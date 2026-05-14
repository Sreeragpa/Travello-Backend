import mongoose from "mongoose";
import { IAiUtilizationRecord } from "../entities/aiUtilization.entity";
import { AiUtilizationModel } from "../frameworks/models/aiUtilization.model";
import { IAiUtilizationRepository } from "../interfaces/repositories/IAiUtilization.repository";

export class AiUtilizationRepository implements IAiUtilizationRepository {
  async record(entry: IAiUtilizationRecord): Promise<void> {
    const { user, ...rest } = entry;
    await AiUtilizationModel.create({
      ...rest,
      user: user ? new mongoose.Types.ObjectId(user) : undefined,
    });
  }
}
