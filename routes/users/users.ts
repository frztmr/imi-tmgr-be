import express from "express";
import { usersController } from '../../controller/';
import encrypt from "../../config/encrypt";

const usersRouter = express.Router();


usersRouter.get('/profile',
    encrypt.decodeCookies,
    usersController.getProfileInfo
); 
usersRouter.get('/bookmark',
    encrypt.decodeCookies,
    usersController.getUsersBookmark
); 
usersRouter.get('/posts',
    encrypt.decodeCookies,
    usersController.getUsersPost
); 
usersRouter.get('/tags',
    encrypt.decodeCookies,
    usersController.getUsersTags
); 
usersRouter.post('/tags',
    encrypt.decodeCookies,
    usersController.newUsersTags
); 

export default usersRouter;