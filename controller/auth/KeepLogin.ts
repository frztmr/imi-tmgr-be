
import { dbPgMain, dbPgMainQuery } from '../../config/db'
import { Request, Response } from 'express';
import encrypt from '../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { authSql } from './authSqlQuery' 
import { QueryResult } from 'pg';
import updateSesion from './updateSesion';


let yellowTerminal = "\x1b[33m";
let location: string = "auth"

export const keepLogin = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = yellowTerminal
        + date.toLocaleDateString('id')
        + ' ' + date.toLocaleTimeString('id')
        + ' => Keep_login =>';

    try {


        if (req.cookies) {
            const userData: any = req.dataToken
            // console.log("yes, ada cookie isinya ", userData);

            if (userData) {

                let sqlParam: [String] = [userData.uname];



                dbPgMain.query(
                    authSql.KeepLoginQuery, sqlParam,
                    async (err: Error, results: QueryResult<any>) => {
                        /*
                         authSql.KeepLoginQuery,
                         sqlParam, (err: Error, results: RowDataPacket[]) => {
                        
                        */

                        if (err) {
                            res.status(500).send("Error 500 at keepLogin")
                            concol.reverse(
                                location, timestamp,
                                `Error 500 at login ${err}`,
                                colorTx.Red, colorBg.White
                            )

                        } else {

                            //user ditemukan. pasword benar, berhasil login 
                            if (results.rows.length > 0) {

                                let rawData = results.rows[0];


                                // // spare ini untuk event logger
                                // sealStampGenerator(rawData.id, "A_KL")


                                if (results.rows[0].suspended) {

                                    concol.plain(
                                        location, timestamp,
                                        ` => keepLogin "${rawData.uname}" udah gak boleh login`,
                                        colorTx.Yellow, colorBg.Black
                                    )

                                    res.status(201).send(
                                        {
                                            msg: "Whoops! Please try to login!",
                                            data: {},
                                            success: false,
                                            tokek: ''
                                        }
                                    )

                                } else {
                                    // let tokek = encrypt.generateToken(rawDataToken);

                                    let rawDataToken: any = {
                                        uname: results.rows[0].uname,
                                        uID: results.rows[0].public_share_id
                                    }

                                    const tokek = await encrypt.setCookie(res, rawDataToken, results.rows[0].stay_log_for);
                                    await updateSesion(results.rows[0].id, JSON.stringify(tokek), results.rows[0].stay_log_for);

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

                                    concol.plain(
                                        location,
                                        timestamp,
                                        ` => keepLogin "${rawData.uname}" berhasil`,
                                        colorTx.Yellow, colorBg.Black
                                    )


                                }


                            } else {
                                //salah password, tidak ada data ditemukan 
                                res.status(201).send(
                                    {
                                        msg: "Whoops, something went wrong",
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
}