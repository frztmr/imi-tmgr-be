import express from "express";
import { usersController } from '../../controller/';
import encrypt from "../../config/encrypt";

const usersRouter = express.Router();

// semua endpoint menerima ?uname=xxx untuk melihat user lain (kecuali bookmark & tag/new)

usersRouter.get('/profile',
    encrypt.decodeCookies,
    usersController.getProfileInfo
);
usersRouter.get('/post',
    encrypt.decodeCookies,
    usersController.getUsersPost
);
usersRouter.get('/bookmark',
    encrypt.decodeCookies,
    usersController.getUsersBookmark
);
usersRouter.get('/tag',
    encrypt.decodeCookies,
    usersController.getUsersTags
);
usersRouter.post('/tag/new',
    encrypt.decodeCookies,
    usersController.newUsersTags
);

export default usersRouter;

/*

 get  '/users/profile' 
 get  '/users/post' 
 get  '/users/bookmark' 
 get  '/users/tag' 
 post '/users/tag/new' 

*/