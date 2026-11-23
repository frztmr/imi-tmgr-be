import { newPost } from "./post.new"; 
import { getSimplePost } from './post.get'
import { detail } from './post.spesific'
import { newPostReply } from './post.new.reply'
import { likeUnlike } from './post.like'
import { bookmarkUnBookmark } from './post.bookmark'
import { postDelete } from './post.delete'
import { uploadFile } from './post.upload'
import { uploadStatus } from './post.upload.status'
import { getFile } from './post.file.get'

export default {
    newPost, 
    getSimplePost,
    detail,
    newPostReply,
    likeUnlike,
    bookmarkUnBookmark,
    postDelete,
    uploadFile,
    uploadStatus,
    getFile
};