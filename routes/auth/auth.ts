
import express from "express";
// import authController from '../../controller/auth/auth';
import { authController } from '../../controller/index';
import encrypt from "../../config/encrypt";


const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.get('/check', authController.loginReady);
authRouter.get('/keep_login', encrypt.decodeCookies, authController.keepLogin);
authRouter.get('/log_out', encrypt.decodeCookies, authController.logOut);

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