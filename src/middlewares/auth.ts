import { Request, Response, NextFunction } from 'express';
import { authService } from '../modules/auth/auth.services';
import { errorResMsg } from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/user';

// Extend the Request interface to include user property
export interface CustomRequest extends Request {
    user?: any; // You can replace `any` with the actual user type, e.g., `User`
    session: any
}
  
  export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): any => {
    
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return errorResMsg(res, StatusCodes.UNAUTHORIZED, 'Access Denied');
    }
  
    try {
      // Validate the token using your authService
      const decoded = authService.validateToken(token);
      req.user = decoded; // Assign the decoded token to req.user
  
      // Check if the session exists (assuming req.session.user is where the session is stored)
      if (!req.session.user) {
        return errorResMsg(res, StatusCodes.UNAUTHORIZED, 'Session expired, please log in again');
      }
  
      // Pass to the next middleware if everything is valid
      next();
    } catch (error) {
      // Return error for invalid token
      errorResMsg(res, StatusCodes.BAD_REQUEST, 'Invalid Token');
    }
  };

  export const authorizeAdmin = (req: CustomRequest, res: Response, next: NextFunction): any  => {
    if (req.user?.role !== 'admin') {
        return errorResMsg(res, StatusCodes.UNAUTHORIZED,'Access Denied' );
    };
    next();
  };
