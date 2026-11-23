/* ================= worker POOL untuk proses file post ==================== */
// pakai node worker_threads (bawaan Node, TIDAK butuh Redis / Linux).
//
// alur:
// controller (post.upload.ts) => postFilePool.enqueue() => antrian di memory
//   => dikirim ke worker thread yang nganggur (postFile.thread.ts)
//   => hasil balik ke sini => update the_content.post_files (ready / failed)
//
// antrian di memory hilang kalau API restart. TAPI status di database tetap 'queued'/'processing',
// jadi saat start, recoverPending() ambil ulang dari database dan proses lagi.

import { Worker } from "worker_threads";
import path from "path";
import os from "os";
import fs from "fs";
import { dbPgMainQuery } from "../config/db";
import { postFileSql } from "../controller/post/post.sql";
import { UPLOAD_POST_DIR } from "../config/storage";
import { colorBg, colorTx, concol } from "../config/customConsole";
import type { PostFileTask, PostFileResult } from "./postFile.thread";

const location = "postFile.pool.ts";

const THREADS: number = Number(process.env.UPLOAD_WORKER_THREADS)
    || Math.max(1, Math.min(4, os.cpus().length - 1));
const MAX_ATTEMPTS = 3;                  // error tak terduga (misal disk penuh) dicoba ulang 3x
const TASK_TIMEOUT_MS = 2 * 60 * 1000;   // 1 file maksimal 2 menit, lebih dari itu thread di-restart

type QueueItem = { task: PostFileTask, attempts: number };

const stamp = (): string => {
    let date = new Date();
    return colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
};

/* ----------------------- bikin thread ----------------------- */
// kalau jalan pakai ts-node / ts-node-dev, file thread-nya masih .ts dan perlu di-register ts-node dulu.
// kalau sudah di-build (tsc) jadi .js, langsung load file .js-nya.
const spawnThread = (): Worker => {
    const isTs = path.extname(__filename) === ".ts";
    const threadFile = path.join(__dirname, `postFile.thread${isTs ? ".ts" : ".js"}`);

    if (isTs) {
        return new Worker(
            `require('ts-node').register({ transpileOnly: true }); require(${JSON.stringify(threadFile)});`,
            { eval: true }
        );
    }
    return new Worker(threadFile);
};

class PostFilePool {

    private idle: Worker[] = [];
    private busy = new Map<Worker, { item: QueueItem, timer: NodeJS.Timeout }>();
    private queue: QueueItem[] = [];
    private queuedIds = new Set<string>();   // supaya 1 file tidak masuk antrian 2x
    private started = false;
    private stopping = false;

    start() {
        if (this.started) return;
        this.started = true;
        for (let i = 0; i < THREADS; i++) this.addThread();

        concol.bright(location, stamp(), `  post file worker pool ready (${THREADS} thread) `, colorTx.Green, colorBg.Green);
    }

    /** masukkan file ke antrian. tidak pernah throw, langsung return */
    enqueue(task: Omit<PostFileTask, "upload_dir">) {
        if (this.queuedIds.has(task.file_id)) return;
        this.queuedIds.add(task.file_id);

        this.queue.push({ task: { ...task, upload_dir: UPLOAD_POST_DIR }, attempts: 0 });
        this.dispatch();
    }

    /** dipanggil saat API start: proses ulang file yang belum selesai sebelum restart */
    async recoverPending() {
        try {
            const res = await dbPgMainQuery(postFileSql.getPending);
            res.rows.forEach((r: any) => this.enqueue({
                file_id: r.file_id,
                tmp_path: r.tmp_path,
                ext: r.ext,
                kind: r.kind,
            }));
            if (res.rows.length > 0) {
                concol.bright(location, stamp(), `  recovered ${res.rows.length} pending file(s) `, colorTx.White, colorBg.Black);
            }
        } catch (err) {
            concol.bright(location, stamp(), `  unable to recover pending files: ${err}`, colorTx.White, colorBg.Red);
        }
    }

    stats() {
        return { threads: THREADS, idle: this.idle.length, busy: this.busy.size, waiting: this.queue.length };
    }

    async stop() {
        this.stopping = true;
        await Promise.all([...this.idle, ...this.busy.keys()].map(w => w.terminate()));
    }

    /* ----------------------- internal ----------------------- */

