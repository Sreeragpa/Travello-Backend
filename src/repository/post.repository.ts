import mongoose from "mongoose";
import IPost, {  ISave } from "../entities/post.entity";
import { PostModel } from "../frameworks/models/post.model";
import { PostLikeModel } from "../frameworks/models/postLikes.models";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { SaveModel } from "../frameworks/models/saves.model";
import { Model } from "mongoose";
import { ILikedUser } from "../interfaces/repositories/IUser.repository";
import { IStatisticsData } from "../entities/admin.entity";

export class PostRepository implements IPostRepository {
  async getPostCountByDate(days: number): Promise<IStatisticsData[]> {
    let matchStage = {};

    if (days === 0) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      matchStage = {
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      };
    } else {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      matchStage = {
        createdAt: { $gte: startDate }
      };
    }

    const data = await PostModel.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log(data);
    return data
    

  }
  async count(userid: string): Promise<number> {
    try {
      const postCount = await PostModel.countDocuments({creator_id:userid}) 
      return postCount
    } catch (error) {
      throw error
    }

  }
  async findSavedPost(userid: string): Promise<ISave[] | null> {
    try {
      const savedPosts = await SaveModel.find({ user_id: userid }).populate('post_id');


      return savedPosts
    } catch (error) {
      throw error
    }

  }
  async findSave(userid: string, postid: string): Promise<ISave | null> {
    try {
      const saved = await SaveModel.findOne({ user_id: userid, post_id: postid })

      return saved
    } catch (error) {
      throw error
    }
  }
  async savePost(userid: string, postid: string): Promise<ISave> {
    try {
      const newSave = new SaveModel({
        user_id: userid,
        post_id: postid
      })
      const saved = await newSave.save();
      return saved
    } catch (error) {
      throw error
    }
  }
  async unSavePost(userid: string, postid: string): Promise<ISave | null> {
    try {
      const unsavedPost = await SaveModel.findOneAndDelete({ user_id: userid, post_id: postid })
      return unsavedPost
    } catch (error) {
      throw error
    }
  }
  async findPostByUser(userid: string): Promise<IPost[]> {
    try {
      const posts = await PostModel.find({ creator_id: userid }).sort({ createdAt: -1 });
      return posts
    } catch (error) {
      throw error
    }
  }

  async isPostLikedByUser(userid: string, postid: string): Promise<Boolean> {

    const liked = await PostLikeModel.findOne({ post_id: postid, user_id: userid });

    return !!liked
  }
  async likePost(userid: string, postid: string): Promise<any> {
    try {
      const like = new PostLikeModel({
        post_id: postid, user_id: userid
      })
      await like.save()

      await PostModel.updateOne({ _id: postid }, { $inc: { likes: 1 } })
      return like

    } catch (error) {
      throw error
    }
  }
  async unlikePost(userid: string, postid: string): Promise<any> {
    try {

      const dislike = await PostLikeModel.findOneAndDelete({
        post_id: postid, user_id: userid
      })
      await PostModel.updateOne({ _id: postid }, { $inc: { likes: -1 } })

      return dislike


    } catch (error) {
      throw error
    }
  }
  async create(data: IPost): Promise<IPost> {
    try {
      const post = new PostModel({
        creator_id: data.creator_id,
        trip_id: data.trip_id,
        caption: data.caption,
        images: data.images,
        location: data.location,
        place: data.place
      })

      const saved = await post.save();
      return saved;
    } catch (error) {
      throw error
    }

  }
  update(id: string, data: Partial<IPost>): Promise<IPost | null> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<IPost | null> {
    throw new Error("Method not implemented.");
  }
  async findAll(page: number,limit: number): Promise<IPost[]> {
    const skip = (page - 1) * limit;
    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: 'users', // Collection name of the user model
          localField: 'creator_id', // Field in the post model
          foreignField: '_id', // Field in the user model
          as: 'user' // Output array field
        }
      },
      {
        $unwind: '$user' // Unwind the array to get individual user objects
      },
      {
        $project: {
          _id: 1,
          creator_id: 1,
          trip_id: 1,
          caption: 1,
          location: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          place: 1,
          'user.username': 1,
          'user._id': 1,
          'user.profileimg': 1,
          'user.isPremium': 1,
          likes: 1
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);


    return posts
  }

  async findOne(postid: string): Promise<IPost[]> {


    const posts = await PostModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postid)
        }
      },
      {
        $lookup: {
          from: 'users', // Collection name of the user model
          localField: 'creator_id', // Field in the post model
          foreignField: '_id', // Field in the user model
          as: 'user' // Output array field
        }
      },
      {
        $unwind: '$user' // Unwind the array to get individual user objects
      },
      {
        $project: {
          _id: 1,
          creator_id: 1,
          trip_id: 1,
          caption: 1,
          location: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          place: 1,
          'user.username': 1,
          'user._id': 1,
          'user.profileimg': 1,
          'user.isPremium': 1,
          likes: 1
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);




    return posts
  }

  async getlikedUsers(userid: string,postid: string): Promise<ILikedUser[]> {
    // await PostLikeModel.find({ post_id: postid }).populate("user_id");
    let likedUsers = await PostLikeModel.aggregate([
      {
        $match: { post_id: new mongoose.Types.ObjectId(postid) }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "likedUser"
        }
      },
      {
        $unwind: "$likedUser"
      },
      {
        $lookup: {
          from: "follows",
          let: { likedUserId: "$likedUser._id", currentUserId: new mongoose.Types.ObjectId(userid) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$following_id", "$$likedUserId" ] },
                    { $eq: ["$follower_id","$$currentUserId" ] }
                  ]
                }
              }
            }
          ],
          as: "followingStatus"
        }
      },
      {
        $addFields: {
          "likedUser.isFollowing": { $gt: [{ $size: "$followingStatus" }, 0] }
        }
      },
      {
        $lookup: {
          from: "follows",
          let: { likedUserId: "$likedUser._id", currentUserId: new mongoose.Types.ObjectId(userid) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$follower_id", "$$likedUserId" ] },
                    { $eq: ["$following_id", "$$currentUserId" ] }
                  ]
                }
              }
            }
          ],
          as: "followedStatus"
        }
      },
      {
        $addFields: {
          "likedUser.isMutualFollow": {
            $cond: {
              if: { $and: [{ $gt: [{ $size: "$followedStatus" }, 0] }, "$likedUser.isFollowing"] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          "likedUser._id": 1,
          "likedUser.username": 1,
          // "likedUser.isFollowing": 1,
          "likedUser.isMutualFollow": 1,
          "likedUser.profileimg": 1,
          'likedUser.isPremium': 1,
        }
      }
    ]);

    likedUsers = likedUsers.map(user => user.likedUser)

    return likedUsers as ILikedUser[]

  }

}