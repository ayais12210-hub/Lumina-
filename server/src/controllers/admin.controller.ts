
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminController = {
  getStats: async (req: Request, res: Response) => {
    try {
      const [orderStats, activeProducts] = await Promise.all([
        prisma.order.aggregate({
          _sum: { total: true },
          _count: { id: true }
        }),
        prisma.product.count({ where: { status: 'ACTIVE' } })
      ]);

      const revenue = Number(orderStats._sum.total || 0);
      const orders = orderStats._count.id;
      const conversionRate = 2.4; // Mocked for now

      res.json({
        success: true,
        data: { revenue, orders, activeProducts, conversionRate }
      });
    } catch (error) {
      console.error('Admin Stats Error:', error);
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch stats' } });
    }
  },

  getSettings: async (req: Request, res: Response) => {
    try {
      let settings = await prisma.storeSettings.findFirst();
      if (!settings) {
        settings = await prisma.storeSettings.create({
          data: {
            notifications: { orderEmail: true, lowStock: true },
            integrations: { aliExpress: { connected: false, apiKey: '' }, cjDropshipping: { connected: false, apiKey: '' } }
          }
        });
      }
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch settings' } });
    }
  },

  saveSettings: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const first = await prisma.storeSettings.findFirst();
      const settings = await prisma.storeSettings.upsert({
        where: { id: first?.id || 'default-id' },
        update: data,
        create: data
      });
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to save settings' } });
    }
  },

  getProducts: async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        include: { variants: true },
        orderBy: { updatedAt: 'desc' }
      });
      
      // Map to frontend shape
      const mapped = products.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
        category: p.category,
        status: p.status,
        supplier: p.supplier,
        images: p.images,
        variants: p.variants.map(v => ({ ...v, price: Number(v.price) }))
      }));

      res.json({ success: true, data: mapped });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch products' } });
    }
  }
};
