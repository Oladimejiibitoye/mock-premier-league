import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { LoginDto, UserDto } from './auth.dto';
import { errorResMsg, successResMsg } from '../../utils/response';
import { authService } from './auth.services';
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../../middlewares/auth';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const userDto = Object.assign(new UserDto(), req.body);

        const errors = await validate(userDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await authService.register(userDto)

        return successResMsg(res, StatusCodes.CREATED, {message: response.message})
    } catch (error) {
        next(error)
    }
  }

  async login (req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
    try {
        const loginDto = Object.assign(new LoginDto(), req.body);

        const errors = await validate(loginDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await authService.login(loginDto)

        // Store user session
        req.session.user = { id: response.id, role: response.role };

        return successResMsg(res, StatusCodes.CREATED, {message: response.message, data: {token: response.token}})
    } catch (error) {
        next(error)
    }
  }

  async logout (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        
        const response = await authService.logout(req)
        res.clearCookie('connect.sid'); // Clear session cookie
        return successResMsg(res, StatusCodes.CREATED, {message: response.message})
    } catch (error) {
        next(error)
    }
  }
};

export const authController =  new AuthController()
