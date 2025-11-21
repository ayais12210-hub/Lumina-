
import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from './Button';

export const CartDrawer: React.FC = () => {
  const { isOpen, setIsOpen, items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="flex flex-col h-full bg-white shadow-2xl animate-slide-in-right">
            
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
              <h2 className="text-lg font-display font-medium">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-8">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex py-2">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-slate-100 bg-slate-50">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-slate-900">
                            <h3>{item.title}</h3>
                            <p className="ml-4">${item.price}</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{item.variantName}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-slate-500">Qty {item.quantity}</p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/50">
                <div className="flex justify-between text-base font-medium text-slate-900 mb-4">
                  <p>Subtotal</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-slate-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button fullWidth size="lg" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
