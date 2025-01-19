import { Document } from "mongoose";
import IUser from "../entities/user.entity";
import { UserModel } from "../frameworks/models/user.model";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { AuthModel } from "../frameworks/models/auth.model";
import { ErrorCode } from "../enums/errorCodes.enum";
import { IStatisticsData } from "../entities/admin.entity";
export interface IUserData extends Document{}

export class UserRepository implements IUserRepository{
    async getUsername(userid: string): Promise<{ username: string; }> {
     try {
      const user = await UserModel.findOne({ _id: userid }, { username: 1 });
      if (!user) {
        throw new Error(`User with id ${userid} not found.`);
      }
      return { username: user.username };
     } catch (error) {
      throw error
     }
    }

    async blockUser(userid: string): Promise<IUser> {
      const user = await UserModel.findOneAndUpdate({_id: userid},{$set:{isBlocked: true}});
      if (!user) {
        throw new Error(`User with id ${userid} not found.`);
      }
      return user
    }
    async unBlockUser(userid: string): Promise<IUser> {
      const user = await UserModel.findOneAndUpdate({_id: userid},{$set:{isBlocked: false}});
      if (!user) {
        throw new Error(`User with id ${userid} not found.`);
      }
      return user
    }
    async getAllUser(): Promise<IUser[]> {
      const users = await UserModel.find();
      return users
    }
    async getUserCountByDate(days: number): Promise<IStatisticsData[]> {
      let matchStage = {};

      if (days === 0) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
  
        matchStage = {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        };
      } else {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
  
        matchStage = {
          createdAt: { $gte: startDate }
        };
      }
  
      const data = await UserModel.aggregate([
        {
          $match: matchStage
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      console.log(data);
      return data
    }
    async searchUser(searchKey: string): Promise<IUser[]> {
      const regex = new RegExp(searchKey, 'i');
      const users = await UserModel.find({$or:[
        {username:{$regex:regex}},
        {name:{$regex:regex}}
      ]})
      return users
    }

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
    async getUserById(userid: string): Promise<IUser | null> {
      try {
        const user = await UserModel.findById(userid)

        
        return user 
      } catch (error) {
        throw error
      }
    }
    async addProfilePicture(userid: string ,img: string): Promise<IUser | null> {
      try {
        const user = await UserModel.findOneAndUpdate({_id:userid},{$set:{profileimg:img}},{new: true})
        return user
        
      } catch (error) {
        throw error
      }
    }
    
}