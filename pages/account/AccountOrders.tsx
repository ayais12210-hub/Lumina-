import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api/admin'; // Reusing mock API for simplicity
import { Order } from '../../types';

export const AccountOrders: React.FC = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, this would be a separate API endpoint filtering by user ID
    // Here we just fetch all mock orders to simulate the UI
    const fetchOrders = async () => {
      const res = await adminApi.getOrders();
      if (res.success) {
         // Simulate filtering
         setOrders(res.data.slice(0, 3)); 
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-12">
          <div>
             <h1 className="text-3xl font-display font-bold text-slate-900">My Account</h1>
             <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button 
            onClick={logout}
            className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-red-200 rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar / Nav */}
          <div className="space-y-1">
            <Link to="/account/orders" className="block px-4 py-3 bg-slate-50 text-slate-900 font-medium border-l-2 border-slate-900">Order History</Link>
            <Link to="/account/profile" className="block px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors border-l-2 border-transparent">Profile & Settings</Link>
            <Link to="/account/addresses" className="block px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors border-l-2 border-transparent">Addresses</Link>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-4">Recent Orders</h2>

            {orders.length === 0 ? (
               <div className="text-center py-12 bg-slate-50 border border-slate-100 border-dashed">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">You haven't placed any orders yet.</p>
               </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-slate-200 p-6 hover:border-slate-300 transition-colors bg-white group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-mono text-lg font-medium text-slate-900">#{order.id}</h3>
                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                              ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}
                           `}>
                             {order.status}
                           </span>
                        </div>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                      <div className="text-left sm:text-right">
                         <p className="text-lg font-medium text-slate-900">${order.total.toFixed(2)}</p>
                         <p className="text-xs text-slate-500">{order.itemsCount} items</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex -space-x-2 overflow-hidden">
                          {/* Mock item images for visual flair */}
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100"></div>
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200"></div>
                       </div>
                       <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center group-hover:translate-x-1 transition-transform">
                          View Details <ArrowRight className="w-4 h-4 ml-1" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};