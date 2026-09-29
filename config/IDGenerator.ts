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

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateID = `${year}.${month}.${day}-${hours}:${minutes}:${seconds} (GMT+7)`;
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

    return `${type} | ${uname} | ${dateID} | ${id}`;
}
