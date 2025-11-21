
import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, MoreHorizontal, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { Product, ProductStatus } from '../../types';
import { integrationService } from '../../services/integration';
import { useToast } from '../../contexts/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminApi.getProducts();
      if (res.success) setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    showToast('Starting global inventory sync...', 'info');
    try {
      const result = await integrationService.syncInventoryFromSuppliers();
      showToast(`Sync Complete: Updated ${result.updatedCount} products.`, 'success');
      await fetchProducts(); // Refresh UI
    } catch (e) {
      showToast('Inventory Sync Failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-semibold text-slate-900">Products</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Inventory'}
          </button>
          <Link to="/admin/products/new" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Import Product
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Inventory</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {products.map((product) => {
              const totalInventory = product.variants.reduce((sum, v) => sum + v.inventory, 0);
              return (
                <tr 
                  key={product.id} 
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden bg-slate-100 rounded-sm">
                        <img className="h-10 w-10 object-cover" src={product.images[0]} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{product.title}</div>
                        <div className="text-xs text-slate-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {product.supplier || 'AliExpress'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === ProductStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                     <span className={`${totalInventory === 0 ? 'text-red-500 font-medium' : ''}`}>
                       {totalInventory} in stock
                     </span>
                     <div className="text-xs text-slate-400">{product.variants.length} variants</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
