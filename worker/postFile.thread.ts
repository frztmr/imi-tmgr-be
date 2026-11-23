/* ================= worker THREAD: proses 1 file post ==================== */
// file ini jalan di thread terpisah (node worker_threads), BUKAN di main thread API.
// jadi proses berat (baca file, EXIF, copy file) tidak bikin API lemot.
//
// thread ini TIDAK akses database. hasilnya dikirim balik ke pool (postFile.pool.ts)
// dan pool yang update database.
//
// tugas:
// 1. cek isi file asli (magic bytes) cocok dengan ext-nya (jangan percaya ext / mimetype dari client)
// 2. ambil EXIF untuk photo (gps, tanggal foto, kamera)
// 3. pindah file dari storage/tmp ke storage/uploads/posts/YYYY/MM/<file_id>.<ext>

import { parentPort } from "worker_threads";
import fs from "fs";
import path from "path";
import exifr from "exifr";

export type PostFileTask = {
    file_id: string,
    tmp_path: string,
    ext: string,
    kind: "photo" | "attachment",
    upload_dir: string,     // UPLOAD_POST_DIR (absolute)
};

export type PostFileResult =
    | { ok: true, file_id: string, storage_path: string, mime: string, metadata: Record<string, any> | null }
    | { ok: false, file_id: string, fatal: boolean, error: string };

// error yang tidak perlu dicoba ulang (file memang salah)
class FatalFileError extends Error { }

/* ----------------------- cek magic bytes ----------------------- */
// return mime asli kalau cocok dengan ext, atau null kalau tidak cocok
const sniffMime = async (filePath: string, ext: string): Promise<string | null> => {

    const fh = await fs.promises.open(filePath, "r");
    const buf = Buffer.alloc(4096);
    const { bytesRead } = await fh.read(buf, 0, 4096, 0);
    await fh.close();
    const b = buf.subarray(0, bytesRead);

    const startsWith = (sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v);

    const ZIP = [0x50, 0x4B, 0x03, 0x04];        // docx, xlsx, pptx
    const OLE = [0xD0, 0xCF, 0x11, 0xE0];        // doc, xls, ppt (office lama)

    switch (ext) {
        case "jpg":
        case "jpeg": return startsWith([0xFF, 0xD8, 0xFF]) ? "image/jpeg" : null;
        case "png": return startsWith([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) ? "image/png" : null;
        case "gif": return startsWith([0x47, 0x49, 0x46, 0x38]) ? "image/gif" : null;
        case "webp": return startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8) ? "image/webp" : null;
        case "pdf": return startsWith([0x25, 0x50, 0x44, 0x46]) ? "application/pdf" : null;
        case "docx": return startsWith(ZIP) ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : null;
        case "xlsx": return startsWith(ZIP) ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : null;
        case "pptx": return startsWith(ZIP) ? "application/vnd.openxmlformats-officedocument.presentationml.presentation" : null;
        case "doc": return startsWith(OLE) ? "application/msword" : null;
        case "xls": return startsWith(OLE) ? "application/vnd.ms-excel" : null;
        case "ppt": return startsWith(OLE) ? "application/vnd.ms-powerpoint" : null;
        case "txt":
        case "csv":
            // text file tidak punya magic bytes. tolak kalau ada NUL byte (berarti binary)
            return b.includes(0x00) ? null : (ext === "csv" ? "text/csv" : "text/plain");
        default: return null;
    }
};

/* ----------------------- ambil EXIF ----------------------- */
const readExif = async (filePath: string): Promise<Record<string, any> | null> => {
    try {
        const exif = await exifr.parse(filePath, {
            gps: true,
            pick: [
                "latitude", "longitude",
                "DateTimeOriginal", "CreateDate",
                "Make", "Model", "Orientation",
                "ExifImageWidth", "ExifImageHeight",
                "ImageWidth", "ImageHeight",
            ],
        });
        if (!exif) return null;

        return {
            latitude: exif.latitude ?? null,
            longitude: exif.longitude ?? null,
            taken_at: exif.DateTimeOriginal || exif.CreateDate || null,
            camera: [exif.Make, exif.Model].filter(Boolean).join(" ") || null,
            orientation: exif.Orientation ?? null,
            width: exif.ExifImageWidth || exif.ImageWidth || null,
            height: exif.ExifImageHeight || exif.ImageHeight || null,
        };
    } catch (err) {
        // foto tanpa EXIF / format tidak support => bukan error, lanjut saja
        return null;
    }
};

/* ----------------------- pindah file ----------------------- */
const moveFile = async (from: string, to: string) => {
    await fs.promises.mkdir(path.dirname(to), { recursive: true });
    try {
        await fs.promises.rename(from, to);
    } catch (err: any) {
        if (err.code !== "EXDEV") throw err;
        // beda drive / partisi => copy lalu hapus
        await fs.promises.copyFile(from, to);
        await fs.promises.unlink(from);
    }
};

/* ----------------------- proses 1 file ----------------------- */
const processFile = async (task: PostFileTask): Promise<PostFileResult> => {

    const { file_id, tmp_path, ext, kind, upload_dir } = task;

    try {
        const exists = await fs.promises.access(tmp_path).then(() => true).catch(() => false);
        if (!exists) throw new FatalFileError("uploaded file is missing");

        const mime = await sniffMime(tmp_path, ext);
        if (!mime) throw new FatalFileError(`file content does not match .${ext}`);

        const metadata = kind === "photo" ? await readExif(tmp_path) : null;

        const now = new Date();
        const relPath = path.posix.join(
            String(now.getFullYear()),
            String(now.getMonth() + 1).padStart(2, "0"),
            `${file_id}.${ext}`
        );

        // pindah file PALING TERAKHIR, setelah semua cek lolos
        await moveFile(tmp_path, path.join(upload_dir, relPath));

        return { ok: true, file_id, storage_path: relPath, mime, metadata };

    } catch (err: any) {
        return {
            ok: false,
            file_id,
            fatal: err instanceof FatalFileError,
            error: err?.message || String(err),
        };
    }
};

parentPort?.on("message", async (task: PostFileTask) => {
    const result = await processFile(task);
    parentPort?.postMessage(result);
});
