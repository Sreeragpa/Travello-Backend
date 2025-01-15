import { IAdmin, IAdminLogin, IJwtPayloadAdmin, IStatisticsData } from "../entities/admin.entity";
import IUser from "../entities/user.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { signJWT } from "../frameworks/utils/jwt.utils";
import IAdminRepository from "../interfaces/repositories/IAdmin.repository";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { ITripRepository } from "../interfaces/repositories/ITrip.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import IAdminUsecase from "../interfaces/usecase/IAdmin.usecase";
import bcrypt from "bcrypt";


export class AdminUsecase implements IAdminUsecase {
    private adminRespository: IAdminRepository
    private postRepository: IPostRepository
    private tripRepository: ITripRepository
    private userRepository: IUserRepository
    constructor(adminRespository: IAdminRepository,postRepository: IPostRepository,tripRepository: ITripRepository,userRepository:IUserRepository) {
        this.adminRespository = adminRespository
        this.postRepository = postRepository
        this.tripRepository = tripRepository
        this.userRepository = userRepository
    }
    async blockUser(userid: string): Promise<IUser> {
        const blockedUser = await this.userRepository.blockUser(userid)
        return blockedUser
    }
    async unBlockUser(userid: string): Promise<IUser> {
        const unBlockedUser = await this.userRepository.unBlockUser(userid)
        return unBlockedUser
    }
    async searchUsers(query: string): Promise<IUser[]> {
        const users = await this.userRepository.searchUser(query)
        return users
    }
    async getAllUsers(): Promise<IUser[]> {
        const users = await this.userRepository.getAllUser()
        return users
    }
    async usersCountByDate(period: number): Promise<IStatisticsData[]> {
        try {
            const postCount = await this.userRepository.getUserCountByDate(period);
            return postCount
        } catch (error) {
            throw error
        }
    }
    async tripsCountByDate(period: number): Promise<IStatisticsData[]> {
        try {
            const postCount = await this.tripRepository.getTripsCountByDate(period);
            return postCount
        } catch (error) {
            throw error
        }
    }
    async postsCountByDate(period: number): Promise<IStatisticsData[]> {
        try {
            const postCount = await this.postRepository.getPostCountByDate(period);
            return postCount
        } catch (error) {
            throw error
        }
    }
    async adminLogin(email: string, password: string): Promise<IAdminLogin> {
        try {
            console.log(email, password);

            const admin = await this.adminRespository.getAdmin(email);
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                throw new Error(ErrorCode.INVALID_CREDENTIALS);
            }
            const payload: IJwtPayloadAdmin = { id: admin._id, email: admin.email, isAdmin: true }
            const token = signJWT(payload, 8)
            const adminData: IAdminLogin = {
                email: admin.email,
                token: token.accessToken,
                refreshToken: token.refreshToken
            }

            return adminData
        } catch (error) {
            throw error
        }

    }



}