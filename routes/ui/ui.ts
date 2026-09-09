import express from "express"; 
import { uiController } from '../../controller/index'; 


const uiRouter = express.Router();
 
uiRouter.get('/side_menu' , uiController.getSideMenu);
uiRouter.get('/trx_action' , uiController.getTransactionAction);

 
export default uiRouter;