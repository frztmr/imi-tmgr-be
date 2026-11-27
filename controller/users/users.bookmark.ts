import { Request, Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { usersBookmarkSql } from './users.sql';
import { getMyUserId, getPaging, getTimestamp } from './users.helper';

const location: string = "/users/bookmark";

// GET /users/bookmark?limit=&offset=
// bookmark itu privat: selalu milik user yang login (?uname diabaikan)
// bentuk row sama dengan /post/simple_post (termasuk "files")
export const getUsersBookmark = async (req: Request, res: Response) => {

    const timestamp = getTimestamp();

    try {

        const user_id = await getMyUserId(req);

        if (!user_id) {
            res.status(401).send({ msg: "user is invalid!" });
            return; // jika user id invalid, maka berhenti di sini
        }

        const { limit, offset } = getPaging(req);

        const resBookmarks = await dbPgMainQuery(usersBookmarkSql.getUserBookmarks, [user_id, limit, offset]);

        res.status(200).send({
            msg: "successfully get bookmarks",
            posts: resBookmarks.rows,
            limit,
            offset,
        });
        concol.bright(location, timestamp, `  successfully get ${resBookmarks.rows.length} bookmark(s) `, colorTx.White, colorBg.Black);

    } catch (error) {
        res.status(500).send({ msg: "error get bookmarks" });
        concol.bright(location, timestamp, `  caught error at get bookmarks: ${error}`, colorTx.White, colorBg.Red);
    }
}
