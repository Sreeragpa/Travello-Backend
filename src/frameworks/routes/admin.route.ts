import express, { NextFunction, Request, Response } from "express";
import { AdminRepository } from "../../repository/admin.repository";
import { AdminUsecase } from "../../usecase/admin.usecase";
import  AdminController  from "../../controllers/admin.controller";
import { adminAuthMiddleware } from "../middlewares/admin.auth.middleware";
import { PostRepository } from "../../repository/post.repository";
import { TripRepository } from "../../repository/trip.repository";
import { UserRepository } from "../../repository/user.repository";
const router = express.Router();
const adminRespository = new AdminRepository();
const postRepository = new PostRepository();
const tripRepository = new TripRepository();
const userRepository = new UserRepository()
const adminUsecase = new AdminUsecase(adminRespository,postRepository,tripRepository,userRepository);
const adminController = new AdminController(adminUsecase);

router.post('/login',(req: Request,res: Response, next: NextFunction)=>{
    adminController.login(req,res,next)
})

// router.post('/create',(req: Request,res: Response, next: NextFunction)=>{
//     adminController.create(req,res,next)
// })


router.get('/check-auth',adminAuthMiddleware,(req: Request, res: Response,next: NextFunction)=>{
    adminController.checkAuth(req,res,next)
})
router.get('/posts/statistics',adminAuthMiddleware,(req: Request, res: Response,next: NextFunction)=>{
    adminController.getPostStatistics(req,res,next)
})
router.get('/trips/statistics',adminAuthMiddleware,(req: Request, res: Response,next: NextFunction)=>{
    adminController.getTripStatistics(req,res,next)
})
router.get('/users/statistics',adminAuthMiddleware,(req: Request, res: Response,next: NextFunction)=>{
    adminController.getUserStatistics(req,res,next)
})
router.get('/get-users',adminAuthMiddleware,(req: Request, res: Response,next: NextFunction)=>{
    adminController.getAllUsers(req,res,next)
})
router.get('/search-users',adminAuthMiddleware,(req: Request, res: Response,next: NextFunction)=>{
    adminController.searchUsers(req,res,next)
})

router.post('/block/user/:id',adminAuthMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    adminController.blockUser(req,res,next)
})

router.post('/unblock/user/:id',adminAuthMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    adminController.unBlockUser(req,res,next)
})

router.post('/logout',(req: Request,res: Response, next: NextFunction)=>{
    adminController.logout(req,res,next)
})

router.get('/isAdmin',adminAuthMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    adminController.logout(req,res,next)
})


export default router
