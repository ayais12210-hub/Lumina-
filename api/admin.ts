
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_STATS } from '../constants';
import { ApiResponse, DashboardStats, Product, Order, OrderStatus } from '../types';

const SIMULATED_DELAY = 800;

export const adminApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return { success: true, data: MOCK_STATS };
  },

  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return { success: true, data: MOCK_PRODUCTS };
  },
  
  getProductById: async (id: string): Promise<ApiResponse<Product | null>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return { success: true, data: product || null };
  },
  
  saveProduct: async (product: Partial<Product>): Promise<ApiResponse<Product>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    // Mock save logic
    console.log('Saved product:', product);
    return { 
      success: true, 
      data: { ...product, id: product.id || Math.random().toString(36).substr(2, 9) } as Product 
    };
  },

  getOrders: async (statusFilter?: OrderStatus): Promise<ApiResponse<Order[]>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    let orders = [...MOCK_ORDERS];
    if (statusFilter) {
      orders = orders.filter(o => o.status === statusFilter);
    }
    return { success: true, data: orders };
  },

  syncInventory: async (): Promise<ApiResponse<{ synced: number }>> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay for sync
    return { success: true, data: { synced: 14 } };
  },

  fulfillOrder: async (orderId: string): Promise<ApiResponse<{ success: boolean }>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    console.log(`Order ${orderId} sent to supplier...`);
    return { success: true, data: { success: true } };
  },

  // Mock Settings
  getSettings: async (): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return {
      success: true,
      data: {
        storeName: 'Lumina Store',
        supportEmail: 'support@lumina.store',
        currency: 'USD',
        autoFulfill: false,
        notifications: {
          orderEmail: true,
          lowStock: true,
        },
        integrations: {
          aliExpress: { connected: true, apiKey: '****' },
          cjDropshipping: { connected: false, apiKey: '' }
        }
      }
    }
  },

  saveSettings: async (settings: any): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return { success: true, data: settings };
  }
};
