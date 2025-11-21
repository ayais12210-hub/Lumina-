
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Search, Bell } from 'lucide-react';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
        isActive 
          ? 'border-blue-500 bg-slate-900 text-white' 
          : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-950 text-white flex flex-col border-r border-slate-900">
        <div className="h-16 flex items-center px-6 border-b border-slate-900">
           <Link to="/admin" className="text-xl font-display font-semibold tracking-tight">
             Lumina<span className="text-blue-500">.</span> Ops
           </Link>
        </div>

        <div className="flex-1 py-6 space-y-1 overflow-y-auto">
          <SidebarItem to="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
          <SidebarItem to="/admin/products" icon={<Package className="w-4 h-4" />} label="Products" />
          <SidebarItem to="/admin/orders" icon={<ShoppingCart className="w-4 h-4" />} label="Orders" />
          <div className="pt-6 mt-6 border-t border-slate-900">
            <p className="px-6 text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">System</p>
            <SidebarItem to="/admin/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center gap-3 px-2">
             <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-xs font-bold">AD</div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium truncate">Admin User</p>
               <p className="text-xs text-slate-500 truncate">admin@lumina.store</p>
             </div>
             <button className="text-slate-500 hover:text-white">
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
           {/* Global Search (Mock) */}
           <div className="flex items-center flex-1 max-w-md">
             <Search className="w-4 h-4 text-slate-400 mr-3" />
             <input 
               type="text" 
               placeholder="Search orders, products, customers..." 
               className="w-full text-sm border-none focus:ring-0 placeholder-slate-400"
             />
           </div>
           
           <div className="flex items-center gap-4">
             <button className="relative p-2 text-slate-400 hover:text-slate-600">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-100 bg-blue-50 px-3 py-1.5 rounded-full">
               View Storefront
             </Link>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
