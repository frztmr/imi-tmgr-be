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
exports.keepLogin = void 0;
const db_1 = require("../../config/db");
const encrypt_1 = __importDefault(require("../../config/encrypt"));
const customConsole_1 = require("../../config/customConsole");
const authSqlQuery_1 = require("./authSqlQuery");
const updateSesion_1 = __importDefault(require("./updateSesion"));
let yellowTerminal = "\x1b[33m";
let location = "auth";
const keepLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let timestamp = yellowTerminal
        + date.toLocaleDateString('id')
        + ' ' + date.toLocaleTimeString('id')
        + ' => Keep_login =>';
    try {
        if (req.cookies) {
            const userData = req.dataToken;
            // console.log("yes, ada cookie isinya ", userData);
            if (userData) {
                let sqlParam = [userData.uname];
                db_1.dbPgMain.query(authSqlQuery_1.authSql.KeepLoginQuery, sqlParam, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
                    /*
                     authSql.KeepLoginQuery,
                     sqlParam, (err: Error, results: RowDataPacket[]) => {
                    
                    */
                    if (err) {
                        res.status(500).send("Error 500 at keepLogin");
                        customConsole_1.concol.reverse(location, timestamp, `Error 500 at login ${err}`, customConsole_1.colorTx.Red, customConsole_1.colorBg.White);
                    }
                    else {
                        //user ditemukan. pasword benar, berhasil login 
                        if (results.rows.length > 0) {
                            let rawData = results.rows[0];
                            // // spare ini untuk event logger
                            // sealStampGenerator(rawData.id, "A_KL")
                            if (results.rows[0].suspended) {
                                customConsole_1.concol.plain(location, timestamp, ` => keepLogin "${rawData.uname}" udah gak boleh login`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
                                res.status(201).send({
                                    msg: "Whoops! Please try to login!",
                                    data: {},
                                    success: false,
                                    tokek: ''
                                });
                            }
                            else {
                                // let tokek = encrypt.generateToken(rawDataToken);
                                let rawDataToken = {
                                    uname: results.rows[0].uname,
                                    uID: results.rows[0].public_share_id
                                };
                                const tokek = yield encrypt_1.default.setCookie(res, rawDataToken, results.rows[0].stay_log_for);
                                yield (0, updateSesion_1.default)(results.rows[0].id, JSON.stringify(tokek), results.rows[0].stay_log_for);
                                // res.status(200).send({ msg, data, success })
                                res.status(200).send({
                                    msg: `Hello :) `,
                                    personal: {
                                        uname: rawData.uname,
                                        pid: rawData.public_share_id,
                                        role_code: rawData.role_code,
                                        role_name: rawData.role_name
                                    },
                                    // ui_configuration: resLogin.rows[0].ui_configuration
                                });
                                customConsole_1.concol.plain(location, timestamp, ` => keepLogin "${rawData.uname}" berhasil`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
                            }
                        }
                        else {
                            //salah password, tidak ada data ditemukan 
                            res.status(201).send({
                                msg: "Whoops, something went wrong",
                                data: {},
                                success: false,
                                tokek: ''
                            });
                            customConsole_1.concol.bright(location, timestamp, "error uid not valid  ", customConsole_1.colorTx.Red, customConsole_1.colorBg.White);
                        }
                    }
                }));
            }
            else {
                //token or userdata is not provided properly
                res.status(401).send({
                    msg: "tidak ada user data yang didecode",
                    data: {},
                    success: false,
                    tokek: ''
                });
            }
        }
        else {
            console.log(timestamp, "keep Login, dataToken not avail");
            res.status(200).send("keep Login, dataToken not avail");
        }
    }
    catch (error) {
        res.status(500).json({ error: "Invalid token" });
    }
});
exports.keepLogin = keepLogin;
