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
        p.created_at,
        p.event_date
    FROM
        the_content.posts p
    LEFT JOIN auth.users u ON
        p.author_id = u.id
    WHERE
        p.is_deleted IS NOT TRUE
    ORDER BY
        created_at DESC, 
        p.event_date desc;` 
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
        p.root_id   
    FROM the_content.posts p 
    LEFT JOIN auth.users u 
    ON p.author_id = u.id
    WHERE  
        p.parent_id = $1
    `
}

export const newPostReplySql = {
    simpleInsert : ` 
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