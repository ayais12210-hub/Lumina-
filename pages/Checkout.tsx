
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { checkoutApi } from '../api/checkout';
import { Input } from '../components/Form/Input';
import { Button } from '../components/Button';

export const Checkout: React.FC = () => {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await checkoutApi.processPayment(formData);
      if (response.success && response.data.orderId) {
        setOrderId(response.data.orderId);
        setStep('success');
        // Ideally clear cart here via context, handled via useEffect or simple call
        localStorage.removeItem('lumina_cart'); 
      } else {
        setError(response.error?.message || 'Payment failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <Link to="/products">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Order Confirmed</h1>
          <p className="text-slate-500 mb-8 text-lg">
            Thank you, {formData.firstName}. <br/>
            Your order <span className="font-mono font-medium text-slate-900">#{orderId}</span> has been placed.
          </p>
          <div className="flex gap-4 justify-center">
             <Link to="/">
               <Button variant="outline">Continue Shopping</Button>
             </Link>
             <Link to="/account/orders">
               <Button>Track Order</Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col lg:justify-start px-4 sm:px-8 lg:px-24 py-12 lg:pt-20 border-r border-slate-100">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-slate-900">
            Lumina<span className="text-blue-600">.</span>
          </Link>
          <Link to="/products" className="text-sm text-slate-500 hover:text-slate-900 flex items-center lg:hidden">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex text-sm font-medium mb-8">
          <span className={`${step === 'info' ? 'text-slate-900' : 'text-blue-600'}`}>Information</span>
          <span className="mx-4 text-slate-300">/</span>
          <span className={`${step === 'payment' ? 'text-slate-900' : 'text-slate-400'}`}>Payment</span>
        </nav>

        {step === 'info' && (
          <form onSubmit={handleInfoSubmit} className="max-w-lg space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <Input 
                label="Email address" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange}
                required 
              />
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input 
                  label="First name" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required 
                />
                <Input 
                  label="Last name" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required 
                />
                <div className="col-span-2">
                  <Input 
                    label="Address" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <Input 
                  label="City" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required 
                />
                <Input 
                  label="Postal code" 
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" fullWidth>Continue to Payment</Button>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="max-w-lg space-y-8 animate-fade-in">
            
            <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 text-sm text-slate-600 flex justify-between items-center">
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-wider">Ship to</span>
                {formData.address}, {formData.city}
              </div>
              <button 
                type="button" 
                onClick={() => setStep('info')} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Change
              </button>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Payment Method</h2>
              <p className="text-xs text-slate-400 mb-6 flex items-center">
                <Lock className="w-3 h-3 mr-1" /> All transactions are secure and encrypted.
              </p>
              
              <div className="space-y-6">
                 <Input 
                   label="Card number" 
                   name="cardNumber"
                   placeholder="0000 0000 0000 0000"
                   value={formData.cardNumber}
                   onChange={handleInputChange}
                   required 
                 />
                 <div className="grid grid-cols-2 gap-6">
                    <Input 
                      label="Expiration (MM/YY)" 
                      name="expiry"
                      placeholder="MM / YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required 
                    />
                    <Input 
                      label="CVC" 
                      name="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      required 
                    />
                 </div>
                 <Input 
                    label="Name on card" 
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required 
                 />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-2 border-red-500 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="pt-6 flex gap-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep('info')}
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-auto pt-12 text-xs text-slate-400">
          <Link to="/policies" className="hover:text-slate-900 mr-4">Privacy Policy</Link>
          <Link to="/policies" className="hover:text-slate-900 mr-4">Terms of Service</Link>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="hidden lg:block w-[40%] bg-slate-50 border-l border-slate-200 px-12 py-20 h-screen sticky top-0 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-medium text-slate-900 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.variantId} className="flex gap-4">
                <div className="relative h-16 w-16 bg-white border border-slate-200 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  <span className="absolute top-0 right-0 bg-slate-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-bl-md">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.variantName}</p>
                </div>
                <p className="text-sm font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Shipping</span>
              <span className="font-medium text-slate-900">Calculated at next step</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Taxes</span>
              <span className="font-medium text-slate-900">$0.00</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mt-6">
             <div className="flex justify-between items-baseline">
                <span className="text-base font-medium text-slate-900">Total</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-xs text-slate-500 uppercase">USD</span>
                   <span className="text-2xl font-display font-bold text-slate-900">${total.toFixed(2)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
