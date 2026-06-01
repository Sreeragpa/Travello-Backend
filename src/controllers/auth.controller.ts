import { NextFunction, Request, Response } from "express";
import { IAuthUsecase } from "../interfaces/usecase/IAuth.usecase";
import { ErrorCode } from "../enums/errorCodes.enum";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { io } from "../server";
import { forceUserOffline } from "../frameworks/configs/redis";
import { authCookieOptions, clearAuthCookieOptions } from "../frameworks/utils/cookieOptions";
import { verifyJWT } from "../frameworks/utils/jwt.utils";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";

export class AuthController {
    private authUsecase: IAuthUsecase;
    constructor(authUsecase: IAuthUsecase) {
        this.authUsecase = authUsecase
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            console.log(body);

            const data = await this.authUsecase.userSignup(body);
            res.status(200).json({ status: 'success', data: data });
        } catch (error) {
            next(error)
        }
    }
    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            if (!body?.email || !body?.otp) {
                throw new Error("Missing Data (email or OTP")
            }
            const data = await this.authUsecase.verifyOtp(body.email, body.otp);
            res.status(200).json({ status: 'success', data: data });
        } catch (error) {
            next(error)
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            if (!body?.email || !body?.password) {
                throw new Error("Missing Data (email or password")
            }
            const token = await this.authUsecase.userSignin(body);
            // Auth before Refresh Token
            // res.cookie('authToken', token, {
            //     httpOnly: true,
            //     secure: true,  // Use true if you're serving over HTTPS
            //     sameSite: 'strict'  // Allows cross-site cookie usage
            //   });

            res.cookie('authToken', token.accessToken, authCookieOptions(15 * 60 * 1000));

            res.cookie('refreshToken', token.refreshToken, authCookieOptions(7 * 24 * 60 * 60 * 1000));


            res.status(200).json({ status: 'success', data: token.accessToken });

        } catch (error) {
            next(error)
        }
    }
    async googleSignin(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("IN Google AUth Controller");

            const { idToken } = req.body;
            if (!idToken) {
                throw new Error("Missing Token")
            }
            const token = await this.authUsecase.userSigninGoogle(idToken);

            // res.cookie('authToken', token, { httpOnly: true });
            // res.cookie('authToken', token, {
            //     httpOnly: true,
            //     secure: true,  // Use true if you're serving over HTTPS
            //     sameSite: 'strict'  // Allows cross-site cookie usage
            //   });


            res.cookie('authToken', token.accessToken, authCookieOptions(15 * 60 * 1000));

            res.cookie('refreshToken', token.refreshToken, authCookieOptions(7 * 24 * 60 * 60 * 1000));



            res.status(200).json({ status: 'success', data: token.accessToken });

        } catch (error) {
            next(error)
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const data = await this.authUsecase.resetPassword(email);
            res.status(200).json({ status: 'success', data: data });

        } catch (error) {
            next(error)
        }
    }

    async verifyresetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, otp, newpassword } = req.body;
            const data = await this.authUsecase.verifyResetPassword(email, otp, newpassword);
            res.status(200).json({ status: 'success', data: data });

        } catch (error) {
            next(error)
        }
    }

    async checkAuthenticated(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("authenticated");

            res.status(200).json({ status: 'authenticated' });
        } catch (error) {
            next(error)
        }
    }

    async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            res.clearCookie("authToken", clearAuthCookieOptions);
            res.clearCookie("refreshToken", clearAuthCookieOptions);
            res.status(200).json({ status: "success", data: "Logged out successfully" });

            const tokenToDecode = req.cookies?.refreshToken ?? req.cookies?.authToken;
            const decoded = tokenToDecode ? verifyJWT<IJwtPayload>(tokenToDecode) : null;
            const userId = decoded?.user_id;

            void (async () => {
                try {
                    if (refreshToken) {
                        await this.authUsecase.logoutUser(refreshToken);
                    }

                    if (userId) {
                        await forceUserOffline(userId);
                        io.in(userId).disconnectSockets(true);
                    }
                } catch (error) {
                    console.error("Logout cleanup failed:", error);
                }
            })();
        } catch (error) {
            next(error);
        }
    }

    async getToken(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        res.status(200).json({ status: "success", data: token })
    }

}
