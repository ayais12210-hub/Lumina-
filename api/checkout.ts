
import { CartItem, ApiResponse } from '../types';

const SIMULATED_DELAY = 1500;

export const checkoutApi = {
  createSession: async (items: CartItem[]): Promise<ApiResponse<{ clientSecret: string; total: number }>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      success: true,
      data: {
        clientSecret: 'mock_secret_' + Math.random().toString(36).substring(7),
        total
      }
    };
  },

  processPayment: async (details: any): Promise<ApiResponse<{ orderId: string }>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

    // Simulate logic: if email contains 'error', fail.
    if (details.email && details.email.includes('error')) {
      return {
        success: false,
        data: { orderId: '' },
        error: { code: 'PAYMENT_FAILED', message: 'Card declined. Please try a different payment method.' }
      };
    }

    return {
      success: true,
      data: {
        orderId: 'ord_' + Math.random().toString(36).substring(2, 9).toUpperCase()
      }
    };
  }
};
