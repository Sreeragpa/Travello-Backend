import IUser from "../entities/user.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { IAuthRepository } from "../interfaces/repositories/IAuth.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUserUsecase } from "../interfaces/usecase/IUser.usecase";
import bcrypt from "bcrypt";

export class UserUsecase implements IUserUsecase {
    private userRepository: IUserRepository
    private authRepository: IAuthRepository
    private cloudinaryService: CloudinaryService
    constructor(userRepository: IUserRepository, authRepository: IAuthRepository, cloudinaryService: CloudinaryService) {
        this.userRepository = userRepository
        this.cloudinaryService = cloudinaryService
        this.authRepository = authRepository
    }
    async updateUserProfile(userid:string, updatefields: any): Promise<IUser> {
        try {
            if(updatefields.username){
                updatefields.username = updatefields.username.toLowerCase();
                const isUsernameExists = await this.authRepository.checkUsernameExists(updatefields.username);
                if (isUsernameExists) {
                    throw new Error(ErrorCode.USERNAME_ALREADY_EXISTS)
                }
            }
            const user = await this.userRepository.updateUser(userid,updatefields);
            return user
        } catch (error) {
            throw error
        }
    }
    async updatePassword(userid: string, oldPassword: string, newPassword: string): Promise<any> {
        try {
            newPassword = await bcrypt.hash(newPassword,10)
            const password = await this.authRepository.findPassword(userid, oldPassword);
            
            const isPasswordValid = await bcrypt.compare(oldPassword,password);        
            
            if (!isPasswordValid) {
                throw new Error(ErrorCode.INCORRECT_PASSWORD);
            }
            const user = await this.userRepository.updatePassword(userid,newPassword);
            return "Password Updated Successfully"
        } catch (error) {
            throw error
        }

    }
    async getUser(userid: string): Promise<IUser> {
        try {
            const user = await this.userRepository.getUserById(userid);
            return user
        } catch (error) {
            throw error
        }
    }
    async updateUserProfilePic(userid: string, img: string): Promise<IUser> {
        try {
            const uploadedImage = await this.cloudinaryService.uploadImage(img);

            const user = await this.userRepository.addProfilePicture(userid, uploadedImage)
            return user
        } catch (error) {
            throw error
        }
    }
    getUserPofile(username: string): IUser {
        throw new Error("Method not implemented.");
    }


}