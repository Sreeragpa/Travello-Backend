import mongoose from "mongoose";
import { IEditTrip, ITrip } from "../entities/trip.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";
import { ITripRepository, IUserLocation } from "../interfaces/repositories/ITrip.repository";
import { ITripUsecase } from "../interfaces/usecase/ITrip.usecase";
import { INotification } from "../entities/notification.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { INotificationUsecase } from "../interfaces/usecase/INotification.usecase";

export class TripUsecase implements ITripUsecase {
  private tripRepository: ITripRepository;
  private cloudinaryService: CloudinaryService;
  private followRepository: IFollowRepository;
  private notificationUsecase: INotificationUsecase;
  constructor(
    tripRepository: ITripRepository,
    cloudinaryService: CloudinaryService,
    followRepository: IFollowRepository,
    notificationUsecase: INotificationUsecase
  ) {
    this.tripRepository = tripRepository;
    this.cloudinaryService = cloudinaryService;
    this.followRepository = followRepository;
    this.notificationUsecase = notificationUsecase;
  }
    async searchTrip(searchKey: string): Promise<ITrip[]> {
      const trips = await this.tripRepository.searchTrip(searchKey);
      return trips
    }
  async editTrip(userid: string, tripid: string, updateFields: Partial<IEditTrip>): Promise<ITrip> {
    try {
      if(updateFields.imageUrl){
        updateFields.imageUrl = await this.cloudinaryService.uploadImage(updateFields.imageUrl as string)
      }
      const updatedTrip = await this.tripRepository.findOneandUpdate(userid,tripid,updateFields);
      if(updatedTrip){
        return updatedTrip
      }else{
        throw new Error(ErrorCode.FAILED_UPDATING)
      }
    } catch (error) {
      throw error
    }

  }
  async getTripsNearby(userid: string,userLocation: IUserLocation, maxDistance: number): Promise<ITrip[]> {
    try {
      const nearby = await this.tripRepository.findNearbyTrips(userid,userLocation, 5000);
      return nearby
    } catch (error) {
      throw error
    }
  }
  async getSingleTrip(userid: string, tripid: string): Promise<ITrip[]> {
    try {

      const trips = await this.tripRepository.findTripById(userid, tripid);
      return trips;
    } catch (error) {
      throw error;
    }
  }
  async getUserTrips(userid: string): Promise<ITrip[]> {
    try {
      const userTrips = await this.tripRepository.findUserTrips(userid);
      return userTrips;
    } catch (error) {
      throw error;
    }
  }

  async getUserTripCount(userid: string): Promise<number> {
    try {
      const tripCount = await this.tripRepository.count(userid);
      return tripCount;
    } catch (error) {
      throw error;
    }
  }
  async acceptJoinRequest(
    notificationid: string,
    creatorid: string,
    memberid: string,
    tripid: string
  ): Promise<string> {
    try {
      const isUserAlreadyJoined = await this.tripRepository.hasUserJoinedTrip(
        memberid,
        tripid
      );
      if (isUserAlreadyJoined) {
        throw new Error(ErrorCode.USER_ALREADY_JOINED);
      }
      const isJoined = await this.tripRepository.addMember(memberid, tripid);
      await this.notificationUsecase.marksAsRead(notificationid);
      return "Member Added";
    } catch (error) {
      throw error;
    }
  }
  async joinTripRequest(data: INotification): Promise<INotification> {
    try {
      const isUserAlreadyJoined = await this.tripRepository.hasUserJoinedTrip(
        data.sender,
        data.tripid as string
      );
      if (isUserAlreadyJoined) {
        throw new Error(ErrorCode.USER_ALREADY_JOINED);
      }
      const isTripFull = await this.tripRepository.isTripFull(data.tripid as string);
      if (isTripFull) {
        throw new Error(ErrorCode.TRIP_IS_FULL);
      }

      const notification = await this.notificationUsecase.createNotification(data);

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async getTripsbyFollowing(userid: string): Promise<ITrip[]> {
    const followedUsers = await this.followRepository.getFollowing(userid);
    console.log(followedUsers,"followedusers");
    
    const followedUserIds = followedUsers.map(
      (follow) => new mongoose.Types.ObjectId(follow.following_id)
    );
    //    Add the same user(Get Trips posted by the same user)
    followedUserIds.push(new mongoose.Types.ObjectId(userid));

    const trips = await this.tripRepository.findTripsbyCreatorid(
      userid,
      followedUserIds
    );

    return trips;
  }
  async createTrip(data: ITrip): Promise<ITrip> {
    try {
      if (data.imageUrl) {
        console.log("Uplodaing Image");
        const imageUrl = await this.cloudinaryService.uploadImage(
          data.imageUrl as string
        );
        data.imageUrl = imageUrl;
      } else {
        data.imageUrl =
          "https://static.vecteezy.com/system/resources/previews/000/207/516/original/road-trip-vector-illustration.jpg";
      }
      const createdTrip = await this.tripRepository.create(data);
      return createdTrip;
    } catch (error) {
      throw error;
    }
  }
}
