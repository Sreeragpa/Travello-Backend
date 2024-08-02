import mongoose from "mongoose";
import IAuth from "../../entities/auth.entity";

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
    },
    isGoogleAuth:{
        type:Boolean,
        default:false
    }
   
})

export const AuthModel = mongoose.model<IAuth>("Auth",AuthSchema)