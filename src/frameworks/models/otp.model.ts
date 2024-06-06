import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type:String,
        required:true
    },
    expiry:{
        type:Date,
        expires:0
    }
},{timestamps:true});
// OtpSchema.index({expiry:1},{ expireAfterSeconds: 0 })
OtpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = mongoose.model("Otp",OtpSchema)