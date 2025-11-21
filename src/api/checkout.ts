
import { client } from './client';
import { CartItem, ApiResponse } from '../types';

export interface CheckoutPayload {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  items: {
    variantId: string;
    quantity: number;
  }[];
}

export const checkoutApi = {
  createSession: (items: CartItem[]): Promise<ApiResponse<{ clientSecret: string; total: number }>> => {
    return client.post<{ clientSecret: string; total: number }>('/checkout/session', { items });
  },

  processPayment: (payload: CheckoutPayload): Promise<ApiResponse<{ orderId: string }>> => {
    return client.post<{ orderId: string }>('/checkout/process', payload);
  }
};
