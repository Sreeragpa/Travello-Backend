import mongoose from "mongoose";
import { ITrip } from "../../entities/trip.entity";

const tripSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    creator_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:"Users"
    },
    startingPoint: {
      name: {
        type: String,
        required: true
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
    },
    destination: {
      name: {
        type: String,
        required: true
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
    },  
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    members: {
      type: [mongoose.Types.ObjectId],
      required: true
    },
    memberlimit:{
        type: Number
    },
    conversation_id:{
      type: mongoose.Types.ObjectId
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: String
  },{timestamps:true});
  
  // Indexes
  tripSchema.index({ "startingPoint.coordinates": "2dsphere" });
  tripSchema.index({ "destination.coordinates": "2dsphere" });
  tripSchema.index({ title: "text" });
  tripSchema.index({ description: "text" });
  tripSchema.index({ "startingPoint.name": "text" });
  tripSchema.index({ "destination.name": "text" });
  

  export const TripModel = mongoose.model<ITrip>("trips",tripSchema)