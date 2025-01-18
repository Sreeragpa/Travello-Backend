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
exports.TripController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notification_enums_1 = require("../enums/notification.enums");
class TripController {
    constructor(tripUsecase) {
        this.tripUsecase = tripUsecase;
    }
    createTrip(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            try {
                const { title, startingPoint, destination, startDate, endDate, memberlimit, description, imageUrl, } = req.body;
                // Validation of Body
                if (!title ||
                    !startingPoint ||
                    !destination ||
                    !startDate ||
                    !endDate ||
                    !memberlimit ||
                    !description) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                if (!startingPoint.name ||
                    !startingPoint.coordinates ||
                    !startingPoint.coordinates.latitude ||
                    !startingPoint.coordinates.longitude) {
                    return res.status(400).json({ message: "Invalid starting point data" });
                }
                if (!destination.name ||
                    !destination.coordinates ||
                    !destination.coordinates.latitude ||
                    !destination.coordinates.longitude) {
                    return res.status(400).json({ message: "Invalid destination data" });
                }
                const tripData = Object.assign(Object.assign({}, req.body), { members: [new mongoose_1.default.Types.ObjectId(user.user_id)] });
                tripData.creator_id = user.user_id;
                const createdTrip = yield this.tripUsecase.createTrip(tripData);
                res.status(201).json({ status: "success", data: createdTrip });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTrips(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const query = req.query.by;
                const tripid = req.params.id;
                const page = Number(req.query.page) || 1;
                let { long, lat } = req.query;
                let trips = [];
                if (tripid) {
                    trips = yield this.tripUsecase.getSingleTrip(user.user_id, tripid);
                }
                else if (query === "following") {
                    trips = yield this.tripUsecase.getTripsbyFollowing(user.user_id, page);
                }
                else {
                    // Nearby logic
                    if (lat && long) {
                        let longitude = parseFloat(long);
                        let latitude = parseFloat(lat);
                        console.log(longitude, latitude);
                        // longitude = 11.1825447;
                        // latitude = 75.8375372;
                        trips = yield this.tripUsecase.getTripsNearby(user.user_id, [longitude, latitude], 10000, page);
                    }
                    // trips = await this.tripUsecase.getTripsNearby()
                }
                return res.status(200).json({ status: "success", data: trips });
            }
            catch (error) {
                next(error);
            }
        });
    }
    joinTrip(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { recipient, type, tripid } = req.body;
                const sender = user.user_id;
                const notificationdata = {
                    sender: sender,
                    recipient: recipient,
                    type: notification_enums_1.NOTIFICATION_TYPE.JOINREQUEST,
                    tripid: tripid,
                };
                const data = yield this.tripUsecase.joinTripRequest(notificationdata);
                res.status(201).json({ status: "success", data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    acceptJoinRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const creatorid = user.user_id;
                const { memberid, tripid, notificationid } = req.body;
                if (!memberid || !memberid.trim()) {
                    res.status(400).json({ message: "Missing memberid" });
                }
                if (!notificationid || !notificationid.trim()) {
                    res.status(400).json({ message: "Missing notificationid" });
                }
                if (!tripid || !tripid.trim()) {
                    res.status(400).json({ message: "Missing tripid" });
                }
                const data = yield this.tripUsecase.acceptJoinRequest(notificationid, creatorid, memberid, tripid);
                res.status(200).json({ status: "success", data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTripCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = req.params.profileid || user.user_id;
                const count = yield this.tripUsecase.getUserTripCount(userId);
                res.status(200).json({ status: "success", data: { count: count } });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserTrips(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userId = req.params.profileid || user.user_id;
                const userTrips = yield this.tripUsecase.getUserTrips(userId);
                res.status(200).json({ status: "success", data: userTrips });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateTrip(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { title, imageUrl, memberlimit, description } = req.body;
                const tripid = req.params.id;
                const updateFields = {};
                if (title && title.trim())
                    updateFields.title = title.trim();
                if (imageUrl && imageUrl.trim())
                    updateFields.imageUrl = imageUrl.trim();
                if (memberlimit !== undefined)
                    updateFields.memberlimit = memberlimit;
                if (description && description.trim())
                    updateFields.description = description.trim();
                const updatedTrip = yield this.tripUsecase.editTrip(user.user_id, tripid, updateFields);
                res.status(200).json({ status: "success", data: updatedTrip });
            }
            catch (error) {
                next(error);
            }
        });
    }
    searchTrip(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const search = req.query.search;
                const trips = yield this.tripUsecase.searchTrip(search);
                res.status(200).json({ status: "success", data: trips });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TripController = TripController;
