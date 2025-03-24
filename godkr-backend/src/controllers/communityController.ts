import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const communityController = {
  // Get all communities
  getAllCommunities: async (req: Request, res: Response) => {
    try {
      const communities = await prisma.community.findMany({
        include: {
          members: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });
      res.json(communities);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching communities' });
    }
  },

  // Get community by ID
  getCommunityById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const community = await prisma.community.findUnique({
        where: { id },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          posts: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      });

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }

      res.json(community);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching community' });
    }
  },

  // Create new community
  createCommunity: async (req: Request, res: Response) => {
    try {
      const { name, description, category } = req.body;
      const userId = (req as any).user.userId;

      const community = await prisma.community.create({
        data: {
          name,
          description,
          category,
          members: {
            connect: { id: userId },
          },
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });

      res.status(201).json(community);
    } catch (error) {
      res.status(500).json({ error: 'Error creating community' });
    }
  },

  // Join community
  joinCommunity: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const community = await prisma.community.update({
        where: { id },
        data: {
          members: {
            connect: { id: userId },
          },
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });

      res.json(community);
    } catch (error) {
      res.status(500).json({ error: 'Error joining community' });
    }
  },

  // Leave community
  leaveCommunity: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const community = await prisma.community.update({
        where: { id },
        data: {
          members: {
            disconnect: { id: userId },
          },
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });

      res.json(community);
    } catch (error) {
      res.status(500).json({ error: 'Error leaving community' });
    }
  },

  // Create post in community
  createPost: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = (req as any).user.userId;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          user: {
            connect: { id: userId },
          },
          community: {
            connect: { id },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Error creating post' });
    }
  },
}; 