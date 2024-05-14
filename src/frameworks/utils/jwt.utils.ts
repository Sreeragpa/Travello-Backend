import * as jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "test_secret";

// Sign JWT
export function signJWT(payload: object, expiresIn: string | number): string {
    const accessToken = jwt.sign(payload, JWT_SECRET);
    return accessToken;
}

// Verify JWT
export function verifyJWT(token: string): object | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as object;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return null; // Token has expired
        } else {
            console.error("JWT Verification Error:", error);
            throw new Error("JWT Verification Error");
        }
    }
}