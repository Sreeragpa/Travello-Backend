import mongoose from "mongoose";
import IPost from "../entities/post.entity";
import { PostModel } from "../frameworks/models/post.model";
import { PostLikeModel } from "../frameworks/models/postLikes.models";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";

export class PostRepository implements IPostRepository {
  async findPostByUser(userid: string): Promise<IPost[]> {
    try {
      const posts = await PostModel.find({creator_id:userid});
      return posts
    } catch (error) {
      throw error
    }
  }

  async isPostLikedByUser(userid: string, postid: string): Promise<Boolean> {

    const liked = await PostLikeModel.findOne({ post_id: postid, user_id: userid});
    
    return !!liked
  }
  async likePost(userid: string, postid: string): Promise<any> {
    try {
        const like = new PostLikeModel({
          post_id: postid, user_id: userid
        })
        await like.save()
  
        await PostModel.updateOne({_id:postid},{$inc:{likes:1}})
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
        await PostModel.updateOne({_id:postid},{$inc:{likes:-1}})
  
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
  async findAll(): Promise<IPost[]> {
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
          likes:1
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    console.log(posts);


    return posts
  }

  async findOne(postid: string): Promise<IPost[]> {
    console.log(postid);
    
    const posts = await PostModel.aggregate([
      {
        $match:{
          _id:new mongoose.Types.ObjectId(postid)
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
          likes:1
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    console.log(posts);


    return posts
  }

}