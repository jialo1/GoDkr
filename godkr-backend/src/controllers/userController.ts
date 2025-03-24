import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const userController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  },

  // Get user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          profileImage: true,
          favorites: true,
          reviews: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { name, profileImage } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          profileImage,
        },
        select: {
          id: true,
          email: true,
          name: true,
          profileImage: true,
        },
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user profile' });
    }
  },

  // Add place to favorites
  addToFavorites: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { placeId } = req.params;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: { id: placeId },
          },
        },
        include: {
          favorites: true,
        },
      });

      res.json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: 'Error adding place to favorites' });
    }
  },

  // Remove place from favorites
  removeFromFavorites: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { placeId } = req.params;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: placeId },
          },
        },
        include: {
          favorites: true,
        },
      });

      res.json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: 'Error removing place from favorites' });
    }
  },
}; 