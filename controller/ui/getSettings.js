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
exports.getSettings = void 0;
const db_1 = require("../../config/db");
// import { } from '../../../config/encrypt'
const customConsole_1 = require("../../config/customConsole");
const uiQueryPg_1 = require("./uiQueryPg");
let location = "/ui/setting";
let yellowTerminal = "\x1b[33m";
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let timestamp = customConsole_1.colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
    if (req.dataToken.uname) { // cari public share id
        let sqlParam = [req.dataToken.uname];
        db_1.dbPgMain.query(uiQueryPg_1.setting.getMenuSetting, sqlParam, (err, results) => {
            if (err) {
                res.status(500).send("Error 500 at /ui/settings");
                customConsole_1.concol.bright(location, timestamp, "/ui/side_menu => error at sideMenu" + err, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
            }
            else {
                res.status(200).send(results.rows);
                customConsole_1.concol.bright(location, timestamp, "/ui/side_menu => success", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
            }
        });
    }
    else {
        res.status(401).send("unauthorized attemt");
        customConsole_1.concol.bright(location, timestamp, " get menu list unauthorized attemt", customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
    }
});
exports.getSettings = getSettings;
