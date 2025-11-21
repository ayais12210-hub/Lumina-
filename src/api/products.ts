import { client } from './client';
import { ProductListingItem, ProductDetailViewModel, ApiResponse } from '../types';

export const productsApi = {
  getAll: (category?: string): Promise<ApiResponse<ProductListingItem[]>> => {
    const query = category ? `?category=${category}` : '';
    return client.get<ProductListingItem[]>(`/products${query}`);
  },

  getById: (id: string): Promise<ApiResponse<ProductDetailViewModel>> => {
    return client.get<ProductDetailViewModel>(`/products/${id}`);
  }
};