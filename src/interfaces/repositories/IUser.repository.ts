import IUser from "../../entities/user.entity";
import { IUserData } from "../../repository/user.repository";

export interface IUserRepository{
    addProfilePicture(userid: string, img: string): Promise<IUser>
    getUserById(userid: string): Promise<IUser| null>
    updateUser(userid: string,updatefields: any): Promise<IUser>
    updatePassword(userid: string, password: string): Promise<string>
    searchUser(searchKey: string): Promise<IUser[]>
}   

export interface ILikedUser{
    _id:string,
    username: string,
    isMutualFollow: boolean,
}