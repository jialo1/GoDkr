import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import placeRoutes from './routes/placeRoutes';
import userRoutes from './routes/userRoutes';
import communityRoutes from './routes/communityRoutes';
import newsRoutes from './routes/newsRoutes';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/places', placeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/news', newsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GoDkr API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 