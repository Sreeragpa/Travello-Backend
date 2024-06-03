import express, { NextFunction, Request, Response }  from "express";
import { UserRepository } from "../../repository/user.repository";
import { UserUsecase } from "../../usecase/user.usecase";
import { UserController } from "../../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CloudinaryService } from "../utils/cloudinaryService";
import { AuthRepository } from "../../repository/auth.repository";
const router = express.Router();
const cloudinaryService = new CloudinaryService();
const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository,authRepository,cloudinaryService);
const userController = new UserController(userUsecase)

// /api/user

router.put('/add-profileimg',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    userController.updateProfilePicture(req,res,next)
})

router.get('/get-user',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    userController.getUser(req,res,next)
})

router.put('/user',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    userController.updateProfile(req,res,next);
})

router.put('/update-password',authMiddleware,(req: Request,res: Response,next: NextFunction)=>{
    userController.updatePassword(req,res,next)
})


export default router