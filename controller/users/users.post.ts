import { Request, Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { usersPostSql } from './users.sql';
import { getMyUserId, getPaging, getTimestamp, resolveTargetUser } from './users.helper';

const location: string = "/users/post";

// GET /users/post                          => post sendiri
// GET /users/post?uname=xxx&limit=&offset= => post user lain
// bentuk row sama dengan /post/simple_post (termasuk "files")
export const getUsersPost = async (req: Request, res: Response) => {

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

        const { limit, offset } = getPaging(req);

        const resPosts = await dbPgMainQuery(usersPostSql.getUserPosts, [user_id, target_id, limit, offset]);

        res.status(200).send({
            msg: "successfully get posts",
            posts: resPosts.rows,
            limit,
            offset,
        });
        concol.bright(location, timestamp, `  successfully get ${resPosts.rows.length} user post(s) `, colorTx.White, colorBg.Black);

    } catch (error) {
        res.status(500).send({ msg: "error get user posts" });
        concol.bright(location, timestamp, `  caught error at get user posts: ${error}`, colorTx.White, colorBg.Red);
    }
}
