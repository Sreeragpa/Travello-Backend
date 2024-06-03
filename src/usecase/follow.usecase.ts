import IFollow from "../entities/follow.entity";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";
import { IFollowUsecase } from "../interfaces/usecase/IFollow.usecase";

export class FollowUsecase implements IFollowUsecase{
    private followRepository: IFollowRepository
    constructor(followRepository: IFollowRepository){
        this.followRepository = followRepository
    }
    async getFollowersCount(userid: string): Promise<any> {
        try {
            const result = await this.followRepository.getFollowcount(userid);
            return result
        } catch (error) {
            throw error
        }
    }

    async follow(followerid: string, followingid: string): Promise<IFollow> {
        try {
            const result = await this.followRepository.addFollow(followerid,followingid);
            return result
        } catch (error) {
            throw error
        }
    }
    async unfollow(followerid: string, followingid: string): Promise<IFollow> {
        try {
            const deleted = await this.followRepository.deleteFollow(followerid,followingid);
            return deleted
        } catch (error) {
            throw error
        }
    }

}