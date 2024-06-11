import IFollow from "../entities/follow.entity";
import { FollowModel } from "../frameworks/models/follow.model";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";

export class FollowRepository implements IFollowRepository {
    async getFollowcount(userid: string): Promise<any> {
        try {
            const followingCount = await FollowModel.countDocuments({ follower_id: userid });
            const followersCount = await FollowModel.countDocuments({ following_id: userid });

            return {followingCount,followersCount}
        } catch (error) {
            throw error
        }
    }
    async isUserFollowing(userid: string, followingid: string): Promise<Boolean> {
   
        const following = await FollowModel.findOne({
            follower_id: userid,
            following_id: followingid
        })
        return !!following
    }
    async getFollower(userid: string): Promise<IFollow[]> {
        try {
            const followers = await FollowModel.find({ following_id: userid })
            return followers
        } catch (error) {
            throw error
        }

    }
    async getFollowing(userid: string): Promise<IFollow[]> {
        try {
            const following = await FollowModel.find({ follower_id: userid }).select('following_id');
            console.log(following);
            
            return following
        } catch (error) {
            throw error
        }

    }
    async addFollow(followerid: string, followingid: string): Promise<IFollow> {
        const newFollow = new FollowModel({
            follower_id: followerid,
            following_id: followingid
        })

        const saved = await newFollow.save()
        return saved
    }
    async deleteFollow(followerid: string, followingid: string): Promise<any> {
        try {
            const deleted = await FollowModel.findOneAndDelete({ follower_id: followerid, following_id: followingid });
            return deleted
        } catch (error) {
            throw error
        }

    }

}