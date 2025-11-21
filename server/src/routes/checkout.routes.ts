
import { Router } from 'express';
import { checkoutController } from '../controllers/checkout.controller';

const router = Router();
router.post('/session', checkoutController.createSession);
router.post('/process', checkoutController.processPayment);

export default router;
