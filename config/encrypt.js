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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customConsole_1 = require("./customConsole");
const queryLocation = 'encrypt.ts';
const encrypt = {
    hashPassword: (text) => {
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        customConsole_1.concol.plain(queryLocation, timestamp, "hashing password... ", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
        return (0, crypto_1.createHmac)(process.env.SECURITY_HASH_TYPE_HT || 'hash_type', process.env.SECURITY_HASH_KEY_HT || 'hehehe_kepo lu').update(text).digest('hex');
    },
    generateToken: (dataToken) => {
        console.log("dataToken", dataToken);
        console.log("typeof dataToken", typeof dataToken);
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        customConsole_1.concol.plain(queryLocation, timestamp, "generating token...", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
        return jsonwebtoken_1.default.sign({ token: dataToken }, process.env.SECURITY_TOKEN_KEY || 'kepo_lu_anjir', { expiresIn: '1h' });
    },
    decodeToken: (req, res, next) => {
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        customConsole_1.concol.plain(queryLocation, timestamp, "decoding token ", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
        jsonwebtoken_1.default.verify(req.token, process.env.SECURITY_TOKEN_KEY || "ih_beneran_kepo_lu_ye", (err, decode) => {
            if (err) {
                console.log("Invalid Token Read Token");
                return res.status(401).send({
                    message: 'ERROR IN AUTH!'
                });
            }
            // console.log("decodeded token",decode)
            req.dataToken = decode;
            next();
        });
    },
    clearCookie: (res) => {
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        try {
            res.clearCookie("tokek", {
                httpOnly: true,
                secure: false, // ✅ match cookie settings
                sameSite: "lax", // ✅ match cookie settings
            });
            customConsole_1.concol.plain(queryLocation, timestamp, " cookie clear ", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
        }
        catch (error) {
            customConsole_1.concol.plain(queryLocation, timestamp, `ERRORR while clear cookie : ${error}`, customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
        }
    },
    setCookie: (res, dataToken, expiresInSeconds) => __awaiter(void 0, void 0, void 0, function* () {
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        // 1. Tentukan fallback default (misal 1 jam / 3600 detik) jika tidak diisi atau 0
        const DEFAULT_EXPIRE_SECONDS = 60 * 60; // 1 jam dalam detik -> INI DEGAULT VALUE
        const durationInSeconds = (expiresInSeconds && expiresInSeconds > 0)
            ? expiresInSeconds
            : DEFAULT_EXPIRE_SECONDS;
        const durationInMs = durationInSeconds * 1000; // DIKALI SERIBU
        let tokek = jsonwebtoken_1.default.sign(dataToken, process.env.SECURITY_TOKEN_KEY || 'kepo_lu_anjir', { expiresIn: durationInMs });
        /*
         MAX AGE:
         60 seconds ×
         60 minutes (3600 seconds (1 hour)) ×
         1000 milliseconds =
         3,600,000 ms
         */
        try {
            res.cookie("tokek", tokek, {
                httpOnly: true,
                // secure: cookieSecureParameter, // use true in production with HTTPS  
                secure: false, // use true in production with HTTPS  
                sameSite: 'lax', // local. Secure -> production
                maxAge: durationInMs
                // maxAge: 60 * 60 * 1000, // 60 menit * 60 detik * 1000 milidetik
                // maxAge: lifeSpan, 
            });
            customConsole_1.concol.plain(queryLocation, timestamp, "cookie generated and thrown to client", customConsole_1.colorTx.White, customConsole_1.colorBg.Blue);
        }
        catch (error) {
            customConsole_1.concol.plain(queryLocation, timestamp, "failed generated cookie " + error, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
        }
    }),
    decodeCookies: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        if (req.cookies) {
            // concol.bright(queryLocation,timestamp,`isi cookies ${req.cookies} `, colorTx.Green, colorBg.Red)
            console.log("req.cookies?.['tokek']", (_a = req.cookies) === null || _a === void 0 ? void 0 : _a['tokek']);
            if (!((_b = req.cookies) === null || _b === void 0 ? void 0 : _b['tokek'])) { //case ini jika gak ada token
                customConsole_1.concol.plain(queryLocation, timestamp, " gak ada cookie", customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
                let msg = "there is no cookie to decode ";
                let success = false;
                // res.status(204).send({ msg, success }); //tpken gak ada atau gak valid
            }
            else { // case ini jika ada token. 
                try {
                    let cookies = req.cookies['tokek'];
                    const decoded = jsonwebtoken_1.default.verify(cookies, process.env.SECURITY_TOKEN_KEY || "fedsvaihnu");
                    req.dataToken = decoded; // decoding token
                    console.log("decoded", decoded);
                    next();
                    customConsole_1.concol.plain(queryLocation, timestamp, "eating (decoding) cookie ", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
                }
                catch (err) {
                    let msg = "failed to decode cookie ";
                    let success = false;
                    // res.status(204).send({ msg, success });
                }
            }
        }
        else {
            res.status(500).send({ error: "there is no cookies " });
        }
    }),
};
exports.default = encrypt;
