import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from '../modules/auth/auth.services';
import { User } from '../models/user'; 
import { BadRequestError, InternalServerError } from '../utils/errors';
import { Request } from 'express';
import { UserDto } from '../modules/auth/auth.dto';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/models/user');

describe('AuthService', () => {
  
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userDto : UserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
      };

      // Mock User.findOne to return null (no existing user)
      (User.findOne as any).mockResolvedValue(null);

      // Mock User.save to simulate saving a new user
      const saveMock = jest.fn().mockResolvedValue({});
      (User as any).mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await authService.register(userDto);

      expect(User.findOne).toHaveBeenCalledTimes(2);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('should throw an error if user already exists', async () => {
      const userDto : UserDto = {
        username: 'existinguser',
        email: 'existinguser@example.com',
        password: 'password123',
        role: 'user',
      };

      // Mock User.findOne to return an existing user
      (User.findOne as any).mockResolvedValue({});

      await expect(authService.register(userDto)).rejects.toThrow(BadRequestError);
    });
  });

  describe('login', () => {
    it('should log in a user with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock User.findOne to return a valid user
      const userMock = {
        _id: 'user_id',
        email: 'test@example.com',
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as any).mockResolvedValue(userMock);

      // Mock jwt.sign to return a token
      (jwt.sign as jest.Mock).mockReturnValue('jwt_token');

      const result = await authService.login(loginDto);

      expect(User.findOne).toHaveBeenCalledWith({ email: /test@example.com/i });
      expect(userMock.comparePassword).toHaveBeenCalledWith('password123');
      expect(result).toEqual({
        id: 'user_id',
        role: 'user',
        token: 'jwt_token',
        message: 'Login successful',
      });
    });

    it('should throw BadRequestError for invalid credentials', async () => {
      const loginDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      // Mock User.findOne to return null (no user found)
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      // Mock User.findOne to return a user but with a wrong password
      const userMock = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      (User.findOne as jest.Mock).mockResolvedValue(userMock);

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestError);
    });
  });

  describe('logout', () => {
    it('should log out a user by destroying session', async () => {
      const req = {
        session: {
          destroy: jest.fn((callback) => callback(null)),
        },
      } as unknown as Request;

      const result = await authService.logout(req);

      expect(req.session.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Logout successful' });
    });

    it('should throw InternalServerError if session destruction fails', async () => {
      const req = {
        session: {
          destroy: jest.fn((callback) => callback(new Error('Session destruction error'))),
        },
      } as unknown as Request;

      await expect(authService.logout(req)).rejects.toThrow(InternalServerError);
    });
  });

  describe('validateToken', () => {
    it('should validate a token and return decoded data', () => {
      const token = 'valid_token';
      const decoded = { id: 'user_id', email: 'test@example.com', role: 'user' };

      // Mock jwt.verify to return decoded data
      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = authService.validateToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(result).toEqual(decoded);
    });

    it('should throw an error for an invalid token', () => {
      const token = 'invalid_token';

      // Mock jwt.verify to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.validateToken(token)).toThrow('Invalid token');
    });
  });
});
