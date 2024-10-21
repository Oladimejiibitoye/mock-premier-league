import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user'; 
import { LoginDto, UserDto } from './auth.dto'; 
import { JWT_SECRET } from '../../environment/config';
import { BadRequestError, InternalServerError } from '../../utils/errors';
import { Request } from 'express';

class AuthService {


  constructor() {}

  // Register a new user
  async register(userDto: UserDto): Promise<{ message: string }> {
    const { username, email, password, role } = userDto;

    // Check if user already exists
    const existingUser = await User.findOne({ email: new RegExp(email, 'i') });
    if (existingUser) {
      throw new BadRequestError('User with email already exists');
    }

    const existingUserWithUsername = await User.findOne({ username: new RegExp(username, 'i') });
    if (existingUserWithUsername) {
        throw new BadRequestError('User with username already exists')
    }

    // Create the new user
    const newUser = new User({
      username,
      email,
      password,
      role
    });

    await newUser.save();
    return { message: 'User registered successfully' };
  }

  // User login with JWT token
  async login(loginDto: LoginDto): Promise<{ id: any, role: string, token: string, message: string }> {
    const {email, password} = loginDto
    
    const user = await User.findOne({ email: new RegExp(email, 'i') });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      id: user._id, 
      role: user.role,
      token,
      message: 'Login successful'
    };
  }

  // Logout user by deleting session from Redis
  async logout(req: Request): Promise<{ message: string }> {
    req.session.destroy((err) => {
        if (err) {
            throw new InternalServerError('Failed to log out')
        };
    })
    return { message: 'Logout successful' };
  }

  // Validate token and retrieve user info
  validateToken(token: string): any {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService()
