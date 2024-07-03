import { IAdmin, IAdminLogin, IStatisticsData } from "../../entities/admin.entity";
import IUser from "../../entities/user.entity";

export default interface IAdminUsecase{
    adminLogin(email: string,password: string): Promise<IAdminLogin>
    postsCountByDate(period: number): Promise<IStatisticsData[]>
    tripsCountByDate(period: number): Promise<IStatisticsData[]>
    usersCountByDate(period: number): Promise<IStatisticsData[]>
    getAllUsers(): Promise<IUser[]>
    searchUsers(query: string): Promise<IUser[]>
    blockUser(userid: string): Promise<IUser>
    unBlockUser(userid: string): Promise<IUser>
}