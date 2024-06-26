import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { IJwtPayload } from '../../interfaces/usecase/IUser.usecase';



export interface AuthenticatedRequest extends Request {
    user?: IJwtPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        req.user = userData; // Attach user data to the request object
      
        next();
    } catch (error) {
        return res.status(500).json({ message: 'JWT Verification Error' });
    }
};
