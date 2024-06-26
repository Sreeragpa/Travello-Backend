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
         
            

            const userdata = await this.userUsecase.updateUserProfilePic(user.user_id, image);
         
            
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

    
          
            const updateFields: any = {};
    
            if (name && name.trim()) updateFields.name = name.trim();
            if (username && username.trim()) updateFields.username = username.trim();
            if (bio && bio.trim()) updateFields.bio = bio.trim();
      


            // Check for validation errors
            if (Object.keys(updateFields).length > 0) {
                // Assuming you have a method to update the user profile
           
                
                const userdata = await this.userUsecase.updateUserProfile(user.user_id,updateFields);
                 return res.status(200).json({status:"success",data:userdata})
        
              } else {
                return res.status(400).json({ status: 'failure', message: 'No valid fields to update' });
              }

           
            
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
            const userId = req.params.id || user.user_id;
            let currentUser = user.user_id
            const userdata = await this.userUsecase.getUser(userId,currentUser);
            console.log(userdata,"userdataatt");
            
            res.status(200).json({status:"succeess",data:userdata})

        } catch (error) {
            next(error)
        }
    }

    async searchUser(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const search = req.query.search as string;
            if(!search.trim()){
                return res.status(400).json({ message:"Invalid Search" }); 
            }
            const searchResults = await this.userUsecase.searchUser(user.user_id,search);
            res.status(200).json({status:"succeess",data:searchResults})

        } catch (error) {
            next(error)
        }
    }
}