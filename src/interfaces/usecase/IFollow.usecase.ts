import IFollow from "../../entities/follow.entity"

export interface IFollowUsecase{
    follow(followerid:string,followingid: string): Promise<IFollow>
    unfollow(followerid:string,followingid: string): Promise<IFollow>
    getFollowersCount(userid: string): Promise<any>
}