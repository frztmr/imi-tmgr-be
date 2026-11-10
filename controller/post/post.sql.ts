export const newPostSql = {
    verifyUser: `
    SELECT
        u.id   
    FROM
        auth.users u
    WHERE
        u.public_share_id = $1  
    LIMIT 1;`,
    injetPost: `
    INSERT
	INTO
    the_content.post(
        post_id ,
        refresh_token,
        last_refresh_token_generated,
        expired)
    VALUES ( $1,
        $2,
        now(),
        $3);

    `
}