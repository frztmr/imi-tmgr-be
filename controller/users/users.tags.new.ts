import { Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import { dbPgMain, dbPgMainQuery } from '../../config/db'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { usersTagNewSql } from './users.sql';
import { getMyUserId, getTimestamp } from './users.helper';

const location: string = "/users/tag/new";

const tagId = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 24);
const personId = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 24);

const JOIN_POLICIES = ["open", "approval", "invite", "closed"];
const TRIP_MODES = ["approval", "instant"];

// ---------------------------------------------------------------
// body (JSON). field dari form FE (Tag.New.tsx / Trip.New.tsx) di kanan:
// {
//   tag_type:        "trip" | "simple" | "person" | "event" | "country"   (wajib)
//   name:            string, max 100                         <= title      (wajib)
//   description:     string                                  <= purpose
//   country:         string                                  <= country    (wajib untuk tag_type country)
//   cities:          string[]   (atau city: string)          <= city
//   start_date:      "YYYY-MM-DD"                            <= startDate
//   end_date:        "YYYY-MM-DD"                            <= endDate
//   usable_from:     ISO datetime   (masa pakai tag, optional)
//   usable_until:    ISO datetime   (masa pakai tag, optional)
//   join_policy:     "open" | "approval" | "invite" | "closed"  (default dari tag_types)
//   trip_mode:       "approval" | "instant"                  <= mode       (trip saja)
//   approval_file_id: file_id dari POST /post/upload_file    <= file BTA   (wajib kalau trip_mode instant)
//   local_currency:  "MYR"                                   (trip saja, 3 huruf)
//   attributes:      {}   data tambahan per jenis tag (person: company / position, event: venue, ...)
// }
// ---------------------------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toText = (v: any, max: number): string | null => {
    if (typeof v !== "string") return null;
    const s = v.trim();
    return s ? s.slice(0, max) : null;
};

const toDate = (v: any): string | null | undefined => {
    if (v === undefined || v === null || v === "") return null;
    if (typeof v !== "string" || !DATE_RE.test(v) || isNaN(Date.parse(v))) return undefined; // undefined = invalid
    return v;
};

const toDateTime = (v: any): string | null | undefined => {
    if (v === undefined || v === null || v === "") return null;
    if (typeof v !== "string" || isNaN(Date.parse(v))) return undefined;
    return new Date(v).toISOString();
};

// "Seoul May Sweep" => "seoulmaysweep"  (bentuk hashtag)
const toSlug = (name: string): string =>
    name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "").slice(0, 100);

