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
exports.LogIn = void 0;
const db_1 = require("../../config/db");
const encrypt_1 = __importDefault(require("../../config/encrypt"));
const customConsole_1 = require("../../config/customConsole");
const authSqlQuery_1 = require("./authSqlQuery");
const IDGenerator_1 = require("../../config/IDGenerator");
const updateSesion_1 = __importDefault(require("./updateSesion"));
let yellowTerminal = "\x1b[33m";
let location = "auth/login";
const LogIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id');
    const login_attempt = process.env.SECURITY_TRIAL_LOGIN || 4; // defined agreement of how many attempt
    const loginAttemptPolicy = parseInt(login_attempt);
    if (req.body) {
        let { uname, pswd } = req.body;
        let sqlParamCheckUser = [uname];
        if (uname && pswd) {
            // cek dulu apakah ada usernya atau tidak? 
            // cek juga sudah berapa kali dia mencoba untuk login?
            db_1.dbPgMain.query(authSqlQuery_1.authSql.checkUser, sqlParamCheckUser, (errCheckUser, resCheckUser) => {
                if (errCheckUser) {
                    res.status(500).send("Error 500 at login");
                    console.log(timestamp, "Error 500 at login", errCheckUser);
                }
                else {
                    if (
                    //user ditemukan  
                    resCheckUser.rows[0]
                    // &&
                    // resCheckUser[0].user_level != 0 //this will verify 
                    // that role is exist or not
                    ) {
                        const userLoginAttempt = parseInt(resCheckUser.rows[0].login_attempt);
                        const isSuspended = resCheckUser.rows[0].suspended;
                        const lastLoginAttempt = resCheckUser.rows[0].last_login_attempt;
                        const COOLDOWN_MS = 15 * 1000;
                        const timeDifference = (Date.now()) - (new Date(lastLoginAttempt).getTime());
                        // cek apakah percobaan login 
                        // lebih dari batas yang ditentukan
                        if (isSuspended) {
                            res.status(201).send({
                                msg: "Cannot Proceed Login, Please contact your Team administrator",
                                data: {},
                                ui_configuration: {}
                            });
                        }
                        else {
                            // bounce click holder
                            if (timeDifference < COOLDOWN_MS) {
                                const remainingSeconds = Math.ceil((COOLDOWN_MS - timeDifference) / 1000);
                                res.status(201).send({
                                    msg: `Whoops! Too fast! please wait ${remainingSeconds} seconds more!`,
                                    data: {},
                                    ui_configuration: {}
                                });
                                customConsole_1.concol.plain(location, timestamp, `=> login SPAM_ATTACK by "${uname}" . cooling down for ${remainingSeconds}`, customConsole_1.colorTx.Red, customConsole_1.colorBg.Black);
                            }
                            else {
                                if (
                                //ini res data dari percobaan login
                                ((userLoginAttempt + 1) <= loginAttemptPolicy)
                                    ||
                                        (userLoginAttempt == null)
                                    ||
                                        (userLoginAttempt == 0)
                                    ||
                                        (!userLoginAttempt)) {
                                    //ini password yang sudah di hash
                                    let waswod = encrypt_1.default.hashPassword(pswd);
                                    //ini untuk param login
                                    let sqlParamLogin = [uname, waswod];
                                    db_1.dbPgMain.query(authSqlQuery_1.authSql.loginQuery, sqlParamLogin, (errLogin, resLogin) => __awaiter(void 0, void 0, void 0, function* () {
                                        if (errLogin) {
                                            res.status(500).send("Error 500 at login");
                                            console.log(timestamp, "Error 500 at login errLogin", errLogin);
                                        }
                                        else {
                                            //cek hasil login apakah username 
                                            // dan password benar atau tidak
                                            // INI CASE JIKA PASSWORD SALAH
                                            if (resLogin.rows.length <= 0) {
                                                // ini case salah password
                                                res.status(201).send({
                                                    msg: "wrong password",
                                                    personal: {
                                                        uname: '',
                                                        pid: '',
                                                        role_code: '',
                                                        role_name: ''
                                                    },
                                                    ui_configuration: {}
                                                });
                                                customConsole_1.concol.plain(location, timestamp, `=> login "${uname}" salah password`, customConsole_1.colorTx.Red, customConsole_1.colorBg.Black);
                                                const userID = resCheckUser.rows[0].id;
                                                const updatedAttemptValue = (userLoginAttempt ? userLoginAttempt : 0) + 1;
                                                const updateLoginAttemptParam = [(updatedAttemptValue), userID];
                                                db_1.dbPgMain.query(authSqlQuery_1.authSql.loginUpdateAttemptQuery, updateLoginAttemptParam, (errUpdateAttept) => {
                                                    if (errUpdateAttept) {
                                                        customConsole_1.concol.bright("auth", timestamp, `auth error at update login attempt value : ${errUpdateAttept}`, "Red", "Yellow");
                                                    }
                                                });
                                            }
                                            else {
                                                // INI CASE JIKA PASSWORD BENAR
                                                /* data comment
                                                data ini akan dilempar ke frontend tanpa enkripsi
                                                dan akan disimpan di global state redux
                                                */
                                                // set cookie ini, untuk refresh token
                                                // ini harus di atas dari res. 
                                                // karena tidak bisa kirim res 2x. 
                                                // di sini langkah mengirim header, 
                                                // lalu next. gitu loh
                                                let rawDataToken = {
                                                    uname: resLogin.rows[0].uname,
                                                    uID: resLogin.rows[0].public_share_id
                                                };
                                                const tokek = yield encrypt_1.default.setCookie(res, rawDataToken, resLogin.rows[0].stay_log_for);
                                                yield (0, updateSesion_1.default)(resLogin.rows[0].id, JSON.stringify(tokek), resLogin.rows[0].stay_log_for);
                                                //tutup comm ke frontend
                                                res.status(200).send({
                                                    msg: `welcome `,
                                                    personal: {
                                                        uname: resLogin.rows[0].uname,
                                                        pid: resLogin.rows[0].public_share_id,
                                                        role_code: resLogin.rows[0].role_code,
                                                        role_name: resLogin.rows[0].role_name
                                                    },
                                                    ui_configuration: resLogin.rows[0].ui_configuration
                                                });
                                                console.log("rawData.id + ", (0, IDGenerator_1.sealStampGenerator)(resLogin.rows[0].id, "A_LI"));
                                                customConsole_1.concol.plain(location, timestamp, `=> login "${uname}" berhasil`, customConsole_1.colorTx.Green, customConsole_1.colorBg.Black);
                                                //reset attempt login
                                                const userID = resCheckUser.rows[0].id;
                                                const updatedAttemptValue = 0; //ya kan reset 
                                                const updateLoginAttemptParam = [updatedAttemptValue, userID];
                                                // INI UNTUK MERESET LOGIN ATTEMPT JIKA ADA
                                                db_1.dbPgMain.query(authSqlQuery_1.authSql.loginUpdateAttemptQuery, updateLoginAttemptParam, (errUpdateAttept) => {
                                                    if (errUpdateAttept) {
                                                        customConsole_1.concol.bright("auth", timestamp, `auth error at reset login attempt value : ${errUpdateAttept}`, customConsole_1.colorTx.Red, customConsole_1.colorBg.Yellow);
                                                    }
                                                });
                                                const updateLoginAttemptValidateParam = [userID];
                                                db_1.dbPgMain.query(authSqlQuery_1.authSql.loginUpdateAttemptQueryValidate, updateLoginAttemptValidateParam, (errUpdateAttept) => {
                                                    if (errUpdateAttept) {
                                                        customConsole_1.concol.bright("auth", timestamp, `auth error at unvalidate sesion login for ${userID} value : ${errUpdateAttept}`, customConsole_1.colorTx.Red, customConsole_1.colorBg.Yellow);
                                                    }
                                                });
                                            }
                                        }
                                    }));
                                }
                                else {
                                    // this case will NOT allow user that 
                                    // has been reaching login attempt
                                    // ini case percobaan login melampaui yang diizinkan.
                                    let msg = `Too many login attempt! Please reset your password! `;
                                    let data = {};
                                    res.status(201).send({ msg, data });
                                    customConsole_1.concol.bright(location, timestamp, msg, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.White);
                                }
                            }
                        }
                    }
                    else {
                        //salah password, tidak ada data ditemukan 
                        // let msg: string = " username is not exist";
                        let msg = "invalid credentials";
                        let data = {};
                        res.status(201).send({ msg, data });
                        customConsole_1.concol.bright(location, timestamp, msg, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.White);
                    }
                    ;
                }
            });
        }
        else {
            console.log(timestamp, "username or password is empty");
            res.status(500).send(timestamp + "username or password is empty");
        }
    }
    else {
        console.log(timestamp, "INVALID REQ BODY", req.body);
        res.status(500).send(timestamp + "INVALID REQ BODY");
    }
});
exports.LogIn = LogIn;
