import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { TransferController } from '../controllers/TransferController';

const router = Router();

router.post('/', authMiddleware, TransferController.createTransfer);

export default router; 