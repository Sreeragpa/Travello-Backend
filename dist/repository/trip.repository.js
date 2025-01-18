"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const trip_model_1 = require("../frameworks/models/trip.model");
class TripRepository {
    getTripsCountByDate(days) {
        return __awaiter(this, void 0, void 0, function* () {
            let matchStage = {};
            if (days === 0) {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                matchStage = {
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                };
            }
            else {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - days);
                matchStage = {
                    createdAt: { $gte: startDate }
                };
            }
            const data = yield trip_model_1.TripModel.aggregate([
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
            return data;
        });
    }
    addConversationIdtoTrip(tripid, conversationid) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTrip = yield trip_model_1.TripModel.findOneAndUpdate({ _id: tripid }, { $set: { conversation_id: new mongoose_1.default.Types.ObjectId(conversationid) } }, { new: true });
            if (!updatedTrip) {
                throw new Error("Trip Not Found");
            }
            return updatedTrip;
        });
    }
    searchTrip(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRegex = new RegExp(searchKey, 'i');
            // const trips = await TripModel.find({ $text: { $search: searchKey } });
            const trips = yield trip_model_1.TripModel.find({
                $or: [
                    { title: { $regex: searchRegex } },
                    { "destination.name": { $regex: searchRegex } },
                    { "startingPoint.name": { $regex: searchRegex } }
                ]
            });
            return trips;
        });
    }
    findOneandUpdate(userid, tripid, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTrip = yield trip_model_1.TripModel.findOneAndUpdate({ _id: tripid, creator_id: userid }, { $set: updateFields }, { new: true });
            return updatedTrip;
        });
    }
    findNearbyTrips(userid, userLocation, maxDistance, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            try {
                const trips = yield trip_model_1.TripModel.aggregate([
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
                                currentUserId: new mongoose_1.default.Types.ObjectId(userid),
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
                                    if: { $eq: ["$creator_id", new mongoose_1.default.Types.ObjectId(userid)] },
                                    then: true,
                                    else: false,
                                },
                            },
                            isuserjoined: {
                                $in: [new mongoose_1.default.Types.ObjectId(userid), "$members"],
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
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ]); //
                return trips;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findTripById(userid, tripid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const trip = await TripModel.find({ _id: tripid });
                const trip = yield trip_model_1.TripModel.aggregate([
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(tripid) },
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
                                currentUserId: new mongoose_1.default.Types.ObjectId(userid),
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
                                    if: { $eq: ["$creator_id", new mongoose_1.default.Types.ObjectId(userid)] },
                                    then: true,
                                    else: false,
                                },
                            },
                            isuserjoined: {
                                $in: [new mongoose_1.default.Types.ObjectId(userid), "$members"],
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUserTrips(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTrips = yield trip_model_1.TripModel.find({ creator_id: userid });
                return userTrips;
            }
            catch (error) {
                throw error;
            }
        });
    }
    count(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripCount = yield trip_model_1.TripModel.countDocuments({ creator_id: userid });
            return tripCount;
        });
    }
    isTripFull(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield trip_model_1.TripModel.findById(tripId)
                .select("members memberlimit")
                .lean();
            if (!trip) {
                throw new Error("Trip not found");
            }
            return trip.members.length >= trip.memberlimit;
        });
    }
    addMember(memberid, tripid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTrip = yield trip_model_1.TripModel.findOneAndUpdate({ _id: tripid }, { $addToSet: { members: new mongoose_1.default.Types.ObjectId(memberid) } }, { new: true });
                if (!updatedTrip) {
                    throw new Error("Trip not found.");
                }
                return updatedTrip;
            }
            catch (error) {
                throw error;
            }
        });
    }
    hasUserJoinedTrip(userId, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const trip = yield trip_model_1.TripModel.findOne({
                    _id: tripId,
                    members: { $elemMatch: { $eq: userObjectId } },
                }).select("_id");
                return trip !== null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findTripsbyCreatorid(userid, creator_id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            //  await TripModel.find({ creator_id: { $in: creator_id } }).populate("creator_id")
            const skip = (page - 1) * limit;
            const trips = yield trip_model_1.TripModel.aggregate([
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
                            currentUserId: new mongoose_1.default.Types.ObjectId(userid),
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
                                if: { $eq: ["$creator_id", new mongoose_1.default.Types.ObjectId(userid)] },
                                then: true,
                                else: false,
                            },
                        },
                        isuserjoined: {
                            $in: [new mongoose_1.default.Types.ObjectId(userid), "$members"],
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
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);
            return trips;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTrip = new trip_model_1.TripModel({
                    creator_id: data.creator_id,
                    title: data.title,
                    startingPoint: {
                        name: data.startingPoint.name,
                        coordinates: {
                            type: "Point",
                            coordinates: [
                                data.startingPoint.coordinates.longitude, // Corrected order
                                data.startingPoint.coordinates.latitude,
                            ],
                        },
                    },
                    destination: {
                        name: data.destination.name,
                        coordinates: {
                            type: "Point",
                            coordinates: [
                                data.destination.coordinates.longitude, // Corrected order
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
                const savedTrip = yield newTrip.save();
                return savedTrip;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error creating trip: ${error.message}`);
                }
                else {
                    throw new Error("Error creating trip: Unknown error");
                }
            }
        });
    }
}
exports.TripRepository = TripRepository;
