import { Request, Response } from 'express';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { getProfile } from './profile.sql';

export const getProfileInfo = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    try {

        const resVerifyUser = await dbPgMainQuery(getProfile.verifyUser, [req.dataToken.psid]);
        const user_id = resVerifyUser.rows[0]?.id;

        if (!user_id) {
            res.status(401).send({ msg: "user is invalid!" });
            return; // jika user id invalid, maka berhenti di sini
        }



        
    } catch (error) {

    }
}

// saya sudah siapkan endpoint api untuk dikirim ke backend. kirim semua data ke: endpoint /post/new