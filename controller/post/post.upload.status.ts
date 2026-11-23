import { Request, Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { newPostSql, postFileSql } from './post.sql';

const location: string = "/post/upload_status";

// GET /post/upload_status?ids=fileId1,fileId2
export const uploadStatus = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    if (!req.dataToken?.psid) {
        res.status(401).send({ msg: "unauthorized" });
        return;
    }

    const ids: string[] = String(req.query.ids || "")
        .split(",")
        .map(s => s.trim())
        .filter(s => /^[A-Za-z0-9]{1,32}$/.test(s))
        .slice(0, 50);

    if (ids.length === 0) {
        res.status(400).send({ msg: "query ?ids= is required" });
        return;
    }

    try {
        const resVerifyUser = await dbPgMainQuery(newPostSql.verifyUser, [req.dataToken.psid]);
        const user_id = resVerifyUser.rows[0]?.id;

        if (!user_id) {
            res.status(401).send({ msg: "user is invalid!" });
            return;
        }

        const resStatus = await dbPgMainQuery(postFileSql.getStatus, [ids, String(user_id)]);

        res.status(200).send({
            msg: "ok",
            files: resStatus.rows,
            all_done: resStatus.rows.every((f: any) => f.status === "ready" || f.status === "failed"),
        });

    } catch (err) {
        res.status(500).send({ msg: "error get upload status" });
        concol.bright(location, timestamp, `  caught error at upload status: ${err}`, colorTx.White, colorBg.Red);
    }
}
