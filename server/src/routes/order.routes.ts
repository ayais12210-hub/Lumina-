
import { Router } from 'express';
import { orderController } from '../controllers/order.controller';

const router = Router();

router.get('/', orderController.getAll);
router.post('/:id/fulfill', orderController.fulfill);

export default router;
