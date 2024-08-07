import IAuth from "../../entities/auth.entity"
import IUser from "../../entities/user.entity"

export interface IAuthUsecase{
    userSignin(data:IAuth): Promise<string>
    userSigninGoogle(data:string): Promise<string>
    userSignup(data:IUser): Promise<IUser>
    forgotPassword(email: string): any
    verifyOtp(email: string, otp: string): Promise<string>
    sendOtpByEmail(email: string, subject: string): Promise<void>
    resetPassword(email: string): Promise<string>
    verifyResetPassword(email: string,otp: string, newpassword: string): Promise<string>
    logoutUser(): string
}

export interface IRegisterInput {
    username: string;
    email: string;
    password: string;
  } 