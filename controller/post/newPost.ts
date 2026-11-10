import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql } from './post.sql';

export const newPost = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (req.dataToken.uname) { // cari public share id

        // verify user 
        let getIDsqlParam: [string] = [req.dataToken.psid];

        dbPgMain.query(                             // validate user
            newPostSql.verifyUser, getIDsqlParam,    
            (err: any, resVerifyUser: any) => {      

                const user_id = resVerifyUser.rows[0].id // validate user

                if (user_id) {                  // validate user

                    if (req.body) {             // validate req.body

                        let {
                            kind,
                            tag,
                            text,
                            location,
                            contact,
                            impression,
                            expiresAt,
                            poll,
                            visibility,
                            allowedViewers,
                            teamId,
                            status,
                            photos,
                            attachments,
                            expense,
                            feeling
                        } = req.body


                        res.status(200).send({
                            msg: "successfully added"
                        })

                    } else {
                        res.status(204).send({
                            msg: "request body is not proper"
                        })
                        
                    }
                } else {

                    res.status(401).send({
                        msg: "user is invalid!"
                    })

                }


            })

    } else {

        res.status(401).send({
            msg: "unauthorized"
        })
    }
}

// saya sudah siapkan endpoint api untuk dikirim ke backend. kirim semua data ke: endpoint /post/new