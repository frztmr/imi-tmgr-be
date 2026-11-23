import express from "express";
import { postController } from '../../controller/';
import encrypt from "../../config/encrypt";
import { uploadPostFiles } from "../../config/postUploader";

const postRouter = express.Router();

postRouter.post('/new_post',
    encrypt.decodeCookies,
    postController.newPost
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

postRouter.delete('/delete/:post_id',
    encrypt.decodeCookies,
    postController.postDelete
);

// upload file post (photo / attachment). diproses di background oleh worker thread
postRouter.post('/upload_file',
    encrypt.decodeCookies,
    uploadPostFiles,            // multer: simpan ke storage/tmp
    postController.uploadFile   // insert DB + masuk antrian worker
);
postRouter.get('/upload_status',
    encrypt.decodeCookies,
    postController.uploadStatus
);
postRouter.get('/file/:file_id',
    encrypt.decodeCookies,
    postController.getFile
);

export default postRouter;

/*

  POST /post/upload_file',
 get /post/upload_status
 get /post/file/:file_id 
);

*/