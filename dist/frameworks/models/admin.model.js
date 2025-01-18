"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminCred = new mongoose_1.default.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
});
exports.adminModel = mongoose_1.default.model("admins", adminCred);
