import IFollow, { IFollowingSearch } from "../entities/follow.entity";
import { INotification } from "../entities/notification.entity";
import IUser from "../entities/user.entity";
import { NOTIFICATION_TYPE } from "../enums/notification.enums";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { IFollowUsecase } from "../interfaces/usecase/IFollow.usecase";
import { INotificationUsecase } from "../interfaces/usecase/INotification.usecase";

export class FollowUsecase implements IFollowUsecase{
    private followRepository: IFollowRepository
    private notificationUsecase: INotificationUsecase

    constructor(followRepository: IFollowRepository,notificationUsecase: INotificationUsecase){
        this.followRepository = followRepository
        this.notificationUsecase = notificationUsecase
    }
    async getFollowings(searchData: IFollowingSearch): Promise<IUser[]> {
        try {
            const users = this.followRepository.getFollowingUsers(searchData);
            return users
        } catch (error) {
            throw error
        }
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
            const notification: INotification = {
                sender: result.follower_id,
                recipient: result.following_id,
                type: NOTIFICATION_TYPE.FOLLOW
            }
            await this.notificationUsecase.createNotification(notification)
            
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