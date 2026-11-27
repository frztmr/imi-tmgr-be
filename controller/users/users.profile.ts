import { Request, Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { getProfile } from './users.sql';
import { getMyUserId, getTimestamp, resolveTargetUser } from './users.helper';

const location: string = "/users/profile";

// GET /users/profile              => profile sendiri
// GET /users/profile?uname=xxx    => profile user lain
export const getProfileInfo = async (req: Request, res: Response) => {

    const timestamp = getTimestamp();

    try {

        const user_id = await getMyUserId(req);

        if (!user_id) {
            res.status(401).send({ msg: "user is invalid!" });
            return; // jika user id invalid, maka berhenti di sini
        }

        const target_id = await resolveTargetUser(req, user_id);
        if (!target_id) {
            res.status(404).send({ msg: "user not found" });
            return;
        }

        const resProfile = await dbPgMainQuery(getProfile.getProfileInfo, [target_id]);
        const row = resProfile.rows[0];

        if (!row) {
            res.status(404).send({ msg: "user not found" });
            return;
        }

        const is_me = target_id === user_id;

        // NIK, grade, cost centre = data karyawan. hanya untuk pemilik akun
        const { nik, level_name, grade, cost_centre, ...publicInfo } = row;

        res.status(200).send({
            msg: "successfully get profile",
            profile: {
                ...publicInfo,
                is_me,
                ...(is_me ? { employee: { nik, level_name, grade, cost_centre } } : {}),
            },
        });
        concol.bright(location, timestamp, `  successfully get profile ${row.uname} `, colorTx.White, colorBg.Black);

    } catch (error) {
        res.status(500).send({ msg: "error get profile" });
        concol.bright(location, timestamp, `  caught error at get profile: ${error}`, colorTx.White, colorBg.Red);
    }
}
