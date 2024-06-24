import IFollow, { IFollowingSearch } from "../../entities/follow.entity"
import IUser from "../../entities/user.entity"

export interface IFollowUsecase{
    follow(followerid:string,followingid: string): Promise<IFollow>
    unfollow(followerid:string,followingid: string): Promise<IFollow>
    getFollowersCount(userid: string): Promise<any>
    getFollowings(searchData: IFollowingSearch): Promise<IUser[]>
}