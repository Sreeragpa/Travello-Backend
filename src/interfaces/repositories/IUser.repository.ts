import { IStatisticsData } from "../../entities/admin.entity";
import IUser from "../../entities/user.entity";
import { IUserData } from "../../repository/user.repository";

export interface IUserRepository{
    getUserCountByDate(days: number): Promise<IStatisticsData[]>
    addProfilePicture(userid: string, img: string): Promise<IUser | null>
    getUserById(userid: string): Promise<IUser| null>
    updateUser(userid: string,updatefields: any): Promise<IUser>
    updatePassword(userid: string, password: string): Promise<string>
    searchUser(searchKey: string): Promise<IUser[]>
    getAllUser(): Promise<IUser[]>
    blockUser(userid: string): Promise<IUser>
    unBlockUser(userid: string): Promise<IUser>
    getUsername(userid: string): Promise<{username: string}>
}   

export interface ILikedUser{
    _id:string,
    username: string,
    isMutualFollow: boolean,
}