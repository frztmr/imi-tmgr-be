import {
    // dbIod,
    // dbIodQuery,
    // dbHots,
    // dbHotsQuery, 
} from './db'
import { customAlphabet } from "nanoid";

export const generateId = async (company_id: number, wh_id: number, res: Res) => {

}

export const sealStampGenerator = async (uname: string, type: string): Promise<string> => {


    let date = new Date();
    let timestamp = date.toLocaleDateString('id')
        + ' ' + date.toLocaleTimeString('id') + ' => ';

    const dateID = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    /*
    return createHmac(
        // process.env.SECURITY_HASH_TYPE_INTEGRATION || 'sha256',
        'sha128',
        process.env.SECURITY_HASH_KEY_INTEGRATION || 'hehehe_kepo lu'
    )
        .update(text).digest('hex')
*/
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

    const id = nanoid();

    return `${type}-${uname}-${dateID}-${id}`;
}
