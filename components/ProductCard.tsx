import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ProductListingItem } from '../types';

interface ProductCardProps {
  product: ProductListingItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="group block relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-3">
        <img
          src={product.thumbnail}
          alt={product.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${product.hoverImage ? 'group-hover:opacity-0' : ''}`}
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.compareAtPrice && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Sale</span>
            )}
            {product.isNew && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">New</span>
            )}
        </div>

        {/* OOS Overlay */}
        {product.isSoldOut && (
             <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                <span className="bg-slate-900 text-white px-3 py-1 text-xs uppercase font-bold tracking-widest">Sold Out</span>
             </div>
        )}

        {/* Quick Action Overlay */}
        {!product.isSoldOut && (
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                <button className="w-full bg-white/90 backdrop-blur text-slate-900 h-10 text-xs font-bold uppercase tracking-wide hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg">
                    View Details <Plus className="w-3 h-3" />
                </button>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{product.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{product.category}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-900">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-slate-400 line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
};