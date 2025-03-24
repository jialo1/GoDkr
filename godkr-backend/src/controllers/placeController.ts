import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const placeController = {
  // Get all places
  getAllPlaces: async (req: Request, res: Response) => {
    try {
      const places = await prisma.place.findMany({
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching places' });
    }
  },

  // Get place by ID
  getPlaceById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const place = await prisma.place.findUnique({
        where: { id },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
      }
      res.json(place);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching place' });
    }
  },

  // Create new place
  createPlace: async (req: Request, res: Response) => {
    try {
      const { name, description, category, address, latitude, longitude, images } = req.body;
      const place = await prisma.place.create({
        data: {
          name,
          description,
          category,
          address,
          latitude,
          longitude,
          images,
        },
      });
      res.status(201).json(place);
    } catch (error) {
      res.status(500).json({ error: 'Error creating place' });
    }
  },

  // Update place
  updatePlace: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, category, address, latitude, longitude, images } = req.body;
      const place = await prisma.place.update({
        where: { id },
        data: {
          name,
          description,
          category,
          address,
          latitude,
          longitude,
          images,
        },
      });
      res.json(place);
    } catch (error) {
      res.status(500).json({ error: 'Error updating place' });
    }
  },

  // Delete place
  deletePlace: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.place.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting place' });
    }
  },

  // Get places by category
  getPlacesByCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const places = await prisma.place.findMany({
        where: { category },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching places by category' });
    }
  },
}; 