
import express from "express";
// import authController from '../../controller/auth/auth';
import { authController } from '../../controller/index';
import encrypt from "../../config/encrypt";


const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.get('/check', authController.loginReady);
authRouter.get('/keep_login',
    encrypt.decodeCookies,
    authController.keepLogin);
authRouter.get('/log_out', authController.logOut);

export default authRouter;