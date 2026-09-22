"use strict";
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
    setCookie: (res, dataToken, expiresIn) => {
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        let tokek = jsonwebtoken_1.default.sign(dataToken, process.env.SECURITY_TOKEN_KEY || 'kepo_lu_anjir', { expiresIn: '1h' });
        let lifeSpan = expiresIn = 0 ? 60 * 60 * 1000 : expiresIn; // 1 hour
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
                maxAge: 60 * 60 * 1000,
                // maxAge: lifeSpan, 
            });
            customConsole_1.concol.plain(queryLocation, timestamp, "cookie generated and thrown to client", customConsole_1.colorTx.White, customConsole_1.colorBg.Blue);
        }
        catch (error) {
            customConsole_1.concol.plain(queryLocation, timestamp, "failed generated cookie " + error, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
        }
    },
    decodeCookies: (req, res, next) => {
        var _a;
        let date = new Date();
        let timestamp = date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';
        if (req.cookies) {
            // concol.bright(queryLocation,timestamp,`isi cookies ${req.cookies} `, colorTx.Green, colorBg.Red)
            if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a['tokek'])) {
                // return res.status(401).send("INVALID TOKEN");
                // res.status(200).send();
                customConsole_1.concol.plain(queryLocation, timestamp, " gak ada cookie", customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Black);
                let msg = "there is no cookie to decode ";
                let success = false;
                res.status(204).send({ msg, success });
            }
            else {
                try {
                    let cookies = req.cookies['tokek'];
                    const decoded = jsonwebtoken_1.default.verify(cookies, process.env.SECURITY_TOKEN_KEY || "fedsvaihnu");
                    req.dataToken = decoded;
                    next();
                    customConsole_1.concol.plain(queryLocation, timestamp, "eating (decoding) cookie ", customConsole_1.colorTx.White, customConsole_1.colorBg.Black);
                }
                catch (err) {
                    let msg = "failed to decode cookie ";
                    let success = false;
                    res.status(204).send({ msg, success });
                }
            }
        }
        else {
            res.status(500).send({ error: "there is no cookies " });
        }
    },
};
exports.default = encrypt;
