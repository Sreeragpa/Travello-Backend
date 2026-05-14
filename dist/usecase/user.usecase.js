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
exports.UserUsecase = void 0;
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserUsecase {
    constructor(userRepository, authRepository, cloudinaryService, followRepository) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.authRepository = authRepository;
        this.followRepository = followRepository;
    }
    searchUser(userid, searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchResults = yield this.userRepository.searchUser(searchKey);
                if (searchResults) {
                    console.log(searchResults, "SRSRRSR");
                    searchResults = searchResults.filter((user) => {
                        return String(user._id) != userid;
                    });
                }
                return searchResults;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUserProfile(userid, updatefields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (updatefields.username) {
                    updatefields.username = updatefields.username.toLowerCase();
                    const isUsernameExists = yield this.authRepository.checkUsernameExists(updatefields.username);
                    if (isUsernameExists) {
                        throw new Error(errorCodes_enum_1.ErrorCode.USERNAME_ALREADY_EXISTS);
                    }
                }
                const user = yield this.userRepository.updateUser(userid, updatefields);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatePassword(userid, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                newPassword = yield bcrypt_1.default.hash(newPassword, 10);
                const password = yield this.authRepository.findPassword(userid, oldPassword);
                const isPasswordValid = yield bcrypt_1.default.compare(oldPassword, password);
                if (!isPasswordValid) {
                    throw new Error(errorCodes_enum_1.ErrorCode.INCORRECT_PASSWORD);
                }
                const user = yield this.userRepository.updatePassword(userid, newPassword);
                return "Password Updated Successfully";
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUser(userid, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let isFollowing = false
                const user = yield this.userRepository.getUserById(userid);
                // Check if the current user is following the retrieved user
                if (!user)
                    throw Error;
                let isFollowing = false;
                if (userid !== currentUser) {
                    isFollowing = yield this.followRepository.isUserFollowing(currentUser, userid);
                }
                const userWithFollowing = Object.assign(Object.assign({}, user.toObject()), { isFollowing: isFollowing });
                // Return user along with the isFollowing status
                return userWithFollowing;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUserProfilePic(userid, img) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadedImage = yield this.cloudinaryService.uploadImage(img);
                const user = yield this.userRepository.addProfilePicture(userid, uploadedImage);
                if (user) {
                    return user;
                }
                else {
                    throw new Error(errorCodes_enum_1.ErrorCode.FAILED_UPDATING);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserUsecase = UserUsecase;
