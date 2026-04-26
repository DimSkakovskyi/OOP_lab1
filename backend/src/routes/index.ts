import { Router } from 'express';
import authRoutes from './authRoutes';
import accountRoutes from './accountRoutes';
import paymentRoutes from './paymentRoutes';
import topupRoutes from './topupRoutes';
import adminRoutes from './adminRoutes';
import transferRoutes from './transferRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/payments', paymentRoutes);
router.use('/topups', topupRoutes);
router.use('/admin', adminRoutes);
router.use('/transfers', transferRoutes);

export default router;