import { Router } from 'express';
import { communityController } from '../controllers/communityController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', communityController.getAllCommunities);
router.get('/:id', communityController.getCommunityById);

// Protected routes
router.post('/', auth, communityController.createCommunity);
router.post('/:id/join', auth, communityController.joinCommunity);
router.post('/:id/leave', auth, communityController.leaveCommunity);
router.post('/:id/posts', auth, communityController.createPost);

export default router; 