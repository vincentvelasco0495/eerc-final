import {
  LMS_FLASH_SET,
  LMS_FLASH_CLEAR,
  LMS_COMMAND_REQUEST,
  LMS_COMMAND_SUCCESS,
  LMS_COMMAND_FAILURE,
  QUIZ_SIMULATION_FAILURE,
  QUIZ_SIMULATION_REQUEST,
  QUIZ_SIMULATION_SUCCESS,
  ENROLLMENT_SUBMIT_SUCCESS,
  ENROLLMENT_SUBMIT_FAILURE,
  ENROLLMENT_SUBMIT_REQUEST,
  QUIZ_QUESTION_SET_REQUEST,
  QUIZ_QUESTION_SET_SUCCESS,
  QUIZ_QUESTION_SET_FAILURE,
  LMS_RESOURCE_FETCH_REQUEST,
  LMS_RESOURCE_FETCH_SUCCESS,
  LMS_RESOURCE_FETCH_FAILURE,
  ADMIN_UPLOAD_MODULE_SUCCESS,
  ADMIN_UPLOAD_MODULE_FAILURE,
  ADMIN_UPLOAD_MODULE_REQUEST,
  ADMIN_TOGGLE_MODULE_VISIBILITY_SUCCESS,
  ADMIN_TOGGLE_MODULE_VISIBILITY_FAILURE,
  ADMIN_TOGGLE_MODULE_VISIBILITY_REQUEST,
  ADMIN_UPDATE_ENROLLMENT_STATUS_SUCCESS,
  ADMIN_UPDATE_ENROLLMENT_STATUS_FAILURE,
  ADMIN_UPDATE_ENROLLMENT_STATUS_REQUEST,
} from 'src/redux/constants/lmsTypes';

export const initialLmsLoading = {
  enrollmentSubmit: false,
  quizAttempt: false,
  quizQuestions: false,
  moduleVisibility: false,
  adminUpload: false,
  enrollmentStatus: false,
};

const initialAppState = {
  error: null,
  flash: null,
  loading: { ...initialLmsLoading },
  resources: {},
  commands: {},
};

/** Replace prior row for the same course/program target, then prepend the new submission. */
function upsertEnrollmentInList(list, created) {
  if (!created?.id) {
    return list ?? [];
  }

  const filtered = (list ?? []).filter((item) => {
    if (!item) {
      return false;
    }
    if (created.courseId) {
      return item.courseId !== created.courseId;
    }
    if (created.programId && !created.courseId) {
      return !(item.programId === created.programId && !item.courseId);
    }
    return item.id !== created.id;
  });

  return [created, ...filtered];
}

function mergeEnrollmentSubmitIntoResources(resources, created) {
  if (!created?.id) {
    return resources;
  }

  const next = { ...resources };
  const stamp = Date.now();

  Object.keys(next).forEach((key) => {
    if (!key.startsWith('/api/enrollments') || key.includes('enrolled-courses')) {
      return;
    }

    const prev = next[key] ?? {};
    const list = Array.isArray(prev?.data?.data) ? prev.data.data : [];
    const merged = upsertEnrollmentInList(list, created);

    next[key] = {
      ...prev,
      data: { ...(prev.data ?? {}), data: merged },
      error: null,
      isLoading: false,
      updatedAt: stamp,
    };
  });

  return next;
}

