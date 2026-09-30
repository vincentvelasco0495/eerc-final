import { useQuery } from '@tanstack/react-query';

import { CONFIG } from 'src/global-config';

import { fetchContactPagePublic } from '../api/contact-page-api';
import { CONTACT_PAGE_DEFAULTS } from '../data/contact-page-defaults';

export function useContactPageContent({ preview = false } = {}) {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());

  return useQuery({
    queryKey: ['contact-page', preview ? 'preview' : 'public'],
    queryFn: () => (hasApi ? fetchContactPagePublic(preview) : Promise.resolve(CONTACT_PAGE_DEFAULTS)),
    placeholderData: (prev) => prev ?? CONTACT_PAGE_DEFAULTS,
    staleTime: 120_000,
  });
}
