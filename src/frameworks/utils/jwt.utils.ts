import * as jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "test_secret";

// Sign JWT
export function signJWT(payload: object, expiresIn: string | number): {accessToken: string,refreshToken: string} {
    const accessToken = jwt.sign(payload, JWT_SECRET,{ expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET,{ expiresIn: '7d' });
    return {accessToken,refreshToken};
}

// Verify JWT
export function verifyJWT<T>(token: string): T | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as T;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return null; // Token has expired
        } else {
            console.error("JWT Verification Error:", error);
            throw new Error("JWT Verification Error");
        }
    }
}