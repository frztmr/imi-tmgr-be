
export const authSql = {
    checkUser: `
    SELECT
        u.uname,
        u.login_attempt,
        u.last_login_attempt,
        u.suspended 
    FROM
        auth.users u
    WHERE
        u.uname = $1  
    LIMIT 1;`,
    loginQuery: ` 
    SELECT
        *
    FROM
        auth.users u
    LEFT JOIN auth.sesi s ON
        u.id = s.user_id
    WHERE
        u.uname = $1
        AND u.pswd = $2
    AND u.suspended IS NOT TRUE;
    `,
    KeepLoginQuery: ` 
    -- your query here;
    `,
}