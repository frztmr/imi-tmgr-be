
export const ui = {
    getSidebarMenu: `
    SELECT 
    * 
    FROM ui.side_menu sm
    WHERE 
    sm.active = TRUE
    ORDER BY ordering_position ASC ;`
    , getTransactionAction: `
    SELECT
        ti.id,
        ti.title ,
        ti.subtitle,
        ti.route,
        ti.type 
    FROM
        inventory_stock.ui.transaction_item ti
    WHERE
        ti.is_active = TRUE
	AND ti.is_global = TRUE;`
}

export const setting = {
    getMenuSetting: `
    SELECT
        s.link, s.logo, s.title, s.subtitle 
    FROM
        auth.users u
    LEFT JOIN auth.rization r ON
        u.id = r.users_id
    LEFT JOIN ui.settings s ON
        r.roles_id = ANY(s.allowed_roles::TEXT[])
    WHERE
        u.uname =  $1;
    `
}
