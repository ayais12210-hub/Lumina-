import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Star, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { productsApi } from '../api/products';
import { ProductDetailViewModel, Variant } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<ProductDetailViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await productsApi.getById(id);
        if (response.success && response.data) {
          setProduct(response.data);
          // Default to first variant
          if (response.data.variants.length > 0) {
            setSelectedVariant(response.data.variants[0]);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addToCart(product, selectedVariant);
      showToast(`Added ${product.title} (${selectedVariant.name}) to cart`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-xl font-display">Product not found</h2>
        <Link to="/products" className="text-blue-600 mt-4 inline-block">Back to collection</Link>
      </div>
    );
  }

  const isOOS = selectedVariant.inventory === 0;

  return (
    <div className="bg-white pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbish */}
        <Link to="/products" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 text-sm">
           <ArrowLeft className="w-4 h-4 mr-1" /> Back to {product.category || 'Shop'}
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="h-full w-full object-cover object-center"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-[4/5] w-full overflow-hidden bg-slate-100">
                    <img src={img} alt="" className="h-full w-full object-cover object-center" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
            <div className="mb-6">
              <h1 className="text-4xl font-display text-slate-900 tracking-tight">{product.title}</h1>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-medium text-slate-900">${selectedVariant.price}</p>
                    {product.compareAtPrice && (
                        <span className="text-lg text-slate-400 line-through">${product.compareAtPrice}</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-900">4.8</span>
                  <span className="text-sm text-slate-500">(124 reviews)</span>
                </div>
              </div>
            </div>

            <div className="py-6 border-y border-slate-100 space-y-6">
              <p className="text-base text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-slate-500">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> In Stock & Ready to Ship
                </li>
                <li className="flex items-center text-sm text-slate-500">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Free Shipping over $200
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {/* Variants */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Select Option</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => {
                    const isVariantOOS = variant.inventory === 0;
                    const isSelected = selectedVariant.id === variant.id;
                    
                    return (
                        <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={isVariantOOS}
                        className={`px-4 py-2 text-sm border transition-all relative ${
                            isSelected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : isVariantOOS 
                                ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                                : 'border-slate-200 text-slate-900 hover:border-slate-900'
                        }`}
                        >
                        {variant.name}
                        </button>
                    )
                  })}
                </div>
              </div>

              <Button 
                fullWidth 
                size="lg"
                disabled={isOOS}
                onClick={handleAddToCart}
              >
                {isOOS ? 'Sold Out' : `Add to Cart - $${selectedVariant.price}`}
              </Button>
              
              <p className="mt-4 text-xs text-center text-slate-400">
                Secure checkout powered by Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
            <div className="mt-24 pt-12 border-t border-slate-100">
                <h2 className="text-2xl font-display text-slate-900 mb-8">You might also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                    {product.relatedProducts.map(related => (
                        <ProductCard key={related.id} product={related} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};