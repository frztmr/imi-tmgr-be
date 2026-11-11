import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, getPostSql } from './post.sql';
import { post_id } from '../../config/IDGenerator'
import { DatabaseError } from 'pg';
import { Result } from 'ioredis';
import { RowDataPacket } from 'mysql2';

export const getSimplePost = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';


    if (req.dataToken.uname) { // cari public share id

        let getIDsqlParam: [string] = [req.dataToken.psid];

        dbPgMain.query(                     //VALIDATE USER                        // validate user
            newPostSql.verifyUser, getIDsqlParam,
            async (err: Error, resVerifyUser: any) => {

                const user_id: string = resVerifyUser.rows[0].id // validate user 

                if (user_id) {                  // validate user



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