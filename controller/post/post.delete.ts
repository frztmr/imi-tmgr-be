
import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, postDeleteSql } from './post.sql';
import { DatabaseError } from 'pg';
import { Result } from 'ioredis';

const location: string = `/post/bookmark_unbookmark`;

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
                                async (errGetLikeStatus: Error, resGetLikeStatus: any) => {

                                    if (errGetLikeStatus) {

                                        res.status(500).send({
                                            msg: "error get status bookmarkPost.getBookmarkStatus"
                                        });
                                        concol.bright( //error console
                                            location, timestamp,
                                            `  unable to bookmarkPost.getBookmarkStatus :   ${errGetLikeStatus}`,
                                            colorTx.White, colorBg.Red);

                                    } else {

                                        const posts = await (resGetLikeStatus.rows[0])

                                        try {


                                            await dbPgMainQuery(postDeleteSql.deletePost, [post_id, user_id]) //buat unlike 

                                            res.status(200).send({
                                                msg: "successfully bookmark posts",
                                                posts
                                            });
                                            concol.bright(  //success console
                                                location, timestamp,
                                                `  successfully bookmark post `,
                                                colorTx.White, colorBg.Black
                                            )


                                        } catch (error) {

                                            res.status(500).send({
                                                msg: "error bookmark/unbookmark post!"
                                            });
                                            concol.bright( //error console
                                                location, timestamp,
                                                `  unable to bookmark : ${error}`,
                                                colorTx.White, colorBg.Red);

                                        }

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