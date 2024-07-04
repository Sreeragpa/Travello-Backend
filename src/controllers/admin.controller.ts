import { NextFunction, Request, Response } from "express";
import { adminModel } from "../frameworks/models/admin.model";
import bcrypt from "bcrypt";
import IAdminUsecase from "../interfaces/usecase/IAdmin.usecase";
import { IPostUsecase } from "../interfaces/usecase/IPost.usercase";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";

export default class AdminController{
    private adminUsecase: IAdminUsecase
    constructor(adminUsecase: IAdminUsecase){
        this.adminUsecase = adminUsecase
    }

    async login(req: Request,res: Response,next: NextFunction){
        try {
            const {email,password} = req.body;
            console.log(req.body);
            
            if(!email || !password){
                return res.status(401).json({ message: 'Email and Password Required'});
            }
            const admin = await this.adminUsecase.adminLogin(email,password);
            const token = admin.token
            res.cookie('authTokenAdmin', token, {
                httpOnly: true,
                secure: true,  // Use true if you're serving over HTTPS
                sameSite: 'none'  // Allows cross-site cookie usage
              });

            
            res.status(200).json({status:"success",data:admin})


        } catch (error) {
            next(error)
        }
    }

    async checkAuth(req: Request,res: Response,next: NextFunction){
        try {
            try {
                res.status(200).json({ status: 'authenticated' });
            } catch (error) {
                next(error)
            }
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request,res: Response,next: NextFunction){
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({ message: 'Email and Password Required'});
        }
        const hashedpassword = await bcrypt.hash(password,10)

       const admin = new adminModel({
        email: email,
        password: hashedpassword
       })

       const savedAdmin = await admin.save();

       res.status(200).send({status:"success",data:savedAdmin})
    }

    async getPostStatistics(req: Request,res: Response,next: NextFunction){
        const period = Number(req.query.period);
        if(!period && period!==0){
            return res.status(401).json({ message: 'Period Required'});
        }
        const data = await this.adminUsecase.postsCountByDate(period);
        res.status(200).json({ status: 'success', data: data });
    }
    async getTripStatistics(req: Request,res: Response,next: NextFunction){
        const period = Number(req.query.period);
        if(!period && period!==0){
            return res.status(401).json({ message: 'Period Required'});
        }
        const data = await this.adminUsecase.tripsCountByDate(period);
        res.status(200).json({ status: 'success', data: data });
    }
    async getUserStatistics(req: Request,res: Response,next: NextFunction){
        const period = Number(req.query.period);
        if(!period && period!==0){
            return res.status(401).json({ message: 'Period Required'});
        }
        const data = await this.adminUsecase.usersCountByDate(period);
        res.status(200).json({ status: 'success', data: data });
    }

    async getAllUsers(req: Request,res: Response,next: NextFunction){
        try {
            const data = await this.adminUsecase.getAllUsers()
            res.status(200).json({ status: 'success', data: data });

        } catch (error) {
            next(error)
        }
    }

    async searchUsers(req: Request,res: Response,next: NextFunction){
        try {
            let query = String(req.query.search);
            if(query && !query.trim()){
            return res.status(401).json({ message: 'Invalid Search'})
            }
            query = query.trim();
            const data = await this.adminUsecase.searchUsers(query)
            res.status(200).json({ status: 'success', data: data });
        } catch (error) {
            next(error)
        }
    }

    async blockUser(req: Request,res: Response,next: NextFunction){
        try {
            const userid = req.params.id;
            console.log(userid);
            
            if(userid){
                return res.status(400).json({ message: 'Invalid Userid'})
            }
           const user = await this.adminUsecase.blockUser(userid);
           res.status(200).json({ status: 'success', data: user });

        } catch (error) {
            next(error)
        }
    }
    async unBlockUser(req: Request,res: Response,next: NextFunction){
        try {
            const userid = req.params.id;
            if(userid){
                return res.status(400).json({ message: 'Invalid Userid'})
            }
            const user = await this.adminUsecase.unBlockUser(userid)
            res.status(200).json({ status: 'success', data: user });

        } catch (error) {
            next(error)
        }
    }

}