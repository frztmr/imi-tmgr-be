export const newPostSql = {
    verifyUser: `
    SELECT
        u.id   
    FROM
        auth.users u
    WHERE
        u.public_share_id = $1  
    LIMIT 1;`,
    insertSimplePost: `
    INSERT
	INTO
    the_content.posts(
        post_id,
        author_id,
        type,
        visibility,
        event_date,
        latitude,
        longitude,
        body,
        title
    ) VALUES ( 
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9 
    );`,

}
// kolom "files" untuk setiap post: array photo & attachment yang sudah 'ready'.
// dipakai di feed (getSimplePost) & detail (getOnePost, getPostRoot).
// FE: tampilkan dengan url => GET /post/file/:file_id
export const postFilesColumn = `
    COALESCE((
        SELECT json_agg(
            json_build_object(
                'file_id', f.file_id,
                'kind', f.kind,
                'original_name', f.original_name,
                'mime', f.mime,
                'size_bytes', f.size_bytes,
                'url', '/post/file/' || f.file_id,
                'metadata', f.metadata
            ) ORDER BY f.created_at ASC
        )
        FROM the_content.post_files f
        WHERE f.post_id = p.post_id
          AND f.status = 'ready'
          AND f.is_deleted IS NOT TRUE
    ), '[]'::json) AS files`;

