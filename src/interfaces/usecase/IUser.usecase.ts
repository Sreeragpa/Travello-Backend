import IUser from "../../entities/user.entity";

export interface IUserUsecase{
    getUserPofile(username: string): IUser
    updateUserProfilePic(userid: string, img: string): Promise<IUser>
    getUser(userid: string,currentUser: string): Promise<IUser>
    updateUserProfile(userid: string, updatefields: any): Promise<IUser>
    updatePassword(userid: string, oldPassword: string,newPassword: string): Promise<IUser>
    searchUser(userid: string,searchKey: string): Promise<IUser[]>
}





export interface IJwtPayload{
    id: string,
    user_id: string
}

