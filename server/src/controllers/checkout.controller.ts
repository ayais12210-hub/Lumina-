
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkoutController = {
  createSession: async (req: Request, res: Response) => {
    try {
      const { items } = req.body;
      let total = 0;
      for (const item of items) {
        const variant = await prisma.variant.findUnique({ where: { id: item.variantId } });
        if (variant) total += Number(variant.price) * item.quantity;
      }
      res.json({
        success: true,
        data: { clientSecret: `mock_pi_${Date.now()}`, total }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid items' } });
    }
  },

  processPayment: async (req: Request, res: Response) => {
    try {
      const { items, email, firstName, lastName, address, city, zip } = req.body;
      
      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const variant = await prisma.variant.findUnique({ where: { id: item.variantId } });
        if (!variant) throw new Error('Variant not found');
        if (variant.inventory < item.quantity) throw new Error(`OOS: ${variant.name}`);
        
        const lineTotal = Number(variant.price) * item.quantity;
        calculatedTotal += lineTotal;
        orderItemsData.push({
          variantId: variant.id,
          quantity: item.quantity,
          unitPrice: variant.price,
          totalPrice: lineTotal
        });
      }

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            total: calculatedTotal,
            guestEmail: email,
            guestName: `${firstName} ${lastName}`,
            shippingAddress: { address, city, zip },
            status: 'PAID',
            paymentStatus: 'PAID',
            items: {
              create: orderItemsData.map(d => ({
                variant: { connect: { id: d.variantId } },
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                totalPrice: d.totalPrice
              }))
            }
          }
        });

        for (const item of items) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { inventory: { decrement: item.quantity } }
          });
        }
        return newOrder;
      });

      res.json({ success: true, data: { orderId: order.id } });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: { code: 'PAYMENT_ERROR', message: error.message || 'Payment failed' } });
    }
  }
};
