
import express from "express";

import { authController } from '../../controller/';
import encrypt from "../../config/encrypt";


const authRouter = express.Router();

authRouter.post('/login', authController.LogIn);
authRouter.get('/check', authController.LoginReady);
authRouter.get('/keep_login', encrypt.decodeCookies, authController.keepLogin);
authRouter.get('/log_out', encrypt.decodeCookies, authController.LogOut);

export default authRouter;

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