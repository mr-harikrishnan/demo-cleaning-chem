import { contentStorage, landingPageStorage } from '../storage';
import { Enquiry, LandingPageSettings, SiteContent } from '../types';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const contentService = {
  getContent: async (): Promise<SiteContent> => {
    await delay(100);
    return contentStorage.getContent();
  },

  updateContent: async (updates: Partial<SiteContent>): Promise<SiteContent> => {
    await delay(150);
    return contentStorage.updateContent(updates);
  },

  submitEnquiry: async (name: string, phone: string, requirement: string): Promise<Enquiry> => {
    await delay(200);
    try {
      return contentStorage.addEnquiry(name, phone, requirement);
    } catch (err: unknown) {
      console.error('Enquiry submission error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to submit enquiry.';
      throw new Error(msg);
    }
  },

  getLandingSettings: async (): Promise<LandingPageSettings> => {
    await delay(100);
    return landingPageStorage.getSettings();
  },

  updateFeaturedProducts: async (ids: string[]): Promise<LandingPageSettings> => {
    await delay(150);
    try {
      return landingPageStorage.updateFeaturedProducts(ids);
    } catch (err: unknown) {
      console.error('Update featured error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to update featured products.';
      throw new Error(msg);
    }
  }
};
