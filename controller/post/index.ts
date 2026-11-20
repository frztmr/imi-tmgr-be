import { newPost } from "./post.new";
import { newTag } from "./newTag";
import { getSimplePost } from './post.get'
import { detail } from './post.spesific'
import { newPostReply } from './post.new.reply'
import { likeUnlike } from './post.like'
import { bookmarkUnBookmark } from './post.bookmark'

export default {
    newPost,
    newTag,
    getSimplePost,
    detail,
    newPostReply,
    likeUnlike,
    bookmarkUnBookmark
};