import mongoose from "mongoose";
import { ITrip } from "../entities/trip.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";
import { ITripRepository } from "../interfaces/repositories/ITrip.repository";
import { ITripUsecase } from "../interfaces/usecase/ITrip.usecase";
import { INotification } from "../entities/notification.entity";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { ErrorCode } from "../enums/errorCodes.enum";

export class TripUsecase implements ITripUsecase {
  private tripRepository: ITripRepository;
  private cloudinaryService: CloudinaryService;
  private followRepository: IFollowRepository;
  private notificationRepository: INotificationRepository
  constructor(
    tripRepository: ITripRepository,
    cloudinaryService: CloudinaryService,
    followRepository: IFollowRepository,
    notificationRepository: INotificationRepository
  ) {
    this.tripRepository = tripRepository;
    this.cloudinaryService = cloudinaryService;
    this.followRepository = followRepository;
    this.notificationRepository = notificationRepository
  }
  async acceptJoinRequest(notificationid: string,creatorid: string,memberid: string, tripid: string): Promise<string> {
    try {
      const isUserAlreadyJoined = await this.tripRepository.hasUserJoinedTrip(memberid,tripid);
      if(isUserAlreadyJoined){
        throw new Error(ErrorCode.USER_ALREADY_JOINED)
      }
      const isJoined = await this.tripRepository.addMember(memberid,tripid);
      await this.notificationRepository.markasRead(notificationid);
      return "Member Added"


    } catch (error) {
      throw error
    }
  }
  async joinTripRequest(data: INotification): Promise<INotification> {
    try {
      const isUserAlreadyJoined = await this.tripRepository.hasUserJoinedTrip(data.sender,data.tripid);
      if(isUserAlreadyJoined){
        throw new Error(ErrorCode.USER_ALREADY_JOINED)
      }
      const isTripFull = await this.tripRepository.isTripFull(data.tripid)
      if(isTripFull){
        throw new Error(ErrorCode.TRIP_IS_FULL)
      }

        const notification = await this.notificationRepository.create(data);
        
      return notification
    } catch (error) {
      throw error
    }
  }


  async getTripsbyFollowing(userid: string): Promise<ITrip[]> {
    const followedUsers = await this.followRepository.getFollowing(userid);
    const followedUserIds = followedUsers.map((follow) => new mongoose.Types.ObjectId(follow.following_id));
    //    Add the same user(Get Trips posted by the same user)
    followedUserIds.push(new mongoose.Types.ObjectId(userid));


    const trips = await this.tripRepository.findTripsbyCreatorid(userid,
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
