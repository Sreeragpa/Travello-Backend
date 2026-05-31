import type { CookieOptions } from "express";

const isProduction = () => process.env.NODE_ENV === "production";

export const authCookieOptions = (maxAge?: number): CookieOptions => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  path: "/",
  ...(typeof maxAge === "number" ? { maxAge } : {}),
});

export const clearAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  path: "/",
};
