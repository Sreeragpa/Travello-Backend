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
exports.AiController = void 0;
class AiController {
    constructor(aiUsecase) {
        this.aiUsecase = aiUsecase;
    }
    tripChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const message = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message;
                const lat = Number((_b = req.body) === null || _b === void 0 ? void 0 : _b.lat);
                const lng = Number((_c = req.body) === null || _c === void 0 ? void 0 : _c.lng);
                const radius = Number((_d = req.body) === null || _d === void 0 ? void 0 : _d.radius) || 30; //km
                const location = Number.isFinite(lat) && Number.isFinite(lng)
                    ? Object.assign({ lat,
                        lng }, (Number.isFinite(radius) && { radius })) : undefined;
                const data = yield this.aiUsecase.tripChat(message, location, {
                    userId: (_e = req.user) === null || _e === void 0 ? void 0 : _e.user_id,
                });
                res.status(200).json({ status: "success", data });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AiController = AiController;
