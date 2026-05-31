"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookieOptions = exports.authCookieOptions = void 0;
const isProduction = () => process.env.NODE_ENV === "production";
const authCookieOptions = (maxAge) => (Object.assign({ httpOnly: true, secure: isProduction(), sameSite: isProduction() ? "none" : "lax", path: "/" }, (typeof maxAge === "number" ? { maxAge } : {})));
exports.authCookieOptions = authCookieOptions;
exports.clearAuthCookieOptions = {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
};
