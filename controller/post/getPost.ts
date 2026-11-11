import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, getPostSql } from './post.sql';
import { post_id } from '../../config/IDGenerator'
import { DatabaseError } from 'pg';


export const getSimplePost = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (req.dataToken.uname) { // cari public share id

        // verify user 
        let getIDsqlParam: [string] = [req.dataToken.psid];

        dbPgMain.query(                             // validate user
            newPostSql.verifyUser, getIDsqlParam,
            async (err: any, resVerifyUser: any) => {

                const user_id: string = resVerifyUser.rows[0].id // validate user 

                if (user_id) {                  // validate user


                    dbPgMain.query(                             // insert post
                        getPostSql.getSimplePost,
                        // user_id,
                        (errGetSimplePost: Error) => {

                            if (errGetSimplePost) {

                                res.status(500).send({
                                    msg: "error add post"
                                });
                                console.log("caught error at get simple post ", errGetSimplePost);

                            } else {

                                res.status(200).send({
                                    msg: "successfully added"
                                });

                            }

                        })

 

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