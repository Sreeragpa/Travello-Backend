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
exports.FollowRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const follow_model_1 = require("../frameworks/models/follow.model");
class FollowRepository {
    getFollowingUsers(searchData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchStage = {
                    $match: {
                        follower_id: new mongoose_1.default.Types.ObjectId(searchData.follower_id)
                    }
                };
                const lookupStage = {
                    $lookup: {
                        from: 'users',
                        localField: 'following_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                };
                const unwindStage = {
                    $unwind: "$userDetails"
                };
                const pipeline = [matchStage, lookupStage, unwindStage];
                const searchKeyword = searchData.searchKeyword;
                // Add a match stage for the search keyword if it is provided
                if (searchKeyword) {
                    const searchMatchStage = {
                        $match: {
                            $or: [
                                { "userDetails.username": { $regex: searchKeyword, $options: 'i' } },
                                { "userDetails.email": { $regex: searchKeyword, $options: 'i' } },
                            ]
                        }
                    };
                    pipeline.push(searchMatchStage);
                }
                const users = yield follow_model_1.FollowModel.aggregate(pipeline);
                const userDetails = users.map((user) => user.userDetails);
                return userDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFollowcount(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followingCount = yield follow_model_1.FollowModel.countDocuments({ follower_id: userid });
                const followersCount = yield follow_model_1.FollowModel.countDocuments({ following_id: userid });
                return { followingCount, followersCount };
            }
            catch (error) {
                throw error;
            }
        });
    }
    isUserFollowing(userid, followingid) {
        return __awaiter(this, void 0, void 0, function* () {
            const following = yield follow_model_1.FollowModel.findOne({
                follower_id: userid,
                following_id: followingid
            });
            return !!following;
        });
    }
    getFollower(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followers = yield follow_model_1.FollowModel.find({ following_id: userid });
                return followers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFollowing(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const following = yield follow_model_1.FollowModel.find({ follower_id: userid }).select('following_id');
                return following;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addFollow(followerid, followingid) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFollow = new follow_model_1.FollowModel({
                follower_id: followerid,
                following_id: followingid
            });
            const saved = yield newFollow.save();
            return saved;
        });
    }
    deleteFollow(followerid, followingid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield follow_model_1.FollowModel.findOneAndDelete({ follower_id: followerid, following_id: followingid });
                return deleted;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FollowRepository = FollowRepository;
