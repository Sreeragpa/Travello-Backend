import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { IJwtPayloadAdmin } from '../../entities/admin.entity';



export interface AuthenticatedAdminRequest extends Request {
    admin?: IJwtPayloadAdmin;
}

export const adminAuthMiddleware = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    try {
        const authToken = req.cookies.authTokenAdmin;

        
        if (!authToken) {
            return res.sendStatus(401);
        }
    
        // const token = authHeader.split(' ')[1];

        const adminData = verifyJWT<IJwtPayloadAdmin>(authToken);

        if (!adminData || !adminData?.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.admin = adminData; // Attach user data to the request object
      
        next(); 
    } catch (error) {
        return res.status(500).json({ message: 'JWT Verification Error' });
    }
};
