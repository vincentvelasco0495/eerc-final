import { useQuery } from '@tanstack/react-query';

import { CONFIG } from 'src/global-config';

import { fetchHomepageV2Public } from '../api/homepage-v2-api';
import { HOMEPAGE_V2_DEFAULTS } from '../data/homepage-v2-defaults';

export function useHomepageContent({ preview = false } = {}) {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());

  return useQuery({
    queryKey: ['homepage-v2', preview ? 'preview' : 'public'],
    queryFn: () => (hasApi ? fetchHomepageV2Public(preview) : Promise.resolve(HOMEPAGE_V2_DEFAULTS)),
    placeholderData: (prev) => prev ?? HOMEPAGE_V2_DEFAULTS,
    staleTime: 120_000,
  });
}

export function useHomepageV2Section(sectionKey, options) {
  const { data, isLoading, isFetching, error } = useHomepageContent(options);
  const sections = data?.sections ?? HOMEPAGE_V2_DEFAULTS.sections;

  return {
    content: sections[sectionKey] ?? null,
    sections,
    isLoading: isLoading && !data,
    isFetching,
    error,
  };
}
