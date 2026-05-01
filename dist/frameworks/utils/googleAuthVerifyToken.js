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
const google_auth_library_1 = require("google-auth-library");
const clientId = process.env.GOOGLE_CLIENT_ID;
function verifyIdToken(idToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new google_auth_library_1.OAuth2Client(clientId);
            const ticket = yield client.verifyIdToken({ idToken, audience: clientId });
            const payload = ticket.getPayload(); // Type assertion
            return payload;
        }
        catch (error) {
            console.error(error);
            throw new Error('Invalid ID token');
        }
    });
}
exports.default = verifyIdToken;
