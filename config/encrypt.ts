
import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'
import { Response } from 'express'

import { colorBg, colorTx, concol } from './customConsole'
const queryLocation: string = 'encrypt.ts';

const encrypt = {

    hashPassword: (text: string): string => {

        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

        concol.plain(queryLocation, timestamp, "hashing password... ", colorTx.White, colorBg.Black)
        return createHmac(process.env.SECURITY_HASH_TYPE_HT || 'hash_type', process.env.SECURITY_HASH_KEY_HT || 'hehehe_kepo lu').update(text).digest('hex')
    },
    generateToken: (dataToken: DataToken): string => {

        console.log("dataToken", dataToken)
        console.log("typeof dataToken", typeof dataToken)

        let date = new Date();
        let timestamp: string = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

        concol.plain(queryLocation, timestamp, "generating token...", colorTx.White, colorBg.Black)
        return jwt.sign({ token: dataToken }, process.env.SECURITY_TOKEN_KEY || 'kepo_lu_anjir', { expiresIn: '1h' })

    },
    decodeToken: (req: any, res: any, next: any) => {

        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

        concol.plain(
            queryLocation, timestamp,
            "decoding token ",
            colorTx.White, colorBg.Black
        )

        jwt.verify(req.token, process.env.SECURITY_TOKEN_KEY || "ih_beneran_kepo_lu_ye", (err: any, decode: any) => {
            if (err) {
                console.log("Invalid Token Read Token");
                return res.status(401).send({
                    message: 'ERROR IN AUTH!'
                })
            }

            // console.log("decodeded token",decode)
            req.dataToken = decode;
            next();
        })
    },
    clearCookie: (res: Response) => {

        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';



        try {

            res.clearCookie("tokek", {
                httpOnly: true,
                secure: false,       // ✅ match cookie settings
                sameSite: "lax",   // ✅ match cookie settings
            });
            concol.plain(queryLocation, timestamp, " cookie clear ", colorTx.White, colorBg.Black);
        } catch (error) {

            concol.plain(queryLocation, timestamp, `ERRORR while clear cookie : ${error}`, colorTx.White, colorBg.Black);
        }

    },
    setCookie: (res: Response, dataToken: DataToken, expiresIn: number): any => {

        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';


        let tokek: string = jwt.sign(
            dataToken,
            process.env.SECURITY_TOKEN_KEY || 'kepo_lu_anjir',
            { expiresIn: '1h' }
        )

        let lifeSpan: number = expiresIn = 0 ? 60 * 60 * 1000 : expiresIn // 1 hour
        /*
         MAX AGE: 
         60 seconds ×  
         60 minutes (3600 seconds (1 hour)) × 
         1000 milliseconds = 
         3,600,000 ms 
         */

        try {
            res.cookie("tokek", tokek, {
                httpOnly: true,
                // secure: cookieSecureParameter, // use true in production with HTTPS  
                secure: false, // use true in production with HTTPS  
                sameSite: 'lax', // local. Secure -> production
                maxAge: 60 * 60 * 1000,
                // maxAge: lifeSpan, 
            });
            concol.plain(queryLocation, timestamp, "cookie generated and thrown to client", colorTx.White, colorBg.Blue)
        } catch (error) {
            concol.plain(queryLocation, timestamp, "failed generated cookie " + error, colorTx.White, colorBg.Red)
        }


    },
    decodeCookies: (req: any, res: any, next: Next) => {

        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';


        if (req.cookies) {
            // concol.bright(queryLocation,timestamp,`isi cookies ${req.cookies} `, colorTx.Green, colorBg.Red)


            if (!(req.cookies?.['tokek'])) {

                // return res.status(401).send("INVALID TOKEN");
                // res.status(200).send();
                concol.plain(queryLocation, timestamp, " gak ada cookie", colorTx.Yellow, colorBg.Black);
                let msg: string = "there is no cookie to decode "
                let success: boolean = false
                res.status(204).send({ msg, success });

            } else {

                try {
                    let cookies: string = req.cookies['tokek'];

                    const decoded = jwt.verify(cookies, process.env.SECURITY_TOKEN_KEY || "fedsvaihnu");
                    (req as any).dataToken = decoded;
                    next();
                    concol.plain(queryLocation, timestamp, "eating (decoding) cookie ", colorTx.White, colorBg.Black)

                } catch (err) {
                    let msg: string = "failed to decode cookie "
                    let success: boolean = false
                    res.status(204).send({ msg, success });

                }

            }

        } else {
            res.status(500).send({ error: "there is no cookies " });
        }


    },
}

export default encrypt
