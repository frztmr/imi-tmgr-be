import { Request, Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { usersTagSql } from './users.sql';
import { getMyUserId, getTimestamp, resolveTargetUser } from './users.helper';

const location: string = "/users/tag";

// GET /users/tag                     => tag yang saya miliki + yang saya join
// GET /users/tag?uname=xxx           => tag user lain (hanya yang statusnya active)
// GET /users/tag?type=trip           => filter jenis tag (simple, person, event, country, trip)
export const getUsersTags = async (req: Request, res: Response) => {

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

        const is_me = target_id === user_id;

        const type = typeof req.query.type === "string" && /^[a-z_]{1,20}$/.test(req.query.type)
            ? req.query.type
            : null;

        // diri sendiri: tampilkan juga yang masih menunggu approval owner
        const statuses = is_me ? ["active", "pending"] : ["active"];

        const resTags = await dbPgMainQuery(usersTagSql.getUserTags, [target_id, type, statuses]);

        // file BTA hanya boleh terlihat oleh owner tag-nya sendiri
        const tags = resTags.rows.map((t: any) => {
            const { approval_file_id, ...rest } = t;
            return {
                ...rest,
                has_approval_file: Boolean(approval_file_id),
                ...(is_me && t.role === "owner" ? { approval_file_id } : {}),
            };
        });

        res.status(200).send({
            msg: "successfully get tags",
            tags,
        });
        concol.bright(location, timestamp, `  successfully get ${tags.length} tag(s) `, colorTx.White, colorBg.Black);

    } catch (error) {
        res.status(500).send({ msg: "error get tags" });
        concol.bright(location, timestamp, `  caught error at get tags: ${error}`, colorTx.White, colorBg.Red);
    }
}
