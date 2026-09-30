import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CONFIG } from 'src/global-config';
import { CONTACT_PAGE_DEFAULTS } from 'src/features/contact-page/data/contact-page-defaults';
import {
  fetchContactPageAdmin,
  updateContactPageSection,
  publishAllContactPageSections,
} from 'src/features/contact-page/api/contact-page-api';

import { toast } from 'src/components/snackbar';

export const CONTACT_PAGE_ADMIN_QUERY_KEY = ['contact-page-admin'];

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

export function useContactPageAdmin() {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CONTACT_PAGE_ADMIN_QUERY_KEY,
    queryFn: () => (hasApi ? fetchContactPageAdmin() : Promise.resolve(CONTACT_PAGE_DEFAULTS)),
    enabled: hasApi,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CONTACT_PAGE_ADMIN_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['contact-page'] });
  }, [queryClient]);

  const publishAllMutation = useMutation({
    mutationFn: publishAllContactPageSections,
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
          return updateContactPageSection(sectionKey, {
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
