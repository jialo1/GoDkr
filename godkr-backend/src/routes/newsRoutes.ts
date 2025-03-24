import { Router } from 'express';
import { newsController } from '../controllers/newsController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.get('/category/:category', newsController.getNewsByCategory);

// Protected routes (admin only)
router.post('/', auth, newsController.createNews);
router.put('/:id', auth, newsController.updateNews);
router.delete('/:id', auth, newsController.deleteNews);

export default router; 