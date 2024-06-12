import mongoose, { Types } from "mongoose";
import { ITrip } from "../entities/trip.entity";
import { TripModel } from "../frameworks/models/trip.model";
import { ITripRepository } from "../interfaces/repositories/ITrip.repository";

export class TripRepository implements ITripRepository {
  async isTripFull(tripId: string): Promise<boolean> {
    const trip = await TripModel.findById(tripId)
      .select("members memberlimit")
      .lean();
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip.members.length >= trip.memberlimit;
  }
  async addMember(memberid: string, tripid: string): Promise<boolean> {
    try {
      const result = await TripModel.updateOne(
        { _id: tripid },
        { $addToSet: { members: new mongoose.Types.ObjectId(memberid) } }
      );
      return result ? true : false;
    } catch (error) {
      throw error;
    }
  }
  async hasUserJoinedTrip(userId: string, tripId: string): Promise<boolean> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const trip = await TripModel.findOne({
        _id: tripId,
        members: { $elemMatch: { $eq: userObjectId } },
      }).select("_id");

      return trip !== null;
    } catch (error) {
      throw error;
    }
  }
  async findTripsbyCreatorid(
    userid: string,
    creator_id: mongoose.Types.ObjectId[]
  ): Promise<ITrip[]> {
    //  await TripModel.find({ creator_id: { $in: creator_id } }).populate("creator_id")
    console.log(userid);

    const trips = await TripModel.aggregate([
      {
        $match: { creator_id: { $in: creator_id } },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator_id",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: "$creator",
      },
      // Lookup to check if the current user follows the trip creator
      {
        $lookup: {
          from: "follows", 
          let: {
            creatorId: "$creator_id",
            currentUserId: new mongoose.Types.ObjectId(userid),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$follower_id", "$$currentUserId"] },
                    { $eq: ["$following_id", "$$creatorId"] },
                  ],
                },
              },
            },
          ],
          as: "followingInfo",
        },
      },
      // adding field for knwing the trip is posted by the same user
      {
        $addFields: {
          issameuser: {
            $cond: {
              if: { $eq: ["$creator_id", new mongoose.Types.ObjectId(userid)] },
              then: true,
              else: false,
            },
          },
          isuserjoined: {
            $in: [new mongoose.Types.ObjectId(userid), "$members"],
          },
          istripfull: {
            $cond: {
              if: { $gte: [{ $size: "$members" }, "$memberlimit"] },
              then: true,
              else: false,
            },
          },
          isuserfollowing: {
            $gt: [{ $size: "$followingInfo" }, 0], // Check if followingInfo array has elements
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    console.log(trips);
    

    return trips;
  }
  async create(data: ITrip): Promise<ITrip> {
    try {
      const newTrip = new TripModel({
        creator_id: data.creator_id,
        title: data.title,
        startingPoint: {
          name: data.startingPoint.name,
          coordinates: {
            type: "Point",
            coordinates: [
              data.startingPoint.coordinates.latitude,
              data.startingPoint.coordinates.longitude,
            ],
          },
        },
        destination: {
          name: data.destination.name,
          coordinates: {
            type: "Point",
            coordinates: [
              data.destination.coordinates.latitude,
              data.destination.coordinates.longitude,
            ],
          },
        },
        startDate: data.startDate,
        endDate: data.endDate,
        memberlimit: data.memberlimit,
        description: data.description,
        imageUrl: data.imageUrl,
        members: data.members,
      });

      const savedTrip = await newTrip.save();
      return savedTrip;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating trip: ${error.message}`);
      } else {
        throw new Error("Error creating trip: Unknown error");
      }
    }
  }
}
