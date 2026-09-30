import { all, put, call, takeEvery, takeLatest } from 'redux-saga/effects';

import { lmsApi } from 'src/redux/api/lmsApi';
import { lmsEndpoints } from 'src/redux/api/lmsEndpoints';
import { apiErrorHandler } from 'src/redux/utils/apiErrorHandler';
import {
  LMS_COMMAND_REQUEST,
  QUIZ_SIMULATION_REQUEST,
  ENROLLMENT_SUBMIT_REQUEST,
  QUIZ_QUESTION_SET_REQUEST,
  LMS_RESOURCE_FETCH_REQUEST,
  ADMIN_UPLOAD_MODULE_REQUEST,
  ADMIN_TOGGLE_MODULE_VISIBILITY_REQUEST,
  ADMIN_UPDATE_ENROLLMENT_STATUS_REQUEST,
} from 'src/redux/constants/lmsTypes';
import {
  lmsFlashSet,
  lmsCommandFailure,
  lmsCommandSuccess,
  simulateQuizSuccess,
  simulateQuizFailure,
  uploadModuleSuccess,
  uploadModuleFailure,
  lmsResourceFetchFailure,
  lmsResourceFetchSuccess,
  lmsResourceFetchRequest,
  submitEnrollmentSuccess,
  submitEnrollmentFailure,
  fetchQuizQuestionSetSuccess,
  fetchQuizQuestionSetFailure,
  toggleModuleVisibilitySuccess,
  toggleModuleVisibilityFailure,
  updateEnrollmentStatusSuccess,
  updateEnrollmentStatusFailure,
} from 'src/redux/actions/lmsActions';

function* submitEnrollmentSaga(action) {
  const { courseId, programId, paymentProofFile, formData, resolve, reject } = action.payload ?? {};
  try {
    const payload = yield call(lmsApi.submitEnrollmentRequest, {
      courseId,
      programId,
      paymentProofFile,
      formData,
    });
    yield put(submitEnrollmentSuccess(payload));
    const enrollmentsEndpoint = lmsEndpoints.enrollments();
    const authUserId = action.payload?.authUserId;
    const enrollmentsKey = lmsEndpoints.enrollmentsCacheKey(authUserId);
    yield put(lmsResourceFetchRequest({ key: enrollmentsKey, endpoint: enrollmentsEndpoint }));
    if (authUserId) {
      const enrolledCoursesEndpoint = lmsEndpoints.enrolledCourses();
      yield put(
        lmsResourceFetchRequest({
          key: lmsEndpoints.enrolledCoursesCacheKey(authUserId),
          endpoint: enrolledCoursesEndpoint,
        })
      );
    }
    yield put(
      lmsFlashSet({
        severity: 'success',
        message: 'Enrollment submitted with payment proof. An administrator will verify it shortly.',
      })
    );
    if (typeof resolve === 'function') {
      resolve(payload);
    }
  } catch (error) {
    const message = apiErrorHandler(error);
    yield put(submitEnrollmentFailure(message));
    if (typeof reject === 'function') {
      reject(new Error(message));
    }
  }
}

function* simulateQuizSaga(action) {
  try {
    const payload = yield call(lmsApi.simulateQuizAttempt, action.payload.quizId);
    yield put(simulateQuizSuccess(payload));
    yield put(lmsFlashSet({ severity: 'success', message: `Quiz submitted. Score: ${payload.score}%` }));
  } catch (error) {
    yield put(simulateQuizFailure(apiErrorHandler(error)));
  }
}

function* fetchQuestionSetSaga(action) {
  try {
    const questions = yield call(lmsApi.fetchQuizQuestionSet, action.payload.quizId);
    yield put(fetchQuizQuestionSetSuccess({ quizId: action.payload.quizId, questions }));
  } catch (error) {
    yield put(fetchQuizQuestionSetFailure(apiErrorHandler(error)));
  }
}

