
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
    -- your query here;
    `,
    KeepLoginQuery: ` 
    -- your query here;
    `,
}