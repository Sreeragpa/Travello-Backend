import mongoose from "mongoose";

const dbUrl: string | undefined = process.env.MONGO_URI;

if (!dbUrl) {
    console.error("MongoDB URI is not defined. Make sure to set the MONGO_URI environment variable.");
    process.exit(1); 
}


const connectDb = async()=>{
    try {
        if(dbUrl){
            const conn = await mongoose.connect(dbUrl,{dbName:"travello-app"});
            console.log(`MongoDB connected:${conn.connection.host}`);
        }
    } catch (error) {
        console.log(error);
        setTimeout(connectDb, 5000);
    }
}

export default connectDb;