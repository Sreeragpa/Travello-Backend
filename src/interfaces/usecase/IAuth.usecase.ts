import IAuth from "../../entities/auth.entity"
import IUser from "../../entities/user.entity"

export interface IAuthUsecase{
    userSignin(data:IAuth): Promise<{accessToken: string,refreshToken:string}>
    userSigninGoogle(data:string): Promise<{accessToken: string,refreshToken:string}>
    userSignup(data:IUser): Promise<IUser>
    forgotPassword(email: string): any
    verifyOtp(email: string, otp: string): Promise<string>
    sendOtpByEmail(email: string, subject: string): Promise<void>
    resetPassword(email: string): Promise<string>
    verifyResetPassword(email: string,otp: string, newpassword: string): Promise<string>
    logoutUser(): string
    getAuth(email: string): Promise<IAuth>
}

export interface IRegisterInput {
    username: string;
    email: string;
    password: string;
  } 