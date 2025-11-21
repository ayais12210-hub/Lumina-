
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import adminRoutes from './routes/admin.routes';
import orderRoutes from './routes/order.routes';
import checkoutRoutes from './routes/checkout.routes';
import authRoutes from './routes/auth.routes';
import { protect, admin } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/auth', authRoutes);

// Protected Routes
app.use('/api/v1/orders', protect, orderRoutes);
app.use('/api/v1/admin', protect, admin, adminRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'lumina-backend' }));

app.listen(PORT, () => {
  console.log(`🚀 Lumina Backend running on http://localhost:${PORT}`);
});