import { INITIAL_LANDING_SETTINGS } from '../data/seedData';
import { LandingPageSettings } from '../types';
import { getData, setData, STORAGE_KEYS } from './storageCore';

export const landingPageStorage = {
  getSettings: (): LandingPageSettings => {
    return getData<LandingPageSettings>(STORAGE_KEYS.LANDING_PAGE, INITIAL_LANDING_SETTINGS);
  },

  updateFeaturedProducts: (ids: string[]): LandingPageSettings => {
    if (ids.length > 8) {
      throw new Error('A maximum of 8 featured products is allowed on the landing page.');
    }
    const settings: LandingPageSettings = { featuredProductIds: ids };
    setData(STORAGE_KEYS.LANDING_PAGE, settings);
    return settings;
  }
};
