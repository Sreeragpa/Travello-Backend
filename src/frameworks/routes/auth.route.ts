import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { AuthUsecase } from "../../usecase/auth.usecase";
import { AuthRepository } from "../../repository/auth.repository";

const router = express.Router();
const authRepository = new AuthRepository();
const authUsecase = new AuthUsecase(authRepository)
const authController = new AuthController(authUsecase)

// main route /api/auth
router.post('/signup',(req: Request, res: Response, next: NextFunction) => {
    authController.signup(req, res, next)
  }); 

router.post('/verify-otp',(req: Request, res: Response, next: NextFunction)=>{
    authController.verifyOtp(req,res,next)
});
router.post('/signin', (req: Request, res: Response, next: NextFunction)=>{
    authController.signin(req,res,next)
});
router.get('/test', (req: Request, res: Response, next: NextFunction)=>{
    res.status(200).json({message:"/api/auth Working like a pro"})
});

router.delete('/logout',(req: Request, res: Response, next: NextFunction)=>{
    res.cookie('authToken', '', { expires: new Date(0) });
    res.status(200).json({status:"Success",message:"logout"})
})

router.post('/forgot-password',(req: Request, res: Response, next: NextFunction)=>{
    authController.resetPassword(req,res,next)
})

router.post('/verify-password',(req: Request, res: Response, next: NextFunction)=>{
    authController.verifyresetPassword(req,res,next)
})

// router.post('/forgot-password', authController.forgotPassword);
// router.post('/refresh-token', authController.refreshToken);

export default router