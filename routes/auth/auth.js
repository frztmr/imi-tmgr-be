"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import authController from '../../controller/auth/auth';
const index_1 = require("../../controller/index");
const encrypt_1 = __importDefault(require("../../config/encrypt"));
const authRouter = express_1.default.Router();
authRouter.post('/login', index_1.authController.login);
authRouter.get('/check', index_1.authController.loginReady);
authRouter.get('/keep_login', encrypt_1.default.decodeCookies, index_1.authController.keepLogin);
authRouter.get('/log_out', index_1.authController.logOut);
exports.default = authRouter;
/*

advance login attempt protection

jika user mencoba login pada satu perangkat
terlalu banyak,

maka coba kita kunci perangkat itu
dari percobaan login lain

kita coba pakai HTTPonlyCOokie
store json, isinya attempt.
sistem waktu disimpan di backend, mencompile



*/ 
