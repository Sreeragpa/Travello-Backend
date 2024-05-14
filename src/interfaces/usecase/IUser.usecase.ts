import IUser from "../../entities/user.entity";

export interface IUserUsecase{
    getUserPofile(username: string): IUser
    updateUserProfile(id: string): IUser
}

