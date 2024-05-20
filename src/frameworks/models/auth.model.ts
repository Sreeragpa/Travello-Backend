import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique:true
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    verified:{
        type:Boolean,
        default:false
    },
    token:[{
        type:String,
    }],
    userid:{
        type: mongoose.Types.ObjectId
    }
   
})

export const AuthModel = mongoose.model("Auth",AuthSchema)