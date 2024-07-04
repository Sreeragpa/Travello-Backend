import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { IJwtPayload } from '../../interfaces/usecase/IUser.usecase';
import { UserModel } from '../models/user.model';



export interface AuthenticatedRequest extends Request {
    user?: IJwtPayload;
}

export const authMiddleware = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authToken = req.cookies.authToken;
        
        if (!authToken) {
            return res.sendStatus(401);
        }
    
        // const token = authHeader.split(' ')[1];

        const userData = verifyJWT(authToken) as IJwtPayload;

        if (!userData) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
          // Fetch the user from the database
          const user = await UserModel.findById(userData.user_id);

          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
  
          // Check if the user is blocked
          if (user.isBlocked) {
              return res.status(403).json({ message: 'User is blocked' });
          }
  

        req.user = userData; // Attach user data to the request object
      
        next();
    } catch (error) {
        return res.status(500).json({ message: 'JWT Verification Error' });
    }
};
