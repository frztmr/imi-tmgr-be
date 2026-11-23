
import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, postDeleteSql } from './post.sql';
import { DatabaseError } from 'pg';
import { Result } from 'ioredis';

const location: string = `/post/delete`;

export const postDelete = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (req.dataToken.uname) { // cari public share id

        // verify user 
        let getIDsqlParam: [string] = [req.dataToken.psid];

        dbPgMain.query(                             // validate user
            newPostSql.verifyUser, getIDsqlParam,
            async (errVerifyUser: Error, resVerifyUser: any) => {
                const user_id: string = resVerifyUser.rows[0].id // validate user 

                if (errVerifyUser) {
                    res.status(401).send({
                        msg: "user is invalid!"
                    })
                    concol.bright( //error console
                        location, timestamp,
                        `  invalid user_id`,
                        colorTx.White, colorBg.Red);
                } else {

                    if (user_id) {

                        if (req.params.post_id) {

                            const post_id = req.params.post_id
                            // validate user

                            dbPgMain.query(         // cek status like, sudah dilike apa belum
                                postDeleteSql.deletePost,
                                [post_id],
                                async (errDeletePost: Error,) => {

                                    if (errDeletePost) {

                                        res.status(500).send({
                                            msg: "error get status postDeleteSql.deletePost"
                                        });
                                        concol.bright( //error console
                                            location, timestamp,
                                            `  unable to postDeleteSql.deletePost :  ${errDeletePost}`,
                                            colorTx.White, colorBg.Red);

                                    } else {

                                        res.status(200).send({
                                            msg: "successfully delete posts",

                                        });
                                        concol.bright(  //success console
                                            location, timestamp,
                                            `  successfully delete posts `,
                                            colorTx.White, colorBg.Black
                                        )

                                    }

                                })
                        } else {
                            res.status(400).send({
                                msg: "invalid req param!"
                            });
                            concol.bright( //error console
                                location, timestamp,
                                `  invalid req param!`,
                                colorTx.White, colorBg.Red);
                        }

                    } else {

                        res.status(401).send({
                            msg: "user is invalid!"
                        })
                        concol.bright( //error console
                            location, timestamp,
                            `  invalid user_id`,
                            colorTx.White, colorBg.Red);
                    }

                }
            })

    } else {

        res.status(401).send({
            msg: "unauthorized"
        })
        concol.bright( //error console
            location, timestamp,
            `  invalid user_id`,
            colorTx.White, colorBg.Red);
    }
}

// saya sudah siapkan endpoint api untuk dikirim ke backend. kirim semua data ke: endpoint /post/new