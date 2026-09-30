"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import authController from '../../controller/auth/auth';
const controller_1 = require("../../controller/");
const encrypt_1 = __importDefault(require("../../config/encrypt"));
const authRouter = express_1.default.Router();
authRouter.post('/login', controller_1.authController.LogIn);
authRouter.get('/check', controller_1.authController.LoginReady);
authRouter.get('/keep_login', encrypt_1.default.decodeCookies, controller_1.authController.keepLogin);
authRouter.get('/log_out', encrypt_1.default.decodeCookies, controller_1.authController.LogOut);
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