    private addThread() {
        const worker = spawnThread();

        worker.on("message", (result: PostFileResult) => this.onResult(worker, result));

        worker.on("error", (err) => {
            concol.bright(location, stamp(), `  worker thread crashed: ${err.message}`, colorTx.White, colorBg.Red);
        });

        // thread mati (crash / timeout) => kembalikan job-nya ke antrian & bikin thread baru
        worker.on("exit", () => {
            this.idle = this.idle.filter(w => w !== worker);
            const running = this.busy.get(worker);
            if (running) {
                clearTimeout(running.timer);
                this.busy.delete(worker);
                this.retryOrFail(running.item, "worker thread stopped unexpectedly");
            }
            if (!this.stopping) {
                this.addThread();
            }
        });

        this.idle.push(worker);
        this.dispatch();
    }

    private dispatch() {
        while (this.idle.length > 0 && this.queue.length > 0) {
            const worker = this.idle.shift()!;
            const item = this.queue.shift()!;

            const timer = setTimeout(() => {
                concol.bright(location, stamp(), `  file ${item.task.file_id} timeout, restarting thread`, colorTx.White, colorBg.Red);
                worker.terminate(); // => event 'exit' => retryOrFail
            }, TASK_TIMEOUT_MS);

            this.busy.set(worker, { item, timer });

            dbPgMainQuery(postFileSql.setProcessing, [item.task.file_id]).catch(() => { });
            worker.postMessage(item.task);
        }
    }

    private async onResult(worker: Worker, result: PostFileResult) {
        const running = this.busy.get(worker);
        if (!running) return;

        clearTimeout(running.timer);
        this.busy.delete(worker);
        this.idle.push(worker);
        this.dispatch(); // thread ini langsung boleh ambil job berikutnya

        const { item } = running;

        if (result.ok) {
            try {
                await dbPgMainQuery(postFileSql.setReady, [
                    result.file_id,
                    result.storage_path,
                    result.mime,
                    result.metadata ? JSON.stringify(result.metadata) : null,
                ]);
                this.queuedIds.delete(result.file_id);
                concol.plain(location, stamp(), `  file ${result.file_id} ready `, colorTx.White, colorBg.Black);
            } catch (err) {
                // file sudah dipindah tapi DB gagal update. coba update DB lagi nanti
                concol.bright(location, stamp(), `  file ${result.file_id} processed but DB update failed: ${err}`, colorTx.White, colorBg.Red);
                setTimeout(() => this.onResultRetryDb(result, 1), 5000);
            }
        } else if (result.fatal) {
            await this.markFailed(item, result.error);
        } else {
            this.retryOrFail(item, result.error);
        }
    }

    private async onResultRetryDb(result: Extract<PostFileResult, { ok: true }>, attempt: number) {
        try {
            await dbPgMainQuery(postFileSql.setReady, [
                result.file_id, result.storage_path, result.mime,
                result.metadata ? JSON.stringify(result.metadata) : null,
            ]);
            this.queuedIds.delete(result.file_id);
        } catch (err) {
            if (attempt < 5) setTimeout(() => this.onResultRetryDb(result, attempt + 1), 5000 * (attempt + 1));
            else concol.bright(location, stamp(), `  giving up DB update for ${result.file_id}: ${err}`, colorTx.White, colorBg.Red);
        }
    }

    private retryOrFail(item: QueueItem, error: string) {
        item.attempts++;
        if (item.attempts >= MAX_ATTEMPTS) {
            this.markFailed(item, error);
            return;
        }
        concol.bright(location, stamp(),
            `  file ${item.task.file_id} attempt ${item.attempts} failed (${error}), retrying`,
            colorTx.White, colorBg.Yellow);

        setTimeout(() => {
            this.queue.push(item);
            this.dispatch();
        }, 2000 * item.attempts);
    }

    private async markFailed(item: QueueItem, error: string) {
        this.queuedIds.delete(item.task.file_id);
        fs.promises.unlink(item.task.tmp_path).catch(() => { });

        concol.bright(location, stamp(), `  file ${item.task.file_id} failed: ${error}`, colorTx.White, colorBg.Red);
        try {
            await dbPgMainQuery(postFileSql.setFailed, [item.task.file_id, error]);
        } catch (err) {
            concol.bright(location, stamp(), `  unable to mark file failed: ${err}`, colorTx.White, colorBg.Red);
        }
    }
}

export const postFilePool = new PostFilePool();
