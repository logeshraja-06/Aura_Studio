import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All equipment management routes require admin JWT authentication
router.use(protectAdmin);

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/', createEquipment);
router.patch('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
