import { Request, Response, NextFunction } from "express";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { IJwtPayload } from "../../interfaces/usecase/IUser.usecase";
import { UserModel } from "../models/user.model";
import IUser from "../../entities/user.entity";

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;

    if (!authToken && !refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No tokens provided" });
    }

    let userData: any | null = null;
    if (authToken) {
      // Attempt to verify the access token
      userData = verifyJWT<IJwtPayload>(authToken) as IJwtPayload;
    }

    console.log("heyegywugewyrug",userData);
    

    // If access token is invalid, use the refresh token
    if (!userData && refreshToken) {
      const refreshTokenData = await verifyJWT<IJwtPayload>(refreshToken) as IJwtPayload;

      console.log(refreshTokenData,"REFREEDATATA");
      

      if (!refreshTokenData) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid refresh token" });
      }

      userData = refreshTokenData;

      // Issue a new access token
      const payload = {
        id: userData.id,
        email: userData.email,
        user_id: userData.user_id,
      };
      const token = signJWT(payload, 15);

      // Send new tokens to the client
      res.cookie("authToken", token.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      });
    }

    // If no valid token is found, return unauthorized
    if (!userData) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token verification failed" });
    }

    let user: IUser | null = await UserModel.findById(userData?.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    req.user = userData; // Attach user data to the request object

    next();
  } catch (error) {
    return res.status(500).json({ message: "JWT Verification Error" });
  }
};
