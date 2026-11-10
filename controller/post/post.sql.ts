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

    `
}