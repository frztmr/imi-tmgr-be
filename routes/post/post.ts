import express from "express";
import { postController } from '../../controller/';
import encrypt from "../../config/encrypt";

const postRouter = express.Router();

postRouter.post('/new_post',
    encrypt.decodeCookies,
    postController.newPost
);
postRouter.post('/new_tag',
    encrypt.decodeCookies,
    postController.newTag
);
postRouter.get('/simple_post',
    encrypt.decodeCookies,
    postController.getSimplePost
);

export default postRouter;