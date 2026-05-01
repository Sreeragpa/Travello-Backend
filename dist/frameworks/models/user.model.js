"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    followers: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    following: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    hosted_trips: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    joined_trips: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    posts: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    chats: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    profileimg: {
        type: String,
        default: "https://res.cloudinary.com/delyrsoej/image/upload/v1724225037/travello/abya4nwiaelu7cxjlxfr.jpg"
    },
    bio: {
        type: String,
        default: "New to Travello"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("Users", UserSchema);
