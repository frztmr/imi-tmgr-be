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
const db_1 = require("../../config/db");
const encrypt_1 = __importDefault(require("../../config/encrypt"));
const customConsole_1 = require("../../config/customConsole");
const authSqlQuery_1 = require("./authSqlQuery");
/*
auth diantaranya:
- login,
- keep login,
- change password
- forgot password
- forgot password verification
- change password forgot password

*/
let yellowTerminal = "\x1b[33m";
let location = "auth";
const authController = {
    loginReady: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ' + ' Auth Login  =>';
        let msg = 'Whenever you ready!';
        let stats = 200;
        let ready = true;
        // let ready: boolean = true
        res.status(stats).send({ msg, ready });
        console.log(timestamp, " Check login availability. Is ready :", ready);
        // dbIod.query(dbIodQuery, paramQuery, async (error: Error, results: Response) => {})
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                                    db_1.dbPgMain.query(authSqlQuery_1.authSql.loginQuery, sqlParamLogin, (errLogin, resLogin) => {
                                        if (errLogin) {
                                            res.status(500).send("Error 500 at login");
                                            console.log(timestamp, "Error 500 at login errLogin", errLogin);
                                        }
                                        else {
                                            //cek hasil login apakah username 
                                            // dan password benar atau tidak
                                            if (resLogin.rows.length <= 0) {
                                                // ini case salah password
                                                res.status(201).send({
                                                    msg: "wrong password",
                                                    data: {},
                                                    ui_configuration: {}
                                                });
                                                customConsole_1.concol.plain(location, timestamp, `=> login "${uname}" salah password`, customConsole_1.colorTx.Red, customConsole_1.colorBg.Black);
                                                const userID = resCheckUser.rows[0].id;
                                                const updatedAttemptValue = (userLoginAttempt ? userLoginAttempt : 0) + 1;
                                                console.log("updatedAttemptValue", updatedAttemptValue);
                                                console.log("userLoginAttempt", userLoginAttempt);
                                                const updateLoginAttemptParam = [(updatedAttemptValue), userID];
                                                db_1.dbPgMain.query(authSqlQuery_1.authSql.loginUpdateAttemptQuery, updateLoginAttemptParam, (errUpdateAttept) => {
                                                    if (errUpdateAttept) {
                                                        customConsole_1.concol.bright("auth", timestamp, `auth error at update login attempt value : ${errUpdateAttept}`, "Red", "Yellow");
                                                    }
                                                });
                                            }
                                            else {
                                                // ini case benar
                                                /* data comment
                                                data ini akan dilempar ke frontend tanpa enkripsi
                                                dan akan disimpan di global state redux
                                                */
                                                res.status(200).send({
                                                    msg: `welcome `,
                                                    data: {},
                                                    ui_configuration: resLogin.rows[0].ui_configuration
                                                });
                                                customConsole_1.concol.plain(location, timestamp, `=> login "${uname}" berhasil`, customConsole_1.colorTx.Green, customConsole_1.colorBg.Black);
                                                //reset attempt login
                                                const userID = resCheckUser.rows[0].id;
                                                const updatedAttemptValue = 0; //ya kan reset 
                                                const updateLoginAttemptParam = [updatedAttemptValue, userID];
                                                db_1.dbPgMain.query(authSqlQuery_1.authSql.loginUpdateAttemptQuery, updateLoginAttemptParam, (errUpdateAttept) => {
                                                    if (errUpdateAttept) {
                                                        customConsole_1.concol.bright("auth", timestamp, `auth error at reset login attempt value : ${errUpdateAttept}`, "red", "Yellow");
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                else {
                                    // this case will not allow user that 
                                    // has been reaching login attempt
                                    // ini case percobaan login melampaui yang diizinkan.
                                    let msg = `Too many login attempt! Please reset your password! `;
                                    let data = {};
                                    res.status(201).send({ msg, data });
                                    customConsole_1.concol.bright(location, timestamp, msg, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.White);
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
    }),
    keepLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let date = new Date();
        let timestamp = yellowTerminal
            + date.toLocaleDateString('id')
            + ' ' + date.toLocaleTimeString('id')
            + ' => Keep_login =>';
        try {
            if (req.cookies) {
                const userData = req.dataToken;
                if (userData) {
                    let sqlParam = [userData.uid];
                    db_1.dbHots.execute(authSqlQuery_1.authSql.KeepLoginQuery, sqlParam, (err, results) => {
                        if (err) {
                            res.status(500).send("Error 500 at keepLogin");
                            customConsole_1.concol.reverse(location, timestamp, `Error 500 at login ${err}`, customConsole_1.colorTx.Red, customConsole_1.colorBg.White);
                        }
                        else {
                            //user ditemukan. pasword benar, berhasil login 
                            if (results.length > 0) {
                                let rawData = results[0];
                                let finished_date = rawData.finished_date;
                                if (!finished_date) {
                                    let msg = "berhasil";
                                    /*
                                    data ini akan dilempar ke frontend tanpa enkripsi
                                    dan akan disimpan di global state redux
                                    */
                                    let data = {
                                        firstname: rawData.firstname,
                                        lastname: rawData.lastname,
                                        type_id: rawData.type_id,
                                        uid: rawData.uid,
                                        active: rawData.active,
                                        status: rawData.status,
                                        user_level: rawData.user_level,
                                    };
                                    /*
                                    data ini akan dilempar ke frontend dengan enkripsi
                                    dan data ini akan disimpan di cookies
                                    dan dikirim ke backend jika diperlukan
                                    */
                                    let rawDataToken = {
                                        user_id: rawData.user_id,
                                        employee_id: rawData.employee_id,
                                        type_id: rawData.type_id,
                                        uid: rawData.uid,
                                        active: rawData.active,
                                        status: rawData.status,
                                        user_level: rawData.user_level,
                                    };
                                    // let tokek = encrypt.generateToken(rawDataToken);
                                    encrypt_1.default.setCookie(res, rawDataToken, 0);
                                    let success = data.active == 1 ? true : false;
                                    res.status(200).send({ msg, data, success });
                                    customConsole_1.concol.plain(location, timestamp, ` => keepLogin "${rawData.uid}" berhasil`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
                                }
                                else {
                                    customConsole_1.concol.plain(location, timestamp, ` => keepLogin "${userData.uid}" udah gak boleh login`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
                                    res.status(401).send({
                                        msg: "you are no longer authorized to login. your accound are suspended",
                                        data: {},
                                        success: false,
                                        tokek: ''
                                    });
                                }
                            }
                            else {
                                //salah password, tidak ada data ditemukan 
                                res.status(401).send({
                                    msg: "",
                                    data: {},
                                    success: false,
                                    tokek: ''
                                });
                                customConsole_1.concol.bright(location, timestamp, "error uid not valid  ", customConsole_1.colorTx.Red, customConsole_1.colorBg.White);
                            }
                        }
                    });
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
    }),
    logOut: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => Keep_login =>';
        try {
            encrypt_1.default.clearCookie(res);
            customConsole_1.concol.plain(location, timestamp, ` => log out 📤`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
            res.status(200).send("successfuly clear cookies");
        }
        catch (error) {
            customConsole_1.concol.plain(location, timestamp, ` => FAIL to log out 📤 ❌`, customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
            res.status(500).send("successfuly clear cookies");
        }
    }),
    // keepLogin: ()
};
exports.default = authController;
