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
exports.AdminUsecase = void 0;
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
const jwt_utils_1 = require("../frameworks/utils/jwt.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminUsecase {
    constructor(adminRespository, postRepository, tripRepository, userRepository) {
        this.adminRespository = adminRespository;
        this.postRepository = postRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }
    blockUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockedUser = yield this.userRepository.blockUser(userid);
            return blockedUser;
        });
    }
    unBlockUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const unBlockedUser = yield this.userRepository.unBlockUser(userid);
            return unBlockedUser;
        });
    }
    searchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.searchUser(query);
            return users;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.getAllUser();
            return users;
        });
    }
    usersCountByDate(period) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postCount = yield this.userRepository.getUserCountByDate(period);
                return postCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    tripsCountByDate(period) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postCount = yield this.tripRepository.getTripsCountByDate(period);
                return postCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    postsCountByDate(period) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postCount = yield this.postRepository.getPostCountByDate(period);
                return postCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(email, password);
                const admin = yield this.adminRespository.getAdmin(email);
                const isMatch = yield bcrypt_1.default.compare(password, admin.password);
                if (!isMatch) {
                    throw new Error(errorCodes_enum_1.ErrorCode.INVALID_CREDENTIALS);
                }
                const payload = { id: admin._id, email: admin.email, isAdmin: true };
                const token = (0, jwt_utils_1.signJWT)(payload, 8);
                const adminData = {
                    email: admin.email,
                    token: token.accessToken,
                    refreshToken: token.refreshToken
                };
                return adminData;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminUsecase = AdminUsecase;
