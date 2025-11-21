import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import { productsApi } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { ProductListingItem } from '../types';

export const ProductListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('cat');
  
  const [products, setProducts] = useState<ProductListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Type assertion to string | undefined for the API
        const response = await productsApi.getAll(category || undefined);
        if (response.success) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="bg-white min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h1 className="text-4xl font-display text-slate-900 mb-4">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
            </h1>
            <p className="text-slate-500 max-w-md">A collection of essential items for the modern home.</p>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
            <button className="flex items-center px-4 py-2 border border-slate-200 text-sm font-medium hover:border-slate-900 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
            <button className="flex items-center px-4 py-2 border border-slate-200 text-sm font-medium hover:border-slate-900 transition-colors">
              Sort by: Featured <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};