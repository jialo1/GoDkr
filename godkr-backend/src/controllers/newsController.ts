import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const newsController = {
  // Get all news
  getAllNews: async (req: Request, res: Response) => {
    try {
      const news = await prisma.news.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching news' });
    }
  },

  // Get news by ID
  getNewsById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: { id },
      });

      if (!news) {
        return res.status(404).json({ error: 'News not found' });
      }

      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching news' });
    }
  },

  // Create news
  createNews: async (req: Request, res: Response) => {
    try {
      const { title, content, image, category } = req.body;
      const news = await prisma.news.create({
        data: {
          title,
          content,
          image,
          category,
        },
      });
      res.status(201).json(news);
    } catch (error) {
      res.status(500).json({ error: 'Error creating news' });
    }
  },

  // Update news
  updateNews: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, image, category } = req.body;
      const news = await prisma.news.update({
        where: { id },
        data: {
          title,
          content,
          image,
          category,
        },
      });
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Error updating news' });
    }
  },

  // Delete news
  deleteNews: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.news.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting news' });
    }
  },

  // Get news by category
  getNewsByCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const news = await prisma.news.findMany({
        where: { category },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching news by category' });
    }
  },
}; 