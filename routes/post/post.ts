import express from "express";
import { postController } from '../../controller/';
import encrypt from "../../config/encrypt";

const postRouter = express.Router();

postRouter.post('/new',
    encrypt.decodeCookies,
    postController.addNewPost
)

export default postRouter;