export const getPostSql = {
    getSimplePost: `
    SELECT
    u.uname,
    u.public_share_id,
    p.body,
    p.title,
    p.created_at,
    p.visibility,
    p.location_literal,
    p.longitude,
    p.latitude,
    p.like_count,
    p.reply_count,
    p.repost_count,
    p.is_edited,
    p.post_id,
    p.event_date,
    p.parent_id, 
    EXISTS (
        SELECT 1
        FROM auth.users au 
        WHERE au.id = p.author_id 
          AND au.id = $1
    ) AS is_deletable,
    EXISTS (
        SELECT 1
        FROM social.post_likes spl
        WHERE spl.post_id = p.post_id
          AND spl.user_id = $1
    ) AS is_liked,
    EXISTS (
        SELECT 1
        FROM social.post_bookmark spb
        WHERE spb.post_id = p.post_id
          AND spb.user_id = $1
        ) AS is_bookmarked,
    ${postFilesColumn},
    pp.title AS parent_title,
    pp.body AS parent_body,
    pp.created_at AS parent_created_at,
    pp.event_date AS parent_event_date,
    pu.uname AS parent_uname
FROM the_content.posts p
LEFT JOIN auth.users u
    ON p.author_id = u.id
LEFT JOIN the_content.posts pp
    ON pp.post_id = p.parent_id
    AND pp.is_deleted IS NOT TRUE
LEFT JOIN auth.users pu
    ON pp.author_id = pu.id
WHERE p.is_deleted IS NOT TRUE
ORDER BY
    p.created_at DESC,
    p.event_date DESC;`
}
export const getPostDetail = {
    getOnePost: `
    SELECT 
        u.uname,
        u.public_share_id, 
        p.body,
        p.title,   
        p.created_at,
        p.visibility,
        p.location_literal,
        p.longitude,
        p.latitude,
        p.like_count,
        p.reply_count, 
        p.repost_count, 
        p.is_edited,
        p.post_id,
        p.parent_id,
        p.root_id,
        p.created_at,
        p.event_date,
        EXISTS (
            SELECT 1
            FROM auth.users au 
            WHERE au.id = p.author_id 
          AND au.id = $1
        ) AS is_deletable,
        EXISTS (
            SELECT 1
            FROM social.post_likes spl
            WHERE spl.post_id = p.post_id
            AND spl.user_id = $2
            ) AS is_liked,
        EXISTS (
            SELECT 1
            FROM social.post_bookmark spb
            WHERE spb.post_id = p.post_id
            AND spb.user_id = $2
        ) AS is_bookmarked,
        ${postFilesColumn}
    FROM the_content.posts p 
    LEFT JOIN auth.users u 
    ON p.author_id = u.id
    WHERE 
        p.is_deleted IS NOT TRUE 
        AND 
        p.post_id = $1`,
    getPostRoot: `
    SELECT 
        u.uname,
        u.public_share_id, 
        p.body,
        p.title,   
        p.created_at,
        p.visibility,
        p.location_literal,
        p.longitude,
        p.latitude,
        p.like_count,
        p.reply_count, 
        p.repost_count, 
        p.is_edited,
        p.post_id,
        p.parent_id,
        p.root_id,
        p.event_date,
        EXISTS (
            SELECT 1
            FROM auth.users au 
            WHERE au.id = p.author_id 
            AND au.id = $1
            ) AS is_deletable,
        EXISTS (
            SELECT 1
            FROM social.post_likes spl
            WHERE spl.post_id = p.post_id
            AND spl.user_id = $2
            ) AS is_liked,
        EXISTS (
            SELECT 1
            FROM social.post_bookmark spb
            WHERE spb.post_id = p.post_id
            AND spb.user_id = $2
            ) AS is_bookmarked,
            ${postFilesColumn}
    FROM the_content.posts p
    LEFT JOIN auth.users u
    ON p.author_id = u.id
    WHERE
        p.parent_id = $1
        AND 
        p.is_deleted IS NOT TRUE
    `
}
export const newPostReplySql = {
    getPrevReplyValue: `
    SELECT
        p.reply_count
    FROM
        the_content.posts p
    WHERE
        p.post_id = $1
    `,
    updateReplyValue: `
    UPDATE 
        the_content.posts 
    SET reply_count = $1 
    WHERE post_id = $2;`,
    simpleInsert: ` 
    INSERT
	INTO
    the_content.posts(
        post_id,
        author_id,
        type,
        visibility,
        event_date,
        latitude,
        longitude,
        body,
        title,
        parent_id
    ) VALUES ( 
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9, 
        $10 
    );`

}
export const likePost = {
    getLikeStatus: `
    SELECT 
        pl.post_id 
    FROM 
        social.post_likes pl 
    WHERE 
        pl.post_id = $1 
        AND 
        pl.user_id = $2 
    LIMIT 1;
    `,
    prevLikeValue: `
    SELECT
        p.like_count
    FROM
        the_content.posts p
    WHERE
        p.post_id = $1`,
    updateLikeValue: `
    UPDATE 
        the_content.posts 
    SET like_count = $1 
    WHERE post_id = $2;`,
    likePost: `
    INSERT INTO 
        social.post_likes 
        (post_id, user_id ) 
    VALUES 
        ($1, $2);`,
    unlikePost: `
    DELETE  FROM 
        social.post_likes 
    WHERE post_id = $1 AND  user_id = $2 `,

}
export const bookmarkPost = {
    getBookmarkStatus: `
    SELECT 
        spb.post_id 
    FROM 
        social.post_bookmark spb 
    WHERE 
        spb.post_id = $1 
        AND 
        spb.user_id = $2 
    LIMIT 1;
    `, 
    bookmarkPost: `
    INSERT INTO 
        social.post_bookmark 
        (post_id, user_id ) 
    VALUES 
        ($1, $2);`,
    unBookmarkPost: `
    DELETE  FROM 
        social.post_bookmark 
    WHERE post_id = $1 AND  user_id = $2 `,

}
export const postDeleteSql = {
    deletePost: `
    UPDATE 
        the_content.posts 
    SET is_deleted = TRUE 
    WHERE post_id = $1; `,

}
// file upload untuk post (photo & attachment). DDL ada di database/post_files.sql
export const postFileSql = {
    insertFile: `
    INSERT INTO the_content.post_files (
        file_id,
        uploader_id,
        kind,
        status,
        original_name,
        ext,
        mime,
        size_bytes,
        tmp_path
    ) VALUES ( $1, $2, $3, 'queued', $4, $5, $6, $7, $8 );`,
    setProcessing: `
    UPDATE the_content.post_files
    SET status = 'processing'
    WHERE file_id = $1;`,
    setReady: `
    UPDATE the_content.post_files
    SET
        status = 'ready',
        storage_path = $2,
        mime = $3,
        metadata = $4,
        tmp_path = NULL,
        error = NULL,
        processed_at = NOW()
    WHERE file_id = $1;`,
    setFailed: `
    UPDATE the_content.post_files
    SET
        status = 'failed',
        error = $2,
        tmp_path = NULL,
        processed_at = NOW()
    WHERE file_id = $1;`,
    getPending: `
    SELECT
        f.file_id,
        f.tmp_path,
        f.ext,
        f.kind
    FROM the_content.post_files f
    WHERE
        f.status IN ('queued', 'processing')
        AND f.tmp_path IS NOT NULL
        AND f.is_deleted IS NOT TRUE
    ORDER BY f.created_at ASC;`,
    getStatus: `
    SELECT
        f.file_id,
        f.kind,
        f.status,
        f.original_name,
        f.size_bytes,
        f.post_id,
        f.error,
        f.created_at,
        f.processed_at
    FROM the_content.post_files f
    WHERE
        f.file_id = ANY($1::varchar[])
        AND f.uploader_id = $2
        AND f.is_deleted IS NOT TRUE;`,
    attachToPost: `
    UPDATE the_content.post_files
    SET post_id = $1
    WHERE
        file_id = ANY($2::varchar[])
        AND uploader_id = $3
        AND post_id IS NULL
        AND status <> 'failed'
        AND is_deleted IS NOT TRUE
    RETURNING file_id;`,
    getFileForDownload: `
    SELECT
        f.file_id,
        f.uploader_id,
        f.status,
        f.storage_path,
        f.mime,
        f.original_name,
        f.kind,
        f.post_id,
        p.is_deleted AS post_is_deleted
    FROM the_content.post_files f
    LEFT JOIN the_content.posts p
        ON p.post_id = f.post_id
    WHERE
        f.file_id = $1
        AND f.is_deleted IS NOT TRUE
    LIMIT 1;`,
    getFilesByPost: `
    SELECT
        f.file_id,
        f.kind,
        f.original_name,
        f.mime,
        f.size_bytes,
        f.metadata
    FROM the_content.post_files f
    WHERE
        f.post_id = $1
        AND f.status = 'ready'
        AND f.is_deleted IS NOT TRUE
    ORDER BY f.created_at ASC;`,
}
