import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CONFIG } from 'src/global-config';
import { HOMEPAGE_V2_DEFAULTS } from 'src/features/homepage-v2/data/homepage-v2-defaults';
import {
  fetchHomepageV2Admin,
  updateHomepageV2Section,
  reorderHomepageV2Sections,
  publishAllHomepageV2Sections,
} from 'src/features/homepage-v2/api/homepage-v2-api';

import { toast } from 'src/components/snackbar';

export const HOMEPAGE_ADMIN_QUERY_KEY = ['homepage-v2-admin'];

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

export function useHomepageAdmin() {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: HOMEPAGE_ADMIN_QUERY_KEY,
    queryFn: () => (hasApi ? fetchHomepageV2Admin() : Promise.resolve(HOMEPAGE_V2_DEFAULTS)),
    enabled: hasApi,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: HOMEPAGE_ADMIN_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['homepage-v2'] });
  }, [queryClient]);

  const saveSectionMutation = useMutation({
    mutationFn: ({ sectionKey, content, status }) =>
      updateHomepageV2Section(sectionKey, { content, status }),
    onSuccess: () => {
      invalidateAll();
      toast.success('Section saved.');
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message ?? e?.message ?? 'Save failed.');
    },
  });

  const publishAllMutation = useMutation({
    mutationFn: publishAllHomepageV2Sections,
    onSuccess: () => {
      invalidateAll();
      toast.success('All sections published.');
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message ?? e?.message ?? 'Publish failed.');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderHomepageV2Sections,
    onMutate: async (sectionKeys) => {
      await queryClient.cancelQueries({ queryKey: HOMEPAGE_ADMIN_QUERY_KEY });
      const previous = queryClient.getQueryData(HOMEPAGE_ADMIN_QUERY_KEY);
      queryClient.setQueryData(HOMEPAGE_ADMIN_QUERY_KEY, (current) => {
        if (!current?.sections) {
          return current;
        }
        const sections = {};
        sectionKeys.forEach((key, index) => {
          if (current.sections[key]) {
            sections[key] = { ...current.sections[key], sortOrder: (index + 1) * 10 };
          }
        });
        Object.keys(current.sections).forEach((key) => {
          if (!sections[key]) {
            sections[key] = current.sections[key];
          }
        });
        return { ...current, sections };
      });
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(HOMEPAGE_ADMIN_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: ['homepage-v2'] });
      toast.success('Section order saved.');
    },
    onError: (error, _keys, context) => {
      if (context?.previous) {
        queryClient.setQueryData(HOMEPAGE_ADMIN_QUERY_KEY, context.previous);
      }
      toast.error(error?.response?.data?.message ?? error?.message ?? 'Could not reorder sections.');
    },
  });

  const saveAllSections = useCallback(
    async (sectionsByKey) => {
      const keys = Object.keys(sectionsByKey);
      await Promise.all(
        keys.map((sectionKey) => {
          const row = sectionsByKey[sectionKey] ?? {};
          const { status, ...content } = row;
          return updateHomepageV2Section(sectionKey, {
            content,
            status: status ?? 'published',
          });
        })
      );
      invalidateAll();
      toast.success('Changes saved.');
    },
    [invalidateAll]
  );

  return {
    hasApi,
    query,
    sections: adminDataToFormSections(query.data),
    isLoading: query.isLoading,
    isSaving: saveSectionMutation.isPending || publishAllMutation.isPending,
    saveSection: saveSectionMutation.mutateAsync,
    saveAllSections,
    reorderSections: reorderMutation.mutateAsync,
    isReordering: reorderMutation.isPending,
    publishAll: publishAllMutation.mutateAsync,
    refetch: query.refetch,
  };
}
