/* ================= lokasi penyimpanan file upload post ==================== */
import path from "path";

// file mentah dari multer masuk ke sini dulu (belum diverifikasi)
export const UPLOAD_TMP_DIR: string = path.resolve(
    process.cwd(),
    process.env.UPLOAD_TMP_DIR || "storage/tmp"
);

// file yang sudah diproses worker dipindah ke sini
// SENGAJA tidak di folder static (open_area), supaya aksesnya lewat endpoint yang cek login
export const UPLOAD_POST_DIR: string = path.resolve(
    process.cwd(),
    process.env.UPLOAD_POST_DIR || "storage/uploads/posts"
);

export const UPLOAD_MAX_FILE_SIZE: number = (Number(process.env.UPLOAD_MAX_FILE_MB) || 25) * 1024 * 1024;
export const UPLOAD_MAX_FILES: number = Number(process.env.UPLOAD_MAX_FILES) || 10;

// kind: photo  -> ditampilkan sebagai gambar di post
// kind: attachment -> file lampiran (dokumen)
export type PostFileKind = "photo" | "attachment";

// allowlist ext => { mime, kind }.
// SVG sengaja TIDAK diizinkan (bisa berisi script / XSS)
export const ALLOWED_POST_FILES: Record<string, { mime: string[], kind: PostFileKind }> = {
    jpg: { mime: ["image/jpeg"], kind: "photo" },
    jpeg: { mime: ["image/jpeg"], kind: "photo" },
    png: { mime: ["image/png"], kind: "photo" },
    webp: { mime: ["image/webp"], kind: "photo" },
    gif: { mime: ["image/gif"], kind: "photo" },

    pdf: { mime: ["application/pdf"], kind: "attachment" },
    doc: { mime: ["application/msword"], kind: "attachment" },
    xls: { mime: ["application/vnd.ms-excel"], kind: "attachment" },
    ppt: { mime: ["application/vnd.ms-powerpoint"], kind: "attachment" },
    docx: { mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], kind: "attachment" },
    xlsx: { mime: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], kind: "attachment" },
    pptx: { mime: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"], kind: "attachment" },
    txt: { mime: ["text/plain"], kind: "attachment" },
    csv: { mime: ["text/csv", "application/vnd.ms-excel", "text/plain"], kind: "attachment" },
};

export const getExt = (filename: string): string => {
    return path.extname(filename || "").replace(".", "").toLowerCase();
};
