import { useDispatch, useSelector } from 'react-redux';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import axios from 'src/lib/axios';
import { lmsEndpoints } from 'src/redux/api/lmsEndpoints';
import { LMS_REDUX_FLAGS, shouldUseReduxRead } from 'src/features/lms/redux-flags';
import {
  getLearnerEnrollmentAccessSets,
  isSoftDeletedRecord,
  withoutSoftDeleted,
  withoutSoftDeletedModules,
} from 'src/features/student-profile/student-profile-data';
import {
  selectAppState,
  selectLmsLoading,
  selectQuizzesState,
  selectLmsResources,
  selectIsBootstrapping,
  selectLmsResourceByKey,
  selectIsAnyLmsMutationPending,
} from 'src/app/store/selectors/lms.selectors';
import {
  lmsCommandRequest,
  simulateQuizRequest,
  uploadModuleRequest,
  lmsResourceFetchRequest,
  submitEnrollmentRequest,
  fetchQuizQuestionSetRequest,
  toggleModuleVisibilityRequest,
  updateEnrollmentStatusRequest,
} from 'src/app/store/modules/lms';

import { useAuthContext } from 'src/auth/hooks';

const inFlightReduxResourceRequests = new Set();
const EMPTY_LMS_LIST = [];

function useLiveLmsRows(list) {
  const source = Array.isArray(list) ? list : EMPTY_LMS_LIST;
  return useMemo(() => withoutSoftDeleted(source), [source]);
}

function useLiveLmsModules(list) {
  const source = Array.isArray(list) ? list : EMPTY_LMS_LIST;
  return useMemo(() => withoutSoftDeletedModules(source), [source]);
}

/** Normalize catalog list/detail API payloads into course rows. */
function extractCatalogCoursesFromPayload(payload) {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }
  if (payload.data && typeof payload.data === 'object' && payload.data.id) {
    return [payload.data];
  }
  if (Array.isArray(payload) && payload.some((row) => row?.id)) {
    return payload;
  }
  return [];
}

export function useLmsAppState() {
  return useSelector(selectAppState);
}

export function useLmsLoading() {
  return useSelector(selectLmsLoading);
}

export function useIsBootstrapping() {
  return useSelector(selectIsBootstrapping);
}

export function useIsAnyLmsMutationPending() {
  return useSelector(selectIsAnyLmsMutationPending);
}

function useReduxLmsResource(endpoint, enabled = true, options = {}) {
  const dispatch = useDispatch();
  const fetchEndpoint = options.fetchEndpoint ?? endpoint;
  const cacheKey = options.cacheKey ?? endpoint;
  const useRedux = Boolean(enabled && fetchEndpoint && shouldUseReduxRead(fetchEndpoint));
  const resource = useSelector((state) => selectLmsResourceByKey(state, cacheKey));
  const ttlMs = Number(options.ttlMs ?? 30_000);
  const canRefetch = Boolean(options.refetchOnMount ?? true);
  const retryOnError = Boolean(options.retryOnError ?? false);

  useEffect(() => {
    if (!useRedux || !canRefetch) return;
    if (!fetchEndpoint || !cacheKey) return;
    if (resource?.isLoading) return;
    if (inFlightReduxResourceRequests.has(cacheKey)) return;
    const fresh = resource?.updatedAt && Date.now() - Number(resource.updatedAt) < ttlMs;
    if (fresh) return;
    // Avoid a tight request loop after an error; allow manual mutate() or explicit retryOnError.
    if (resource?.error && !retryOnError) return;
    inFlightReduxResourceRequests.add(cacheKey);
    dispatch(lmsResourceFetchRequest({ key: cacheKey, endpoint: fetchEndpoint }));
  }, [
    cacheKey,
    canRefetch,
    dispatch,
    fetchEndpoint,
    resource?.error,
    resource?.isLoading,
    resource?.updatedAt,
    retryOnError,
    ttlMs,
    useRedux,
  ]);

  useEffect(() => {
    if (!useRedux || !cacheKey) return;
    if (resource && !resource.isLoading) {
      inFlightReduxResourceRequests.delete(cacheKey);
    }
  }, [cacheKey, resource, resource?.isLoading, useRedux]);

  const mutate = useCallback(() => {
    if (!useRedux) return Promise.resolve();
    return new Promise((resolve, reject) => {
      inFlightReduxResourceRequests.add(cacheKey);
      dispatch(
        lmsResourceFetchRequest({
          key: cacheKey,
          endpoint: fetchEndpoint,
          resolve,
          reject,
        })
      );
    });
  }, [cacheKey, dispatch, fetchEndpoint, useRedux]);

  return {
    useRedux,
    data: resource?.data,
    error: resource?.error ?? null,
    isLoading: Boolean(useRedux && (resource?.isLoading || !resource)),
    mutate,
  };
}

