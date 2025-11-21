import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter text-white">
              Lumina<span className="text-blue-500">.</span>
            </Link>
            <p className="mt-6 text-slate-400 text-sm leading-relaxed max-w-xs">
              Defining the intersection of technology and lifestyle. curated for the modern minimalist.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Collections</h3>
            <ul className="space-y-4">
              <li><Link to="/products?cat=furniture" className="text-sm text-slate-300 hover:text-white transition-colors">Furniture</Link></li>
              <li><Link to="/products?cat=lighting" className="text-sm text-slate-300 hover:text-white transition-colors">Lighting</Link></li>
              <li><Link to="/products?cat=tech" className="text-sm text-slate-300 hover:text-white transition-colors">Tech Objects</Link></li>
              <li><Link to="/products" className="text-sm text-slate-300 hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">Join our list for exclusive drops and design journals.</p>
            <form className="flex gap-0">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors placeholder-slate-600"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 text-sm font-medium hover:bg-blue-500 transition-colors">
                Join
              </button>
            </form>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-600">&copy; 2024 Lumina Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
