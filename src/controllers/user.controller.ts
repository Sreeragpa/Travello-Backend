import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { IJwtPayload, IUserUsecase } from "../interfaces/usecase/IUser.usecase";

export class UserController {
    private userUsecase: IUserUsecase

    constructor(userUsecase: IUserUsecase) {
        this.userUsecase = userUsecase
    }

    async updateProfilePicture(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IJwtPayload;
            const image = req.body.profileimg;
            console.log(user,image);
            

            const userdata = await this.userUsecase.updateUserProfilePic(user.user_id, image);
            console.log(userdata);
            
            if(userdata){
                res.status(200).json({status:"success",data:userdata})
            }
        } catch (error) {
            next(error)
        }

    }

    async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const {name,username,bio} = req.body;
            const user = req.user as IJwtPayload;

            const errors = [];
            if (!name.trim()) {
              errors.push('Name is required.');
            }
            if (!username.trim()) {
              errors.push('Username is required.');
            }
            if (!bio.trim()) {
              errors.push('Bio is required.');
            }
          
            // Check for validation errors
            if (errors.length > 0) {
              return res.status(400).json({ errors }); // Bad request
            }

            const userdata = await this.userUsecase.updateUserProfile(user.user_id,name,username,bio);
            return res.status(200).json({status:"success",data:userdata})
            
        } catch (error) {
            next(error)
        }
    }

    async updatePassword(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {

            const user = req.user as IJwtPayload;
            const {currentPassword,newPassword} = req.body;
            const errors = [];
            if (!currentPassword.trim()) {
              errors.push('currentPassword is required.');
            }
            if (!newPassword.trim()) {
              errors.push('newPassword is required.');
            }

            // Check for validation errors
            if (errors.length > 0) {
                return res.status(400).json({ errors }); // Bad request
              }
              const data = await this.userUsecase.updatePassword(user.user_id,currentPassword,newPassword);
              return res.status(200).json({status:"success",data:data})
              

        } catch (error) {
            next(error)
        }
    }


    async getUser(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const userdata = await this.userUsecase.getUser(user.user_id);
            res.status(200).json({status:"succeess",data:userdata})

        } catch (error) {
            next(error)
        }
    }
}