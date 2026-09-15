
import { dbHots, dbPgMain, dbPgMainQuery } from '../../config/db'
import { Request, Response } from 'express';
import encrypt from '../../config/encrypt'
import { RowDataPacket } from 'mysql2';
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { authSql } from './authSqlQuery'
import { error } from 'console';


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
let location: string = "auth"


const authController = {
    loginReady: async (req: Request, res: Response) => {

        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ' + ' Auth Login  =>';

        let msg: string = 'Whenever you ready!'
        let stats: number = 200
        let ready: boolean = true
        // let ready: boolean = true

        res.status(stats).send({ msg, ready })
        console.log(timestamp, " Check login availability. Is ready :", ready)
        // dbIod.query(dbIodQuery, paramQuery, async (error: Error, results: Response) => {})

    },
    login: async (req: Request, res: Response) => {

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

                                // cek apakah percobaan login 
                                // lebih dari batas yang ditentukan
                                if (isSuspended) {
                                    res.status(201).send({
                                        msg: "Cannot Proceed Login, Please contact your Team administrator",
                                        data: {},
                                        ui_configuration: {}
                                    });
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
                                            (errLogin: Error, resLogin: any) => {


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

                                                    if (resLogin.rows.length <= 0) {

                                                        // ini case salah password

                                                        res.status(201).send({
                                                            msg: "wrong password",
                                                            data: {},
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
                                                        console.log("updatedAttemptValue", updatedAttemptValue)
                                                        console.log("userLoginAttempt", userLoginAttempt)

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

                                                        dbPgMain.query(
                                                            authSql.loginUpdateAttemptQuery,
                                                            updateLoginAttemptParam,
                                                            (errUpdateAttept: Error) => {

                                                                if (errUpdateAttept) {
                                                                    concol.bright(
                                                                        "auth",
                                                                        timestamp,
                                                                        `auth error at reset login attempt value : ${errUpdateAttept}`,
                                                                        "red", "Yellow"
                                                                    )
                                                                }

                                                            }
                                                        )
                                                    }
                                                }
                                            });

                                    } else {

                                        // this case will not allow user that 
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

    },
    keepLogin: async (req: any, res: Response) => {

        let date = new Date();
        let timestamp = yellowTerminal
            + date.toLocaleDateString('id')
            + ' ' + date.toLocaleTimeString('id')
            + ' => Keep_login =>';


        try {


            if (req.cookies) {
                const userData: any = req.dataToken

                if (userData) {




                    let sqlParam: object = [userData.uid];

                    dbHots.execute(authSql.KeepLoginQuery, sqlParam, (err: Error, results: RowDataPacket[]) => {


                        if (err) {
                            res.status(500).send("Error 500 at keepLogin")
                            concol.reverse(
                                location, timestamp,
                                `Error 500 at login ${err}`,
                                colorTx.Red, colorBg.White
                            )

                        } else {

                            //user ditemukan. pasword benar, berhasil login 
                            if (results.length > 0) {

                                let rawData = results[0];
                                let finished_date: string = rawData.finished_date

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
                                    }


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
                                    }

                                    // let tokek = encrypt.generateToken(rawDataToken);
                                    encrypt.setCookie(res, rawDataToken, 0);

                                    let success = data.active == 1 ? true : false

                                    res.status(200).send({ msg, data, success })

                                    concol.plain(location, timestamp, ` => keepLogin "${rawData.uid}" berhasil`, colorTx.Yellow, colorBg.Black)

                                } else {

                                    concol.plain(
                                        location, timestamp,
                                        ` => keepLogin "${userData.uid}" udah gak boleh login`,
                                        colorTx.Yellow, colorBg.Black
                                    )

                                    res.status(401).send(
                                        {
                                            msg: "you are no longer authorized to login. your accound are suspended",
                                            data: {},
                                            success: false,
                                            tokek: ''
                                        }
                                    )
                                }


                            } else {
                                //salah password, tidak ada data ditemukan 
                                res.status(401).send(
                                    {
                                        msg: "",
                                        data: {},
                                        success: false,
                                        tokek: ''
                                    }
                                )
                                concol.bright(location, timestamp, "error uid not valid  ", colorTx.Red, colorBg.White)
                            }


                        }

                    })
                } else {
                    //token or userdata is not provided properly
                    res.status(401).send(
                        {
                            msg: "tidak ada user data yang didecode",
                            data: {},
                            success: false,
                            tokek: ''
                        }
                    )

                }


            } else {

                console.log(timestamp, "keep Login, dataToken not avail");
                res.status(200).send("keep Login, dataToken not avail")

            }

        } catch (error) {
            res.status(500).json({ error: "Invalid token" });
        }
    },
    logOut: async (req: Req, res: Res) => {

        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => Keep_login =>';

        try {
            encrypt.clearCookie(res);

            concol.plain(location, timestamp, ` => log out 📤`, colorTx.Yellow, colorBg.Black)
            res.status(200).send("successfuly clear cookies");

        } catch (error) {
            concol.plain(location, timestamp, ` => FAIL to log out 📤 ❌`, colorTx.Yellow, colorBg.Black)

            res.status(500).send("successfuly clear cookies");
        }

    },
    // keepLogin: ()
}
export default authController

