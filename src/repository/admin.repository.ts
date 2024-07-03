import { IAdmin } from "../entities/admin.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { adminModel } from "../frameworks/models/admin.model";
import IAdminRepository from "../interfaces/repositories/IAdmin.repository";

export class AdminRepository implements IAdminRepository{
    async getAdmin(email: string): Promise<IAdmin> {
        try {
            const admin = await adminModel.findOne({email: email});
            if(!admin){
                throw new Error(ErrorCode.INVALID_ADMIN_EMAIL)
            }
            return admin
        } catch (error) {   
            throw error
        }

    }

}