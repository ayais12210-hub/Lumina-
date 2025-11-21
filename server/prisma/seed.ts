import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    title: 'Eames-Style Lounge Chair',
    slug: 'eames-style-lounge-chair',
    description: 'Mid-century modern design icon. Premium leather upholstery with walnut wood veneer. A statement piece for any living space.',
    category: 'Furniture',
    price: 1299.00,
    compareAtPrice: 1599.00,
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'PremiumFurn',
    status: 'ACTIVE',
    isFeatured: true,
    variants: [
      { sku: 'ELC-BLK', name: 'Black Leather', price: 1299.00, inventory: 5 },
      { sku: 'ELC-WHT', name: 'White Leather', price: 1299.00, inventory: 2 },
    ]
  },
  {
    title: 'Minimalist Concrete Lamp',
    slug: 'minimalist-concrete-lamp',
    description: 'Hand-poured concrete base with an exposed filament bulb. Industrial chic meets warm ambient lighting.',
    category: 'Lighting',
    price: 89.00,
    images: [
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'UrbanLight',
    status: 'ACTIVE',
    variants: [
      { sku: 'MCL-GRY', name: 'Grey', price: 89.00, inventory: 20 }
    ]
  },
  {
    title: 'Ceramic Pour-Over Set',
    slug: 'ceramic-pour-over-set',
    description: 'Artisan crafted ceramic coffee dripper and carafe. Designed for the perfect bloom and extraction.',
    category: 'Kitchen',
    price: 45.00,
    images: [
      'https://images.unsplash.com/photo-1544510802-5dc38c242ea5?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'KitchenCraft',
    status: 'ACTIVE',
    isFeatured: true,
    variants: [
      { sku: 'CPO-BLK', name: 'Matte Black', price: 45.00, inventory: 15 },
      { sku: 'CPO-WHT', name: 'Speckled White', price: 45.00, inventory: 8 }
    ]
  },
  {
    title: 'Smart Air Purifier',
    slug: 'smart-air-purifier',
    description: 'HEPA filtration with real-time air quality monitoring. Silent operation for bedroom use.',
    category: 'Electronics',
    price: 199.00,
    images: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'TechDrop',
    status: 'DRAFT',
    variants: [
      { sku: 'SAP-001', name: 'Standard', price: 199.00, inventory: 0 }
    ]
  }
];

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumina.store' },
    update: {},
    create: {
      email: 'admin@lumina.store',
      name: 'Admin User',
      password,
      role: 'ADMIN'
    }
  });
  console.log(`Created user: ${admin.email} (Role: ${admin.role})`);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@lumina.store' },
    update: {},
    create: {
      email: 'customer@lumina.store',
      name: 'Alice Customer',
      password,
      role: 'CUSTOMER'
    }
  });
  console.log(`Created user: ${customer.email} (Role: ${customer.role})`);

  // 2. Create Settings
  await prisma.storeSettings.upsert({
    where: { id: 'default-settings' }, // Assuming a fixed ID logic or singleton pattern
    update: {},
    create: {
      storeName: 'Lumina Store',
      supportEmail: 'support@lumina.store',
      notifications: { orderEmail: true, lowStock: true },
      integrations: { aliExpress: { connected: false, apiKey: '' }, cjDropshipping: { connected: false, apiKey: '' } }
    }
  }).catch(() => {
    // If upsert fails due to ID constraint on singleton, ignore or handle gracefully
    // Prisma upsert needs a unique where clause. If ID is UUID, tricky to predict. 
    // We'll rely on the controller creating it if missing.
  });

  // 3. Create Products
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        images: p.images // Ensure images are updated on re-seed
      },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        images: p.images,
        supplier: p.supplier,
        status: p.status,
        isFeatured: p.isFeatured,
        variants: {
          create: p.variants
        }
      }
    });
    console.log(`Created product: ${product.title}`);
  }

  console.log('✅ Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
