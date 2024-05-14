import { Document } from "mongoose";
import IAuth from "../../entities/auth.entity";
import IUser from "../../entities/user.entity";

export interface IAuthRepository{
    create(data: IUser): Promise<IUser>
    login(data: IAuth,token: string): Promise<string>
    checkEmailExists(email: string): Promise<Boolean>
    checkUsernameExists(username: string): Promise<Boolean>
    checkUserVerified(email: string): Promise<Boolean>
    saveOtp(email: string, otp: string):Promise<string>
    verifyOtp(email: string,otp: string): Promise<string>
    emailAuth(email: string): Promise<IAuth>
    changePassword(email: string,password: string): Promise<string>
    verifyUserAccount(email: string): Promise<IAuth | null>
}