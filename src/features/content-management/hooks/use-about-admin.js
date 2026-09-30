import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CONFIG } from 'src/global-config';
import { ABOUT_US_DEFAULTS } from 'src/features/about-us/data/about-us-defaults';
import {
  fetchAboutUsAdmin,
  updateAboutUsSection,
  publishAllAboutUsSections,
} from 'src/features/about-us/api/about-us-api';

import { toast } from 'src/components/snackbar';

export const ABOUT_US_ADMIN_QUERY_KEY = ['about-us-admin'];

export function adminDataToFormSections(adminData) {
  const out = {};
  const rows = adminData?.sections ?? {};

  Object.entries(rows).forEach(([key, row]) => {
    const content = row?.content ?? row;
    out[key] = {
      status: row?.status ?? 'published',
      ...(typeof content === 'object' && content !== null ? content : {}),
    };
  });

  return out;
}

export function useAboutAdmin() {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ABOUT_US_ADMIN_QUERY_KEY,
    queryFn: () => (hasApi ? fetchAboutUsAdmin() : Promise.resolve(ABOUT_US_DEFAULTS)),
    enabled: hasApi,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ABOUT_US_ADMIN_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['about-us'] });
  }, [queryClient]);

  const publishAllMutation = useMutation({
    mutationFn: publishAllAboutUsSections,
    onSuccess: () => {
      invalidateAll();
      toast.success('All sections published.');
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message ?? e?.message ?? 'Publish failed.');
    },
  });

  const saveAllSections = useCallback(
    async (sectionsByKey) => {
      const keys = Object.keys(sectionsByKey);
      await Promise.all(
        keys.map((sectionKey) => {
          const row = sectionsByKey[sectionKey] ?? {};
          const { status, ...content } = row;
          return updateAboutUsSection(sectionKey, {
            content,
            status: status ?? 'published',
          });
        })
      );
      invalidateAll();
      toast.success('All changes saved.');
    },
    [invalidateAll]
  );

  return {
    hasApi,
    query,
    sections: adminDataToFormSections(query.data),
    isLoading: query.isLoading,
    isSaving: publishAllMutation.isPending,
    saveAllSections,
    publishAll: publishAllMutation.mutateAsync,
    refetch: query.refetch,
  };
}
