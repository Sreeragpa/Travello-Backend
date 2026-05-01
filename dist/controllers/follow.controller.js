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
exports.FollowController = void 0;
class FollowController {
    constructor(followUsecase) {
        this.followUsecase = followUsecase;
    }
    followAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { followingid } = req.body;
                const followerid = user.user_id;
                const result = yield this.followUsecase.follow(followerid, followingid);
                // const followedUserSocketId = this.userSocketMap[followingid];
                // console.log(followedUserSocketId);
                // console.log(this.io,'io');
                // if (followedUserSocketId) {
                //     console.log('hehehheheh');
                //     // this.io.to(followedUserSocketId).emit('followNotification',result);
                //   }
                res.status(200).json({ status: "success", data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    unfollowAcccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { followingid } = req.body;
                const followerid = user.user_id;
                const result = yield this.followUsecase.unfollow(followerid, followingid);
                res.status(200).json({ status: "success", data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFollowCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = req.params.id || user.user_id;
                const result = yield this.followUsecase.getFollowersCount(userId);
                res.status(200).json({ status: 'success', data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFollowings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const searchvalue = req.query.search;
                const data = {
                    follower_id: user.user_id,
                    searchKeyword: searchvalue ? String(searchvalue).trim() : null
                };
                const users = yield this.followUsecase.getFollowings(data);
                res.status(200).json({ status: "success", data: users });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FollowController = FollowController;
