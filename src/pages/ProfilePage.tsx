import { CheckCircle2, ShieldCheck, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || 'Chennai');
  const [state, setState] = useState(currentUser?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        phone,
        address,
        city,
        state,
        pincode
      });
      showToast('Profile information updated successfully.', 'success');
    } catch (err: unknown) {
      console.error('Update profile error:', err);
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return <div className="p-8 text-center">Please sign in to view profile.</div>;
  }

  return (
    <div className="py-12 bg-[#F7F9FC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[20px] border border-[#E6EAF2] p-8 shadow-cleantec-sm flex flex-col gap-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[#E6EAF2]">
            <div className="w-14 h-14 rounded-full bg-[#0A1F5C] text-white flex items-center justify-center font-extrabold text-xl shadow-cleantec-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0A1F5C]">{currentUser.name}</h1>
              <span className="text-xs text-[#94A3B8]">{currentUser.email} • {currentUser.role.toUpperCase()}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label="Contact / Facility Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email (Read Only)"
                disabled
                value={currentUser.email}
                helperText="Email is bound to your account ID"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Input
              label="Delivery Address / Facility"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <Input
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-[#E6EAF2] flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
