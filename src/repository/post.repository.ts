import IPost from "../entities/post.entity";
import { PostModel } from "../frameworks/models/post.model";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";

export class PostRepository implements IPostRepository {
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
                place:1,
                'user.username': 1,
                'user._id': 1
              }
            },
            {
                $sort:{
                    createdAt:1
                }
            }
          ]);
          
          console.log(posts);
          
    
        return posts
    }

}