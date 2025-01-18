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
exports.AuthRepository = void 0;
const auth_model_1 = require("../frameworks/models/auth.model");
const user_model_1 = require("../frameworks/models/user.model");
const otp_model_1 = require("../frameworks/models/otp.model");
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthRepository {
    findPassword(userid, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield auth_model_1.AuthModel.findOne({ userid: userid });
                return user === null || user === void 0 ? void 0 : user.password;
            }
            catch (error) {
                throw error;
            }
        });
    }
    logout() {
        throw new Error("Method not implemented.");
    }
    verifyUserAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield auth_model_1.AuthModel.findOneAndUpdate({ email: email }, { $set: { verified: true } }, { new: true } // Return the modified document
                );
                if (updatedUser) {
                    return updatedUser.toJSON();
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                password = yield bcrypt_1.default.hash(password, 10);
                yield auth_model_1.AuthModel.findOneAndUpdate({ email: email }, { $set: { password: password } });
                return "Password Changed Successfully";
            }
            catch (error) {
                throw error;
            }
        });
    }
    emailAuth(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_model_1.AuthModel.findOne({ email: email });
            if (!user) {
                throw new Error(errorCodes_enum_1.ErrorCode.USER_NOT_FOUND);
            }
            // Return the user object
            return user.toJSON();
        });
    }
    checkUserVerified(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_model_1.AuthModel.findOne({ email: email });
            return (user === null || user === void 0 ? void 0 : user.verified) == true;
        });
    }
    saveOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expiry = new Date();
                expiry.setTime(expiry.getTime() + 60000); // Adding 60 seconds
                const newOTP = new otp_model_1.OtpModel({
                    email: email,
                    otp: otp,
                    expiry: expiry
                });
                yield newOTP.save();
                return otp;
            }
            catch (error) {
                throw new Error("Error Saving OTP");
            }
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the OTP document
                const otpFound = yield otp_model_1.OtpModel.findOne({ email: email, otp: otp }).sort({ expiry: -1 });
                console.log(otpFound);
                if (!otpFound) {
                    throw new Error("Invalid OTP"); // Throw an error if OTP not found
                }
                console.log(otpFound);
                if (!otpFound.expiry || otpFound.expiry < new Date) {
                    throw new Error("OTP Expired");
                }
                return "OTP verified successfully";
            }
            catch (error) {
                console.error('Error verifying OTP:', error);
                throw error;
            }
        });
    }
    checkUsernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_model_1.AuthModel.findOne({ username: username });
            return user !== null;
        });
    }
    checkEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_model_1.AuthModel.findOne({ email: email });
            return user !== null;
        });
    }
    create(data, isGoogleAuth = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_model_1.UserModel({
                email: data.email,
                username: data.username,
                name: data.username,
                bio: "New to Travello! ✈️ Exploring the world",
                profileimg: data.profileimg
            });
            const newAuth = new auth_model_1.AuthModel({
                email: data.email,
                username: data.username,
                password: data.password,
                userid: user._id,
                isGoogleAuth: isGoogleAuth
            });
            const saved = yield user.save();
            const authsaved = yield newAuth.save();
            const createdUser = user.toObject();
            return createdUser;
        });
    }
    login(data, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auth_model_1.AuthModel.updateOne({ email: data.email }, { $push: { token: token } });
            return token;
        });
    }
    checkUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_model_1.AuthModel.findOne({ email: email });
            return user;
        });
    }
}
exports.AuthRepository = AuthRepository;
