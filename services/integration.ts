import { Order } from '../types';

// Simulated Supplier API Response
interface SupplierResponse {
  success: boolean;
  trackingNumber?: string;
  estimatedDelivery?: string;
  error?: string;
}

export const integrationService = {
  /**
   * Simulates sending an order to a supplier like AliExpress or CJ Dropshipping.
   * Includes random failure simulation for "Attention Needed" testing.
   */
  sendOrderToSupplier: async (order: Order): Promise<SupplierResponse> => {
    console.log(`[Integration] Sending Order #${order.id} to Supplier...`);
    
    // Simulate network latency (1.5s - 3s)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    // 10% chance of failure (Out of stock or API error)
    const shouldFail = Math.random() < 0.1;

    if (shouldFail) {
      console.error(`[Integration] Supplier API Error for Order #${order.id}`);
      return {
        success: false,
        error: 'Supplier API Time-out / Out of Stock'
      };
    }

    const tracking = 'TRK' + Math.random().toString(36).substring(2, 10).toUpperCase();
    console.log(`[Integration] Order #${order.id} Accepted. Tracking: ${tracking}`);

    return {
      success: true,
      trackingNumber: tracking,
      estimatedDelivery: '12-15 Days'
    };
  },

  /**
   * Simulates a full inventory sync across all products.
   */
  syncInventoryFromSuppliers: async (): Promise<{ updatedCount: number }> => {
    console.log('[Integration] Starting Global Inventory Sync...');
    await new Promise(resolve => setTimeout(resolve, 2500));
    const count = Math.floor(Math.random() * 5) + 1; // Simulate 1-5 updates
    console.log(`[Integration] Sync Complete. ${count} products updated.`);
    return { updatedCount: count };
  }
};