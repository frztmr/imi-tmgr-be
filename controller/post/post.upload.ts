import { Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, postFileSql } from './post.sql';
import { ALLOWED_POST_FILES, getExt } from '../../config/storage';
import { cleanupTmpFiles } from '../../config/postUploader';
import { postFilePool } from '../../worker/postFile.pool';

const location: string = "/post/upload_file";

const fileId = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 24);

// alur FE:
// 1. POST /post/upload_file (multipart, field "files")  => dapat file_id (status: queued)
// 2. GET  /post/upload_status?ids=a,b,c                  => polling sampai status ready / failed
// 3. POST /post/new_post  { ..., photos: [file_id], attachments: [file_id] }
export const uploadFile = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    const files = (req.files as Express.Multer.File[]) || [];

    if (!req.dataToken?.psid) {
        cleanupTmpFiles(files);
        res.status(401).send({ msg: "unauthorized" });
        return;
    }

    if (files.length === 0) {
        res.status(400).send({ msg: "no file uploaded. use multipart field name \"files\"" });
        concol.bright(location, timestamp, "  no file uploaded", colorTx.White, colorBg.Red);
        return;
    }

    try {
        // verify user
        const resVerifyUser = await dbPgMainQuery(newPostSql.verifyUser, [req.dataToken.psid]);
        const user_id = resVerifyUser.rows[0]?.id;

        if (!user_id) {
            cleanupTmpFiles(files);
            res.status(401).send({ msg: "user is invalid!" });
            concol.bright(location, timestamp, "  invalid user_id", colorTx.White, colorBg.Red);
            return;
        }

        const result: {
            file_id: string,
            kind: string,
            original_name: string,
            size_bytes: number,
            status: string
        }[] = [];

        for (const file of files) {

            const ext = getExt(file.originalname);
            const kind = ALLOWED_POST_FILES[ext].kind; // sudah divalidasi di fileFilter multer
            const file_id = fileId();

            // simpan dulu ke DB (status queued) => kalau API restart, file ini tetap diproses
            await dbPgMainQuery(postFileSql.insertFile, [
                file_id,                //$1
                String(user_id),        //$2
                kind,                   //$3
                file.originalname,      //$4
                ext,                    //$5
                file.mimetype,          //$6 (dari client, nanti ditimpa worker dengan hasil cek magic bytes)
                file.size,              //$7
                file.path,              //$8 tmp_path
            ]);

            postFilePool.enqueue({ file_id, tmp_path: file.path, ext, kind });

            result.push({ file_id, kind, original_name: file.originalname, size_bytes: file.size, status: "queued" });
        }

        res.status(202).send({
            msg: "files received, processing",
            files: result,
        });
        concol.bright(location, timestamp, `  ${result.length} file(s) queued `, colorTx.White, colorBg.Black);

    } catch (err) {
        cleanupTmpFiles(files);
        res.status(500).send({ msg: "error upload file" });
        concol.bright(location, timestamp, `  caught error at upload file: ${err}`, colorTx.White, colorBg.Red);
    }
}
