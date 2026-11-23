-- =====================================================================
-- table untuk file upload post (photo & attachment)
-- jalankan sekali di database imi_tmgr (PostgreSQL)
--
-- status flow:  queued -> processing -> ready
--                                    \-> failed
--
-- table ini juga berfungsi sebagai "antrian" worker:
-- kalau API restart, row yang masih queued/processing akan diproses ulang.
--
-- uploader_id & post_id sengaja TEXT/VARCHAR tanpa FK supaya aman
-- apapun tipe auth.users.id. kalau mau FK, sesuaikan tipenya lalu tambahkan:
--   ALTER TABLE the_content.post_files
--     ADD CONSTRAINT fk_post_files_post FOREIGN KEY (post_id)
--     REFERENCES the_content.posts(post_id);
-- =====================================================================

CREATE TABLE IF NOT EXISTS the_content.post_files (
    file_id        VARCHAR(32)  PRIMARY KEY,
    uploader_id    TEXT         NOT NULL,
    post_id        VARCHAR(64)  NULL,          -- NULL = sudah diupload tapi belum dipakai di post
    kind           VARCHAR(16)  NOT NULL CHECK (kind IN ('photo', 'attachment')),
    status         VARCHAR(16)  NOT NULL DEFAULT 'queued'
                   CHECK (status IN ('queued', 'processing', 'ready', 'failed')),
    original_name  TEXT         NOT NULL,
    ext            VARCHAR(10)  NOT NULL,
    mime           VARCHAR(128) NULL,
    size_bytes     BIGINT       NOT NULL DEFAULT 0,
    tmp_path       TEXT         NULL,          -- lokasi file mentah, dikosongkan setelah diproses
    storage_path   TEXT         NULL,          -- relative ke UPLOAD_POST_DIR
    metadata       JSONB        NULL,          -- EXIF (gps, taken_at, width, height, ...)
    error          TEXT         NULL,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    processed_at   TIMESTAMPTZ  NULL
);

-- untuk table yang sudah terlanjur dibuat dari versi lama (tanpa tmp_path).
-- aman dijalankan berkali-kali
ALTER TABLE the_content.post_files ADD COLUMN IF NOT EXISTS tmp_path TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_post_files_post_id    ON the_content.post_files (post_id);
CREATE INDEX IF NOT EXISTS idx_post_files_uploader_id ON the_content.post_files (uploader_id);
CREATE INDEX IF NOT EXISTS idx_post_files_pending     ON the_content.post_files (status)
    WHERE status IN ('queued', 'processing');
