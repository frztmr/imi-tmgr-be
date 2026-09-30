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
exports.LoginReady = void 0;
/*
auth diantaranya:
- login,
- keep login,
- change password
- forgot password
- forgot password verification
- change password forgot password

*/
let yellowTerminal = "\x1b[33m";
let location = "auth";
const LoginReady = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ' + ' Auth Login  =>';
    let msg = 'Whenever you ready!';
    let stats = 200;
    let ready = true;
    // let ready: boolean = true
    res.status(stats).send({ msg, ready });
    console.log(timestamp, " Check login availability. Is ready :", ready);
    // dbIod.query(dbIodQuery, paramQuery, async (error: Error, results: Response) => {})
});
exports.LoginReady = LoginReady;
