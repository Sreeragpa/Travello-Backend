import { NextFunction, Response } from "express";
import { ITripUsecase } from "../interfaces/usecase/ITrip.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { ITrip } from "../entities/trip.entity";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";
import mongoose from "mongoose";

export class TripController {
  private tripUsecase: ITripUsecase;
  constructor(tripUsecase: ITripUsecase) {
    this.tripUsecase = tripUsecase;
  }

  async createTrip(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user as IJwtPayload;

    try {
      const {
        title,
        startingPoint,
        destination,
        startDate,
        endDate,
        memberlimit,
        description,
        imageUrl,
      } = req.body;
      console.log(req.body);

      // Validation of Body
      if (
        !title ||
        !startingPoint ||
        !destination ||
        !startDate ||
        !endDate ||
        !memberlimit ||
        !description
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (
        !startingPoint.name ||
        !startingPoint.coordinates ||
        !startingPoint.coordinates.latitude ||
        !startingPoint.coordinates.longitude
      ) {
        return res.status(400).json({ message: "Invalid starting point data" });
      }

      if (
        !destination.name ||
        !destination.coordinates ||
        !destination.coordinates.latitude ||
        !destination.coordinates.longitude
      ) {
        return res.status(400).json({ message: "Invalid destination data" });
      }
      const tripData: ITrip = {...req.body,members: [new mongoose.Types.ObjectId(user.user_id)]};
      tripData.creator_id = user.user_id;
      const createdTrip = await this.tripUsecase.createTrip(tripData);
      res.status(201).json({ status: "success", data: createdTrip });
    } catch (error) {
      next(error);
    }
  }

  async getTrips(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as IJwtPayload;
      const query = req.query.by;
      let trips: ITrip[] = [];
      console.log(query);

      if (query === "following") {
        trips = await this.tripUsecase.getTripsbyFollowing(user.user_id);
      } else {
        // Nearby logic
      }
      return res.status(200).json({ status: "success", data: trips });
    } catch (error) {
      next(error);
    }
  }
}
