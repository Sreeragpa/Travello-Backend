import mongoose from "mongoose";
import IUser from "../../entities/user.entity";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    hosted_trips:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    joined_trips:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    chats:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    profileimg:{
        type: String,
        default:""
    },
    bio:{
        type: String,
        default:"New to Travello"
    },
    isBlocked:{
        type: Boolean,
        default: false
    }
},{timestamps:true})

export const UserModel = mongoose.model<IUser>("Users",UserSchema);