"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostUsecase = void 0;
const notification_enums_1 = require("../enums/notification.enums");
class PostUsecase {
    constructor(postRepository, cloudinaryService, followRepository, commentRepository, notificationUsecase) {
        this.postRepository = postRepository;
        this.cloudinaryService = cloudinaryService;
        this.followRepository = followRepository;
        this.commentRepository = commentRepository;
        this.notificationUsecase = notificationUsecase;
    }
    getUserPostCount(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postCount = yield this.postRepository.count(userid);
                return postCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSavedPosts(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedPosts = yield this.postRepository.findSavedPost(userid);
            const postDetails = (savedPosts === null || savedPosts === void 0 ? void 0 : savedPosts.map((item) => item.post_id)) || null;
            return postDetails;
        });
    }
    unsavePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unsavedPost = yield this.postRepository.unSavePost(userid, postid);
                return unsavedPost;
            }
            catch (error) {
                throw error;
            }
        });
    }
    savePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingSave = yield this.postRepository.findSave(userid, postid);
                if (existingSave) {
                    return existingSave;
                }
                const data = yield this.postRepository.savePost(userid, postid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserPosts(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPosts = yield this.postRepository.findPostByUser(userid);
                return userPosts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    likePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isLiked = yield this.postRepository.isPostLikedByUser(userid, postid);
                if (!isLiked) {
                    const result = yield this.postRepository.likePost(userid, postid);
                    const post = yield this.postRepository.findOne(result.post_id);
                    const recipient = post[0].creator_id;
                    const notification = {
                        sender: userid,
                        recipient: recipient,
                        type: notification_enums_1.NOTIFICATION_TYPE.POSTLIKE,
                    };
                    const notifications = yield this.notificationUsecase.createNotification(notification);
                    return result;
                }
                else {
                    throw new Error("Error like not Submitted");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    unlikePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isLiked = yield this.postRepository.isPostLikedByUser(userid, postid);
                if (isLiked) {
                    const result = yield this.postRepository.unlikePost(userid, postid);
                    return result;
                }
                throw new Error("Error unlike not Submitted");
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPosts(userid, postid, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let posts = [];
                if (postid) {
                    posts = yield this.postRepository.findOne(postid);
                }
                else {
                    posts = yield this.postRepository.findAll(page, 3);
                }
                const postsWithAllInfo = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                    const [isLiked, isFollowing, isSaved, likedUsers, comments] = yield Promise.all([
                        yield this.postRepository.isPostLikedByUser(userid, post._id),
                        yield this.followRepository.isUserFollowing(userid, post.creator_id),
                        (yield this.postRepository.findSave(userid, post._id))
                            ? true
                            : false,
                        yield this.postRepository.getlikedUsers(userid, post._id),
                        yield this.commentRepository.getCommentsByPostId(post._id)
                    ]);
                    return Object.assign(Object.assign({}, post), { isLiked, isFollowing, isSaved, likedUsers, comments });
                })));
                postsWithAllInfo.forEach((post) => {
                    var _a;
                    if (((_a = post.user) === null || _a === void 0 ? void 0 : _a._id.toString()) === userid) {
                        post.same_user = true;
                    }
                });
                return postsWithAllInfo;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadedImages = yield Promise.all(data.images.map((image) => this.cloudinaryService.uploadImage(image)));
                data.images = uploadedImages;
                const post = yield this.postRepository.create(data);
                return post;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPost(postid, caption) {
        throw new Error("Method not implemented.");
    }
    deletePost(postid) {
        throw new Error("Method not implemented.");
    }
}
exports.PostUsecase = PostUsecase;
