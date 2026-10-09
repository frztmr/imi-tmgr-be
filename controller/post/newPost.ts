import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPost } from './post.sql';

export const addNewPost = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (req.dataToken.uname) { // cari public share id



        let sqlParam: [string] = [req.dataToken.uname];
        
        if (req.body) {
            res.status(200).send("ok")
            console.log("req.body :", req.body)
            
        } else {
            res.status(200).send("ok no req body")

        }
        
    }
}

// saya sudah siapkan endpoint api untuk dikirim ke backend. kirim semua data ke: endpoint /post/new