import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const where = category ? { category: String(category), status: 'ACTIVE' } : { status: 'ACTIVE' };
      
      const products = await prisma.product.findMany({
        where,
        include: { variants: true },
        orderBy: { createdAt: 'desc' }
      });

      const mapped = products.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
        thumbnail: p.images[0] || '',
        hoverImage: p.images[1] || '',
        isNew: p.isFeatured,
        isSoldOut: p.variants.every(v => v.inventory === 0),
        category: p.category
      }));

      res.json({ success: true, data: mapped });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch products' } });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: { variants: true }
      });

      if (!product) {
        return res.status(404).json({ success: false, error: { code: '404', message: 'Product not found' } });
      }

      // Fetch related (same category, not self)
      const related = await prisma.product.findMany({
        where: { category: product.category, id: { not: product.id }, status: 'ACTIVE' },
        take: 4,
        include: { variants: true }
      });

      res.json({ 
        success: true, 
        data: {
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
          variants: product.variants.map(v => ({ ...v, price: Number(v.price) })),
          relatedProducts: related.map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            price: Number(p.price),
            thumbnail: p.images[0],
            category: p.category,
            isNew: p.isFeatured,
            isSoldOut: p.variants.every(v => v.inventory === 0)
          }))
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch product' } });
    }
  },
  
  create: async (req: Request, res: Response) => {
    try {
      const { title, price, description, category, images, variants, supplier, status, isFeatured, compareAtPrice } = req.body;
      
      // Generate simple slug
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

      const product = await prisma.product.create({
        data: {
          title,
          slug,
          price,
          compareAtPrice,
          description,
          category,
          images,
          supplier,
          status: status || 'DRAFT',
          isFeatured: isFeatured || false,
          variants: {
            create: variants.map((v: any) => ({
              sku: v.sku,
              name: v.name,
              price: v.price,
              inventory: parseInt(v.inventory),
              supplierSku: v.supplierSku
            }))
          }
        },
        include: { variants: true }
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error('Create Product Error:', error);
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to create product' } });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { variants, ...data } = req.body;

      // 1. Update Product Basic Info
      const product = await prisma.product.update({
        where: { id },
        data: data,
      });

      // 2. Handle Variants (Simple strategy: Delete all and Re-create for this MVP)
      // In production, you'd want to upsert to preserve IDs/Order History links better
      if (variants && variants.length > 0) {
        await prisma.variant.deleteMany({ where: { productId: id } });
        await prisma.variant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
            sku: v.sku,
            name: v.name,
            price: v.price,
            inventory: parseInt(v.inventory),
            supplierSku: v.supplierSku
          }))
        });
      }

      const updated = await prisma.product.findUnique({
        where: { id },
        include: { variants: true }
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Update Product Error:', error);
      res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Failed to update product' } });
    }
  }
};