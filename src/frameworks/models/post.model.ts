import mongoose, { Schema, Document } from 'mongoose';
import IPost from '../../entities/post.entity';

// Define the schema for the post
const PostSchema: Schema = new Schema({
    creator_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    trip_id: {
        type: mongoose.Types.ObjectId
    },
    caption: {
        type: String,
    },
    images:[{
        type:String,
        required:true
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    place:{
        type: String
    },
    likes:{
        type: Number,
        default: 0
    }
},{timestamps:true});

// Create a 2dsphere index on the location field to support geospatial queries
PostSchema.index({ location: '2dsphere' });


export const PostModel = mongoose.model<IPost>('Post', PostSchema);

