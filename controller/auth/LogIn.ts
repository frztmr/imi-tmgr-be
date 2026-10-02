import { dbPgMain, dbPgMainQuery } from '../../config/db'
import { Request, Response } from 'express';
import encrypt from '../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { authSql } from './authSqlQuery'
import { sealStampGenerator } from '../../config/IDGenerator'
import { QueryResult } from 'pg';
import updateSesion from './updateSesion';

let yellowTerminal = "\x1b[33m";
let location: string = "auth/login"

export const LogIn = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id');

    const login_attempt: any = process.env.SECURITY_TRIAL_LOGIN || 4 // defined agreement of how many attempt
    const loginAttemptPolicy = parseInt(login_attempt)

    interface RequestBody {
        uname: string; // or any other type
        pswd: string; // or any other type
    }


    if (req.body) {

        let { uname, pswd }: RequestBody = req.body;
        let sqlParamCheckUser: [string] = [uname];


        if (uname && pswd) {

            // cek dulu apakah ada usernya atau tidak? 
            // cek juga sudah berapa kali dia mencoba untuk login?
            dbPgMain.query(authSql.checkUser, sqlParamCheckUser,
                (errCheckUser: Error, resCheckUser: any) => {

                    if (errCheckUser) {
                        res.status(500).send("Error 500 at login")
                        console.log(timestamp, "Error 500 at login", errCheckUser)
                    } else {


                        if (
                            //user ditemukan  
                            resCheckUser.rows[0]
                            // &&
                            // resCheckUser[0].user_level != 0 //this will verify 
                            // that role is exist or not
                        ) {
                            const userLoginAttempt: number = parseInt(resCheckUser.rows[0].login_attempt)
                            const isSuspended: Boolean = resCheckUser.rows[0].suspended
                            const lastLoginAttempt: Date = resCheckUser.rows[0].last_login_attempt
                            const COOLDOWN_MS = 15 * 1000;
                            const timeDifference = (Date.now()) - (new Date(lastLoginAttempt).getTime());

                            // cek apakah percobaan login 
                            // lebih dari batas yang ditentukan
                            if (isSuspended) {
                                res.status(401).send({
                                    msg: "Cannot Proceed Login, Please contact your Team administrator",
                                    data: {},
                                    ui_configuration: {}
                                });
                            } else {

                                // bounce click holder

                                if (timeDifference < COOLDOWN_MS) {
                                    const remainingSeconds = Math.ceil((COOLDOWN_MS - timeDifference) / 1000);

                                    res.status(401).send({
                                        msg: `Whoops! Too fast! please wait ${remainingSeconds} seconds more!`,
                                        data: {},
                                        ui_configuration: {}
                                    });
                                    concol.plain(
                                        location,
                                        timestamp,
                                        `=> login SPAM_ATTACK by "${uname}" . cooling down for ${remainingSeconds}`,
                                        colorTx.Red,
                                        colorBg.Black
                                    );
                                } else {

                                    if (
                                        //ini res data dari percobaan login
                                        ((userLoginAttempt + 1) <= loginAttemptPolicy)
                                        ||
                                        (userLoginAttempt == null)
                                        ||
                                        (userLoginAttempt == 0)
                                        ||
                                        (!userLoginAttempt)
                                    ) {


                                        //ini password yang sudah di hash
                                        let waswod: string = encrypt.hashPassword(pswd);

                                        //ini untuk param login
                                        let sqlParamLogin: [string, string] = [uname, waswod];

                                        dbPgMain.query(
                                            authSql.loginQuery,
                                            sqlParamLogin,
                                            async (errLogin: Error, resLogin: any) => {


                                                if (errLogin) {

                                                    res.status(500).send("Error 500 at login");
                                                    console.log(
                                                        timestamp,
                                                        "Error 500 at login errLogin",
                                                        errLogin
                                                    );

                                                } else {

                                                    //cek hasil login apakah username 
                                                    // dan password benar atau tidak


                                                    // INI CASE JIKA PASSWORD SALAH
                                                    if (resLogin.rows.length <= 0) {

                                                        // ini case salah password

                                                        res.status(401).send({
                                                            msg: "Whoops! invalid credential!",
                                                            personal: {
                                                                uname: '',
                                                                pid: '',
                                                                role_code: '',
                                                                role_name: ''
                                                            },
                                                            ui_configuration: {}
                                                        });

                                                        concol.plain(
                                                            location,
                                                            timestamp,
                                                            `=> login "${uname}" salah password`,
                                                            colorTx.Red,
                                                            colorBg.Black
                                                        );

                                                        const userID = resCheckUser.rows[0].id
                                                        const updatedAttemptValue = (userLoginAttempt ? userLoginAttempt : 0) + 1

                                                        const updateLoginAttemptParam: [Number, String] = [(updatedAttemptValue), userID]

                                                        dbPgMain.query(
                                                            authSql.loginUpdateAttemptQuery,
                                                            updateLoginAttemptParam,
                                                            (errUpdateAttept: Error) => {

                                                                if (errUpdateAttept) {
                                                                    concol.bright(
                                                                        "auth",
                                                                        timestamp,
                                                                        `auth error at update login attempt value : ${errUpdateAttept}`,
                                                                        "Red", "Yellow")
                                                                }
                                                            }
                                                        )


                                                    } else {

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
                                                        let rawDataToken: any = {
                                                            uname: resLogin.rows[0].uname,
                                                            uID: resLogin.rows[0].public_share_id
                                                        }

                                                        const tokek = await encrypt.setCookie(res, rawDataToken, resLogin.rows[0].stay_log_for);
                                                        await updateSesion(resLogin.rows[0].id, JSON.stringify(tokek), resLogin.rows[0].stay_log_for);


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

                                                        console.log("rawData.id + ",
                                                            sealStampGenerator(resLogin.rows[0].id, "A_LI"),
                                                            //A: auth, LI, LogIn
                                                        )
                                                        concol.plain(
                                                            location,
                                                            timestamp,
                                                            `=> login "${uname}" berhasil`,
                                                            colorTx.Green,
                                                            colorBg.Black
                                                        );




                                                        //reset attempt login
                                                        const userID = resCheckUser.rows[0].id
                                                        const updatedAttemptValue = 0 //ya kan reset 

                                                        const updateLoginAttemptParam: [Number, String] = [updatedAttemptValue, userID]

                                                        // INI UNTUK MERESET LOGIN ATTEMPT JIKA ADA
                                                        dbPgMain.query(
                                                            authSql.loginUpdateAttemptQuery,
                                                            updateLoginAttemptParam,
                                                            (errUpdateAttept: Error) => {

                                                                if (errUpdateAttept) {
                                                                    concol.bright(
                                                                        "auth",
                                                                        timestamp,
                                                                        `auth error at reset login attempt value : ${errUpdateAttept}`,
                                                                        colorTx.Red, colorBg.Yellow
                                                                    )
                                                                }

                                                            }
                                                        )
                                                        const updateLoginAttemptValidateParam: [string] = [userID]
                                                        dbPgMain.query(
                                                            authSql.loginUpdateAttemptQueryValidate,
                                                            updateLoginAttemptValidateParam,
                                                            (errUpdateAttept: Error) => {

                                                                if (errUpdateAttept) {
                                                                    concol.bright(
                                                                        "auth",
                                                                        timestamp,
                                                                        `auth error at unvalidate sesion login for ${userID} value : ${errUpdateAttept}`,
                                                                        colorTx.Red, colorBg.Yellow
                                                                    )
                                                                }

                                                            }
                                                        )
                                                    }
                                                }
                                            });

                                    } else {

                                        // this case will NOT allow user that 
                                        // has been reaching login attempt

                                        // ini case percobaan login melampaui yang diizinkan.
                                        let msg: string = `Too many login attempt! Please reset your password! `;
                                        let data: any = {};

                                        res.status(201).send({ msg, data });
                                        concol.bright(
                                            location,
                                            timestamp,
                                            msg,
                                            colorTx.Yellow,
                                            colorBg.White
                                        );
                                    }
                                }

                            }

                        } else {
                            //salah password, tidak ada data ditemukan 
                            // let msg: string = " username is not exist";
                            let msg: string = "invalid credentials";
                            let data: any = {};

                            res.status(201).send({ msg, data });
                            concol.bright(
                                location, timestamp,
                                msg,
                                colorTx.Yellow, colorBg.White);

                        };

                    }
                })
        }
        else {
            console.log(timestamp, "username or password is empty")
            res.status(500).send(timestamp + "username or password is empty")

        }

    } else {

        console.log(timestamp, "INVALID REQ BODY", req.body)
        res.status(500).send(timestamp + "INVALID REQ BODY")
    }

}