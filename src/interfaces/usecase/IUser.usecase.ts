import IUser from "../../entities/user.entity";

export interface IUserUsecase{
    getUserPofile(username: string): IUser
    updateUserProfile(id: string): IUser
}

export interface IJwtPayload{
    id: string,
    user_id: string
}

