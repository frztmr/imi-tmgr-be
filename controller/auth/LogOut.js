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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOut = void 0;
const db_1 = require("../../config/db");
const encrypt_1 = __importDefault(require("../../config/encrypt"));
const customConsole_1 = require("../../config/customConsole");
const authSqlQuery_1 = require("./authSqlQuery");
// import { sealStampGenerator } from '../../config/IDGenerator'
// import { QueryResult } from 'pg';
// import updateSesion from './updateSesion';
let yellowTerminal = "\x1b[33m";
let location = "auth";
const LogOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => Keep_login =>';
    try {
        const uname = req.dataToken.uname;
        const sqlParamInvalidateSesion = [uname];
        db_1.dbPgMain.query(authSqlQuery_1.authSql.invalidateSesion, sqlParamInvalidateSesion, (errUpdateSesion) => {
            if (errUpdateSesion) {
                customConsole_1.concol.bright(location, timestamp, `Error while update sesion! : ${errUpdateSesion}`, customConsole_1.colorTx.White, customConsole_1.colorBg.Green);
                res.status(500).send(`error clear cookies for ${uname} : ${errUpdateSesion}`);
            }
            else {
                customConsole_1.concol.bright(location, timestamp, `succesfully logout for ${uname} ! `, customConsole_1.colorTx.White, customConsole_1.colorBg.Green);
                encrypt_1.default.clearCookie(res);
                res.status(200).send(`Good Bye ${uname} `);
            }
        });
    }
    catch (error) {
        customConsole_1.concol.plain(location, timestamp, ` => FAIL to log out 📤 ❌`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
    }
});
exports.LogOut = LogOut;
