import { IAiUtilizationRecord } from "../../entities/aiUtilization.entity";

export interface IAiUtilizationRepository {
  record(entry: IAiUtilizationRecord): Promise<void>;
}
