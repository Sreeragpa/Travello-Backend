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
exports.TripUsecase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
class TripUsecase {
    constructor(tripRepository, cloudinaryService, followRepository, notificationUsecase, conversationRepository) {
        this.tripRepository = tripRepository;
        this.cloudinaryService = cloudinaryService;
        this.followRepository = followRepository;
        this.notificationUsecase = notificationUsecase;
        this.conversationRepository = conversationRepository;
    }
    searchTrip(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const trips = yield this.tripRepository.searchTrip(searchKey);
            return trips;
        });
    }
    editTrip(userid, tripid, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (updateFields.imageUrl) {
                    updateFields.imageUrl = yield this.cloudinaryService.uploadImage(updateFields.imageUrl);
                }
                const updatedTrip = yield this.tripRepository.findOneandUpdate(userid, tripid, updateFields);
                if (updatedTrip) {
                    return updatedTrip;
                }
                else {
                    throw new Error(errorCodes_enum_1.ErrorCode.FAILED_UPDATING);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTripsNearby(userid, userLocation, maxDistance, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nearby = yield this.tripRepository.findNearbyTrips(userid, userLocation, 5000, page, 2);
                return nearby;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSingleTrip(userid, tripid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trips = yield this.tripRepository.findTripById(userid, tripid);
                return trips;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserTrips(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTrips = yield this.tripRepository.findUserTrips(userid);
                return userTrips;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserTripCount(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripCount = yield this.tripRepository.count(userid);
                return tripCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    acceptJoinRequest(notificationid, creatorid, memberid, tripid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUserAlreadyJoined = yield this.tripRepository.hasUserJoinedTrip(memberid, tripid);
                if (isUserAlreadyJoined) {
                    throw new Error(errorCodes_enum_1.ErrorCode.USER_ALREADY_JOINED);
                }
                const isJoined = yield this.tripRepository.addMember(memberid, tripid);
                if (isJoined) {
                    yield this.conversationRepository.joinToGroup(isJoined.conversation_id, memberid);
                }
                yield this.notificationUsecase.marksAsRead(notificationid);
                return "Member Added";
            }
            catch (error) {
                throw error;
            }
        });
    }
    joinTripRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUserAlreadyJoined = yield this.tripRepository.hasUserJoinedTrip(data.sender, data.tripid);
                if (isUserAlreadyJoined) {
                    throw new Error(errorCodes_enum_1.ErrorCode.USER_ALREADY_JOINED);
                }
                const isTripFull = yield this.tripRepository.isTripFull(data.tripid);
                if (isTripFull) {
                    throw new Error(errorCodes_enum_1.ErrorCode.TRIP_IS_FULL);
                }
                const notification = yield this.notificationUsecase.createNotification(data);
                return notification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTripsbyFollowing(userid, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const followedUsers = yield this.followRepository.getFollowing(userid);
            const followedUserIds = followedUsers.map((follow) => new mongoose_1.default.Types.ObjectId(follow.following_id));
            //    Add the same user(Get Trips posted by the same user)
            followedUserIds.push(new mongoose_1.default.Types.ObjectId(userid));
            const trips = yield this.tripRepository.findTripsbyCreatorid(userid, followedUserIds, page, 2);
            return trips;
        });
    }
    createTrip(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.imageUrl) {
                    console.log("Uplodaing Image");
                    const imageUrl = yield this.cloudinaryService.uploadImage(data.imageUrl);
                    data.imageUrl = imageUrl;
                }
                else {
                    data.imageUrl =
                        "https://static.vecteezy.com/system/resources/previews/000/207/516/original/road-trip-vector-illustration.jpg";
                }
                const createdTrip = yield this.tripRepository.create(data);
                if (createdTrip) {
                    const newGroupConversation = yield this.conversationRepository.createGroupConversation([data.creator_id], data.title);
                    yield this.tripRepository.addConversationIdtoTrip(createdTrip._id, newGroupConversation._id);
                }
                // createdTrip.title
                return createdTrip;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.TripUsecase = TripUsecase;
