import mongoose, { Types } from "mongoose";
import { IEditTrip, ITrip } from "../entities/trip.entity";
import { TripModel } from "../frameworks/models/trip.model";
import { ITripRepository, IUserLocation } from "../interfaces/repositories/ITrip.repository";
import { IStatisticsData } from "../entities/admin.entity";

export class TripRepository implements ITripRepository {
  async getTripsCountByDate(days: number): Promise<IStatisticsData[]> {
    let matchStage = {};

    if (days === 0) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      matchStage = {
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      };
    } else {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      matchStage = {
        createdAt: { $gte: startDate }
      };
    }

    const data = await TripModel.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log(data);
    return data
    
  }
  async addConversationIdtoTrip(tripid: string ,conversationid: string): Promise<ITrip> {
    const updatedTrip = await TripModel.findOneAndUpdate(
      { _id: tripid },
      { $set: { conversation_id: new mongoose.Types.ObjectId(conversationid) } },
      { new: true }
    )
    if(!updatedTrip){
      throw new Error("Trip Not Found");
    }
    return updatedTrip
  }
  async searchTrip(searchKey: string): Promise<ITrip[]> {
    const searchRegex = new RegExp(searchKey, 'i');
    // const trips = await TripModel.find({ $text: { $search: searchKey } });
    const trips = await TripModel.find({
      $or: [
        { title: { $regex: searchRegex } },
        { "destination.name": { $regex: searchRegex } },
        { "startingPoint.name": { $regex: searchRegex } }
      ]
    })
    return trips
  }
  async findOneandUpdate(userid: string, tripid: string,updateFields: Partial<IEditTrip>): Promise<ITrip | null> {
    const updatedTrip = await TripModel.findOneAndUpdate({_id:tripid,creator_id:userid},{$set:updateFields},{new:true});
    return updatedTrip
  }
  async findNearbyTrips(userid: string,userLocation: IUserLocation, maxDistance: number,page: number,limit: number): Promise<ITrip[]> {
    const skip = (page-1) * limit
    try {
      const trips = await TripModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: userLocation // [longitude, latitude]
            },
            distanceField: 'distance',
            maxDistance: maxDistance, // Maximum distance in meters
            spherical: true,
            key: 'startingPoint.coordinates'
          }
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
          $sort: { distance: 1 }
        },
        {
          $skip:skip
        },
        {
          $limit:limit
        }
        
      ] as any); //
      
      return trips
    } catch (error) {
      throw error
    }
  }
  async findTripById(userid: string,tripid: string): Promise<ITrip[]> {
    try {
      // const trip = await TripModel.find({ _id: tripid });
      const trip = await TripModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(tripid) },
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
      
      return trip;
    } catch (error) {
      throw error;
    }
  }
  async findUserTrips(userid: string): Promise<ITrip[]> {
    try {
      const userTrips = await TripModel.find({ creator_id: userid });
      return userTrips;
    } catch (error) {
      throw error;
    }
  }
  async count(userid: string): Promise<number> {
    const tripCount = await TripModel.countDocuments({ creator_id: userid });
    return tripCount;
  }
  async isTripFull(tripId: string): Promise<boolean> {
    const trip = await TripModel.findById(tripId)
      .select("members memberlimit")
      .lean();
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip.members.length >= trip.memberlimit;
  }
  async addMember(memberid: string, tripid: string): Promise<ITrip> {
    try {
      const updatedTrip = await TripModel.findOneAndUpdate(
        { _id: tripid },
        { $addToSet: { members: new mongoose.Types.ObjectId(memberid) } },
        { new: true }
        
    )
    if (!updatedTrip) {
      throw new Error("Trip not found.");
    }
      return updatedTrip 
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
    creator_id: mongoose.Types.ObjectId[],
    page: number,limit: number
  ): Promise<ITrip[]> {
    //  await TripModel.find({ creator_id: { $in: creator_id } }).populate("creator_id")

    const skip = (page-1) * limit

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
      {
        $skip:skip
      },
      {
        $limit:limit
      }
    ]);

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
              data.startingPoint.coordinates.longitude,  // Corrected order
              data.startingPoint.coordinates.latitude,
            ],
          },
        },
        destination: {
          name: data.destination.name,
          coordinates: {
            type: "Point",
            coordinates: [
              data.destination.coordinates.longitude,  // Corrected order
              data.destination.coordinates.latitude,
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
