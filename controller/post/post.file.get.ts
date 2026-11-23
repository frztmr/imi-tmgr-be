import { Request, Response } from 'express';
import path from 'path';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, postFileSql } from './post.sql';
import { UPLOAD_POST_DIR } from '../../config/storage';

const location: string = "/post/file";

// GET /post/file/:file_id
// photo => tampil inline (bisa dipakai di <img src>)
// attachment => download
export const getFile = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (!req.dataToken?.psid) {
        res.status(401).send({ msg: "unauthorized" });
        return;
    }

    const file_id = String(req.params.file_id || "");
    if (!/^[A-Za-z0-9]{1,32}$/.test(file_id)) {
        res.status(400).send({ msg: "invalid file id" });
        return;
    }

    try {
        const resVerifyUser = await dbPgMainQuery(newPostSql.verifyUser, [req.dataToken.psid]);
        const user_id = resVerifyUser.rows[0]?.id;

        if (!user_id) {
            res.status(401).send({ msg: "user is invalid!" });
            return;
        }

        const resFile = await dbPgMainQuery(postFileSql.getFileForDownload, [file_id]);
        const file = resFile.rows[0];

        // boleh akses kalau: pemilik file, ATAU file sudah nempel di post yang belum dihapus
        const isOwner = file && file.uploader_id === String(user_id);
        const isPublished = file && file.post_id && file.post_is_deleted !== true;

        if (!file || file.status !== "ready" || !(isOwner || isPublished)) {
            res.status(404).send({ msg: "file not found" });
            return;
        }

        // pastikan path tidak keluar dari folder storage
        const fullPath = path.resolve(UPLOAD_POST_DIR, file.storage_path);
        if (!fullPath.startsWith(UPLOAD_POST_DIR + path.sep)) {
            res.status(404).send({ msg: "file not found" });
            return;
        }

        if (file.kind === "attachment") {
            res.attachment(file.original_name);
        }
        res.setHeader("Content-Type", file.mime);
        res.setHeader("Cache-Control", "private, max-age=86400");

        res.sendFile(fullPath, (err) => {
            if (err && !res.headersSent) {
                res.status(404).send({ msg: "file not found" });
                concol.bright(location, timestamp, `  file missing on disk ${file_id}: ${err}`, colorTx.White, colorBg.Red);
            }
        });

    } catch (err) {
        res.status(500).send({ msg: "error get file" });
        concol.bright(location, timestamp, `  caught error at get file: ${err}`, colorTx.White, colorBg.Red);
    }
}