function* toggleVisibilitySaga(action) {
  try {
    const payload = yield call(lmsApi.toggleModuleVisibility, action.payload.moduleId);
    yield put(toggleModuleVisibilitySuccess(payload));
    yield put(lmsFlashSet({ severity: 'success', message: 'Module visibility updated successfully.' }));
  } catch (error) {
    yield put(toggleModuleVisibilityFailure(apiErrorHandler(error)));
  }
}

function* uploadModuleSaga(action) {
  try {
    const payload = yield call(lmsApi.uploadAdminModule, action.payload);
    yield put(uploadModuleSuccess(payload));
    yield put(lmsFlashSet({ severity: 'success', message: `"${payload.title}" was queued for upload.` }));
  } catch (error) {
    yield put(uploadModuleFailure(apiErrorHandler(error)));
  }
}

function* updateEnrollmentStatusSaga(action) {
  try {
    const payload = yield call(lmsApi.updateEnrollmentStatus, action.payload);
    yield put(updateEnrollmentStatusSuccess(payload));
    const enrollmentsEndpoint = lmsEndpoints.enrollments();
    const enrolledCoursesEndpoint = lmsEndpoints.enrolledCourses();
    yield put(
      lmsResourceFetchRequest({ key: enrollmentsEndpoint, endpoint: enrollmentsEndpoint })
    );
    yield put(
      lmsResourceFetchRequest({
        key: enrolledCoursesEndpoint,
        endpoint: enrolledCoursesEndpoint,
      })
    );
    yield put(lmsFlashSet({ severity: 'success', message: `Enrollment updated to "${payload.status}".` }));
  } catch (error) {
    yield put(updateEnrollmentStatusFailure(apiErrorHandler(error)));
  }
}

function* fetchLmsResourceSaga(action) {
  try {
    const endpoint = String(action.payload?.endpoint ?? '').trim();
    const key = String(action.payload?.key ?? endpoint).trim();
    if (!endpoint || !key) throw new Error('Missing endpoint/key for LMS resource fetch.');
    const data = yield call(lmsApi.fetchResource, { endpoint, params: action.payload?.params ?? null });
    yield put(lmsResourceFetchSuccess({ key, data }));
    if (typeof action.payload?.resolve === 'function') {
      yield call(action.payload.resolve, data);
    }
  } catch (error) {
    yield put(lmsResourceFetchFailure({ key: String(action.payload?.key ?? action.payload?.endpoint ?? '').trim(), error: apiErrorHandler(error) }));
    if (typeof action.payload?.reject === 'function') {
      yield call(action.payload.reject, error);
    }
  }
}

function* runLmsCommandSaga(action) {
  const command = String(action.payload?.command ?? '').trim();
  try {
    if (!command) throw new Error('Missing LMS command.');
    const data = yield call(lmsApi.runCommand, command, action.payload?.args ?? {});
    yield put(lmsCommandSuccess({ command, data }));
    if (typeof action.payload?.resolve === 'function') {
      yield call(action.payload.resolve, data);
    }
  } catch (error) {
    yield put(lmsCommandFailure({ command, error: apiErrorHandler(error) }));
    if (typeof action.payload?.reject === 'function') {
      yield call(action.payload.reject, error);
    }
  }
}

export function* lmsSagas() {
  yield all([
    takeLatest(ENROLLMENT_SUBMIT_REQUEST, submitEnrollmentSaga),
    takeLatest(QUIZ_SIMULATION_REQUEST, simulateQuizSaga),
    takeLatest(QUIZ_QUESTION_SET_REQUEST, fetchQuestionSetSaga),
    takeLatest(ADMIN_TOGGLE_MODULE_VISIBILITY_REQUEST, toggleVisibilitySaga),
    takeLatest(ADMIN_UPLOAD_MODULE_REQUEST, uploadModuleSaga),
    takeLatest(ADMIN_UPDATE_ENROLLMENT_STATUS_REQUEST, updateEnrollmentStatusSaga),
    // Do not globally cancel unrelated endpoints/commands; cancellation here can strand loading flags.
    takeEvery(LMS_RESOURCE_FETCH_REQUEST, fetchLmsResourceSaga),
    takeEvery(LMS_COMMAND_REQUEST, runLmsCommandSaga),
  ]);
}
