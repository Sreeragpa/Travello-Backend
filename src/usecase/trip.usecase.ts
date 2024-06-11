import mongoose from "mongoose";
import { ITrip } from "../entities/trip.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";
import { ITripRepository } from "../interfaces/repositories/ITrip.repository";
import { ITripUsecase } from "../interfaces/usecase/ITrip.usecase";

export class TripUsecase implements ITripUsecase {
  private tripRepository: ITripRepository;
  private cloudinaryService: CloudinaryService;
  private followRepository: IFollowRepository;

  constructor(
    tripRepository: ITripRepository,
    cloudinaryService: CloudinaryService,
    followRepository: IFollowRepository
  ) {
    this.tripRepository = tripRepository;
    this.cloudinaryService = cloudinaryService;
    this.followRepository = followRepository;
  }
  async getTripsbyFollowing(userid: string): Promise<ITrip[]> {
    const followedUsers = await this.followRepository.getFollowing(userid);
    const followedUserIds = followedUsers.map((follow) => new mongoose.Types.ObjectId(follow.following_id));
    //    Add the same user(Get Trips posted by the same user)
    followedUserIds.push(new mongoose.Types.ObjectId(userid));
    console.log(followedUserIds);

    const trips = await this.tripRepository.findTripsbyCreatorid(userid,
      followedUserIds
    );
    console.log(trips);

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
