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
exports.UserController = void 0;
class UserController {
    constructor(userUsecase) {
        this.userUsecase = userUsecase;
    }
    updateProfilePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const image = req.body.profileimg;
                const userdata = yield this.userUsecase.updateUserProfilePic(user.user_id, image);
                if (userdata) {
                    res.status(200).json({ status: "success", data: userdata });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, username, bio } = req.body;
                const user = req.user;
                const updateFields = {};
                if (name && name.trim())
                    updateFields.name = name.trim();
                if (username && username.trim())
                    updateFields.username = username.trim();
                if (bio && bio.trim())
                    updateFields.bio = bio.trim();
                // Check for validation errors
                if (Object.keys(updateFields).length > 0) {
                    // Assuming you have a method to update the user profile
                    const userdata = yield this.userUsecase.updateUserProfile(user.user_id, updateFields);
                    return res.status(200).json({ status: "success", data: userdata });
                }
                else {
                    return res.status(400).json({ status: 'failure', message: 'No valid fields to update' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { currentPassword, newPassword } = req.body;
                const errors = [];
                if (!currentPassword.trim()) {
                    errors.push('currentPassword is required.');
                }
                if (!newPassword.trim()) {
                    errors.push('newPassword is required.');
                }
                // Check for validation errors
                if (errors.length > 0) {
                    return res.status(400).json({ errors }); // Bad request
                }
                const data = yield this.userUsecase.updatePassword(user.user_id, currentPassword, newPassword);
                return res.status(200).json({ status: "success", data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = req.params.id || user.user_id;
                let currentUser = user.user_id;
                const userdata = yield this.userUsecase.getUser(userId, currentUser);
                console.log(userdata, "userdataatt");
                res.status(200).json({ status: "succeess", data: userdata });
            }
            catch (error) {
                next(error);
            }
        });
    }
    searchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const search = req.query.search;
                if (!search.trim()) {
                    return res.status(400).json({ message: "Invalid Search" });
                }
                const searchResults = yield this.userUsecase.searchUser(user.user_id, search);
                res.status(200).json({ status: "succeess", data: searchResults });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
