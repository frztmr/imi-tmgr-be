
import { dbPgMain, dbPgMainQuery } from '../../config/db'
import { Request, Response } from 'express';
import encrypt from '../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { authSql } from './authSqlQuery'
// import { sealStampGenerator } from '../../config/IDGenerator'
// import { QueryResult } from 'pg';
// import updateSesion from './updateSesion';

let yellowTerminal = "\x1b[33m";
let location: string = "auth"

export const LogOut = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => Keep_login =>';

    try {
        const uname = req.dataToken.uname
        const sqlParamInvalidateSesion = [uname]
        dbPgMain.query(authSql.invalidateSesion, sqlParamInvalidateSesion,
            (errUpdateSesion: Error) => {

                if (errUpdateSesion) {
                    concol.bright(
                        location,
                        timestamp,
                        `Error while update sesion! : ${errUpdateSesion}`,
                        colorTx.White, colorBg.Green
                    )
                    res.status(500).send(`error clear cookies for ${uname} : ${errUpdateSesion}`);
                } else {

                    concol.bright(
                        location,
                        timestamp,
                        `succesfully logout for ${uname} ! `,
                        colorTx.White, colorBg.Green
                    )
                    encrypt.clearCookie(res);
                    res.status(200).send(`Good Bye ${uname} `);
                }
            })


    } catch (error) {
        concol.plain(location, timestamp, ` => FAIL to log out 📤 ❌`, colorTx.Yellow, colorBg.Black)

    }

}