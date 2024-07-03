import mongoose from "mongoose";
import { IAdmin } from "../../entities/admin.entity";

const adminCred = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type: String
    }
});

export const adminModel = mongoose.model<IAdmin>("admins",adminCred)