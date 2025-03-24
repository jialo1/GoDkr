import { Router } from 'express';
import { placeController } from '../controllers/placeController';

const router = Router();

// Get all places
router.get('/', placeController.getAllPlaces);

// Get place by ID
router.get('/:id', placeController.getPlaceById);

// Create new place
router.post('/', placeController.createPlace);

// Update place
router.put('/:id', placeController.updatePlace);

// Delete place
router.delete('/:id', placeController.deletePlace);

// Get places by category
router.get('/category/:category', placeController.getPlacesByCategory);

export default router; 