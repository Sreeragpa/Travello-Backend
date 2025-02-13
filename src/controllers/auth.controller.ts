import { NextFunction, Request, Response } from "express";
import { IAuthUsecase } from "../interfaces/usecase/IAuth.usecase";
import { ErrorCode } from "../enums/errorCodes.enum";

export class AuthController{
    private authUsecase: IAuthUsecase;
    constructor(authUsecase: IAuthUsecase){
        this.authUsecase = authUsecase
    }

    async signup(req: Request,res: Response,next: NextFunction){
        try {
            const body = req.body;
            console.log(body);
            
            const data = await this.authUsecase.userSignup(body);
            res.status(200).json({ status: 'success', data: data });
        } catch (error) {
            next(error)
        }
    }
    async verifyOtp(req: Request, res: Response, next: NextFunction){
        try {
            const body = req.body;
            if(!body?.email || !body?.otp){
                throw new Error("Missing Data (email or OTP")
            }
            const data = await this.authUsecase.verifyOtp(body.email,body.otp);
            res.status(200).json({ status: 'success', data: data });
        } catch (error) {
            next(error)
        }
    }

    async signin(req: Request, res: Response, next: NextFunction){
        try {    
            const body = req.body;
            if(!body?.email || !body?.password){
                throw new Error("Missing Data (email or password")
            }
            const token = await this.authUsecase.userSignin(body);
            // Auth before Refresh Token
            // res.cookie('authToken', token, {
            //     httpOnly: true,
            //     secure: true,  // Use true if you're serving over HTTPS
            //     sameSite: 'none'  // Allows cross-site cookie usage
            //   });

            res.cookie('authToken', token.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', token.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            
            res.status(200).json({ status: 'success', data: token.accessToken });

        } catch (error) {
            next(error)
        }
    }
    async googleSignin(req: Request, res: Response, next: NextFunction){
        try {    
            console.log("IN Google AUth Controller");
            
            const { idToken } = req.body;
            if(!idToken){
                throw new Error("Missing Token")
            }
            const token = await this.authUsecase.userSigninGoogle(idToken);
            
            // res.cookie('authToken', token, { httpOnly: true });
            // res.cookie('authToken', token, {
            //     httpOnly: true,
            //     secure: true,  // Use true if you're serving over HTTPS
            //     sameSite: 'none'  // Allows cross-site cookie usage
            //   });


              res.cookie('authToken', token.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', token.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });


            
            res.status(200).json({ status: 'success', data: token.accessToken });

        } catch (error) {
            next(error)
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction){
        try {
            const {email} = req.body;
            const data = await this.authUsecase.resetPassword(email);
            res.status(200).json({ status: 'success', data: data });
            
        } catch (error) {
            next(error)
        }
    }

    async verifyresetPassword(req: Request, res: Response, next: NextFunction){
        try {
            const {email,otp,newpassword} = req.body;
            const data = await this.authUsecase.verifyResetPassword(email,otp,newpassword);
            res.status(200).json({ status: 'success', data: data });
            
        } catch (error) {
            next(error)
        }
    }

    async checkAuthenticated(req: Request, res: Response, next: NextFunction){
        try {
            console.log("authenticated");
            
            res.status(200).json({ status: 'authenticated' });
        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction){
        res.cookie('authToken', '', {
            httpOnly: true,
            secure: true, // Use true if you're serving over HTTPS
            sameSite: 'none',
            expires: new Date(0), // Set expiration date to the past
          });
          res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: true, // Use true if you're serving over HTTPS
            sameSite: 'none',
            expires: new Date(0), // Set expiration date to the past
          });


        res.status(200).json({status:"success",data:"Logged out successfully"})
    }

    async getToken(req: Request, res: Response, next: NextFunction){
        const token = req.cookies.authToken; 

    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
        res.status(200).json({status:"success",data:token})
    }

}