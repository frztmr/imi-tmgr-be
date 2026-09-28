"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sealStampGenerator = exports.generateId = void 0;
const nanoid_1 = require("nanoid");
const generateId = (company_id, wh_id, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.generateId = generateId;
const sealStampGenerator = (uname, type) => __awaiter(void 0, void 0, void 0, function* () {
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
    const nanoid = (0, nanoid_1.customAlphabet)("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
    const id = nanoid();
    return `${type}-${uname}-${dateID}-${id}`;
});
exports.sealStampGenerator = sealStampGenerator;
