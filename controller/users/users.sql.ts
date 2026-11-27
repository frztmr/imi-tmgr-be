import { postFilesColumn } from '../post/post.sql';

export const getProfile = {
    verifyUser: `
    SELECT
        u.id
    FROM
        auth.users u
    WHERE
        u.public_share_id = $1
    LIMIT 1;`,

    // untuk lihat profile / post / tag milik user lain: /users/profile?uname=xxx
    getUserByUname: `
    SELECT
        u.id
    FROM
        auth.users u
    WHERE
        u.uname = $1
        AND u.suspended IS NOT TRUE
    LIMIT 1;`,

    // $1 = user id yang dilihat
    // profile ada di social.persons (terpisah dari auth). bisa belum ada => kolom profile NULL
    getProfileInfo: `
    SELECT
        u.uname,
        u.public_share_id,
        r.names AS role_name,
        up.person_id,
        up.full_name,
        up.job_title,
        up.division,
        up.department,
        up.location_base,
        up.bio,
        -- data karyawan di bawah ini hanya dikirim ke pemilik akun (lihat controller)
        up.nik,
        up.level_name,
        up.grade,
        up.cost_centre,
        (
            SELECT COUNT(*)
            FROM the_content.posts p
            WHERE p.author_id = u.id
              AND p.is_deleted IS NOT TRUE
        )::int AS post_count,
        (
            SELECT COALESCE(SUM(p.like_count), 0)
            FROM the_content.posts p
            WHERE p.author_id = u.id
              AND p.is_deleted IS NOT TRUE
        )::int AS like_count,
        (
            SELECT COUNT(*)
            FROM the_content.tag_members m
            JOIN the_content.tags t
                ON t.tag_id = m.tag_id
                AND t.is_deleted IS NOT TRUE
            WHERE m.person_id = up.person_id
              AND m.status = 'active'
              AND t.tag_type = 'trip'
        )::int AS trip_count,
        (
            SELECT COUNT(*)
            FROM the_content.tag_members m
            JOIN the_content.tags t
                ON t.tag_id = m.tag_id
                AND t.is_deleted IS NOT TRUE
            WHERE m.person_id = up.person_id
              AND m.status = 'active'
              AND t.tag_type <> 'trip'
        )::int AS tag_count
    FROM auth.users u
    LEFT JOIN auth.roles r
        ON u.user_role = r.codes
    LEFT JOIN social.persons up
        ON up.user_id = u.id
        AND up.is_deleted IS NOT TRUE
    WHERE
        u.id = $1
        AND u.suspended IS NOT TRUE
    LIMIT 1;`,
}

// kolom post sama persis dengan feed (/post/simple_post) supaya FE bisa pakai mapper yang sama
// $1 = user yang sedang login (untuk is_liked, is_bookmarked, is_deletable)
const postColumns = `
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
    (p.author_id = $1) AS is_deletable,
    EXISTS (
        SELECT 1
        FROM social.post_likes spl
        WHERE spl.post_id = p.post_id
          AND spl.user_id = $1
    ) AS is_liked,
    EXISTS (
        SELECT 1
        FROM social.post_bookmark spb
        WHERE spb.post_id = p.post_id
          AND spb.user_id = $1
    ) AS is_bookmarked,
    ${postFilesColumn},
    pp.title AS parent_title,
    pp.body AS parent_body,
    pp.created_at AS parent_created_at,
    pp.event_date AS parent_event_date,
    pu.uname AS parent_uname`;

const postJoins = `
    LEFT JOIN auth.users u
        ON p.author_id = u.id
    LEFT JOIN the_content.posts pp
        ON pp.post_id = p.parent_id
        AND pp.is_deleted IS NOT TRUE
    LEFT JOIN auth.users pu
        ON pp.author_id = pu.id`;

export const usersPostSql = {
    // $1 = viewer, $2 = author, $3 = limit, $4 = offset
    getUserPosts: `
    SELECT ${postColumns}
    FROM the_content.posts p
    ${postJoins}
    WHERE
        p.is_deleted IS NOT TRUE
        AND p.author_id = $2
    ORDER BY
        p.created_at DESC
    LIMIT $3 OFFSET $4;`,
}

export const usersBookmarkSql = {
    // bookmark selalu milik user yang login. $1 = viewer, $2 = limit, $3 = offset
    getUserBookmarks: `
    SELECT ${postColumns}
    FROM the_content.posts p
    JOIN social.post_bookmark b
        ON b.post_id = p.post_id
        AND b.user_id = $1
    ${postJoins}
    WHERE
        p.is_deleted IS NOT TRUE
    ORDER BY
        p.created_at DESC
    LIMIT $2 OFFSET $3;`,
}

