"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSql = void 0;
exports.authSql = {
    checkUser: `
    SELECT
        u.id, 
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
        u.id, 
        u.uname,
        u.login_attempt,
        u.suspended,
        u.public_share_id
    FROM
    	auth.users u 
    WHERE
        u.uname = $1
        AND u.pswd = $2
    AND u.suspended IS NOT TRUE
    LIMIT 1;
    `,
    loginUpdateAttemptQuery: ` 
    UPDATE auth.users 
    SET 
    login_attempt = $1,
    last_login_attempt = now()
    WHERE id = $2 ;
    `,
    KeepLoginQuery: ` 
    -- your query here;
    `,
};
