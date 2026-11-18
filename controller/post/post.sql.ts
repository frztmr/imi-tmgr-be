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
        pp.title      AS parent_title,
        pp.body       AS parent_body,
        pp.created_at AS parent_created_at,
        pp.event_date AS parent_event_date,
        pu.uname      AS parent_uname
    FROM
        the_content.posts p
    LEFT JOIN auth.users u ON
        p.author_id = u.id
    LEFT JOIN the_content.posts pp ON            -- parent post (only when p is a reply)
        pp.post_id = p.parent_id
        AND pp.is_deleted IS NOT TRUE
    LEFT JOIN auth.users pu ON                   -- parent post author
        pp.author_id = pu.id
    WHERE
        p.is_deleted IS NOT TRUE
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
        p.event_date   
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
        p.event_date
    FROM the_content.posts p
    LEFT JOIN auth.users u
    ON p.author_id = u.id
    WHERE
        p.parent_id = $1
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