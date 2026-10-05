import { ArrowRight, BedDouble, CheckCircle2, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// NOTE: This authentication system is a client-side DEMO implementation using LocalStorage.
export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err: unknown) {
      console.error('Login submit error:', err);
      const msg = err instanceof Error ? err.message : 'Invalid credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col lg:flex-row bg-white">
      {/* Left Column: Navy-50 Brand Panel with Logo & Promises */}
      <div className="lg:w-1/2 bg-[#EEF4FF] p-8 lg:p-16 flex flex-col justify-between border-r border-[#E6EAF2]">
        <div>
          <Logo size="lg" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F5C] mt-10 leading-tight">
            Institutional Procurement Portal
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed max-w-md">
            Direct access to hospital-grade, hotel-compliant cleaning chemicals with simplified commercial delivery.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-white text-[#1F6FEB] flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1F5C]">Superior Cleaning Formulation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-white text-[#1F6FEB] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1F5C]">Safe & Highly Effective</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-white text-[#2E9B3E] flex items-center justify-center shadow-sm">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1F5C]">Eco Responsible Ingredients</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-white text-[#1F6FEB] flex items-center justify-center shadow-sm">
                <BedDouble className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1F5C]">Formulated for Hospitality</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E6EAF2] text-xs text-[#94A3B8]">
          Clean Today, Better Tomorrow • CleanTec Hospitality Chemicals™
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-[#0A1F5C]">Sign In to Your Account</h1>
        <p className="mt-1.5 text-sm text-[#475569]">
          Manage orders, view delivery history, and re-order commercial chemicals.
        </p>

        {/* Demo Credentials Helper (Part G Requirement) */}
        <div className="mt-6 p-4 rounded-[12px] bg-[#F7F9FC] border border-[#E6EAF2] flex flex-col gap-2.5">
          <span className="text-xs font-bold text-[#0A1F5C] uppercase tracking-wider">
            ⚡ Quick Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('hari@gmail.com', 'Hari@123')}
              className="px-3 py-2 rounded-[8px] bg-white border border-[#E6EAF2] hover:border-[#1F6FEB] text-left text-xs transition-colors group cursor-pointer"
            >
              <strong className="text-[#0A1F5C] block">Customer (Hari)</strong>
              <span className="text-[11px] text-[#94A3B8]">hari@gmail.com</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('admin@gmail.com', 'Admin@123')}
              className="px-3 py-2 rounded-[8px] bg-white border border-[#E6EAF2] hover:border-[#1F6FEB] text-left text-xs transition-colors group cursor-pointer"
            >
              <strong className="text-[#0A1F5C] block">Admin Portal</strong>
              <span className="text-[11px] text-[#94A3B8]">admin@gmail.com</span>
            </button>
          </div>
          <span className="text-[10px] text-[#94A3B8]">
            Click any demo profile to auto-fill credentials.
          </span>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-[8px] bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. hari@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In to CleanTec
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#475569]">
          Don't have a commercial account yet?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-bold text-[#1F6FEB] hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
