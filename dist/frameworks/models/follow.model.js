"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FollowSchema = new mongoose_1.default.Schema({
    follower_id: { type: mongoose_1.default.Types.ObjectId, required: true },
    following_id: { type: mongoose_1.default.Types.ObjectId, required: true },
}, { timestamps: true });
exports.FollowModel = mongoose_1.default.model("follows", FollowSchema);
