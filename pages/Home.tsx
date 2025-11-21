import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { MOCK_PRODUCTS } from '../constants';

export const Home: React.FC = () => {
  const featuredProduct = MOCK_PRODUCTS[0];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=80" 
            alt="Modern Interior" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <span className="text-blue-400 font-medium tracking-widest uppercase text-sm mb-4">New Collection 2024</span>
          <h1 className="text-5xl md:text-7xl font-display font-light tracking-tight leading-tight max-w-3xl">
            Elevate your space <br/> with silence.
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed font-light">
            Discover our curated selection of minimalist furniture and decor. 
            Designed for clarity, crafted for comfort.
          </p>
          <div className="mt-10 flex gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">Shop Collection</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">View Lookbook</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Product Split */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">Iconic Design</h2>
            <h3 className="text-4xl font-display text-slate-900 mb-6">{featuredProduct.title}</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {featuredProduct.description}
              <br /><br />
              Meticulously engineered to provide the perfect balance of support and softness.
            </p>
            <Link to={`/products/${featuredProduct.id}`}>
              <Button variant="outline">View Details <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative group">
             <div className="absolute -inset-4 bg-slate-50 rounded-xl -z-10 transform group-hover:rotate-1 transition-transform duration-500" />
             <img 
               src={featuredProduct.images[0]} 
               alt={featuredProduct.title} 
               className="w-full h-[500px] object-cover shadow-sm"
             />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-display text-slate-900">Shop by Category</h2>
            <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Furniture', 'Lighting', 'Decor'].map((cat, i) => (
              <Link key={cat} to={`/products?cat=${cat.toLowerCase()}`} className="group relative overflow-hidden h-80">
                <img 
                  src={[
                    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1513506003011-382928420130?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'
                  ][i]} 
                  alt={cat}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl text-white font-display">{cat}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border border-slate-100">
            <h3 className="text-lg font-semibold mb-2">Global Curation</h3>
            <p className="text-slate-500 text-sm">Sourced from the finest independent designers worldwide.</p>
          </div>
          <div className="p-8 border border-slate-100">
            <h3 className="text-lg font-semibold mb-2">Secure Shipping</h3>
            <p className="text-slate-500 text-sm">Tracked delivery to your door in 100% sustainable packaging.</p>
          </div>
          <div className="p-8 border border-slate-100">
            <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-slate-500 text-sm">30-day return window on all items. No questions asked.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
