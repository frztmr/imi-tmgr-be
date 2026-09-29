/*
    user_id text NOT NULL,
    refresh_token text NULL,
    last_refresh_token_generated timestamp NOT NULL DEFAULT now(),
    "generated" timestamp NULL,
    expired timestamp NULL,
    invalidate bool NULL,

    */

let yellowTerminal = "\x1b[33m";
const location: string = " auth -> updateSesion "

import { dbPgMain } from '../../config/db'
import { authSql } from './authSqlQuery'
import { QueryResult } from 'pg';
import { colorBg, colorTx, concol } from '../../config/customConsole'



const updateSession = async (id: String, tokek: any, expiredAt: number) => {

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

    const sqlParamCheckSesion = [id]
    const sqlParamUpdateInjectSesion = [id, tokek, expiredDate]


    dbPgMain.query(authSql.checkSesion, sqlParamCheckSesion,
        (errCheckUser: Error, resCheckUser: QueryResult) => {

            if (errCheckUser) { // kalau error

            } else {
                if (resCheckUser.rows.length > 0) { // jika lebih dari satu 


                    dbPgMain.query(authSql.updateSesion, sqlParamUpdateInjectSesion,
                        (errUpdateSesion: Error) => {

                            if (errUpdateSesion) {
                                concol.bright(
                                    location,
                                    timestamp,
                                    `Error while update sesion! : ${errUpdateSesion}`,
                                    colorTx.White, colorBg.Green
                                )
                            } else {
                                concol.bright(
                                    location,
                                    timestamp,
                                    `succesfully Update Sesion! `,
                                    colorTx.White, colorBg.Green
                                )
                            }
                        })
                } else { // ini kalau sesinya BELUM ada.

                    dbPgMain.query(authSql.injectSesion, sqlParamUpdateInjectSesion,
                        (errInjectSesion: Error) => {
                            if (errInjectSesion) {
                                concol.bright(
                                    location,
                                    timestamp,
                                    `Error while Inject sesion! : ${errInjectSesion}`,
                                    colorTx.White, colorBg.Red
                                )
                            } else {
                                concol.bright(
                                    location,
                                    timestamp,
                                    `succesfully Inject Sesion! `,
                                    colorTx.White, colorBg.Green
                                )
                            }
                        })

                }
            }
        })



}
export default updateSession;
/*


    user_id text NOT NULL, S1
    refresh_token text NULL, S2 
    expired timestamp NULL,
    invalidate bool NULL,

*/