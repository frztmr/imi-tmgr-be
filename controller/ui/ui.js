"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../config/db");
// import { } from '../../../config/encrypt'
const customConsole_1 = require("../../config/customConsole");
const uiQueryPg_1 = require("./uiQueryPg");
// import { error } from 'console';
// import { dateShifter } from '../../../config/formatShifter'
let location = "/ui";
const uiController = {
    getSideMenu: (res) => __awaiter(void 0, void 0, void 0, function* () {
        let date = new Date();
        let timestamp = customConsole_1.colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        // if (req.dataToken.uid) {
        // if (company_id) {
        // let sqlParam: [number] = [company_id];
        db_1.dbPgMainQuery.query(uiQueryPg_1.ui.getSidebarMenu, (err, results) => {
            if (err) { //error catch
                res.status(500).send("Error 500 at /ui/side_menu");
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
    }),
    getTransactionAction: (res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
};
exports.default = uiController;
