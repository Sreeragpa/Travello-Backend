"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookieOptions = exports.authCookieOptions = void 0;
// Vercel does not always set NODE_ENV=production; use VERCEL too so cross-origin
// cookies get SameSite=None; Secure (required for fetch from another domain).
const useCrossOriginCookies = () => process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const authCookieOptions = (maxAge) => (Object.assign({ httpOnly: true, secure: useCrossOriginCookies(), sameSite: useCrossOriginCookies() ? "none" : "lax", path: "/" }, (typeof maxAge === "number" ? { maxAge } : {})));
exports.authCookieOptions = authCookieOptions;
exports.clearAuthCookieOptions = {
    httpOnly: true,
    secure: useCrossOriginCookies(),
    sameSite: useCrossOriginCookies() ? "none" : "lax",
    path: "/",
};
