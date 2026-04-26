import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.get(
  '/accounts',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.getAllAccounts
);

router.get(
  '/accounts/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.getAccountDetails
);

router.get(
  '/accounts/:accountId/cards/:cardId',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.getCardDetails
);

router.patch(
  '/accounts/:id/block',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.blockAccount
);

router.patch(
  '/accounts/:id/unblock',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.unblockAccount
);

router.post(
  '/users/create-client',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.createClient
);

router.post(
  '/users/create-admin',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.createAdmin
);

router.post(
  '/accounts/:id/cards',
  authMiddleware,
  roleMiddleware('ADMIN'),
  AdminController.addCardToAccount
);

export default router;