// --- ENUMS ---
export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING_AT_SUPPLIER = 'PROCESSING_AT_SUPPLIER',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REQUIRES_ATTENTION = 'REQUIRES_ATTENTION',
  FULFILLED = 'FULFILLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

// --- CORE ENTITIES ---

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Variant {
  id: string;
  sku: string;
  name: string; // "Large / Black"
  price: number;
  inventory: number;
  supplierSku?: string;
}

export interface Product {
  id: string;
  slug?: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  tags?: string[];
  status: ProductStatus;
  variants: Variant[];
  supplier?: string;
  supplierId?: string;
  createdAt?: string;
  updatedAt?: string;
  price: number;
  compareAtPrice?: number;
  isFeatured?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
}

// --- VIEW MODELS (Optimized for UI) ---

// Used on PLP - Lightweight
export interface ProductListingItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  thumbnail: string;
  hoverImage?: string;
  isNew: boolean;
  isSoldOut: boolean;
  category: string;
}

// Used on PDP - Full Detail
export interface ProductDetailViewModel extends Product {
  relatedProducts: ProductListingItem[];
  seoTitle?: string;
  seoDescription?: string;
}

// Used in Cart
export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}

// Used in Admin List
export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  supplierName: string;
}

// --- API RESPONSES ---

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  activeProducts: number;
  conversionRate: number;
}