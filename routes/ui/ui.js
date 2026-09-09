"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../../controller/index");
const uiRouter = express_1.default.Router();
uiRouter.get('/side_menu', index_1.uiController.getSideMenu);
uiRouter.get('/trx_action', index_1.uiController.getTransactionAction);
exports.default = uiRouter;
