import type { CookieOptions } from "express";

// Vercel does not always set NODE_ENV=production; use VERCEL too so cross-origin
// cookies get SameSite=None; Secure (required for fetch from another domain).
const useCrossOriginCookies = () =>
  process.env.NODE_ENV === "production" || !!process.env.VERCEL;

export const authCookieOptions = (maxAge?: number): CookieOptions => ({
  httpOnly: true,
  secure: useCrossOriginCookies(),
  sameSite: useCrossOriginCookies() ? "none" : "lax",
  path: "/",
  ...(typeof maxAge === "number" ? { maxAge } : {}),
});

export const clearAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: useCrossOriginCookies(),
  sameSite: useCrossOriginCookies() ? "none" : "lax",
  path: "/",
};