export const newUsersTags = async (req: Request, res: Response) => {

    const timestamp = getTimestamp();

    const bad = (msg: string) => {
        res.status(400).send({ msg });
        concol.bright(location, timestamp, `  rejected: ${msg}`, colorTx.White, colorBg.Red);
    };

    try {

        const user_id = await getMyUserId(req);

        if (!user_id) {
            res.status(401).send({ msg: "user is invalid!" });
            return; // jika user id invalid, maka berhenti di sini
        }

        const body = req.body || {};

        /* ----------------------- validasi ----------------------- */
        const tag_type = toText(body.tag_type, 20);
        if (!tag_type) {
            const resTypes = await dbPgMainQuery(usersTagNewSql.getActiveTagTypes);
            return bad(`tag_type is required (${resTypes.rows.map((r: any) => r.code).join(", ")})`);
        }

        const resType = await dbPgMainQuery(usersTagNewSql.getTagType, [tag_type]);
        const typeRow = resType.rows[0];
        if (!typeRow) return bad(`unknown tag_type "${tag_type}"`);

        const name = toText(body.name, 100);
        if (!name) return bad("name is required");

        const slug = toSlug(name) || tagId().toLowerCase();

        const description = toText(body.description, 2000);
        const country = toText(body.country, 100);
        if (tag_type === "country" && !country) return bad("country is required for a country tag");

        const citiesRaw: any[] = Array.isArray(body.cities) ? body.cities : (body.city ? [body.city] : []);
        const cities = citiesRaw.map((c) => toText(c, 100)).filter((c): c is string => Boolean(c)).slice(0, 20);

        const start_date = toDate(body.start_date);
        const end_date = toDate(body.end_date);
        if (start_date === undefined) return bad("start_date must be YYYY-MM-DD");
        if (end_date === undefined) return bad("end_date must be YYYY-MM-DD");
        if (start_date && end_date && end_date < start_date) return bad("end_date must be on or after start_date");

        const usable_from = toDateTime(body.usable_from);
        const usable_until = toDateTime(body.usable_until);
        if (usable_from === undefined) return bad("usable_from must be a valid date/time");
        if (usable_until === undefined) return bad("usable_until must be a valid date/time");
        if (usable_from && usable_until && usable_until < usable_from) return bad("usable_until must be after usable_from");

        const join_policy = body.join_policy ?? typeRow.default_join_policy;
        if (!JOIN_POLICIES.includes(join_policy)) return bad(`join_policy must be one of: ${JOIN_POLICIES.join(", ")}`);

        const attributes = body.attributes && typeof body.attributes === "object" && !Array.isArray(body.attributes)
            ? body.attributes
            : {};

        // khusus trip
        let trip_mode: string | null = null;
        let local_currency: string | null = null;
        let approval_file_id: string | null = null;

        if (tag_type === "trip") {
            trip_mode = body.trip_mode ?? "approval";
            if (!TRIP_MODES.includes(trip_mode as string)) return bad(`trip_mode must be one of: ${TRIP_MODES.join(", ")}`);

            if (body.local_currency) {
                if (typeof body.local_currency !== "string" || !/^[A-Za-z]{3}$/.test(body.local_currency)) {
                    return bad("local_currency must be a 3-letter currency code, e.g. MYR");
                }
                local_currency = body.local_currency.toUpperCase();
            }

            approval_file_id = toText(body.approval_file_id, 32);
            if (trip_mode === "instant" && !approval_file_id) {
                return bad("approval_file_id is required for an instant trip tag (upload the signed BTA first via /post/upload_file)");
            }

            if (approval_file_id) {
                const resFile = await dbPgMainQuery(usersTagNewSql.checkApprovalFile, [approval_file_id, user_id]);
                const file = resFile.rows[0];
                if (!file) return bad("approval file not found");
                if (file.status === "failed") return bad("approval file failed to process, please upload again");
            }
        }

        const resSlug = await dbPgMainQuery(usersTagNewSql.checkSlug, [user_id, slug]);
        if (resSlug.rows.length > 0) {
            res.status(409).send({ msg: `you already have a tag named #${slug}`, tag_id: resSlug.rows[0].tag_id });
            return;
        }

        /* ----------------------- simpan (1 transaksi) ----------------------- */
        // tag + owner sebagai member harus masuk bersama, atau tidak sama sekali
        const client = await dbPgMain.connect();
        try {
            await client.query("BEGIN");

            const resInsert = await client.query(usersTagNewSql.insertTag, [
                tagId(),            //$1  tag_id
                tag_type,           //$2
                name,               //$3
                slug,               //$4
                description,        //$5
                user_id,            //$6  owner_id
                country,            //$7
                cities,             //$8
                start_date,         //$9
                end_date,           //$10
                usable_from,        //$11
                usable_until,       //$12
                join_policy,        //$13
                trip_mode,          //$14
                local_currency,     //$15
                approval_file_id,   //$16
                JSON.stringify(attributes), //$17
            ]);
            const tag = resInsert.rows[0];

            // member tag = person (bukan akun). pastikan akun ini punya person dulu
            await client.query(usersTagNewSql.ensurePerson, [personId(), user_id]);
            const resPerson = await client.query(usersTagNewSql.getPersonByUser, [user_id]);
            const person_id: string = resPerson.rows[0].person_id;

            await client.query(usersTagNewSql.insertOwner, [tag.tag_id, person_id]);

            await client.query("COMMIT");

            res.status(201).send({
                msg: "tag created",
                tag: { ...tag, role: "owner", member_status: "active" },
            });
            concol.bright(location, timestamp, `  tag #${slug} (${tag_type}) created `, colorTx.White, colorBg.Black);

        } catch (errInsert: any) {
            await client.query("ROLLBACK").catch(() => { });

            // 2 request bersamaan dengan nama sama => unique index uq_tags_owner_slug
            if (errInsert?.code === "23505") {
                res.status(409).send({ msg: `you already have a tag named #${slug}` });
                return;
            }
            throw errInsert;

        } finally {
            client.release();
        }

    } catch (error) {
        res.status(500).send({ msg: "error create tag" });
        concol.bright(location, timestamp, `  caught error at create tag: ${error}`, colorTx.White, colorBg.Red);
    }
}
