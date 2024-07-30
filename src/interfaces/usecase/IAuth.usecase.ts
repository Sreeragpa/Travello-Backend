import IAuth from "../../entities/auth.entity"
import IUser from "../../entities/user.entity"

export interface IAuthUsecase{
    userSignin(data:IAuth): any
    userSigninGoogle(data:string): any
    userSignup(data:IUser): any
    forgotPassword(email: string): any
    verifyOtp(email: string, otp: string): any
    sendOtpByEmail(email: string, subject: string): any
    resetPassword(email: string): any
    verifyResetPassword(email: string,otp: string, newpassword: string): any
    logoutUser(): string
}

export interface IRegisterInput {
    username: string;
    email: string;
    password: string;
  } 