export function useLmsUser(enabled = true) {
  const key = enabled ? lmsEndpoints.user() : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 5000 });
  return {
    user: redux.data ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsMeta() {
  const redux = useReduxLmsResource(lmsEndpoints.meta(), true, { ttlMs: 120_000 });
  const source = redux.data;
  return (
    source ?? {
      todayLabel: '',
      leaderboardPeriods: [],
      learningFlowSteps: [],
    }
  );
}

export function useLmsPrograms() {
  const redux = useReduxLmsResource(lmsEndpoints.programs(), true, { ttlMs: 120_000 });
  return {
    programs: redux.data?.data ?? [],
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsProgramsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.programsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    programs: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsProgramApplicantsPaginated(
  programId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  enabled = true
) {
  const ready = Boolean(enabled && programId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.programApplicantsPaginated({
            programId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
          })
        : null,
    [page, perPage, programId, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    program: payload.program ?? null,
    applicantCount: payload.applicantCount ?? 0,
    applicants: payload.data ?? [],
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsBranchEnrolls() {
  const redux = useReduxLmsResource(lmsEndpoints.branchEnrolls(), true, { ttlMs: 30_000 });
  return {
    branchEnrolls: redux.data?.data ?? [],
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsBatchEnrollsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.batchEnrollsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    batchEnrolls: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsBatchApplicantsPaginated(
  batchId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  enabled = true
) {
  const ready = Boolean(enabled && batchId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.batchApplicantsPaginated({
            batchId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
          })
        : null,
    [batchId, page, perPage, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    batch: payload.batch ?? null,
    applicantCount: payload.applicantCount ?? 0,
    applicants: payload.data ?? [],
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsLearningModesPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.learningModesPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    learningModes: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsLearningModeApplicantsPaginated(
  modeId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  program = '',
  batch = '',
  enabled = true
) {
  const ready = Boolean(enabled && modeId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.learningModeApplicantsPaginated({
            modeId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
            program: typeof program === 'string' ? program : '',
            batch: typeof batch === 'string' ? batch : '',
          })
        : null,
    [batch, modeId, page, perPage, program, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    learningMode: payload.learningMode ?? null,
    applicantCount: payload.applicantCount ?? 0,
    applicants: payload.data ?? [],
    filters: payload.filters ?? { programs: [], batches: [] },
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsBranchApplicantsPaginated(
  branchId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  program = '',
  batch = '',
  learningMode = '',
  enabled = true
) {
  const ready = Boolean(enabled && branchId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.branchApplicantsPaginated({
            branchId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
            program: typeof program === 'string' ? program : '',
            batch: typeof batch === 'string' ? batch : '',
            learningMode: typeof learningMode === 'string' ? learningMode : '',
          })
        : null,
    [batch, branchId, learningMode, page, perPage, program, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    branch: payload.branch ?? null,
    applicantCount: payload.applicantCount ?? 0,
    applicants: payload.data ?? [],
    filters: payload.filters ?? { programs: [], batches: [], learningModes: [] },
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsBranchEnrollsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.branchEnrollsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    branchEnrolls: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsReviewScheduleApplicantsPaginated(
  scheduleId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  program = '',
  batch = '',
  learningMode = '',
  enabled = true
) {
  const ready = Boolean(enabled && scheduleId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.reviewScheduleApplicantsPaginated({
            scheduleId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
            program: typeof program === 'string' ? program : '',
            batch: typeof batch === 'string' ? batch : '',
            learningMode: typeof learningMode === 'string' ? learningMode : '',
          })
        : null,
    [batch, learningMode, page, perPage, program, ready, scheduleId, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    reviewSchedule: payload.reviewSchedule ?? null,
    applicantCount: payload.applicantCount ?? 0,
    occupiedSeats: payload.occupiedSeats ?? 0,
    remainingSeats: payload.remainingSeats ?? 0,
    applicants: payload.data ?? [],
    filters: payload.filters ?? { programs: [], batches: [], learningModes: [] },
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsReviewSchedulesPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.reviewSchedulesPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    reviewSchedules: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsHonorAwardDiscountApplicantsPaginated(
  optionId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  program = '',
  batch = '',
  branch = '',
  enabled = true
) {
  const ready = Boolean(enabled && optionId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.honorAwardDiscountApplicantsPaginated({
            optionId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
            program: typeof program === 'string' ? program : '',
            batch: typeof batch === 'string' ? batch : '',
            branch: typeof branch === 'string' ? branch : '',
          })
        : null,
    [batch, branch, optionId, page, perPage, program, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    honorAwardDiscount: payload.honorAwardDiscount ?? null,
    applicantCount: payload.applicantCount ?? 0,
    applicants: payload.data ?? [],
    filters: payload.filters ?? { programs: [], batches: [], branches: [] },
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsHonorAwardDiscountsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.honorAwardDiscountsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    honorAwardDiscounts: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsPackageEnrollApplicantsPaginated(
  packageId,
  page = 1,
  perPage = 10,
  search = '',
  status = '',
  program = '',
  batch = '',
  branch = '',
  enabled = true
) {
  const ready = Boolean(enabled && packageId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.packageEnrollApplicantsPaginated({
            packageId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : '',
            program: typeof program === 'string' ? program : '',
            batch: typeof batch === 'string' ? batch : '',
            branch: typeof branch === 'string' ? branch : '',
          })
        : null,
    [batch, branch, packageId, page, perPage, program, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    packageEnroll: payload.packageEnroll ?? null,
    applicantCount: payload.applicantCount ?? 0,
    applicants: payload.data ?? [],
    filters: payload.filters ?? { programs: [], batches: [], branches: [] },
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsPackageEnrollsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.packageEnrollsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    packageEnrolls: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useRefreshLmsProgramsCatalog() {
  const dispatch = useDispatch();
  return useCallback(() => {
    const endpoint = lmsEndpoints.programs();
    if (!shouldUseReduxRead(endpoint)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      dispatch(lmsResourceFetchRequest({ key: endpoint, endpoint, resolve, reject }));
    });
  }, [dispatch]);
}

export function useRefreshLmsCoursesCatalog() {
  const dispatch = useDispatch();
  const resources = useSelector(selectLmsResources);
  const resourcesRef = useRef(resources);
  resourcesRef.current = resources;
  return useCallback(() => {
    const fromStore = Object.keys(resourcesRef.current ?? {}).filter(
      (key) =>
        key.startsWith('/api/courses') ||
        key.startsWith('/api/modules') ||
        key.startsWith('/api/quizzes') ||
        key.startsWith('/api/quiz-summaries') ||
        key.startsWith('/api/assignment-summaries') ||
        key.startsWith('/api/my-quizzes') ||
        key.startsWith('/api/my-assignments') ||
        key.startsWith('/api/quiz-results') ||
        key.startsWith('/api/gradebook')
    );
    const endpoints = [...new Set([
      lmsEndpoints.courses({ page: 1, limit: 200 }),
      lmsEndpoints.courses({ page: 1, limit: 500 }),
      ...fromStore,
    ])];
    return Promise.all(
      endpoints.map((endpoint) => {
        if (!shouldUseReduxRead(endpoint)) {
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          dispatch(lmsResourceFetchRequest({ key: endpoint, endpoint, resolve, reject }));
        });
      })
    );
  }, [dispatch]);
}

/** Full instructor roster (`GET /api/instructors` without pagination). */
export function useLmsInstructors() {
  const redux = useReduxLmsResource(lmsEndpoints.instructors(), true, { ttlMs: 60_000 });
  return {
    instructors: redux.data?.data ?? [],
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsInstructorsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.instructorsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    instructors: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useRefreshInstructorsCatalog() {
  const dispatch = useDispatch();
  return useCallback(() => {
    const endpoint = lmsEndpoints.instructors();
    if (!shouldUseReduxRead(endpoint)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      dispatch(lmsResourceFetchRequest({ key: endpoint, endpoint, resolve, reject }));
    });
  }, [dispatch]);
}

export function useLmsInstructorLinkableUsers() {
  const endpoint = lmsEndpoints.instructorsLinkableUsers();
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  return {
    linkableUsers: redux.data?.data ?? [],
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsStudentsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.studentsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  const meta = payload?.meta ?? null;
  return {
    students: payload?.data ?? [],
    meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useRefreshStudentsCatalog() {
  const dispatch = useDispatch();
  return useCallback(() => {
    const endpoint = lmsEndpoints.students();
    if (!shouldUseReduxRead(endpoint)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      dispatch(lmsResourceFetchRequest({ key: endpoint, endpoint, resolve, reject }));
    });
  }, [dispatch]);
}

export function useLmsStudentLinkableUsers() {
  const endpoint = lmsEndpoints.studentsLinkableUsers();
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  return {
    linkableUsers: redux.data?.data ?? [],
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsProgramStats(programPublicId) {
  const key = programPublicId ? lmsEndpoints.programStats(programPublicId) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  return {
    stats: redux.data?.data ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsCourses(page = 1, limit = 100, program = '', status = '') {
  const key = lmsEndpoints.courses({ page, limit, program, status });
  const redux = useReduxLmsResource(key, true, { ttlMs: 30_000 });
  const payload = redux.data;
  const courses = useLiveLmsRows(payload?.data);
  return {
    courses,
    meta: payload?.meta,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

/** Published catalog courses the learner may access (approved course enrollments only). */
export function useLmsEnrolledProgramCourses(enrollments = []) {
  const { approvedCourseIds } = useMemo(
    () => getLearnerEnrollmentAccessSets(enrollments),
    [enrollments]
  );
  const courseIds = useMemo(() => [...approvedCourseIds], [approvedCourseIds]);
  const fetchKey = [...courseIds].sort().join('|');

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(fetchKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseIds.length) {
      setCourses([]);
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const courseRequests = courseIds.map((courseId) =>
          axios.get(lmsEndpoints.courseDetail(courseId)).then((res) => res.data)
        );

        const responses = await Promise.allSettled(courseRequests);

        if (cancelled) {
          return;
        }

        const byId = new Map();
        responses.forEach((result) => {
          if (result.status !== 'fulfilled') {
            return;
          }
          extractCatalogCoursesFromPayload(result.value).forEach((course) => {
            if (course?.id && !isSoftDeletedRecord(course)) {
              byId.set(course.id, course);
            }
          });
        });

        setCourses([...byId.values()]);
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setCourses([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `fetchKey` encodes sorted course ids
  }, [fetchKey]);

  return { courses, isLoading, error };
}

export function useLmsCourseByLookup(courseLookup) {
  const normalized = String(courseLookup ?? '').trim();
  const key = normalized ? lmsEndpoints.courseDetail(normalized) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  const course = redux.data?.data ?? null;
  return {
    course: isSoftDeletedRecord(course) ? null : course,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function resolveCourseIdFromCatalog(courses, courseLookup) {
  if (!courseLookup) {
    return '';
  }
  const normalizedLookup = decodeURIComponent(String(courseLookup).trim()).toLowerCase();
  if (!normalizedLookup) {
    return '';
  }

  const byId = (Array.isArray(courses) ? courses : []).find(
    (course) => String(course.id ?? '').trim() === String(courseLookup).trim()
  );
  if (byId) {
    return byId.id;
  }

  const byExactSlug = (Array.isArray(courses) ? courses : []).find(
    (course) => String(course.slug ?? '').trim().toLowerCase() === normalizedLookup
  );
  if (byExactSlug) {
    return byExactSlug.id;
  }

  // Fallback for stale links when a slug was later de-duplicated to `${slug}-2`, `${slug}-3`, etc.
  const prefixed = (Array.isArray(courses) ? courses : [])
    .filter((course) => {
      const slug = String(course.slug ?? '').trim().toLowerCase();
      return slug.startsWith(`${normalizedLookup}-`);
    })
    .sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')));

  return prefixed[0]?.id ?? '';
}

export function useResolvedCourseIdFromLookup(courseLookup) {
  const { courses } = useLmsCourses(1, 500);

  return useMemo(() => resolveCourseIdFromCatalog(courses, courseLookup), [courses, courseLookup]);
}

export function useLmsCourse(courseId) {
  const { courses } = useLmsCourses(1, 500);
  return useMemo(() => courses.find((course) => course.id === courseId), [courses, courseId]);
}

export function useLmsCourseStats(courseId) {
  const key = courseId ? lmsEndpoints.courseStats(courseId) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  return {
    stats: redux.data?.data ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
  };
}

export function useLmsModulesByCourse(courseId, swrOptions = {}) {
  const key = courseId ? lmsEndpoints.modulesByCourse(courseId) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  void swrOptions;
  const modules = useLiveLmsModules(redux.data?.data);
  return {
    modules,
    isLoading: redux.isLoading,
    mutate: redux.mutate,
  };
}

export function useLmsModule(moduleId) {
  const key = moduleId ? lmsEndpoints.moduleById(moduleId) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  const list = redux.data?.data ?? [];
  return { module: list[0] ?? null, isLoading: redux.isLoading };
}

export function useLmsQuizzes(moduleId) {
  const key = lmsEndpoints.quizzes(moduleId);
  const redux = useReduxLmsResource(key, true, { ttlMs: 30_000 });
  const quizzes = useLiveLmsRows(redux.data?.data);
  return {
    quizzes,
    isLoading: redux.isLoading,
    mutate: redux.mutate,
  };
}

export function extractQuizzesFromModules(modules) {
  return withoutSoftDeleted(modules).flatMap((moduleItem) =>
    withoutSoftDeleted(Array.isArray(moduleItem?.quizzes) ? moduleItem.quizzes : [])
  );
}

export function extractAssignmentsFromModules(modules) {
  return withoutSoftDeleted(modules).flatMap((moduleItem) =>
    withoutSoftDeleted(Array.isArray(moduleItem?.assignments) ? moduleItem.assignments : [])
  );
}

export function useLmsCourseQuizzes(courseId) {
  const { modules, isLoading, mutate } = useLmsModulesByCourse(courseId);
  const quizzes = useMemo(() => extractQuizzesFromModules(modules), [modules]);
  return { quizzes, isLoading, mutateModules: mutate };
}

export function useLmsQuiz(quizId) {
  const { quizzes } = useLmsQuizzes();
  return useMemo(() => quizzes.find((quiz) => quiz.id === quizId), [quizzes, quizId]);
}

export function useLmsQuizHistory(quizId) {
  const redux = useReduxLmsResource(lmsEndpoints.quizResults(), true, { ttlMs: 30_000 });
  const source = redux.data;
  return useMemo(() => {
    const results = source?.data ?? [];
    return results.filter((result) => result.quizId === quizId);
  }, [source?.data, quizId]);
}

export function useLmsQuizResults(enabled = true) {
  const key = enabled ? lmsEndpoints.quizResults() : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  return { results: redux.data?.data ?? [], isLoading: redux.isLoading, mutate: redux.mutate };
}

export function useLmsAssignmentSummaries(enabled = true) {
  const key = enabled ? lmsEndpoints.assignmentSummaries() : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  const summaries = useLiveLmsRows(redux.data?.data);
  return {
    summaries,
    isLoading: redux.isLoading,
    mutate: redux.mutate,
  };
}

export function useLmsQuizSummaries(enabled = true) {
  const key = enabled ? lmsEndpoints.quizSummaries() : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  const summaries = useLiveLmsRows(redux.data?.data);
  return {
    summaries,
    isLoading: redux.isLoading,
    mutate: redux.mutate,
  };
}

export function useLmsGradebookCourses(enabled = true) {
  const key = enabled ? lmsEndpoints.gradebookCourses() : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  const courses = useLiveLmsRows(redux.data?.data);
  return {
    courses,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsGradebookPaginated(courseId, page = 1, perPage = 10, enabled = true) {
  const ready = Boolean(enabled && courseId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.gradebook({
            courseId,
            page,
            perPage,
          })
        : null,
    [courseId, page, perPage, ready]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    course: payload.course ?? null,
    stats: payload.stats ?? [],
    students: payload.data ?? [],
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsAssignmentStudentsPaginated(
  assignmentId,
  page = 1,
  perPage = 10,
  status = 'passed',
  search = '',
  enabled = true
) {
  const ready = Boolean(enabled && assignmentId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.assignmentStudents({
            assignmentId,
            page,
            perPage,
            status,
            search: typeof search === 'string' ? search : '',
          })
        : null,
    [assignmentId, page, perPage, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 5_000 });
  const payload = redux.data ?? {};
  return {
    assignment: payload.assignment ?? null,
    counts: payload.counts ?? null,
    students: payload.data ?? [],
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsAssignmentLeaderboardPaginated(
  assignmentId,
  page = 1,
  perPage = 10,
  search = '',
  enabled = true
) {
  const ready = Boolean(enabled && assignmentId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.assignmentLeaderboard({
            assignmentId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
          })
        : null,
    [assignmentId, page, perPage, ready, search]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 5_000 });
  const payload = redux.data ?? {};
  return {
    assignment: payload.assignment ?? null,
    leaderboard: payload.data ?? [],
    myRank: payload.myRank ?? null,
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsQuizStudentsPaginated(
  quizId,
  page = 1,
  perPage = 10,
  status = 'passed',
  search = '',
  enabled = true
) {
  const ready = Boolean(enabled && quizId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.quizStudents({
            quizId,
            page,
            perPage,
            status,
            search: typeof search === 'string' ? search : '',
          })
        : null,
    [quizId, page, perPage, ready, search, status]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 5_000 });
  const payload = redux.data ?? {};
  return {
    quiz: payload.quiz ?? null,
    counts: payload.counts ?? null,
    students: payload.data ?? [],
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsQuizLeaderboardPaginated(
  quizId,
  page = 1,
  perPage = 10,
  search = '',
  enabled = true
) {
  const ready = Boolean(enabled && quizId);
  const endpoint = useMemo(
    () =>
      ready
        ? lmsEndpoints.quizLeaderboard({
            quizId,
            page,
            perPage,
            search: typeof search === 'string' ? search : '',
          })
        : null,
    [quizId, page, perPage, ready, search]
  );
  const redux = useReduxLmsResource(endpoint, ready, { ttlMs: 5_000 });
  const payload = redux.data ?? {};
  return {
    quiz: payload.quiz ?? null,
    leaderboard: payload.data ?? [],
    myRank: payload.myRank ?? null,
    meta: payload.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsMyAssignmentsPaginated(
  page = 1,
  perPage = 10,
  status = 'all',
  search = '',
  enabled = true
) {
  const statusParam = useMemo(() => {
    const raw = String(status ?? 'all').trim();
    if (!raw || raw.toLowerCase() === 'all') {
      return 'all';
    }
    return raw.toLowerCase();
  }, [status]);

  const endpoint = useMemo(
    () =>
      enabled
        ? lmsEndpoints.myAssignments({
            page,
            perPage,
            status: statusParam,
            search: typeof search === 'string' ? search : '',
          })
        : null,
    [enabled, page, perPage, search, statusParam]
  );
  const redux = useReduxLmsResource(endpoint, enabled, { ttlMs: 30_000 });
  const payload = redux.data;
  const assignments = useLiveLmsRows(payload?.data);
  return {
    assignments,
    meta: payload?.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsMyQuizzesPaginated(
  page = 1,
  perPage = 10,
  status = 'all',
  search = '',
  enabled = true
) {
  const statusParam = useMemo(() => {
    const raw = String(status ?? 'all').trim();
    if (!raw || raw.toLowerCase() === 'all') {
      return 'all';
    }
    return raw.toLowerCase();
  }, [status]);

  const endpoint = useMemo(
    () =>
      enabled
        ? lmsEndpoints.myQuizzes({
            page,
            perPage,
            status: statusParam,
            search: typeof search === 'string' ? search : '',
          })
        : null,
    [enabled, page, perPage, search, statusParam]
  );
  const redux = useReduxLmsResource(endpoint, enabled, { ttlMs: 30_000 });
  const payload = redux.data;
  const quizzes = useLiveLmsRows(payload?.data);
  return {
    quizzes,
    meta: payload?.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsLessonProgress(courseId, enabled = true) {
  const key = enabled && courseId ? lmsEndpoints.lessonProgress(courseId) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 30_000 });
  return {
    lessonProgressKeys: Array.isArray(redux.data?.data) ? redux.data.data : [],
    lessonProgressRecords: Array.isArray(redux.data?.records) ? redux.data.records : [],
    concurrentViewers:
      redux.data?.concurrentViewers && typeof redux.data.concurrentViewers === 'object'
        ? redux.data.concurrentViewers
        : {},
    isLoading: redux.isLoading,
    mutate: redux.mutate,
  };
}

export function useLmsQuestionSets() {
  return useSelector(selectQuizzesState).questionSets;
}

export function useLmsAnalytics() {
  const redux = useReduxLmsResource(lmsEndpoints.analytics(), true, { ttlMs: 45_000 });
  return { analytics: redux.data ?? null, isLoading: redux.isLoading };
}

export function useSuggestedModules() {
  const { analytics } = useLmsAnalytics();
  const ids = analytics?.suggestedModuleIds ?? [];
  const key = ids.length ? lmsEndpoints.modulesByIds(ids) : null;
  const redux = useReduxLmsResource(key, Boolean(key), { ttlMs: 45_000 });
  return redux.data?.data ?? [];
}

export function useLeaderboard(period) {
  const key = lmsEndpoints.leaderboard(period);
  const redux = useReduxLmsResource(key, true, { ttlMs: 45_000 });
  return redux.data?.data ?? [];
}

export function useLmsEnrollments(enabled = true) {
  const { authenticated, loading: authLoading, user } = useAuthContext();
  const fetchEndpoint = lmsEndpoints.enrollments();
  const ready = Boolean(enabled && authenticated && !authLoading && user?.id);
  const cacheKey = ready ? lmsEndpoints.enrollmentsCacheKey(user.id) : null;

  const redux = useReduxLmsResource(fetchEndpoint, ready, {
    ttlMs: 30_000,
    fetchEndpoint,
    cacheKey: cacheKey ?? fetchEndpoint,
    retryOnError: true,
  });

  return {
    enrollments: ready ? (redux.data?.data ?? []) : [],
    isLoading: ready ? redux.isLoading : false,
    error: redux.error,
    mutate: redux.mutate,
  };
}

/** Approved enrollments → published catalog courses (`GET /api/enrollments/enrolled-courses`). */
export function useLmsEnrolledCourses(enabled = true) {
  const { authenticated, loading: authLoading, user } = useAuthContext();
  const fetchEndpoint = lmsEndpoints.enrolledCourses();
  const ready = Boolean(enabled && authenticated && !authLoading && user?.id);
  const cacheKey = ready ? lmsEndpoints.enrolledCoursesCacheKey(user.id) : null;

  const redux = useReduxLmsResource(fetchEndpoint, ready, {
    ttlMs: 30_000,
    fetchEndpoint,
    cacheKey: cacheKey ?? fetchEndpoint,
    retryOnError: true,
  });

  return {
    courses: ready ? (redux.data?.data ?? []) : [],
    isLoading: ready ? redux.isLoading : false,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsEnrollmentsPaginated(page = 1, perPage = 10, search = '') {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.enrollmentsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
      }),
    [page, perPage, search]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    enrollments: payload?.data ?? [],
    meta: payload?.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useLmsEnrollmentPaymentsPaginated(
  page = 1,
  perPage = 10,
  search = '',
  verification = ''
) {
  const endpoint = useMemo(
    () =>
      lmsEndpoints.enrollmentPaymentsPaginated({
        page,
        perPage,
        search: typeof search === 'string' ? search : '',
        verification: typeof verification === 'string' ? verification : '',
      }),
    [page, perPage, search, verification]
  );
  const redux = useReduxLmsResource(endpoint, true, { ttlMs: 30_000 });
  const payload = redux.data ?? {};
  return {
    payments: payload?.data ?? [],
    meta: payload?.meta ?? null,
    isLoading: redux.isLoading,
    error: redux.error,
    mutate: redux.mutate,
  };
}

export function useRefreshEnrollmentsCatalog() {
  const dispatch = useDispatch();
  return useCallback(() => {
    const endpoint = lmsEndpoints.enrollments();
    if (!shouldUseReduxRead(endpoint)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      dispatch(lmsResourceFetchRequest({ key: endpoint, endpoint, resolve, reject }));
    });
  }, [dispatch]);
}

export function useAdminData() {
  const redux = useReduxLmsResource(lmsEndpoints.admin(), true, { ttlMs: 45_000 });
  return {
    admin: redux.data ?? { users: [], uploads: [] },
    isLoading: redux.isLoading,
  };
}

export function useLmsActions() {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const submitEnrollment = useCallback(
    (payload) =>
      new Promise((resolve, reject) => {
        dispatch(
          submitEnrollmentRequest({
            ...payload,
            authUserId: user?.id ?? null,
            resolve,
            reject,
          })
        );
      }),
    [dispatch, user?.id]
  );
  const requestCourseAccess = useCallback(
    (courseId) =>
      new Promise((resolve, reject) => {
        dispatch(
          submitEnrollmentRequest({
            courseId,
            accessRequest: true,
            authUserId: user?.id ?? null,
            resolve,
            reject,
          })
        );
      }),
    [dispatch, user?.id]
  );
  const simulateQuiz = useCallback(
    (quizId) => dispatch(simulateQuizRequest({ quizId })),
    [dispatch]
  );
  const fetchQuestionSet = useCallback(
    (quizId) => dispatch(fetchQuizQuestionSetRequest({ quizId })),
    [dispatch]
  );
  const toggleModuleVisibility = useCallback(
    (moduleId) => dispatch(toggleModuleVisibilityRequest({ moduleId })),
    [dispatch]
  );
  const uploadModule = useCallback((payload) => dispatch(uploadModuleRequest(payload)), [dispatch]);
  const updateEnrollmentStatus = useCallback(
    (enrollmentId, status) => dispatch(updateEnrollmentStatusRequest({ enrollmentId, status })),
    [dispatch]
  );
  const runCommand = useCallback(
    (command, args = {}) =>
      new Promise((resolve, reject) => {
        if (!LMS_REDUX_FLAGS.writeByRedux) {
          reject(new Error('Redux write pipeline is disabled.'));
          return;
        }
        dispatch(
          lmsCommandRequest({
            command,
            args,
            resolve,
            reject,
          })
        );
      }),
    [dispatch]
  );

  return useMemo(
    () => ({
      fetchQuestionSet,
      requestCourseAccess,
      runCommand,
      simulateQuiz,
      submitEnrollment,
      toggleModuleVisibility,
      updateEnrollmentStatus,
      uploadModule,
    }),
    [
      fetchQuestionSet,
      requestCourseAccess,
      runCommand,
      simulateQuiz,
      submitEnrollment,
      toggleModuleVisibility,
      updateEnrollmentStatus,
      uploadModule,
    ]
  );
}

/** @deprecated Use `useLmsEnrollments`. */
export function useEnrollment(enabled = true) {
  const { enrollments } = useLmsEnrollments(enabled);
  return enrollments;
}
