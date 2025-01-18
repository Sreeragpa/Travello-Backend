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
exports.UserRepository = void 0;
const user_model_1 = require("../frameworks/models/user.model");
const auth_model_1 = require("../frameworks/models/auth.model");
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
class UserRepository {
    blockUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOneAndUpdate({ _id: userid }, { $set: { isBlocked: true } });
            if (!user) {
                throw new Error(`User with id ${userid} not found.`);
            }
            return user;
        });
    }
    unBlockUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOneAndUpdate({ _id: userid }, { $set: { isBlocked: false } });
            if (!user) {
                throw new Error(`User with id ${userid} not found.`);
            }
            return user;
        });
    }
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.UserModel.find();
            return users;
        });
    }
    getUserCountByDate(days) {
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
            const data = yield user_model_1.UserModel.aggregate([
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
    searchUser(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchKey, 'i');
            const users = yield user_model_1.UserModel.find({ $or: [
                    { username: { $regex: regex } },
                    { name: { $regex: regex } }
                ] });
            return users;
        });
    }
    updateUser(userid, updatefields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findOneAndUpdate({ _id: userid }, { $set: updatefields }, { new: true });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatePassword(userid, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield auth_model_1.AuthModel.findOneAndUpdate({ userid: userid }, { $set: { password: password } }, { new: true });
                if (user) {
                    return "Password Changed Successfully";
                }
                else {
                    throw new Error(errorCodes_enum_1.ErrorCode.USER_NOT_FOUND);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserById(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findById(userid);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addProfilePicture(userid, img) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findOneAndUpdate({ _id: userid }, { $set: { profileimg: img } }, { new: true });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
