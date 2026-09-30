"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = void 0;
const db_1 = require("../../config/db");
// import { } from '../../../config/encrypt'
const customConsole_1 = require("../../config/customConsole");
const uiQueryPg_1 = require("./uiQueryPg");
let location = "/ui/setting";
const getSettings = (req, res) => {
    let date = new Date();
    let timestamp = customConsole_1.colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
    // if (req.dataToken.uid) { // spare for authorization variable
    // if (company_id) {
    // let sqlParam: [number] = [company_id];
    db_1.dbPgMainQuery.query(uiQueryPg_1.ui.getTransactionAction, (err, results) => {
        if (err) {
            res.status(500).send("Error 500 at /ui/trx_action");
            customConsole_1.concol.bright(location, timestamp, "/ui/side_menu => error at sideMenu" + err, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
        }
        else {
            res.status(200).send(results);
            customConsole_1.concol.bright(location, timestamp, "/ui/side_menu => success", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
        }
    });
    // } else {
    //     res.status(500).send("Error 500 at getPoNumber")
    //     concol.bright(
    //         location, timestamp,
    //         "/side => error getPoNumber: company_id is not provided",
    //         colorTx.White, colorBg.Red
    //     )
    // }
    // } else {
    //     res.status(200).send("unauthorized attemt")
    //     concol.bright(location, timestamp, " get menu list unauthorized attemt" , colorTx.White, colorBg.Red)
    // }
};
exports.getSettings = getSettings;
