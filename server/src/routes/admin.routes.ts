
import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { productController } from '../controllers/product.controller';
import { orderController } from '../controllers/order.controller';

const router = Router();

router.get('/stats', adminController.getStats);
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.saveSettings);

router.get('/products', adminController.getProducts);
router.get('/products/:id', productController.getById);
router.post('/products', productController.create);
router.patch('/products/:id', productController.update);

router.get('/orders', orderController.getAll);
router.post('/orders/:id/fulfill', orderController.fulfill);

export default router;
