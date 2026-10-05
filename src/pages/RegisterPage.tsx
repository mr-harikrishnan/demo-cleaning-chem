import { BedDouble, CheckCircle2, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// NOTE: Demo authentication using LocalStorage persistence.
export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await register({
        name,
        email,
        password,
        phone,
        address,
        city,
        state,
        pincode
      });
      showToast(`Account created for ${user.name}!`, 'success');
      navigate(redirect);
    } catch (err: unknown) {
      console.error('Registration submit error:', err);
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col lg:flex-row bg-white">
      {/* Left Column: Navy-50 Brand Panel */}
      <div className="lg:w-5/12 bg-[#EEF4FF] p-8 lg:p-14 flex flex-col justify-between border-r border-[#E6EAF2]">
        <div>
          <Logo size="lg" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F5C] mt-8 leading-tight">
            Commercial Account Registration
          </h2>
          <p className="mt-3 text-sm text-[#475569] leading-relaxed">
            Create your facility account to unlock bulk procurement rates, order tracking, and priority direct dispatch across Tamil Nadu.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#0A1F5C]">
              <Sparkles className="w-4 h-4 text-[#1F6FEB]" />
              <span>Full 9-tier commercial hygiene range</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#0A1F5C]">
              <ShieldCheck className="w-4 h-4 text-[#1F6FEB]" />
              <span>Direct factory pricing with tax invoicing</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#0A1F5C]">
              <BedDouble className="w-4 h-4 text-[#1F6FEB]" />
              <span>Engineered specifically for hospitality & institutions</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-[#94A3B8]">
          Clean Today, Better Tomorrow • CleanTec Hospitality Chemicals™
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:w-7/12 p-8 lg:p-14 flex flex-col justify-center max-w-xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F5C]">Create Business Profile</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#475569]">
          Fill in your details for quick delivery scheduling.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-[8px] bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact / Business Name"
              required
              placeholder="e.g. Ramesh Kumar (Bay View Hotel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone Number"
              type="tel"
              required
              placeholder="e.g. 9840123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. purchase@bayview.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password (min 6 characters)"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Input
            label="Street Address / Property Location"
            required
            placeholder="e.g. 24 Marine Drive, Kovalam"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="State"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <Input
              label="Pincode"
              required
              placeholder="e.g. 603112"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="green"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Register Account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#475569]">
          Already have an account?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-bold text-[#1F6FEB] hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
