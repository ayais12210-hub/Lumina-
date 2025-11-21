
import React, { useEffect, useState } from 'react';
import { BarChart, Users, Package, DollarSign, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { adminApi } from '../api/admin';
import { DashboardStats, Order } from '../types';

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode }> = ({ title, value, trend, icon }) => (
  <div className="bg-white p-6 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-900">{icon}</div>
      <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-2 py-1 rounded">
        {trend} <TrendingUp className="w-3 h-3 ml-1" />
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
            adminApi.getStats(),
            adminApi.getOrders()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (ordersRes.success) setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !stats) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
      )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-display font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of your store performance.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">Export Report</button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          trend="+12.5%" 
          icon={<DollarSign className="w-5 h-5" />} 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders.toString()} 
          trend="+8.2%" 
          icon={<Package className="w-5 h-5" />} 
        />
        <StatCard 
          title="Active Products" 
          value={stats.activeProducts.toString()} 
          trend="+2" 
          icon={<BarChart className="w-5 h-5" />} 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats.conversionRate}%`} 
          trend="+0.4%" 
          icon={<Users className="w-5 h-5" />} 
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-900">Recent Orders</h3>
          <button className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800">
            View All <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'FULFILLED' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
