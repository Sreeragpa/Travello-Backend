import { NextFunction, Request, Response } from "express";
import { IAuthUsecase } from "../interfaces/usecase/IAuth.usecase";

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
            // res.cookie('authToken', token, { httpOnly: true });
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,  // Use true if you're serving over HTTPS
                sameSite: 'none'  // Allows cross-site cookie usage
              });
            console.log('cookieset');
            
            res.status(200).json({ status: 'success', data: token });

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
        res.status(200).json({status:"success",data:"Logged out successfully"})
    }

}