export const usersTagSql = {
    // $1 = user (akun) yang dilihat, $2 = filter tag_type (NULL = semua), $3 = member status yang ditampilkan
    // member tag itu person => cari lewat social.persons.user_id
    getUserTags: `
    SELECT
        t.tag_id,
        t.tag_type,
        tt.name AS tag_type_name,
        t.name,
        t.slug,
        t.description,
        t.country,
        t.cities,
        t.start_date,
        t.end_date,
        t.usable_from,
        t.usable_until,
        t.join_policy,
        t.trip_mode,
        t.local_currency,
        t.attributes,
        t.approval_file_id,
        t.created_at,
        ou.uname AS owner_uname,
        m.role,
        m.status AS member_status,
        m.joined_at,
        (
            (t.usable_from IS NULL OR t.usable_from <= NOW())
            AND (t.usable_until IS NULL OR t.usable_until >= NOW())
        ) AS is_usable,
        CASE
            WHEN t.tag_type <> 'trip' THEN NULL
            WHEN t.start_date IS NULL OR CURRENT_DATE < t.start_date THEN 'planned'
            WHEN t.end_date IS NULL OR CURRENT_DATE <= t.end_date THEN 'in_progress'
            ELSE 'completed'
        END AS trip_status,
        (
            SELECT COUNT(*)
            FROM the_content.tag_members mm
            WHERE mm.tag_id = t.tag_id
              AND mm.status = 'active'
        )::int AS member_count,
        (
            SELECT COUNT(*)
            FROM the_content.tag_members mm
            JOIN social.persons dp
                ON dp.person_id = mm.person_id
            WHERE mm.tag_id = t.tag_id
              AND mm.status = 'active'
              AND dp.user_id IS NULL
        )::int AS dummy_member_count,
        (
            SELECT COUNT(*)
            FROM the_content.post_tags pt
            JOIN the_content.posts p
                ON p.post_id = pt.post_id
                AND p.is_deleted IS NOT TRUE
            WHERE pt.tag_id = t.tag_id
        )::int AS post_count
    FROM the_content.tag_members m
    JOIN social.persons mp
        ON mp.person_id = m.person_id
    JOIN the_content.tags t
        ON t.tag_id = m.tag_id
        AND t.is_deleted IS NOT TRUE
    JOIN the_content.tag_types tt
        ON tt.code = t.tag_type
    JOIN auth.users ou
        ON ou.id = t.owner_id
    WHERE
        mp.user_id = $1
        AND ($2::varchar IS NULL OR t.tag_type = $2::varchar)
        AND m.status = ANY($3::varchar[])
    ORDER BY
        (m.role = 'owner') DESC,
        t.created_at DESC;`,
}

export const usersTagNewSql = {
    getTagType: `
    SELECT
        tt.code,
        tt.default_join_policy
    FROM the_content.tag_types tt
    WHERE
        tt.code = $1
        AND tt.is_active IS TRUE
    LIMIT 1;`,
    getActiveTagTypes: `
    SELECT tt.code
    FROM the_content.tag_types tt
    WHERE tt.is_active IS TRUE
    ORDER BY tt.sort_order;`,
    checkSlug: `
    SELECT t.tag_id
    FROM the_content.tags t
    WHERE
        t.owner_id = $1
        AND t.slug = $2
        AND t.is_deleted IS NOT TRUE
    LIMIT 1;`,
    // file BTA harus hasil /post/upload_file milik user sendiri
    checkApprovalFile: `
    SELECT
        f.file_id,
        f.status
    FROM the_content.post_files f
    WHERE
        f.file_id = $1
        AND f.uploader_id = $2
        AND f.is_deleted IS NOT TRUE
    LIMIT 1;`,
    insertTag: `
    INSERT INTO the_content.tags (
        tag_id,
        tag_type,
        name,
        slug,
        description,
        owner_id,
        country,
        cities,
        start_date,
        end_date,
        usable_from,
        usable_until,
        join_policy,
        trip_mode,
        local_currency,
        approval_file_id,
        attributes
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    RETURNING
        tag_id,
        tag_type,
        name,
        slug,
        description,
        country,
        cities,
        start_date,
        end_date,
        usable_from,
        usable_until,
        join_policy,
        trip_mode,
        local_currency,
        approval_file_id,
        attributes,
        created_at;`,
    // akun yang belum punya person dibuatkan otomatis (nama awal = uname, bisa diedit nanti)
    // $1 = person_id baru, $2 = user id. kalau sudah ada, tidak terjadi apa-apa
    ensurePerson: `
    INSERT INTO social.persons (
        person_id,
        user_id,
        full_name,
        created_by
    )
    SELECT $1, u.id, u.uname, u.id
    FROM auth.users u
    WHERE u.id = $2
    ON CONFLICT (user_id) DO NOTHING;`,
    getPersonByUser: `
    SELECT sp.person_id
    FROM social.persons sp
    WHERE sp.user_id = $1
    LIMIT 1;`,
    // pembuat tag otomatis jadi member dengan role owner. $1 = tag_id, $2 = person_id
    insertOwner: `
    INSERT INTO the_content.tag_members (
        tag_id,
        person_id,
        role,
        status,
        joined_at
    ) VALUES ( $1, $2, 'owner', 'active', NOW() );`,
}
