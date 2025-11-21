
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { setIsOpen, itemCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle Scroll Effect for Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/account/orders');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <nav 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-100' 
            : 'bg-white/0 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Left: Logo */}
            <div className="flex items-center">
              <button 
                className="p-2 -ml-2 mr-2 md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-slate-900">
                Lumina<span className="text-blue-600">.</span>
              </Link>
            </div>

            {/* Center: Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:-translate-y-0.5 transition-all">Shop All</Link>
              <Link to="/products?cat=furniture" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:-translate-y-0.5 transition-all">Furniture</Link>
              <Link to="/products?cat=lighting" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:-translate-y-0.5 transition-all">Lighting</Link>
              <Link to="/products?cat=tech" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:-translate-y-0.5 transition-all">Tech</Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleUserClick}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
                title={isAuthenticated ? (isAdmin ? "Admin Dashboard" : "My Account") : "Sign In"}
              >
                <User className="w-5 h-5" />
                {isAuthenticated && !isAdmin && <span className="text-xs font-medium hidden lg:block">Hi, {user?.name}</span>}
              </button>

              <button 
                className="p-2 text-slate-900 hover:text-blue-600 transition-colors relative group"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-white pt-24 px-6 animate-fade-in">
           <div className="flex flex-col space-y-6 text-lg font-display font-medium">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
              <Link to="/products?cat=furniture" onClick={() => setMobileMenuOpen(false)}>Furniture</Link>
              <Link to="/products?cat=lighting" onClick={() => setMobileMenuOpen(false)}>Lighting</Link>
              <Link to="/products?cat=tech" onClick={() => setMobileMenuOpen(false)}>Tech</Link>
              <hr className="border-slate-100" />
              {isAuthenticated ? (
                 <>
                    <button onClick={handleUserClick} className="text-left">My Account</button>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-slate-500">Sign Out</button>
                 </>
              ) : (
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
           </div>
        </div>
      )}
    </>
  );
};
