import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, getPostDetail } from './post.sql';
// import { post_id } from '../../config/IDGenerator'
import { Result } from 'pg';


export const detail = async (req: Request, res: Response) => {

    const location: string = `/post/detail/${req.params.post_id}`;

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';


    if (req.dataToken.uname && req.params.post_id) { // cari public share id

        const post_id = req.params.post_id

        let getIDsqlParam: [string] = [req.dataToken.psid];

        dbPgMain.query(                     //VALIDATE USER                        // validate user
            newPostSql.verifyUser,
            getIDsqlParam,
            async (errVerifyUser: Error, resVerifyUser: any) => {

                const user_id: string = resVerifyUser.rows[0].id // validate user 

                if (errVerifyUser) { //jika terjadi error saat verify user

                    res.status(500).send({
                        msg: "unable Validate User!"
                    })
                    concol.bright(
                        location, timestamp,
                        "  unable Validate User! " + errVerifyUser,
                        colorTx.White, colorBg.Red);

                } else {
                    if (user_id) {                  // validate user

                        dbPgMain.query(              //gather post pareng       
                            getPostDetail.getOnePost,
                            [post_id, user_id],
                            async (errGetOnePostParent: Error, resGetOnePostParent: any) => {


                                if (errGetOnePostParent) {

                                    res.status(500).send({
                                        msg: `unable to gather post_id ${post_id} `,
                                        post_parent: [],
                                        post_root: []
                                    })
                                    concol.bright( // error console
                                        location, timestamp,
                                        "  unable to gather post_id " + errGetOnePostParent,
                                        colorTx.White, colorBg.Red);

                                } else {

                                    dbPgMain.query(              //gather post pareng       
                                        getPostDetail.getPostRoot,
                                        [post_id, user_id],
                                        async (errGetOnePostRoot: Error, resGetOnePostParentRoot: any) => {

                                            if (errGetOnePostRoot) {

                                                res.status(500).send({
                                                    msg: ` unable gather parent_id ${post_id} `,
                                                    post_parent: [],
                                                    post_root: []
                                                })
                                                concol.bright( //error console
                                                    location, timestamp,
                                                    `  unable to gather parent_id ${post_id} :   ${errGetOnePostParent}`,
                                                    colorTx.White, colorBg.Red);

                                            } else {

                                                res.status(200).send({
                                                    msg: `successfully gather post_id ${post_id} `,
                                                    post_parent: resGetOnePostParent.rows,
                                                    post_root: resGetOnePostParentRoot.rows
                                                })
                                                concol.bright(  //success console
                                                    location, timestamp,
                                                    `  successfully gather post_id ${post_id}  `,
                                                    colorTx.White, colorBg.Black
                                                )
                                            }

                                        })

                                }


                            })

                    } else {

                        res.status(401).send({
                            msg: "user is invalid!"
                        })

                    }
                }


            })

    } else {

        res.status(401).send({
            msg: "unauthorized or parameter is invalid"
        })
    }

}