import { NextFunction, Request, Response } from "express";
import { IAiUsecase } from "../interfaces/usecase/IAi.usecase";

export class AiController {
  constructor(private aiUsecase: IAiUsecase) {}

  async tripChat(req: Request, res: Response, next: NextFunction) {
    try {
      const message = req.body?.message as string;
      const lat = Number(req.body?.lat);
      const lng = Number(req.body?.lng);
      const radius = Number(req.body?.radius);
      const location =
        Number.isFinite(lat) && Number.isFinite(lng)
          ? {
              lat,
              lng,
              ...(Number.isFinite(radius) && { radius }),
            }
          : undefined;

      const data = await this.aiUsecase.tripChat(message, location);
      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  }
}
