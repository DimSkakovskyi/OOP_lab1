import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, PaymentController.createPayment);
router.post('/topups', authMiddleware, PaymentController.createTopUp);

export default router;