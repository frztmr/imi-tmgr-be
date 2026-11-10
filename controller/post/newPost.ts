import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql } from './post.sql';
import { post_id } from '../../config/IDGenerator'
import { DatabaseError } from 'pg';


export const newPost = async (req: Request, res: Response) => {

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
 
                    const get_post_id: string = await post_id(user_id);
                    console.log("get_post_id", get_post_id);

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
                            expense     //number 
                        } = req.body

                        let insertPostParam: [
                            string, //$1
                            string, //$2
                            string, //$3
                            string, //$4 
                            string, //$5
                            string, //$6
                            string, //$7
                            string, //$8
                        ] = [
                                get_post_id,    //$1
                                user_id,        //$2
                                kind,           //$3
                                visibility,     //$4
                                eventDate,      //$5
                                latitude,       //$6
                                longitude,      //$7
                                text            //$8
                            ];

                        dbPgMain.query(                             // insert post
                            newPostSql.insertSimplePost, insertPostParam,
                            (errInsertSimplePost: Error) => {

                                if (errInsertSimplePost) {

                                    res.status(500).send({
                                        msg: "error add post"
                                    });
                                    console.log("caught error at insert simple post ", errInsertSimplePost);

                                } else {

                                    res.status(200).send({
                                        msg: "successfully added"
                                    });

                                }

                            })

                    } else {
                        res.status(204).send({
                            msg: "request body is not proper"
                        });

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