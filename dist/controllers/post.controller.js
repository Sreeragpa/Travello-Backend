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
exports.PostController = void 0;
class PostController {
    constructor(postUsecase) {
        this.postUsecase = postUsecase;
    }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const images = req.body.images;
                const caption = req.body.caption.trim();
                const { location, place } = req.body;
                // res.status(200).json({data:"hehehehehehh"})
                const data = {
                    _id: '',
                    creator_id: user.user_id,
                    caption: caption,
                    images: images,
                    location: location,
                    place: place
                };
                const result = yield this.postUsecase.createPost(data);
                res.status(201).json({ status: 'success', data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const page = Number(req.query.page) || 1;
                const id = req.params.id;
                const posts = yield this.postUsecase.getPosts(user.user_id, id, page);
                res.status(200).json({ status: 'success', data: posts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postid = req.body.postid;
                const like = yield this.postUsecase.likePost(user.user_id, postid);
                res.status(200).json({ status: "success", data: like });
            }
            catch (error) {
                next(error);
            }
        });
    }
    unlikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postid = req.body.postid;
                const like = yield this.postUsecase.unlikePost(user.user_id, postid);
                res.status(200).json({ status: "success", data: like });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = req.params.id || user.user_id;
                const posts = yield this.postUsecase.getUserPosts(userId);
                res.status(200).json({ status: 'success', data: posts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSinglePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postid = req.params.id;
            }
            catch (error) {
                next(error);
            }
        });
    }
    addToSaved(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postid = req.body.postid;
                const savedPost = yield this.postUsecase.savePost(user.user_id, postid);
                res.status(200).json({ status: "success", data: savedPost });
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeSaved(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postid = req.params.postid;
                const unsavedPost = yield this.postUsecase.unsavePost(user.user_id, postid);
                res.status(200).json({ status: "success", data: unsavedPost });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSavedPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const savedPosts = yield this.postUsecase.getSavedPosts(user.user_id);
                res.status(200).json({ status: "success", data: savedPosts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = req.params.profileid || user.user_id;
                const count = yield this.postUsecase.getUserPostCount(userId);
                res.status(200).json({ status: "success", data: { count: count } });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PostController = PostController;
