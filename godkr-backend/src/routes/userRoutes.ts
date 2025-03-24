import { Router } from 'express';
import { userController } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/favorites/:placeId', auth, userController.addToFavorites);
router.delete('/favorites/:placeId', auth, userController.removeFromFavorites);

export default router; 