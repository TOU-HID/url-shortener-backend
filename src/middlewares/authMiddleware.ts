import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/User.js';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT Payload Interface
interface JwtPayload {
  userId: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized. Please login to access this resource.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Find user by ID from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
        return;
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token is invalid or expired. Please login again.'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
    return;
  }
};