function appReducer(state = initialAppState, action) {
  switch (action.type) {
    case ENROLLMENT_SUBMIT_REQUEST:
      return { ...state, ...(state.flash ? { flash: null } : {}), loading: { ...state.loading, enrollmentSubmit: true } };
    case ENROLLMENT_SUBMIT_SUCCESS:
      return {
        ...state,
        resources: mergeEnrollmentSubmitIntoResources(state.resources, action.payload),
        loading: { ...state.loading, enrollmentSubmit: false },
      };
    case ENROLLMENT_SUBMIT_FAILURE:
      return { ...state, loading: { ...state.loading, enrollmentSubmit: false }, flash: { severity: 'error', message: action.payload } };
    case QUIZ_SIMULATION_REQUEST:
      return { ...state, ...(state.flash ? { flash: null } : {}), loading: { ...state.loading, quizAttempt: true } };
    case QUIZ_SIMULATION_SUCCESS:
      return { ...state, loading: { ...state.loading, quizAttempt: false } };
    case QUIZ_SIMULATION_FAILURE:
      return { ...state, loading: { ...state.loading, quizAttempt: false }, flash: { severity: 'error', message: action.payload } };
    case QUIZ_QUESTION_SET_REQUEST:
      return { ...state, ...(state.flash ? { flash: null } : {}), loading: { ...state.loading, quizQuestions: true } };
    case QUIZ_QUESTION_SET_SUCCESS:
      return { ...state, loading: { ...state.loading, quizQuestions: false } };
    case QUIZ_QUESTION_SET_FAILURE:
      return { ...state, loading: { ...state.loading, quizQuestions: false }, flash: { severity: 'error', message: action.payload } };
    case ADMIN_TOGGLE_MODULE_VISIBILITY_REQUEST:
      return { ...state, ...(state.flash ? { flash: null } : {}), loading: { ...state.loading, moduleVisibility: true } };
    case ADMIN_TOGGLE_MODULE_VISIBILITY_SUCCESS:
      return { ...state, loading: { ...state.loading, moduleVisibility: false } };
    case ADMIN_TOGGLE_MODULE_VISIBILITY_FAILURE:
      return { ...state, loading: { ...state.loading, moduleVisibility: false }, flash: { severity: 'error', message: action.payload } };
    case ADMIN_UPLOAD_MODULE_REQUEST:
      return { ...state, ...(state.flash ? { flash: null } : {}), loading: { ...state.loading, adminUpload: true } };
    case ADMIN_UPLOAD_MODULE_SUCCESS:
      return { ...state, loading: { ...state.loading, adminUpload: false } };
    case ADMIN_UPLOAD_MODULE_FAILURE:
      return { ...state, loading: { ...state.loading, adminUpload: false }, flash: { severity: 'error', message: action.payload } };
    case ADMIN_UPDATE_ENROLLMENT_STATUS_REQUEST:
      return { ...state, ...(state.flash ? { flash: null } : {}), loading: { ...state.loading, enrollmentStatus: true } };
    case ADMIN_UPDATE_ENROLLMENT_STATUS_SUCCESS:
      return { ...state, loading: { ...state.loading, enrollmentStatus: false } };
    case ADMIN_UPDATE_ENROLLMENT_STATUS_FAILURE:
      return { ...state, loading: { ...state.loading, enrollmentStatus: false }, flash: { severity: 'error', message: action.payload } };
    case LMS_FLASH_SET:
      return { ...state, flash: action.payload };
    case LMS_FLASH_CLEAR:
      return { ...state, flash: null };
    case LMS_RESOURCE_FETCH_REQUEST: {
      const key = String(action.payload?.key ?? '').trim();
      if (!key) return state;
      const prev = state.resources[key] ?? {};
      return { ...state, resources: { ...state.resources, [key]: { ...prev, isLoading: true, error: null } } };
    }
    case LMS_RESOURCE_FETCH_SUCCESS: {
      const key = String(action.payload?.key ?? '').trim();
      if (!key) return state;
      return { ...state, resources: { ...state.resources, [key]: { data: action.payload?.data ?? null, error: null, isLoading: false, updatedAt: Date.now() } } };
    }
    case LMS_RESOURCE_FETCH_FAILURE: {
      const key = String(action.payload?.key ?? '').trim();
      if (!key) return state;
      const prev = state.resources[key] ?? {};
      return {
        ...state,
        resources: {
          ...state.resources,
          [key]: {
            ...prev,
            isLoading: false,
            error: action.payload?.error ?? 'Request failed',
            updatedAt: Date.now(),
          },
        },
      };
    }
    case LMS_COMMAND_REQUEST: {
      const command = String(action.payload?.command ?? '').trim();
      if (!command) return state;
      return { ...state, commands: { ...state.commands, [command]: { isLoading: true, error: null, data: null, updatedAt: Date.now() } } };
    }
    case LMS_COMMAND_SUCCESS: {
      const command = String(action.payload?.command ?? '').trim();
      if (!command) return state;
      return { ...state, commands: { ...state.commands, [command]: { isLoading: false, error: null, data: action.payload?.data ?? null, updatedAt: Date.now() } } };
    }
    case LMS_COMMAND_FAILURE: {
      const command = String(action.payload?.command ?? '').trim();
      if (!command) return state;
      return { ...state, commands: { ...state.commands, [command]: { isLoading: false, error: action.payload?.error ?? 'Request failed', data: null, updatedAt: Date.now() } } };
    }
    default:
      return state;
  }
}

const initialQuizState = { questionSets: {} };
function quizzesReducer(state = initialQuizState, action) {
  switch (action.type) {
    case QUIZ_QUESTION_SET_SUCCESS:
      return {
        ...state,
        questionSets: { ...state.questionSets, [action.payload.quizId]: action.payload.questions },
      };
    default:
      return state;
  }
}

export const lmsReducerMap = {
  app: appReducer,
  quizzes: quizzesReducer,
};
