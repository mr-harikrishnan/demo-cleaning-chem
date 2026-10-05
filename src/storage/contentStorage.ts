import { INITIAL_SITE_CONTENT } from '../data/seedData';
import { Enquiry, SiteContent } from '../types';
import { getData, STORAGE_KEYS, updateData } from './storageCore';

export const contentStorage = {
  getContent: (): SiteContent => {
    return getData<SiteContent>(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
  },

  updateContent: (updates: Partial<SiteContent>): SiteContent => {
    return updateData<SiteContent>(
      STORAGE_KEYS.SITE_CONTENT,
      (prev) => ({
        ...prev,
        ...updates
      }),
      INITIAL_SITE_CONTENT
    );
  },

  addEnquiry: (name: string, phone: string, requirement: string): Enquiry => {
    if (!name || !phone || !requirement) {
      throw new Error('Please fill in your name, contact phone, and requirements.');
    }

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      requirement: requirement.trim(),
      createdAt: new Date().toISOString()
    };

    updateData<SiteContent>(
      STORAGE_KEYS.SITE_CONTENT,
      (prev) => ({
        ...prev,
        enquiries: [newEnquiry, ...(prev.enquiries || [])]
      }),
      INITIAL_SITE_CONTENT
    );

    return newEnquiry;
  }
};
