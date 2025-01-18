"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SavesSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId
    },
    post_id: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Post'
    }
});
exports.SaveModel = mongoose_1.default.model('saves', SavesSchema);
