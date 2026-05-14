import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { IAiUsecase } from "../interfaces/usecase/IAi.usecase";

export class AiController {
  constructor(private aiUsecase: IAiUsecase) {}

  async tripChat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const message = req.body?.message as string;
      const lat = Number(req.body?.lat);
      const lng = Number(req.body?.lng);
      const radius = Number(req.body?.radius) || 30;  //km
      const location =
        Number.isFinite(lat) && Number.isFinite(lng)
          ? {
              lat,
              lng,
              ...(Number.isFinite(radius) && { radius }),
            }
          : undefined;

      const data = await this.aiUsecase.tripChat(message, location, {
        userId: req.user?.user_id,
      });
      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  }
}
