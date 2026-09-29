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
        u.public_share_id,
        u.stay_log_for,
        r.codes role_code,
        r.names role_name 
    FROM
        auth.users u
    LEFT JOIN auth.roles r ON u.user_role = r.codes 
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
    loginUpdateAttemptQueryValidate: ` 
    UPDATE auth.sesi 
    SET  
       invalidate = false
    WHERE id = $1 
    ); ;
    `,
    KeepLoginQuery: ` 
    SELECT
        u.id, 
        u.uname,
        u.login_attempt,
        u.suspended,
        u.public_share_id,
        u.stay_log_for,
        r.codes role_code,
        r.names role_name 
    FROM
        auth.users u
    LEFT JOIN auth.roles r ON u.user_role = r.codes 
    WHERE
        u.uname = $1 
    AND u.suspended IS NOT TRUE
    LIMIT 1;
    `,
    checkSesion: `
    SELECT
        refresh_token
    FROM
        auth.sesi s
    WHERE
        s.user_id = $1;
    `,
    injectSesion: `
    INSERT
	INTO
    auth.sesi(
        user_id,
        refresh_token,
        last_refresh_token_generated,
        expired)
    VALUES ( $1,
        $2,
        now(),
        $3);

    `,
    updateSesion: `
    UPDATE auth.sesi 
    SET 
        refresh_token = $2,
        last_refresh_token_generated = now(),
        expired = $3
    WHERE user_id = $1 
    `,
    invalidateSesion: `
    UPDATE auth.sesi 
    SET  
       invalidate = true
    WHERE user_id IN (
        SELECT id 
        FROM auth.users 
        WHERE uname = $1 
    );`,
};
