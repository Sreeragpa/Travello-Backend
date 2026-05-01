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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = require("../frameworks/models/post.model");
const postLikes_models_1 = require("../frameworks/models/postLikes.models");
const saves_model_1 = require("../frameworks/models/saves.model");
class PostRepository {
    getPostCountByDate(days) {
        return __awaiter(this, void 0, void 0, function* () {
            let matchStage = {};
            if (days === 0) {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                matchStage = {
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                };
            }
            else {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - days);
                matchStage = {
                    createdAt: { $gte: startDate }
                };
            }
            const data = yield post_model_1.PostModel.aggregate([
                {
                    $match: matchStage
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
            console.log(data);
            return data;
        });
    }
    count(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postCount = yield post_model_1.PostModel.countDocuments({ creator_id: userid });
                return postCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findSavedPost(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPosts = yield saves_model_1.SaveModel.find({ user_id: userid }).populate('post_id');
                return savedPosts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findSave(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saved = yield saves_model_1.SaveModel.findOne({ user_id: userid, post_id: postid });
                return saved;
            }
            catch (error) {
                throw error;
            }
        });
    }
    savePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSave = new saves_model_1.SaveModel({
                    user_id: userid,
                    post_id: postid
                });
                const saved = yield newSave.save();
                return saved;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unSavePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unsavedPost = yield saves_model_1.SaveModel.findOneAndDelete({ user_id: userid, post_id: postid });
                return unsavedPost;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findPostByUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield post_model_1.PostModel.find({ creator_id: userid }).sort({ createdAt: -1 });
                return posts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    isPostLikedByUser(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            const liked = yield postLikes_models_1.PostLikeModel.findOne({ post_id: postid, user_id: userid });
            return !!liked;
        });
    }
    likePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const like = new postLikes_models_1.PostLikeModel({
                    post_id: postid, user_id: userid
                });
                yield like.save();
                yield post_model_1.PostModel.updateOne({ _id: postid }, { $inc: { likes: 1 } });
                return like;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unlikePost(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dislike = yield postLikes_models_1.PostLikeModel.findOneAndDelete({
                    post_id: postid, user_id: userid
                });
                yield post_model_1.PostModel.updateOne({ _id: postid }, { $inc: { likes: -1 } });
                return dislike;
            }
            catch (error) {
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = new post_model_1.PostModel({
                    creator_id: data.creator_id,
                    trip_id: data.trip_id,
                    caption: data.caption,
                    images: data.images,
                    location: data.location,
                    place: data.place
                });
                const saved = yield post.save();
                return saved;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, data) {
        throw new Error("Method not implemented.");
    }
    findById(id) {
        throw new Error("Method not implemented.");
    }
    findAll(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const posts = yield post_model_1.PostModel.aggregate([
                {
                    $lookup: {
                        from: 'users', // Collection name of the user model
                        localField: 'creator_id', // Field in the post model
                        foreignField: '_id', // Field in the user model
                        as: 'user' // Output array field
                    }
                },
                {
                    $unwind: '$user' // Unwind the array to get individual user objects
                },
                {
                    $project: {
                        _id: 1,
                        creator_id: 1,
                        trip_id: 1,
                        caption: 1,
                        location: 1,
                        images: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        place: 1,
                        'user.username': 1,
                        'user._id': 1,
                        'user.profileimg': 1,
                        'user.isPremium': 1,
                        likes: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);
            return posts;
        });
    }
    findOne(postid) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield post_model_1.PostModel.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(postid)
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Collection name of the user model
                        localField: 'creator_id', // Field in the post model
                        foreignField: '_id', // Field in the user model
                        as: 'user' // Output array field
                    }
                },
                {
                    $unwind: '$user' // Unwind the array to get individual user objects
                },
                {
                    $project: {
                        _id: 1,
                        creator_id: 1,
                        trip_id: 1,
                        caption: 1,
                        location: 1,
                        images: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        place: 1,
                        'user.username': 1,
                        'user._id': 1,
                        'user.profileimg': 1,
                        'user.isPremium': 1,
                        likes: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]);
            return posts;
        });
    }
    getlikedUsers(userid, postid) {
        return __awaiter(this, void 0, void 0, function* () {
            // await PostLikeModel.find({ post_id: postid }).populate("user_id");
            let likedUsers = yield postLikes_models_1.PostLikeModel.aggregate([
                {
                    $match: { post_id: new mongoose_1.default.Types.ObjectId(postid) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "likedUser"
                    }
                },
                {
                    $unwind: "$likedUser"
                },
                {
                    $lookup: {
                        from: "follows",
                        let: { likedUserId: "$likedUser._id", currentUserId: new mongoose_1.default.Types.ObjectId(userid) },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$following_id", "$$likedUserId"] },
                                            { $eq: ["$follower_id", "$$currentUserId"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "followingStatus"
                    }
                },
                {
                    $addFields: {
                        "likedUser.isFollowing": { $gt: [{ $size: "$followingStatus" }, 0] }
                    }
                },
                {
                    $lookup: {
                        from: "follows",
                        let: { likedUserId: "$likedUser._id", currentUserId: new mongoose_1.default.Types.ObjectId(userid) },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$follower_id", "$$likedUserId"] },
                                            { $eq: ["$following_id", "$$currentUserId"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "followedStatus"
                    }
                },
                {
                    $addFields: {
                        "likedUser.isMutualFollow": {
                            $cond: {
                                if: { $and: [{ $gt: [{ $size: "$followedStatus" }, 0] }, "$likedUser.isFollowing"] },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        "likedUser._id": 1,
                        "likedUser.username": 1,
                        // "likedUser.isFollowing": 1,
                        "likedUser.isMutualFollow": 1,
                        "likedUser.profileimg": 1,
                        'likedUser.isPremium': 1,
                    }
                }
            ]);
            likedUsers = likedUsers.map(user => user.likedUser);
            return likedUsers;
        });
    }
}
exports.PostRepository = PostRepository;
