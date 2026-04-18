import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.get('/accounts', authMiddleware, roleMiddleware('ADMIN'), AdminController.getAllAccounts);
router.patch('/accounts/:id/unblock', authMiddleware, roleMiddleware('ADMIN'), AdminController.unblockAccount);

export default router;