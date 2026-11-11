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
        body
    ) VALUES ( 
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
    );

    `,

}
export const getPostSql = {
    getSimplePost: `
SELECT 
    u.uname,
    u.public_share_id, 
    p.body,  
    p.created_at,
    p.visibility,
    p.location_literal,
    p.longitude,
    p.latitude,
    p.reply_count, 
    p.repost_count, 
    p.is_edited 
FROM the_content.posts p 
LEFT JOIN auth.users u 
ON p.author_id = u.id
WHERE 
    p.is_deleted IS NOT TRUE  `

}