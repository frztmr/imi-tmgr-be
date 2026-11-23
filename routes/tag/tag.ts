import express from "express";
import { tagController } from '../../controller/';
import encrypt from "../../config/encrypt";

const tagRouter = express.Router();


tagRouter.get('/tag',
    encrypt.decodeCookies,
    tagController.newTag)


export default tagRouter;