import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, AccountController.getAccounts);
router.get('/:id', authMiddleware, AccountController.getAccountDetails);
router.patch('/:id/block', authMiddleware, AccountController.blockAccount);

export default router;