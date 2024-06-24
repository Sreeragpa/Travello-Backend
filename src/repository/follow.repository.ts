import mongoose from "mongoose";
import IFollow, { IFollowingSearch } from "../entities/follow.entity";
import IUser from "../entities/user.entity";
import { FollowModel } from "../frameworks/models/follow.model";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";

export class FollowRepository implements IFollowRepository {
    async getFollowingUsers(searchData: IFollowingSearch): Promise<IUser[]> {
        try {
            const matchStage = {
                $match: {
                    follower_id: new mongoose.Types.ObjectId(searchData.follower_id)
                }
            };

            const lookupStage = {
                $lookup: {
                    from: 'users',
                    localField: 'following_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            };

            const unwindStage = {
                $unwind: "$userDetails"
            };

            const pipeline: any[] = [matchStage, lookupStage, unwindStage];
            const searchKeyword = searchData.searchKeyword;
            // Add a match stage for the search keyword if it is provided
            if (searchKeyword) {
                const searchMatchStage = {
                    $match: {
                        $or: [
                            { "userDetails.username": { $regex: searchKeyword, $options: 'i' } },
                            { "userDetails.email": { $regex: searchKeyword, $options: 'i' } },

                        ]
                    }
                };
                pipeline.push(searchMatchStage);
            }

            const users = await FollowModel.aggregate(pipeline);
            const userDetails = users.map((user) => user.userDetails);

            return userDetails
        } catch (error) {
            throw error
        }


    }
    async getFollowcount(userid: string): Promise<any> {
        try {
            const followingCount = await FollowModel.countDocuments({ follower_id: userid });
            const followersCount = await FollowModel.countDocuments({ following_id: userid });

            return { followingCount, followersCount }
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