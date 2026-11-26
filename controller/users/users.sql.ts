export const getProfile = {
    verifyUser: `
    SELECT
        u.id   
    FROM
        auth.users u
    WHERE
        u.public_share_id = $1  
    LIMIT 1;
    }`,
    
}