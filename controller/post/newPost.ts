import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql } from './post.sql';

export const newPost = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (req.dataToken.uname) { // cari public share id



        let sqlParam: [string] = [req.dataToken.uID];

        console.log("sqlParam", sqlParam)
        
        if (req.body) {


            res.status(200).send({
                msg: "successfully added"
            })
            console.log("req.body :", req.body)
            console.log("req.dataToken :", req.dataToken)

        } else {
            res.status(204).send({
                msg: "request body is not proper"
            })

        }

    } else {

        res.status(401).send({
            msg: "unauthorized"
        })
    }
}

// saya sudah siapkan endpoint api untuk dikirim ke backend. kirim semua data ke: endpoint /post/new