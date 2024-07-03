import { IAdmin } from "../../entities/admin.entity";

export default interface IAdminRepository{
    getAdmin(email: string): Promise<IAdmin>
}