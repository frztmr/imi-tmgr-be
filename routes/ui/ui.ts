import express from "express";
import { uiController } from '../../controller/';
import encrypt from "../../config/encrypt";

const uiRouter = express.Router();

uiRouter.get('/settings', encrypt.decodeCookies, uiController.getSettings);
// uiRouter.get('/side_menu' , uiController.getSideMenu);
// uiRouter.get('/trx_action' , uiController.getTransactionAction);


export default uiRouter;