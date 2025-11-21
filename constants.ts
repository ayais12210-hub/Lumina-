import { Product, ProductStatus, Order, OrderStatus, DashboardStats } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Eames-Style Lounge Chair',
    description: 'Mid-century modern design icon. Premium leather upholstery with walnut wood veneer. A statement piece for any living space.',
    category: 'Furniture',
    price: 1299.00,
    compareAtPrice: 1599.00,
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'PremiumFurn',
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    variants: [
      { id: 'v1-1', name: 'Black Leather', sku: 'ELC-BLK', price: 1299, inventory: 5 },
      { id: 'v1-2', name: 'White Leather', sku: 'ELC-WHT', price: 1299, inventory: 2 },
    ]
  },
  {
    id: 'p2',
    title: 'Minimalist Concrete Lamp',
    description: 'Hand-poured concrete base with an exposed filament bulb. Industrial chic meets warm ambient lighting.',
    category: 'Lighting',
    price: 89.00,
    images: [
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'UrbanLight',
    status: ProductStatus.ACTIVE,
    variants: [
      { id: 'v2-1', name: 'Grey', sku: 'MCL-GRY', price: 89, inventory: 20 }
    ]
  },
  {
    id: 'p3',
    title: 'Ceramic Pour-Over Set',
    description: 'Artisan crafted ceramic coffee dripper and carafe. Designed for the perfect bloom and extraction.',
    category: 'Kitchen',
    price: 45.00,
    images: [
      'https://images.unsplash.com/photo-1544510802-5dc38c242ea5?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'KitchenCraft',
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    variants: [
      { id: 'v3-1', name: 'Matte Black', sku: 'CPO-BLK', price: 45, inventory: 15 },
      { id: 'v3-2', name: 'Speckled White', sku: 'CPO-WHT', price: 45, inventory: 8 }
    ]
  },
  {
    id: 'p4',
    title: 'Smart Air Purifier',
    description: 'HEPA filtration with real-time air quality monitoring. Silent operation for bedroom use.',
    category: 'Electronics',
    price: 199.00,
    images: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=800&q=80'
    ],
    supplier: 'TechDrop',
    status: ProductStatus.DRAFT,
    variants: [
      { id: 'v4-1', name: 'Standard', sku: 'SAP-001', price: 199, inventory: 0 }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'o1001', customerName: 'Alex Chen', date: '2023-10-24', total: 1299.00, status: OrderStatus.PENDING, itemsCount: 1 },
  { id: 'o1002', customerName: 'Sarah Jones', date: '2023-10-23', total: 134.00, status: OrderStatus.FULFILLED, itemsCount: 2 },
  { id: 'o1003', customerName: 'Mike Ross', date: '2023-10-22', total: 45.00, status: OrderStatus.PAID, itemsCount: 1 },
  { id: 'o1004', customerName: 'Emily Blunt', date: '2023-10-21', total: 2500.00, status: OrderStatus.CANCELLED, itemsCount: 3 },
];

export const MOCK_STATS: DashboardStats = {
  revenue: 45290.00,
  orders: 124,
  activeProducts: 34,
  conversionRate: 2.4
};
