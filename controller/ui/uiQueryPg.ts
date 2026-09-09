
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
