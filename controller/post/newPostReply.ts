import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, newPostReplySql } from './post.sql';
import { post_id } from '../../config/IDGenerator'
import { Result } from 'pg';

let location: string = "/post/new_reply_post";

export const newPostReply = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (req.dataToken.uname) { // cari public share id

        // verify user 
        let getIDsqlParam: [string] = [req.dataToken.psid];

        dbPgMain.query(                             // validate user
            newPostSql.verifyUser, getIDsqlParam,
            async (errverifyUser: Error, resVerifyUser: Result) => {

                if (errverifyUser) {
                    res.status(500).send({
                        msg: "error Verify user"
                    });
                    concol.bright(
                        location, timestamp,
                        "  caught error at error Verify user newPostReply " + errverifyUser,
                        colorTx.White, colorBg.Red);


                } else { 
                      

                    const user_id: string = resVerifyUser.rows[0].id // validate user 

                    if (user_id) {                  // user has been validated.
 
                        if (req.body) {             // validate req.body

                            let {
                                kind, // string
                                eventDate, // datetime/string
                                tag, // array
                                text, //text
                                latitude, //decimal/float
                                longitude, //decimal/float
                                location, //string
                                contact, // string
                                impression, // string
                                expiresAt, //datetime
                                poll, //id
                                visibility, // string
                                allowedViewers, //array
                                teamId, // string
                                status, // string
                                photos, // array jadi id aja di sini
                                attachments, // array jadi id aja di sini
                                expense,      //number 
                                title,     //varchar
                                parent_id //varchar
                            } = req.body



                            const get_post_id: string = await post_id(user_id); //untuk post id
                            let insertPostReplyParam: [
                                string, //$1
                                string, //$2
                                string, //$3
                                string, //$4 
                                string, //$5
                                string, //$6
                                string, //$7
                                string, //$8
                                string, //$9
                                string, //$10
                            ] = [
                                    get_post_id,    //$1
                                    user_id,        //$2
                                    kind,           //$3
                                    visibility,     //$4
                                    eventDate,      //$5
                                    latitude,       //$6
                                    longitude,      //$7
                                    text,           //$8
                                    title,          //$9
                                    parent_id       //$10
                                ];

                            dbPgMain.query(                             // insert post
                                newPostReplySql.simpleInsert, insertPostReplyParam,
                                (errInsertSimplePostReply: Error) => {

                                    if (errInsertSimplePostReply) {

                                        res.status(500).send({
                                            msg: "error add post Reply"
                                        });
                                        concol.bright(
                                            location, timestamp,
                                            "  caught error at add post Reply" + errInsertSimplePostReply,
                                            colorTx.White, colorBg.Red);

                                    } else {

                                        res.status(200).send({
                                            msg: "successfully added Reply"
                                        });
                                        concol.bright(
                                            location, timestamp,
                                            " successfully add post Reply",
                                            colorTx.White, colorBg.Black
                                        )

                                    }

                                })


                        } else {
                            res.status(204).send({
                                msg: "request body is not proper"
                            });
                            concol.bright(
                                location, timestamp,
                                "  caught error at add post: req body is not provided well ",
                                colorTx.White, colorBg.Red);
                        }



                    } else {

                        res.status(401).send({
                            msg: "user is invalid!"
                        })
                        concol.bright(
                            location, timestamp,
                            "  caught error at add post: user_id is not verified",
                            colorTx.White, colorBg.Red);
                    }   
                }



            })

    } else {

        res.status(401).send({
            msg: "unauthorized"
        })
    }
}

// saya sudah siapkan endpoint api untuk dikirim ke backend. kirim semua data ke: endpoint /post/new