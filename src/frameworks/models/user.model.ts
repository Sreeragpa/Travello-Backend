import mongoose from "mongoose";

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
    }]
})

export const UserModel = mongoose.model("Users",UserSchema);