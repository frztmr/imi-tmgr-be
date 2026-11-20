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
postRouter.get('/detail/:post_id',
    encrypt.decodeCookies,
    postController.detail
);
postRouter.post('/new_reply_post',
    encrypt.decodeCookies,
    postController.newPostReply
);
postRouter.post('/like_unlike/:post_id',
    encrypt.decodeCookies,
    postController.likeUnlike
);

postRouter.post('/bookmark/:post_id',
    encrypt.decodeCookies,
    postController.bookmarkUnBookmark
);

postRouter.post('/delete/:post_id',
    encrypt.decodeCookies,
    postController.postDelete
);

export default postRouter;