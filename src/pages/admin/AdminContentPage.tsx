import { Check, Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { contentService } from '../../services';
import { Enquiry, SiteContent } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const AdminContentPage: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [headline, setHeadline] = useState('');
  const [tagline, setTagline] = useState('');
  const [strapline, setStrapline] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    contentService.getContent().then((res) => {
      setContent(res);
      setHeadline(res.headline);
      setTagline(res.tagline);
      setStrapline(res.strapline);
      setPhone(res.phone);
      setAddress(res.address);
      setEnquiries(res.enquiries || []);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await contentService.updateContent({
        headline,
        tagline,
        strapline,
        phone,
        address
      });
      showToast('Brand content and contact details updated!', 'success');
    } catch (err: unknown) {
      console.error('Update content error:', err);
      showToast('Failed to update content.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1F5C]">Site Content & Bulk Enquiries</h2>
        <p className="text-xs text-[#475569] mt-0.5">
          Update brand copy and manage property procurement inquiries submitted through the portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Brand Copy Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col gap-6">
          <h3 className="text-sm font-bold text-[#0A1F5C] uppercase tracking-wider border-b border-[#E6EAF2] pb-3">
            Company & Contact Details
          </h3>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label="Hero Headline"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tagline (Eyebrow)"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
              <Input
                label="Enquiries Telephone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0A1F5C] uppercase block mb-1">
                Strapline
              </label>
              <textarea
                rows={2}
                value={strapline}
                onChange={(e) => setStrapline(e.target.value)}
                className="w-full p-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs focus-ring"
              />
            </div>

            <Input
              label="Chennai Facility Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                Save Content Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Inquiries Log (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E6EAF2] pb-3">
            <h3 className="text-sm font-bold text-[#0A1F5C] uppercase tracking-wider">
              Incoming Enquiries ({enquiries.length})
            </h3>
            <span className="text-[11px] text-[#94A3B8]">Submitted via Homepage</span>
          </div>

          <div className="divide-y divide-[#E6EAF2] text-xs max-h-[460px] overflow-y-auto">
            {enquiries.length === 0 ? (
              <div className="py-8 text-center text-[#94A3B8]">No enquiries received yet.</div>
            ) : (
              enquiries.map((enq) => (
                <div key={enq.id} className="py-3.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-[#0A1F5C]">{enq.name}</strong>
                    <span className="text-[10px] text-[#94A3B8]">
                      {formatDateTime(enq.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#1F6FEB]">
                    <Phone className="w-3 h-3" />
                    <span>{enq.phone}</span>
                  </div>
                  <p className="p-2.5 rounded-[8px] bg-[#F7F9FC] text-[#475569] leading-relaxed mt-1">
                    {enq.requirement}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
