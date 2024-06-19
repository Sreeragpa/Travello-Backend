import { Document } from "mongoose";
import IUser from "../entities/user.entity";
import { UserModel } from "../frameworks/models/user.model";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { AuthModel } from "../frameworks/models/auth.model";
import { ErrorCode } from "../enums/errorCodes.enum";
export interface IUserData extends Document{}

export class UserRepository implements IUserRepository{

    async updateUser(userid: string, updatefields: any): Promise<any> {
      try {
        
        const user = await UserModel.findOneAndUpdate({_id:userid},{$set:updatefields},{new: true});
        return user
      } catch (error) {
        throw error
      }

    }
    async updatePassword(userid: string, password: string): Promise<string> {
      try {
        const user = await AuthModel.findOneAndUpdate({userid:userid},{$set:{password:password}},{new:true});
    
        
        if(user){
          return "Password Changed Successfully"
        }else{
          throw new Error(ErrorCode.USER_NOT_FOUND)
        }
        
      } catch (error) {
        throw error
      }
    
    }
    async getUserById(userid: string): Promise<any> {
      try {
        const user = await UserModel.findById(userid)

        
        return user 
      } catch (error) {
        throw error
      }
    }
    async addProfilePicture(userid: string ,img: string): Promise<any> {
      try {
        const user = await UserModel.findOneAndUpdate({_id:userid},{$set:{profileimg:img}},{new: true})
        return user
        
      } catch (error) {
        throw error
      }
    }
    
}