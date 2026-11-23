/* ================= multer untuk upload file post ==================== */
// tugas multer di sini CUMA terima file & simpan ke folder tmp.
// verifikasi isi file, ambil EXIF, pindah ke storage final => dikerjakan worker thread.

import multer from "multer";
import fs from "fs";
import { customAlphabet } from "nanoid";
import { Request, Response, NextFunction } from "express";
import {
    UPLOAD_TMP_DIR, UPLOAD_MAX_FILE_SIZE, UPLOAD_MAX_FILES,
    ALLOWED_POST_FILES, getExt
} from "./storage";
import { colorBg, colorTx, concol } from "./customConsole";

const location = "postUploader.ts";

// nama file random. nama asli dari user TIDAK dipakai untuk path (hindari path traversal)
const tmpName = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 32);

fs.mkdirSync(UPLOAD_TMP_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_TMP_DIR),
    filename: (req, file, cb) => cb(null, `${tmpName()}.${getExt(file.originalname)}`),
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = getExt(file.originalname);
    const rule = ALLOWED_POST_FILES[ext];

    if (!rule) {
        return cb(new Error(`file extension .${ext} is not allowed`));
    }
    if (!rule.mime.includes(file.mimetype)) {
        return cb(new Error(`file type ${file.mimetype} does not match .${ext}`));
    }
    cb(null, true);
};

const multerPostFiles = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: UPLOAD_MAX_FILE_SIZE,
        files: UPLOAD_MAX_FILES,
    },
}).array("files", UPLOAD_MAX_FILES); // field name dari FE: "files"

// hapus file tmp kalau request gagal di tengah jalan
export const cleanupTmpFiles = (files: Express.Multer.File[] | undefined) => {
    (files || []).forEach(f => fs.promises.unlink(f.path).catch(() => { }));
};

// wrapper supaya error multer jadi response 400 yang rapi (bukan crash / 500)
export const uploadPostFiles = (req: Request, res: Response, next: NextFunction) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    multerPostFiles(req, res, (err: any) => {
        if (err) {
            cleanupTmpFiles(req.files as Express.Multer.File[]);

            let msg: string = err.message || "upload failed";
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") msg = `file too large. max ${UPLOAD_MAX_FILE_SIZE / 1024 / 1024} MB`;
                if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") msg = `max ${UPLOAD_MAX_FILES} files, field name must be "files"`;
            }

            concol.bright(location, timestamp, `  upload rejected: ${msg}`, colorTx.White, colorBg.Red);
            return res.status(400).send({ msg });
        }
        next();
    });
};
