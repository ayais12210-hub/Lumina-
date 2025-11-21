
import { client } from './client';
import { DashboardStats, Product, Order, OrderStatus, ApiResponse } from '../types';

export const adminApi = {
  getStats: (): Promise<ApiResponse<DashboardStats>> => {
    return client.get<DashboardStats>('/admin/stats');
  },

  getProducts: (): Promise<ApiResponse<Product[]>> => {
    return client.get<Product[]>('/admin/products');
  },
  
  getProductById: (id: string): Promise<ApiResponse<Product>> => {
    return client.get<Product>(`/admin/products/${id}`);
  },
  
  saveProduct: (product: Partial<Product>): Promise<ApiResponse<Product>> => {
    if (product.id) {
      return client.patch<Product>(`/admin/products/${product.id}`, product);
    }
    return client.post<Product>('/admin/products', product);
  },

  getOrders: (statusFilter?: OrderStatus): Promise<ApiResponse<Order[]>> => {
    const query = statusFilter ? `?status=${statusFilter}` : '';
    return client.get<Order[]>(`/admin/orders${query}`);
  },

  fulfillOrder: (orderId: string, trackingInfo?: { trackingNumber: string, carrier: string }): Promise<ApiResponse<{ success: boolean }>> => {
    const body = trackingInfo || { trackingNumber: 'TRK-'+Date.now(), carrier: 'MockExpress' };
    return client.post<{ success: boolean }>(`/admin/orders/${orderId}/fulfill`, body);
  },

  getSettings: (): Promise<ApiResponse<any>> => {
    return client.get<any>('/admin/settings');
  },

  saveSettings: (settings: any): Promise<ApiResponse<any>> => {
    return client.post<any>('/admin/settings', settings);
  }
};
