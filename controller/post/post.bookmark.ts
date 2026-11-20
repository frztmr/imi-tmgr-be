import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, bookmarkPost } from './post.sql';
import { DatabaseError } from 'pg';
import { Result } from 'ioredis';

const location: string = `/post/bookmark_unbookmark`;

export const bookmarkUnBookmark = async (req: Request, res: Response) => {

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
                                bookmarkPost.getBookmarkStatus,
                                [post_id, user_id],
                                async (errGetLikeStatus: Error, resGetLikeStatus: any) => {

                                    if (errGetLikeStatus) {

                                        res.status(500).send({
                                            msg: "error get status like/unlike post"
                                        });
                                        concol.bright( //error console
                                            location, timestamp,
                                            `  unable to likePost.getStatus :   ${errGetLikeStatus}`,
                                            colorTx.White, colorBg.Red);

                                    } else {

                                        const posts = await (resGetLikeStatus.rows[0])
                                        console.log("posts", posts)
                                        console.log("post_id", post_id)

                                        try {

                                            if (!posts) { // jika belum dilike, tambah like

                                                // STEP 1:      
                                                // const prevLikeValue = await dbPgMainQuery(bookmarkPost.prevLikeValue, [post_id]) //buat like 
                                                // const likeValue = await (                       // ternary untuk menentukan jumlah value. 
                                                //     (prevLikeValue.rows[0].like_count) !== 0 ?   // jika value tidak sama dengan nol, 
                                                //         (prevLikeValue.rows[0].like_count) + 1 : // maka kurangi satu
                                                //         1                                        // jika tidak, maka satu 
                                                // ) 
                                                await dbPgMainQuery(bookmarkPost.likePost, [post_id, user_id]) //buat like 
                                                // await dbPgMainQuery(bookmarkPost.updateLikeValue, [likeValue, post_id]) //buat ubah angka like, +1 

                                                res.status(200).send({
                                                    msg: "successfully get posts",
                                                    posts
                                                });
                                                concol.bright(  //success console
                                                    location, timestamp,
                                                    `  successfully gather post `,
                                                    colorTx.White, colorBg.Black
                                                )

                                            } else { //jika sudah dilike, kurangi like


                                                // const prevLikeValue = await dbPgMainQuery(bookmarkPost.prevLikeValue, [post_id]) //buat like 
                                                // const likeValue = await (                        // ternary untuk menentukan jumlah value. 
                                                //     (prevLikeValue.rows[0].like_count) !== 0 ?   // jika value tidak sama dengan nol, 
                                                //         (prevLikeValue.rows[0].like_count) - 1 : // maka kurangi satu
                                                //         0                                        // jika tidak, maka nol   
                                                // )
                                                // console.log("likeValue@unlike", likeValue)
                                                await dbPgMainQuery(bookmarkPost.unlikePost, [post_id, user_id]) //buat unlike 
                                                // await dbPgMainQuery(bookmarkPost.updateLikeValue, [likeValue, post_id]) //buat unlike,   


                                                res.status(200).send({
                                                    msg: "successfully get posts",
                                                    posts
                                                });
                                                concol.bright(  //success console
                                                    location, timestamp,
                                                    `  successfully gather post `,
                                                    colorTx.White, colorBg.Black
                                                )
                                            }

                                        } catch (error) {

                                            res.status(500).send({
                                                msg: "error like/unlike post!"
                                            });
                                            concol.bright( //error console
                                                location, timestamp,
                                                `  unable to likePost.getStatus :   ${errGetLikeStatus}`,
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