import { useQuery } from '@tanstack/react-query';

import { CONFIG } from 'src/global-config';

import { fetchAboutUsPublic } from '../api/about-us-api';
import { ABOUT_US_DEFAULTS } from '../data/about-us-defaults';

export function useAboutContent({ preview = false } = {}) {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());

  return useQuery({
    queryKey: ['about-us', preview ? 'preview' : 'public'],
    queryFn: () => (hasApi ? fetchAboutUsPublic(preview) : Promise.resolve(ABOUT_US_DEFAULTS)),
    // No placeholderData: lets the About page show a skeleton for CMS media until the first fetch completes.
    staleTime: 120_000,
  });
}
