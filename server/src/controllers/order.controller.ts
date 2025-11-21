
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const orderController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const whereClause: any = {};
      if (status && status !== 'ALL') whereClause.status = status;

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: { items: { include: { variant: true } } },
        orderBy: { createdAt: 'desc' }
      });

      const mapped = orders.map(o => ({
        id: o.id,
        customerName: o.guestName || 'Guest',
        date: o.createdAt.toISOString().split('T')[0],
        total: Number(o.total),
        status: o.status,
        itemsCount: o.items.reduce((acc, item) => acc + item.quantity, 0)
      }));

      res.json({ success: true, data: mapped });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch orders' } });
    }
  },

  fulfill: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { trackingNumber, carrier } = req.body;
      
      const order = await prisma.order.update({
        where: { id },
        data: {
          status: 'FULFILLED',
          fulfillment: {
            create: {
              trackingNumber,
              carrier,
              trackingUrl: `https://track.mock.com/${trackingNumber}`
            }
          }
        }
      });
      res.json({ success: true, data: { success: true } });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fulfill order' } });
    }
  }
};
