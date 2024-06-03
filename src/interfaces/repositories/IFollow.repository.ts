import IFollow from "../../entities/follow.entity"

export interface IFollowRepository{
    addFollow(followerid: string, followingid: string): Promise<IFollow>
    deleteFollow(followerid: string, followingid: string): Promise<IFollow>
    getFollower(userid: string): Promise<IFollow[]>
    getFollowing(userid: string): Promise<IFollow[]>
    isUserFollowing(userid: string, followingid: string): Promise<Boolean>
    getFollowcount(userid: string): Promise<any>
}