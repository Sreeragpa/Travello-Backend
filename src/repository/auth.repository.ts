import IAuth from "../entities/auth.entity";
import IUser from "../entities/user.entity";
import { IAuthRepository } from "../interfaces/repositories/IAuth.repository";
import { AuthModel } from "../frameworks/models/auth.model";
import { UserModel } from "../frameworks/models/user.model";
import { OtpModel } from "../frameworks/models/otp.model";
import { Document } from "mongoose";
import { ErrorCode } from "../enums/errorCodes.enum";
import bcrypt from 'bcrypt'

export class AuthRepository implements IAuthRepository {
    async findPassword(userid: string, password: string): Promise<string> {
        try {
            const user = await AuthModel.findOne({userid:userid});
            return user?.password!
        } catch (error) {         
            throw error 
        }
        
    }
    logout(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async verifyUserAccount(email: string): Promise<IAuth | null> {
        try {
            const updatedUser = await AuthModel.findOneAndUpdate(
                { email: email },
                { $set: { verified: true } },
                { new: true } // Return the modified document
            );
            if (updatedUser) {
                return updatedUser.toJSON() as IAuth;
            } else {
                return null;
            }
        } catch (error) {
            throw error
        }
    }
    async changePassword(email: string, password: string): Promise<string> {
        try {
            password = await bcrypt.hash(password,10)
            await AuthModel.findOneAndUpdate({ email: email }, { $set: { password: password } })
            return "Password Changed Successfully"
        } catch (error) {
            throw error
        }
    }
    async emailAuth(email: string): Promise<IAuth> {
        const user = await AuthModel.findOne({ email: email })
        if (!user) {
            throw new Error(ErrorCode.USER_NOT_FOUND);
        }
        // Return the user object
        return user.toJSON() as IAuth;
    }
    async checkUserVerified(email: string): Promise<Boolean> {
        const user = await AuthModel.findOne({ email: email });
        return user?.verified == true
    }
    async saveOtp(email: string, otp: string): Promise<string> {
        try {
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + 60000); // Adding 60 seconds
            const newOTP = new OtpModel({
                email: email,
                otp: otp,
                expiry: expiry
            })
            await newOTP.save();
            return otp
        } catch (error) {

            throw new Error("Error Saving OTP");
        }
    }
    async verifyOtp(email: string, otp: string): Promise<string> {
        try {
            // Find the OTP document

            const otpFound = await OtpModel.findOne({ email: email, otp: otp }).sort({ expiry: -1 });
            console.log(otpFound);
            
            if (!otpFound) {
                throw new Error("Invalid OTP"); // Throw an error if OTP not found
            }
            console.log(otpFound);
            if (!otpFound.expiry || otpFound.expiry < new Date) {
                throw new Error("OTP Expired");
            }
            return "OTP verified successfully";
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    }
    async checkUsernameExists(username: string): Promise<Boolean> {
        const user = await AuthModel.findOne({ username: username });
        return user !== null;
    }
    async checkEmailExists(email: string): Promise<Boolean> {
        const user = await AuthModel.findOne({ email: email });
        return user !== null;
    }

    async create(data: IUser,isGoogleAuth:boolean = false): Promise<IUser> {
        const user = new UserModel({
            email: data.email,
            username: data.username,
            name: data.username,
            bio:"New to Travello! ✈️ Exploring the world",
        })
        const newAuth = new AuthModel({
            email: data.email,
            username: data.username,
            password: data.password,
            userid:user._id,
            isGoogleAuth: isGoogleAuth
        })
        const saved = await user.save();
        const authsaved = await newAuth.save();
        const createdUser: IUser = user.toObject();
        return createdUser
    }
    async login(data: IAuth, token: string): Promise<string> {
        await AuthModel.updateOne({ email: data.email }, { $push: { token: token } });
        return token
    }

} 