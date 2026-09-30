import { useState, useEffect } from 'react';

import axios from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { fetchEnrollmentFormOptionsMock } from 'src/services/enrollment-form-options.service';

const EMPTY_OPTIONS = {
  batchEnrolls: [],
  learningModes: [],
  branchEnrolls: [],
  reviewSchedules: [],
  honorAwardDiscounts: [],
  packageEnrolls: [],
};

const OPTIONS_REQUEST_TIMEOUT_MS = 12_000;

export function useEnrollmentFormOptions(programId = '') {
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        let payload = EMPTY_OPTIONS;

        if (CONFIG.serverUrl?.trim()) {
          try {
            const response = await axios.get('/api/enrollment-form/options', {
              signal: controller.signal,
              timeout: OPTIONS_REQUEST_TIMEOUT_MS,
              params: programId ? { programId } : undefined,
            });
            payload = response.data?.data ?? EMPTY_OPTIONS;
          } catch {
            if (controller.signal.aborted || !active) {
              return;
            }
            payload = await fetchEnrollmentFormOptionsMock(programId);
            setError(
              'Could not reach enrollment settings from the server. Showing default options instead.'
            );
          }
        } else {
          payload = await fetchEnrollmentFormOptionsMock(programId);
        }

        if (!active) {
          return;
        }

        setOptions({ ...EMPTY_OPTIONS, ...(payload ?? {}) });
      } catch (err) {
        if (!active || controller.signal.aborted) {
          return;
        }
        setError(typeof err === 'string' ? err : err?.message ?? 'Could not load enrollment options.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [programId]);

  return { options, isLoading, error };
}
