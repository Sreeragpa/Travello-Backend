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
exports.FollowUsecase = void 0;
const notification_enums_1 = require("../enums/notification.enums");
class FollowUsecase {
    constructor(followRepository, notificationUsecase) {
        this.followRepository = followRepository;
        this.notificationUsecase = notificationUsecase;
    }
    getFollowings(searchData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = this.followRepository.getFollowingUsers(searchData);
                return users;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFollowersCount(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.followRepository.getFollowcount(userid);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    follow(followerid, followingid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.followRepository.addFollow(followerid, followingid);
                const notification = {
                    sender: result.follower_id,
                    recipient: result.following_id,
                    type: notification_enums_1.NOTIFICATION_TYPE.FOLLOW
                };
                yield this.notificationUsecase.createNotification(notification);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unfollow(followerid, followingid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield this.followRepository.deleteFollow(followerid, followingid);
                return deleted;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FollowUsecase = FollowUsecase;
