import React, { useEffect, useState } from 'react';
import { Filter, Truck, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Order, OrderStatus } from '../../types';
import { integrationService } from '../../services/integration';
import { useToast } from '../../contexts/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getOrders(filter === 'ALL' ? undefined : filter);
        if (res.success) setOrders(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filter]);

  const handleFulfill = async (order: Order) => {
    if (processingId) return;
    setProcessingId(order.id);
    showToast(`Routing Order #${order.id} to supplier...`);

    try {
      // Call the simulation service
      const result = await integrationService.sendOrderToSupplier(order);

      if (result.success) {
        setOrders(prev => prev.map(o => 
          o.id === order.id ? { ...o, status: OrderStatus.FULFILLED } : o
        ));
        showToast(`Order #${order.id} Fulfilled! Tracking: ${result.trackingNumber}`, 'success');
      } else {
        showToast(`Failed to fulfill #${order.id}: ${result.error}`, 'error');
      }
    } catch (err) {
       showToast('Integration Service Error', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-semibold text-slate-900">Orders</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {['ALL', OrderStatus.PAID, OrderStatus.FULFILLED, OrderStatus.PENDING].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                filter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status.replace(/_/g, ' ')}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
      ) : (
        <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === OrderStatus.PROCESSING_AT_SUPPLIER ? 'bg-blue-50 text-blue-600' : ''}
                      ${order.status === OrderStatus.FULFILLED ? 'bg-slate-100 text-slate-600' : ''}
                    `}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {order.itemsCount} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {order.status === OrderStatus.PAID && (
                      <button 
                        onClick={() => handleFulfill(order)}
                        disabled={processingId === order.id}
                        className={`text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-auto ${processingId === order.id ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        {processingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                        {processingId === order.id ? 'Routing...' : 'Fulfill'}
                      </button>
                    )}
                    {order.status === OrderStatus.FULFILLED && (
                        <span className="text-green-600 flex items-center justify-end gap-1">
                            <CheckCircle className="w-4 h-4" /> Done
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};