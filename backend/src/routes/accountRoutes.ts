import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, AccountController.getAccounts);
router.get('/:id', authMiddleware, AccountController.getAccountDetails);
router.get('/:id/cards', authMiddleware, AccountController.getAccountCards);
router.get('/:accountId/cards/:cardId', authMiddleware, AccountController.getCardDetails);
router.patch('/:id/block', authMiddleware, AccountController.blockAccount);

export default router;