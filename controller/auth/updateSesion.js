"use strict";
/*
    user_id text NOT NULL,
    refresh_token text NULL,
    last_refresh_token_generated timestamp NOT NULL DEFAULT now(),
    "generated" timestamp NULL,
    expired timestamp NULL,
    invalidate bool NULL,

    */
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
let yellowTerminal = "\x1b[33m";
const location = " auth -> updateSesion ";
const db_1 = require("../../config/db");
const authSqlQuery_1 = require("./authSqlQuery");
const customConsole_1 = require("../../config/customConsole");
const updateSession = (id, tokek, expiredAt) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let timestamp = yellowTerminal
        + date.toLocaleDateString('id')
        + ' ' + date.toLocaleTimeString('id')
        + ' => ' + ' Update Sesion  =>';
    // 1. Ambil timestamp sekarang (dalam milidetik)
    const nowInMs = Date.now();
    // 2. Konversi durasi detik ke milidetik
    const durationInMs = expiredAt * 1000;
    // 3. Tambahkan untuk mendapatkan tanggal expired
    const expiredDate = new Date(nowInMs + durationInMs);
    console.log("expiredDate", expiredDate);
    const sqlParamCheckSesion = [id];
    const sqlParamUpdateInjectSesion = [id, tokek, expiredDate];
    db_1.dbPgMain.query(authSqlQuery_1.authSql.checkSesion, sqlParamCheckSesion, (errCheckUser, resCheckUser) => {
        if (errCheckUser) { // kalau error
        }
        else {
            if (resCheckUser.rows.length > 0) { // jika lebih dari satu 
                db_1.dbPgMain.query(authSqlQuery_1.authSql.updateSesion, sqlParamUpdateInjectSesion, (errUpdateSesion) => {
                    if (errUpdateSesion) {
                        customConsole_1.concol.bright(location, timestamp, `Error while update sesion! : ${errUpdateSesion}`, customConsole_1.colorTx.White, customConsole_1.colorBg.Green);
                    }
                    else {
                        customConsole_1.concol.bright(location, timestamp, `succesfully Update Sesion! `, customConsole_1.colorTx.White, customConsole_1.colorBg.Green);
                    }
                });
            }
            else { // ini kalau sesinya BELUM ada.
                db_1.dbPgMain.query(authSqlQuery_1.authSql.injectSesion, sqlParamUpdateInjectSesion, (errInjectSesion) => {
                    if (errInjectSesion) {
                        customConsole_1.concol.bright(location, timestamp, `Error while Inject sesion! : ${errInjectSesion}`, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
                    }
                    else {
                        customConsole_1.concol.bright(location, timestamp, `succesfully Inject Sesion! `, customConsole_1.colorTx.White, customConsole_1.colorBg.Green);
                    }
                });
            }
        }
    });
});
exports.default = updateSession;
/*


    user_id text NOT NULL, S1
    refresh_token text NULL, S2
    expired timestamp NULL,
    invalidate bool NULL,

*/ 
