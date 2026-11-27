import { Request } from 'express';
import { dbPgMainQuery } from '../../config/db'
import { colorTx } from '../../config/customConsole'
import { getProfile } from './users.sql';

export const getTimestamp = (): string => {
    let date = new Date();
    return colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
};

// user yang sedang login. null kalau token / user tidak valid
export const getMyUserId = async (req: Request): Promise<string | null> => {
    if (!req.dataToken?.psid) return null;
    const res = await dbPgMainQuery(getProfile.verifyUser, [req.dataToken.psid]);
    return res.rows[0]?.id ?? null;
};

// user yang mau dilihat: ?uname=xxx, kalau kosong = diri sendiri
// return null kalau uname tidak ditemukan
export const resolveTargetUser = async (req: Request, myUserId: string): Promise<string | null> => {
    const uname = typeof req.query.uname === "string" ? req.query.uname.trim() : "";
    if (!uname) return myUserId;

    const res = await dbPgMainQuery(getProfile.getUserByUname, [uname]);
    return res.rows[0]?.id ?? null;
};

// ?limit=&offset=  (default 50, max 100)
export const getPaging = (req: Request): { limit: number, offset: number } => {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "50"), 10) || 50, 1), 100);
    const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10) || 0, 0);
    return { limit, offset };
};
