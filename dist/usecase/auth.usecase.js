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
exports.AuthUsecase = void 0;
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
const emailService_1 = require("../frameworks/utils/emailService");
const googleAuthVerifyToken_1 = __importDefault(require("../frameworks/utils/googleAuthVerifyToken"));
const jwt_utils_1 = require("../frameworks/utils/jwt.utils");
const otpGenerator_utils_1 = require("../frameworks/utils/otpGenerator.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthUsecase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    userSigninGoogle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield (0, googleAuthVerifyToken_1.default)(data);
            let user = yield this.authRepository.checkUser(payload.email);
            if (!user) {
                const data = { email: payload.email, userid: payload.email, password: payload.sub, username: payload.email, profileimg: payload.picture };
                yield this.authRepository.create(data, true);
                user = yield this.authRepository.checkUser(payload.email);
            }
            if (user) {
                const authData = { email: payload.email };
                const payloadJWT = { id: user._id, email: user.email, user_id: user.userid };
                const token = (0, jwt_utils_1.signJWT)(payloadJWT, 8);
                yield this.authRepository.login(authData, token.refreshToken);
                return token;
            }
            else {
                throw new Error(errorCodes_enum_1.ErrorCode.RESOURCE_NOT_FOUND);
            }
        });
    }
    logoutUser() {
        throw new Error("Method not implemented.");
    }
    verifyResetPassword(email, otp, newpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.verifyOtp(email, otp);
                if (!data) {
                    throw new Error("OTP_VERIFICATION_ERROR");
                }
                yield this.authRepository.changePassword(email, newpassword);
                return "Reset Password Successfull";
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Sending OTP
                yield this.sendOtpByEmail(email, "Travello:Reset Password");
                return "OTP Sent Successfully";
            }
            catch (error) {
                throw error;
            }
        });
    }
    sendOtpByEmail(email, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate OTP
                const otp = (0, otpGenerator_utils_1.generateOTP)(6);
                // Save OTP to the repository
                yield this.authRepository.saveOtp(email, otp);
                yield (0, emailService_1.sendEmail)(email, subject, `Your OTP is: ${otp}`);
                return;
            }
            catch (error) {
                throw new Error(errorCodes_enum_1.ErrorCode.FAILED_SENDING_OTP);
            }
        });
    }
    userSignin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.emailAuth(data.email);
                const isMatch = yield bcrypt_1.default.compare(data.password, user.password);
                if (!isMatch) {
                    throw new Error(errorCodes_enum_1.ErrorCode.INVALID_CREDENTIALS);
                }
                // Checking Whether Account is created using Google Auth
                if (user.isGoogleAuth) {
                    throw new Error(errorCodes_enum_1.ErrorCode.SIGN_IN_WITH_GOOGLE);
                }
                const isUserVerified = yield this.authRepository.checkUserVerified(data.email);
                if (!isUserVerified) {
                    yield this.sendOtpByEmail(data.email, "Travello:Verify Account");
                    throw new Error(errorCodes_enum_1.ErrorCode.USER_NOT_VERIFIED);
                }
                const payload = { id: user._id, email: user.email, user_id: user.userid };
                const token = (0, jwt_utils_1.signJWT)(payload, 8);
                yield this.authRepository.login(data, token.refreshToken);
                return token;
            }
            catch (error) {
                throw new Error(errorCodes_enum_1.ErrorCode.SIGN_IN_WITH_GOOGLE);
            }
        });
    }
    userSignup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailExists = yield this.authRepository.checkEmailExists(data.email);
                const usernameExists = yield this.authRepository.checkUsernameExists(data.username);
                if (emailExists) {
                    throw new Error(errorCodes_enum_1.ErrorCode.EMAIL_ALREADY_EXISTS); // Throw for controller handling
                }
                if (usernameExists) {
                    throw new Error(errorCodes_enum_1.ErrorCode.USERNAME_ALREADY_EXISTS); // Throw for controller handling
                }
                // Hash password
                data.password = yield bcrypt_1.default.hash(data.password, 10);
                // Create user
                data.username = data.username.toLowerCase();
                const newUser = yield this.authRepository.create(data, false);
                // Generate OTP and Send  via email
                yield this.sendOtpByEmail(data.email, "Travello:Verify Account");
                return newUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sendOtpByEmail(email, "Travello:Reset Password");
                return "OTP Sent";
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifying OTP from OtpCollection
                const OtpVerfication = yield this.authRepository.verifyOtp(email, otp);
                // Verifying User Account after OTP Verification
                yield this.authRepository.verifyUserAccount(email);
                return OtpVerfication;
            }
            catch (error) {
                console.error("Error verifying OTP:", error);
                throw error;
            }
        });
    }
}
exports.AuthUsecase = AuthUsecase;
