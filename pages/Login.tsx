import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Form/Input';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Mock password
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl font-display font-bold tracking-tighter text-slate-900">
          Lumina<span className="text-blue-600">.</span>
        </Link>
        <h2 className="mt-6 text-3xl font-display font-bold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Or <a href="#" className="font-medium text-blue-600 hover:text-blue-500">create a new account</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-none sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              label="Email address" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              label="Password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button fullWidth disabled={loading} className="bg-slate-900">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-white text-slate-500">Demo Credentials</span>
                </div>
             </div>
             <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-500 text-center">
                <div className="p-2 bg-slate-50 rounded border border-slate-100 cursor-pointer hover:bg-slate-100" onClick={() => setEmail('customer@lumina.store')}>
                   Customer: customer@lumina.store
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 cursor-pointer hover:bg-slate-100" onClick={() => setEmail('admin@lumina.store')}>
                   Admin: admin@lumina.store
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};