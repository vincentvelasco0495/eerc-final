import axios from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import {
  uploadAdminModule as mockUploadAdminModule,
  createBatchEnroll as mockCreateBatchEnroll,
  updateBatchEnroll as mockUpdateBatchEnroll,
  deleteBatchEnroll as mockDeleteBatchEnroll,
  createLearningMode as mockCreateLearningMode,
  updateLearningMode as mockUpdateLearningMode,
  deleteLearningMode as mockDeleteLearningMode,
  createBranchEnroll as mockCreateBranchEnroll,
  updateBranchEnroll as mockUpdateBranchEnroll,
  deleteBranchEnroll as mockDeleteBranchEnroll,
  createPackageEnroll as mockCreatePackageEnroll,
  updatePackageEnroll as mockUpdatePackageEnroll,
  deletePackageEnroll as mockDeletePackageEnroll,
  simulateQuizAttempt as mockSimulateQuizAttempt,
  submitEnrollmentRequest as mockSubmitEnrollment,
  createReviewSchedule as mockCreateReviewSchedule,
  updateReviewSchedule as mockUpdateReviewSchedule,
  deleteReviewSchedule as mockDeleteReviewSchedule,
  fetchQuizQuestionSet as mockFetchQuizQuestionSet,
  toggleModuleVisibility as mockToggleModuleVisibility,
  updateEnrollmentStatus as mockUpdateEnrollmentStatus,
  createHonorAwardDiscount as mockCreateHonorAwardDiscount,
  updateHonorAwardDiscount as mockUpdateHonorAwardDiscount,
  deleteHonorAwardDiscount as mockDeleteHonorAwardDiscount,
} from 'src/services/lms.service';

const apiRoot = '/api';
const isLmsLiveApi = () => Boolean(CONFIG.serverUrl?.trim());

function postJson(url, body) {
  return axios.post(url, body).then((res) => res.data);
}
function patchJson(url, body = {}) {
  return axios.patch(url, body).then((res) => res.data);
}
function getJson(url) {
  return axios.get(url).then((res) => res.data);
}

export function getLmsAxiosErrorMessage(error, fallback = 'Request failed.') {
  const payload = error?.response?.data;
  const msg =
    payload && typeof payload === 'object' && payload.message != null ? payload.message : null;
  if (typeof msg === 'string' && msg.trim()) return msg.trim();
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (typeof error?.message === 'string' && error.message.trim()) return error.message.trim();
  return fallback;
}

/** Laravel 422 `errors` bag → first message per field. */
export function getLmsAxiosFieldErrors(error) {
  const bag = error?.response?.data?.errors;
  if (!bag || typeof bag !== 'object') {
    return {};
  }

  return Object.entries(bag).reduce((acc, [key, messages]) => {
    const first = Array.isArray(messages) ? messages[0] : messages;
    if (typeof first === 'string' && first.trim()) {
      acc[key] = first.trim();
    }
    return acc;
  }, {});
}

export async function patchLmsCourse(publicId, payload) {
  const endpoint = `/api/courses/${encodeURIComponent(publicId)}`;
  const body = payload ?? {};
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    if (!body.has('_method')) body.append('_method', 'PATCH');
    const { data } = await axios.post(endpoint, body);
    return data;
  }
  const { data } = await axios.patch(endpoint, body);
  return data;
}
export async function postLmsProgram(payload = {}) {
  const { data } = await axios.post('/api/programs', payload ?? {});
  return data;
}
export async function patchLmsProgram(publicId, payload = {}) {
  const endpoint = `/api/programs/${encodeURIComponent(publicId)}`;
  const body = payload ?? {};
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    if (!body.has('_method')) body.append('_method', 'PATCH');
    const { data } = await axios.post(endpoint, body);
    return data;
  }
  const { data } = await axios.patch(endpoint, body);
  return data;
}
export async function deleteLmsProgram(publicId) {
  const { data } = await axios.delete(`/api/programs/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsBatchEnroll(payload = {}) {
  if (!isLmsLiveApi()) {
    return mockCreateBatchEnroll(payload);
  }
  const { data } = await axios.post('/api/batch-enrolls', payload ?? {});
  return data;
}
export async function patchLmsBatchEnroll(publicId, payload = {}) {
  if (!isLmsLiveApi()) {
    return mockUpdateBatchEnroll(publicId, payload ?? {});
  }
  const { data } = await axios.patch(
    `/api/batch-enrolls/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsBatchEnroll(publicId) {
  if (!isLmsLiveApi()) {
    return mockDeleteBatchEnroll(publicId);
  }
  const { data } = await axios.delete(`/api/batch-enrolls/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsLearningMode(payload = {}) {
  if (!isLmsLiveApi()) {
    return mockCreateLearningMode(payload);
  }
  const { data } = await axios.post('/api/learning-modes', payload ?? {});
  return data;
}
export async function patchLmsLearningMode(publicId, payload = {}) {
  if (!isLmsLiveApi()) {
    return mockUpdateLearningMode(publicId, payload ?? {});
  }
  const { data } = await axios.patch(
    `/api/learning-modes/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsLearningMode(publicId) {
  if (!isLmsLiveApi()) {
    return mockDeleteLearningMode(publicId);
  }
  const { data } = await axios.delete(`/api/learning-modes/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsBranchEnroll(payload = {}) {
  if (!isLmsLiveApi()) {
    return mockCreateBranchEnroll(payload);
  }
  const { data } = await axios.post('/api/branch-enrolls', payload ?? {});
  return data;
}
export async function patchLmsBranchEnroll(publicId, payload = {}) {
  if (!isLmsLiveApi()) {
    return mockUpdateBranchEnroll(publicId, payload ?? {});
  }
  const { data } = await axios.patch(
    `/api/branch-enrolls/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsBranchEnroll(publicId) {
  if (!isLmsLiveApi()) {
    return mockDeleteBranchEnroll(publicId);
  }
  const { data } = await axios.delete(`/api/branch-enrolls/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsReviewSchedule(payload = {}) {
  if (!isLmsLiveApi()) {
    return mockCreateReviewSchedule(payload);
  }
  const { data } = await axios.post('/api/review-schedules', payload ?? {});
  return data;
}
export async function patchLmsReviewSchedule(publicId, payload = {}) {
  if (!isLmsLiveApi()) {
    return mockUpdateReviewSchedule(publicId, payload ?? {});
  }
  const { data } = await axios.patch(
    `/api/review-schedules/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsReviewSchedule(publicId) {
  if (!isLmsLiveApi()) {
    return mockDeleteReviewSchedule(publicId);
  }
  const { data } = await axios.delete(`/api/review-schedules/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsHonorAwardDiscount(payload = {}) {
  if (!isLmsLiveApi()) {
    return mockCreateHonorAwardDiscount(payload);
  }
  const { data } = await axios.post('/api/honor-award-discounts', payload ?? {});
  return data;
}
export async function patchLmsHonorAwardDiscount(publicId, payload = {}) {
  if (!isLmsLiveApi()) {
    return mockUpdateHonorAwardDiscount(publicId, payload ?? {});
  }
  const { data } = await axios.patch(
    `/api/honor-award-discounts/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsHonorAwardDiscount(publicId) {
  if (!isLmsLiveApi()) {
    return mockDeleteHonorAwardDiscount(publicId);
  }
  const { data } = await axios.delete(`/api/honor-award-discounts/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsPackageEnroll(payload = {}) {
  if (!isLmsLiveApi()) {
    return mockCreatePackageEnroll(payload);
  }
  const { data } = await axios.post('/api/package-enrolls', payload ?? {});
  return data;
}
export async function patchLmsPackageEnroll(publicId, payload = {}) {
  if (!isLmsLiveApi()) {
    return mockUpdatePackageEnroll(publicId, payload ?? {});
  }
  const { data } = await axios.patch(
    `/api/package-enrolls/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsPackageEnroll(publicId) {
  if (!isLmsLiveApi()) {
    return mockDeletePackageEnroll(publicId);
  }
  const { data } = await axios.delete(`/api/package-enrolls/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsInstructor(payload = {}) {
  const { data } = await axios.post('/api/instructors', payload ?? {});
  return data;
}
export async function patchLmsInstructor(publicId, payload = {}) {
  const endpoint = `/api/instructors/${encodeURIComponent(publicId)}`;
  const body = payload ?? {};
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    if (!body.has('_method')) body.append('_method', 'PATCH');
    const { data } = await axios.post(endpoint, body);
    return data;
  }
  const { data } = await axios.patch(endpoint, body);
  return data;
}
export async function deleteLmsInstructor(publicId) {
  const { data } = await axios.delete(`/api/instructors/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsStudent(payload = {}) {
  const { data } = await axios.post('/api/students', payload ?? {});
  return data;
}
export async function patchLmsStudent(publicId, payload = {}) {
  const endpoint = `/api/students/${encodeURIComponent(publicId)}`;
  const body = payload ?? {};
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    if (!body.has('_method')) body.append('_method', 'PATCH');
    const { data } = await axios.post(endpoint, body);
    return data;
  }
  const { data } = await axios.patch(endpoint, body);
  return data;
}
export async function deleteLmsStudent(publicId) {
  const { data } = await axios.delete(`/api/students/${encodeURIComponent(publicId)}`);
  return data;
}
export async function patchLmsUser(payload = {}) {
  const body = payload ?? {};
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    if (!body.has('_method')) {
      body.append('_method', 'PATCH');
    }
    const { data } = await axios.post('/api/user', body);
    return data;
  }
  const { data } = await axios.patch('/api/user', body);
  return data;
}
export async function postLmsCourse(payload = {}) {
  const { data } = await axios.post('/api/courses', payload ?? {});
  return data;
}
export async function patchLmsModule(publicId, payload) {
  const { data } = await axios.patch(`/api/modules/${encodeURIComponent(publicId)}`, payload ?? {});
  return data;
}
export async function postLmsModuleForCourse(coursePublicId, payload) {
  const { data } = await axios.post(
    `/api/courses/${encodeURIComponent(coursePublicId)}/modules`,
    payload ?? {}
  );
  return data;
}
export async function reorderLmsModulesForCourse(coursePublicId, moduleIds = []) {
  const { data } = await axios.patch(
    `/api/courses/${encodeURIComponent(coursePublicId)}/modules/reorder`,
    { moduleIds: Array.isArray(moduleIds) ? moduleIds : [] }
  );
  return data;
}
export async function deleteLmsModule(publicId) {
  const { data } = await axios.delete(`/api/modules/${encodeURIComponent(publicId)}`);
  return data;
}
export async function reorderLmsModuleLessons(modulePublicId, lessonIds = []) {
  const { data } = await axios.patch(
    `/api/modules/${encodeURIComponent(modulePublicId)}/lessons/reorder`,
    { lessonIds: Array.isArray(lessonIds) ? lessonIds : [] }
  );
  return data;
}
export async function postLmsStandaloneLesson(modulePublicId, payload) {
  const { data } = await axios.post(
    `/api/modules/${encodeURIComponent(modulePublicId)}/standalone-lessons`,
    payload ?? {}
  );
  return data;
}
export async function patchLmsStandaloneLesson(publicId, payload) {
  const { data } = await axios.patch(
    `/api/standalone-lessons/${encodeURIComponent(publicId)}`,
    payload ?? {}
  );
  return data;
}
export async function deleteLmsStandaloneLesson(publicId) {
  const { data } = await axios.delete(`/api/standalone-lessons/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLmsQuizForModule(modulePublicId, payload) {
  const { data } = await axios.post(
    `/api/modules/${encodeURIComponent(modulePublicId)}/quizzes`,
    payload ?? {}
  );
  return data;
}
export async function getLmsQuizQuestions(publicId) {
  const { data } = await axios.get(`/api/quizzes/${encodeURIComponent(publicId)}/questions`);
  return data;
}
export async function patchLmsQuiz(publicId, payload) {
  const { data } = await axios.patch(`/api/quizzes/${encodeURIComponent(publicId)}`, payload ?? {});
  return data;
}
export async function postLmsAssignmentForModule(modulePublicId, payload) {
  const { data } = await axios.post(
    `/api/modules/${encodeURIComponent(modulePublicId)}/assignments`,
    payload ?? {}
  );
  return data;
}
export async function getLmsAssignmentQuestions(publicId) {
  const { data } = await axios.get(`/api/assignments/${encodeURIComponent(publicId)}/questions`);
  return data;
}
export async function patchLmsAssignment(publicId, payload) {
  const { data } = await axios.patch(`/api/assignments/${encodeURIComponent(publicId)}`, payload ?? {});
  return data;
}
export async function deleteLmsAssignment(publicId) {
  const { data } = await axios.delete(`/api/assignments/${encodeURIComponent(publicId)}`);
  return data;
}
export async function postLessonMaterialForAssignment(assignmentPublicId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await axios.post(
    `/api/assignments/${encodeURIComponent(assignmentPublicId)}/lesson-materials`,
    fd
  );
  return data;
}
export async function postLmsQuizAttempt(publicId, payload) {
  const { data } = await axios.post(
    `/api/quizzes/${encodeURIComponent(publicId)}/attempts`,
    payload ?? {}
  );
  return data;
}
export async function postLmsAssignmentAttempt(publicId, payload) {
  const { data } = await axios.post(
    `/api/assignments/${encodeURIComponent(publicId)}/attempts`,
    payload ?? {}
  );
  return data;
}
export async function postLmsLessonProgress(coursePublicId, lessonKey) {
  const { data } = await axios.post(
    `/api/courses/${encodeURIComponent(coursePublicId)}/lesson-progress`,
    { lessonKey }
  );
  return data;
}
export async function patchLmsLessonProgress(coursePublicId, payload = {}) {
  const { data } = await axios.patch(
    `/api/courses/${encodeURIComponent(coursePublicId)}/lesson-progress`,
    payload ?? {}
  );
  return data;
}
export const VIDEO_UPLOAD_CHUNK_BYTES = 1024 * 1024;
export async function initLessonVideoUpload(payload = {}) {
  const { data } = await axios.post('/api/video-uploads', payload ?? {});
  return data;
}
export async function getLessonVideoUpload(uploadId) {
  const { data } = await axios.get(`/api/video-uploads/${encodeURIComponent(uploadId)}`);
  return data;
}
export async function postLessonVideoUploadChunk(uploadId, index, blob) {
  const fd = new FormData();
  fd.append('chunk', blob, `chunk-${index}`);
  const { data } = await axios.post(
    `/api/video-uploads/${encodeURIComponent(uploadId)}/chunks/${encodeURIComponent(String(index))}`,
    fd,
    { timeout: 0 }
  );
  return data;
}
export async function completeLessonVideoUpload(uploadId) {
  const { data } = await axios.post(
    `/api/video-uploads/${encodeURIComponent(uploadId)}/complete`,
    {},
    { timeout: 0 }
  );
  return data;
}
export async function abortLessonVideoUpload(uploadId) {
  const { data } = await axios.delete(`/api/video-uploads/${encodeURIComponent(uploadId)}`);
  return data;
}

function videoUploadResumeKey(file, target) {
  return [
    'lms-video-upload',
    target.kind,
    target.id,
    file.name,
    file.size,
    file.lastModified,
  ].join(':');
}

function unwrapVideoUploadPayload(raw) {
  if (raw?.data && typeof raw.data === 'object') {
    return raw.data;
  }
  return raw ?? {};
}

function sleepMs(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withVideoUploadRetry(fn, { attempts = 5, signal } = {}) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = error?.status ?? error?.response?.status;
      const retryable = !status || status === 429 || status >= 500;
      if (!retryable || attempt === attempts - 1) {
        throw error;
      }
      await sleepMs(Math.min(8000, 400 * 2 ** attempt));
    }
  }
  throw lastError;
}

/** Resumable 1 MiB chunked video upload; survives refresh via sessionStorage. */
export async function uploadLessonVideoInChunks({ file, target, onProgress, signal } = {}) {
  if (!file) {
    throw new Error('Choose a video file first.');
  }
  const maxBytes = 8 * 1024 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Video is larger than 8 GB.');
  }
  if (file.size < 1) {
    throw new Error('Video file is empty.');
  }

  const chunkSize = VIDEO_UPLOAD_CHUNK_BYTES;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const key = videoUploadResumeKey(file, target);
  let uploadId = null;
  let received = [];

  try {
    uploadId = sessionStorage.getItem(key);
  } catch {
    uploadId = null;
  }

  if (uploadId) {
    try {
      const status = unwrapVideoUploadPayload(await getLessonVideoUpload(uploadId));
      received = Array.isArray(status.receivedChunks) ? status.receivedChunks.map((n) => Number(n)) : [];
    } catch {
      uploadId = null;
      received = [];
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }

  if (!uploadId) {
    const init = unwrapVideoUploadPayload(
      await initLessonVideoUpload({
        originalName: file.name,
        sizeBytes: file.size,
        mime: file.type || 'video/mp4',
        chunkSize,
        totalChunks,
        targetKind: target.kind,
        targetPublicId: target.id,
        moduleResourcePublicId: target.moduleResourcePublicId || undefined,
      })
    );
    uploadId = init.id;
    received = Array.isArray(init.receivedChunks) ? init.receivedChunks.map((n) => Number(n)) : [];
    try {
      sessionStorage.setItem(key, uploadId);
    } catch {
      /* private mode */
    }
  }

  const receivedSet = new Set(received);
  let uploadedBytes = 0;
  receivedSet.forEach((index) => {
    const start = index * chunkSize;
    uploadedBytes += Math.min(chunkSize, file.size - start);
  });
  onProgress?.({
    percent: Math.min(99, Math.round((uploadedBytes / file.size) * 100)),
    uploadedBytes,
    totalBytes: file.size,
  });

  for (let index = 0; index < totalChunks; index += 1) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    if (receivedSet.has(index)) {
      continue;
    }
    const start = index * chunkSize;
    const blob = file.slice(start, Math.min(start + chunkSize, file.size));
    await withVideoUploadRetry(() => postLessonVideoUploadChunk(uploadId, index, blob), { signal });
    receivedSet.add(index);
    uploadedBytes += blob.size;
    onProgress?.({
      percent: Math.min(99, Math.round((uploadedBytes / file.size) * 100)),
      uploadedBytes,
      totalBytes: file.size,
    });
  }

  onProgress?.({ percent: 99, uploadedBytes: file.size, totalBytes: file.size, assembling: true });
  const completed = await completeLessonVideoUpload(uploadId);
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  onProgress?.({ percent: 100, uploadedBytes: file.size, totalBytes: file.size });
  return completed;
}
export async function postLessonMaterialForModule(modulePublicId, file, options = {}) {
  const fd = new FormData();
  fd.append('file', file);
  const rid = options.moduleResourcePublicId;
  if (rid != null && String(rid).trim() !== '') fd.append('moduleResourcePublicId', String(rid).trim());
  const usage = options.usage;
  if (usage != null && String(usage).trim() !== '') fd.append('usage', String(usage).trim());
  const { data } = await axios.post(
    `/api/modules/${encodeURIComponent(modulePublicId)}/lesson-materials`,
    fd
  );
  return data;
}
export async function postLessonMaterialForStandaloneLesson(standalonePublicId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await axios.post(
    `/api/standalone-lessons/${encodeURIComponent(standalonePublicId)}/lesson-materials`,
    fd
  );
  return data;
}
export async function deleteLessonMaterial(publicId) {
  const { data } = await axios.delete(`/api/lesson-materials/${encodeURIComponent(publicId)}`);
  return data;
}
export async function getLessonMaterialPlaybackUrl(publicId) {
  const { data } = await axios.get(`/api/lesson-materials/${encodeURIComponent(publicId)}/playback`);
  const path = data?.data?.path ?? data?.path ?? '';
  if (typeof path !== 'string' || !path.trim()) {
    throw new Error('Playback URL missing.');
  }
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  return `${base}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}
export async function fetchLessonMaterialBlob(publicId, options = {}) {
  const response = await axios.get(`/api/lesson-materials/${encodeURIComponent(publicId)}/file`, {
    responseType: 'blob',
    params: options,
  });
  return response.data;
}

export async function submitEnrollmentWithPaymentProof({ courseId, programId, paymentProofFile }) {
  const fd = new FormData();
  if (courseId) {
    fd.append('course_id', courseId);
  }
  if (programId) {
    fd.append('program_id', programId);
  }
  fd.append('payment_proof', paymentProofFile);
  const { data } = await axios.post(`${apiRoot}/enrollments`, fd);
  return data;
}

export async function submitEnrollmentApplicationForm(formData) {
  const { data } = await axios.post(`${apiRoot}/enrollments`, formData);
  return data;
}

export async function submitEnrollmentPartialPayment({ enrollmentId, amount, paymentProofFile }) {
  if (isLmsLiveApi()) {
    const fd = new FormData();
    fd.append('amount', String(amount));
    fd.append('payment_proof', paymentProofFile);
    const { data } = await axios.post(
      `${apiRoot}/enrollments/${encodeURIComponent(enrollmentId)}/partial-payments`,
      fd
    );
    return data;
  }

  const { submitEnrollmentPartialPayment: mockSubmitEnrollmentPartialPayment } = await import(
    'src/services/lms.service'
  );
  return mockSubmitEnrollmentPartialPayment({ enrollmentId, amount, paymentProofFile });
}

export async function fetchEnrollmentPaymentProofBlob(publicId) {
  const response = await axios.get(
    `${apiRoot}/enrollments/${encodeURIComponent(publicId)}/payment-proof`,
    { responseType: 'blob' }
  );
  return response.data;
}

export async function fetchEnrollmentDocumentBlob(publicId, documentKey) {
  const response = await axios.get(
    `${apiRoot}/enrollments/${encodeURIComponent(publicId)}/documents/${encodeURIComponent(documentKey)}`,
    { responseType: 'blob' }
  );
  return response.data;
}

export async function verifyEnrollmentPayment({ enrollmentId, paymentId, status }) {
  const { data } = await axios.patch(
    `${apiRoot}/enrollments/${encodeURIComponent(enrollmentId)}/payments/${encodeURIComponent(paymentId)}/verification`,
    { status }
  );
  return data;
}

export async function fetchEnrollmentApplication(publicId) {
  if (isLmsLiveApi()) {
    return getJson(`${apiRoot}/enrollments/${encodeURIComponent(publicId)}`);
  }
  const { mockResponseForKey } = await import('src/services/lms.service');
  const payload = await mockResponseForKey(`/api/enrollments/${encodeURIComponent(publicId)}`);
  if (!payload) {
    throw new Error('Enrollment application not found.');
  }
  return payload;
}

export async function fetchEnrollmentExcelExport({ search = '', rows = [] } = {}) {
  if (isLmsLiveApi()) {
    const query = typeof search === 'string' && search.trim()
      ? `?search=${encodeURIComponent(search.trim())}`
      : '';
    try {
      const response = await axios.get(`${apiRoot}/enrollments/export${query}`, {
        responseType: 'blob',
      });
      const blob = response.data;
      if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
        const text = await blob.text();
        let message = 'Could not export enrollments.';
        try {
          const parsed = JSON.parse(text);
          if (typeof parsed?.message === 'string' && parsed.message.trim()) {
            message = parsed.message.trim();
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const { parseContentDispositionFileName } = await import(
        'src/features/enrollment/utils/enrollment-excel'
      );
      const fileName =
        parseContentDispositionFileName(response.headers?.['content-disposition']) ||
        `enrollments-${new Date().toISOString().slice(0, 10)}.xlsx`;

      return { blob, fileName };
    } catch (error) {
      const data = error?.response?.data;
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const parsed = JSON.parse(text);
          if (typeof parsed?.message === 'string' && parsed.message.trim()) {
            throw new Error(parsed.message.trim());
          }
        } catch (inner) {
          if (inner instanceof Error && inner.name !== 'SyntaxError') {
            throw inner;
          }
        }
      }
      throw error instanceof Error ? error : new Error('Could not export enrollments.');
    }
  }

  const {
    ENROLLMENT_EXCEL_HEADERS,
    buildSpreadsheetMlBlob,
    enrollmentRowToExcelCells,
  } = await import('src/features/enrollment/utils/enrollment-excel');
  const { flattenEnrollmentRows } = await import('src/features/enrollment/utils/enrollment-rows');
  const flatRows = flattenEnrollmentRows(rows);
  const blob = buildSpreadsheetMlBlob(
    'Enrollments',
    ENROLLMENT_EXCEL_HEADERS,
    flatRows.map(enrollmentRowToExcelCells)
  );

  return {
    blob,
    fileName: `enrollments-${new Date().toISOString().slice(0, 10)}.xls`,
  };
}

export async function fetchBatchApplicantsExcelExport({
  batchId,
  search = '',
  status = '',
} = {}) {
  const id = encodeURIComponent(String(batchId ?? '').trim());
  const params = new URLSearchParams();
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }
  if (typeof status === 'string' && status.trim()) {
    params.set('status', status.trim());
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await axios.get(`${apiRoot}/batch-enrolls/${id}/applicants/export${query}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export batch applicants.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const { parseContentDispositionFileName } = await import(
      'src/features/enrollment/utils/enrollment-excel'
    );
    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) ||
      `batch-applicants-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error ? error : new Error('Could not export batch applicants.');
  }
}

export async function fetchLearningModeApplicantsExcelExport({
  modeId,
  search = '',
  status = '',
  program = '',
  batch = '',
} = {}) {
  const id = encodeURIComponent(String(modeId ?? '').trim());
  const params = new URLSearchParams();
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }
  if (typeof status === 'string' && status.trim()) {
    params.set('status', status.trim());
  }
  if (typeof program === 'string' && program.trim()) {
    params.set('program', program.trim());
  }
  if (typeof batch === 'string' && batch.trim()) {
    params.set('batch', batch.trim());
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await axios.get(`${apiRoot}/learning-modes/${id}/applicants/export${query}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export learning mode applicants.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const { parseContentDispositionFileName } = await import(
      'src/features/enrollment/utils/enrollment-excel'
    );
    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) ||
      `learning-mode-applicants-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error ? error : new Error('Could not export learning mode applicants.');
  }
}

export async function fetchBranchApplicantsExcelExport({
  branchId,
  search = '',
  status = '',
  program = '',
  batch = '',
  learningMode = '',
} = {}) {
  const id = encodeURIComponent(String(branchId ?? '').trim());
  const params = new URLSearchParams();
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }
  if (typeof status === 'string' && status.trim()) {
    params.set('status', status.trim());
  }
  if (typeof program === 'string' && program.trim()) {
    params.set('program', program.trim());
  }
  if (typeof batch === 'string' && batch.trim()) {
    params.set('batch', batch.trim());
  }
  if (typeof learningMode === 'string' && learningMode.trim()) {
    params.set('learningMode', learningMode.trim());
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await axios.get(`${apiRoot}/branch-enrolls/${id}/applicants/export${query}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export branch applicants.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const { parseContentDispositionFileName } = await import(
      'src/features/enrollment/utils/enrollment-excel'
    );
    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) ||
      `branch-applicants-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error ? error : new Error('Could not export branch applicants.');
  }
}

export async function fetchReviewScheduleApplicantsExcelExport({
  scheduleId,
  search = '',
  status = '',
  program = '',
  batch = '',
  learningMode = '',
} = {}) {
  const id = encodeURIComponent(String(scheduleId ?? '').trim());
  const params = new URLSearchParams();
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }
  if (typeof status === 'string' && status.trim()) {
    params.set('status', status.trim());
  }
  if (typeof program === 'string' && program.trim()) {
    params.set('program', program.trim());
  }
  if (typeof batch === 'string' && batch.trim()) {
    params.set('batch', batch.trim());
  }
  if (typeof learningMode === 'string' && learningMode.trim()) {
    params.set('learningMode', learningMode.trim());
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await axios.get(`${apiRoot}/review-schedules/${id}/applicants/export${query}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export review schedule applicants.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const { parseContentDispositionFileName } = await import(
      'src/features/enrollment/utils/enrollment-excel'
    );
    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) ||
      `review-schedule-applicants-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error ? error : new Error('Could not export review schedule applicants.');
  }
}

export async function fetchHonorAwardDiscountApplicantsExcelExport({
  optionId,
  search = '',
  status = '',
  program = '',
  batch = '',
  branch = '',
} = {}) {
  const id = encodeURIComponent(String(optionId ?? '').trim());
  const params = new URLSearchParams();
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }
  if (typeof status === 'string' && status.trim()) {
    params.set('status', status.trim());
  }
  if (typeof program === 'string' && program.trim()) {
    params.set('program', program.trim());
  }
  if (typeof batch === 'string' && batch.trim()) {
    params.set('batch', batch.trim());
  }
  if (typeof branch === 'string' && branch.trim()) {
    params.set('branch', branch.trim());
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await axios.get(`${apiRoot}/honor-award-discounts/${id}/applicants/export${query}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export honors / awards / discount applicants.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const { parseContentDispositionFileName } = await import(
      'src/features/enrollment/utils/enrollment-excel'
    );
    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) ||
      `honor-award-discount-applicants-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error
      ? error
      : new Error('Could not export honors / awards / discount applicants.');
  }
}

export async function fetchPackageEnrollApplicantsExcelExport({
  packageId,
  search = '',
  status = '',
  program = '',
  batch = '',
  branch = '',
} = {}) {
  const id = encodeURIComponent(String(packageId ?? '').trim());
  const params = new URLSearchParams();
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }
  if (typeof status === 'string' && status.trim()) {
    params.set('status', status.trim());
  }
  if (typeof program === 'string' && program.trim()) {
    params.set('program', program.trim());
  }
  if (typeof batch === 'string' && batch.trim()) {
    params.set('batch', batch.trim());
  }
  if (typeof branch === 'string' && branch.trim()) {
    params.set('branch', branch.trim());
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await axios.get(`${apiRoot}/package-enrolls/${id}/applicants/export${query}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export package enroll applicants.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const { parseContentDispositionFileName } = await import(
      'src/features/enrollment/utils/enrollment-excel'
    );
    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) ||
      `package-enroll-applicants-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error
      ? error
      : new Error('Could not export package enroll applicants.');
  }
}

export const lmsApi = {
  submitEnrollmentRequest: (payload) =>
    isLmsLiveApi()
      ? payload.formData
        ? submitEnrollmentApplicationForm(payload.formData)
        : submitEnrollmentWithPaymentProof(payload)
      : mockSubmitEnrollment(payload),

  simulateQuizAttempt: (quizId) =>
    isLmsLiveApi()
      ? postJson(`${apiRoot}/quizzes/${encodeURIComponent(quizId)}/attempts`, {})
      : mockSimulateQuizAttempt(quizId),

  fetchQuizQuestionSet: (quizId) =>
    isLmsLiveApi()
      ? getJson(`${apiRoot}/quizzes/${encodeURIComponent(quizId)}/questions`)
      : mockFetchQuizQuestionSet(quizId),

  toggleModuleVisibility: (moduleId) =>
    isLmsLiveApi()
      ? patchJson(`${apiRoot}/modules/${encodeURIComponent(moduleId)}/visibility`, {})
      : mockToggleModuleVisibility(moduleId),

  uploadAdminModule: (payload) =>
    isLmsLiveApi()
      ? postJson(`${apiRoot}/admin/uploads`, {
          title: payload.title,
          assetType: payload.assetType,
        })
      : mockUploadAdminModule(payload),

  updateEnrollmentStatus: (payload) =>
    isLmsLiveApi()
      ? patchJson(`${apiRoot}/enrollments/${encodeURIComponent(payload.enrollmentId)}`, {
          status: payload.status,
          ...(payload.rejectionReason
            ? { rejection_reason: payload.rejectionReason }
            : {}),
        })
      : mockUpdateEnrollmentStatus(payload),

  fetchResource: ({ endpoint, params = null }) => {
    if (!endpoint) return Promise.resolve(null);
    const query =
      params && typeof params === 'object'
        ? Object.entries(params)
            .filter(([, value]) => value != null && String(value).trim() !== '')
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&')
        : '';
    const url = query ? `${endpoint}${endpoint.includes('?') ? '&' : '?'}${query}` : endpoint;
    return getJson(url);
  },

  runCommand: async (command, payload = {}) => {
    switch (command) {
      case 'program.create':
        return postLmsProgram(payload);
      case 'program.update':
        return patchLmsProgram(payload.publicId, payload.body ?? {});
      case 'program.delete':
        return deleteLmsProgram(payload.publicId);
      case 'batchEnroll.create':
        return postLmsBatchEnroll(payload);
      case 'batchEnroll.update':
        return patchLmsBatchEnroll(payload.publicId, payload.body ?? {});
      case 'batchEnroll.delete':
        return deleteLmsBatchEnroll(payload.publicId);
      case 'learningMode.create':
        return postLmsLearningMode(payload);
      case 'learningMode.update':
        return patchLmsLearningMode(payload.publicId, payload.body ?? {});
      case 'learningMode.delete':
        return deleteLmsLearningMode(payload.publicId);
      case 'branchEnroll.create':
        return postLmsBranchEnroll(payload);
      case 'branchEnroll.update':
        return patchLmsBranchEnroll(payload.publicId, payload.body ?? {});
      case 'branchEnroll.delete':
        return deleteLmsBranchEnroll(payload.publicId);
      case 'reviewSchedule.create':
        return postLmsReviewSchedule(payload);
      case 'reviewSchedule.update':
        return patchLmsReviewSchedule(payload.publicId, payload.body ?? {});
      case 'reviewSchedule.delete':
        return deleteLmsReviewSchedule(payload.publicId);
      case 'honorAwardDiscount.create':
        return postLmsHonorAwardDiscount(payload);
      case 'honorAwardDiscount.update':
        return patchLmsHonorAwardDiscount(payload.publicId, payload.body ?? {});
      case 'honorAwardDiscount.delete':
        return deleteLmsHonorAwardDiscount(payload.publicId);
      case 'packageEnroll.create':
        return postLmsPackageEnroll(payload);
      case 'packageEnroll.update':
        return patchLmsPackageEnroll(payload.publicId, payload.body ?? {});
      case 'packageEnroll.delete':
        return deleteLmsPackageEnroll(payload.publicId);
      case 'instructor.create':
        return postLmsInstructor(payload);
      case 'instructor.update':
        return patchLmsInstructor(payload.publicId, payload.body ?? {});
      case 'instructor.delete':
        return deleteLmsInstructor(payload.publicId);
      case 'student.create':
        return postLmsStudent(payload);
      case 'student.update':
        return patchLmsStudent(payload.publicId, payload.body ?? {});
      case 'student.delete':
        return deleteLmsStudent(payload.publicId);
      case 'course.create':
        return postLmsCourse(payload.body ?? {});
      case 'course.update':
        return patchLmsCourse(payload.publicId, payload.body ?? {});
      case 'module.create':
        return postLmsModuleForCourse(payload.coursePublicId, payload.body ?? {});
      case 'module.update':
        return patchLmsModule(payload.publicId, payload.body ?? {});
      case 'module.delete':
        return deleteLmsModule(payload.publicId);
      case 'module.reorder':
        return reorderLmsModulesForCourse(payload.coursePublicId, payload.body?.moduleIds ?? []);
      case 'module.lessons.reorder':
        return reorderLmsModuleLessons(payload.modulePublicId, payload.body?.lessonIds ?? []);
      case 'standaloneLesson.create':
        return postLmsStandaloneLesson(payload.modulePublicId, payload.body ?? {});
      case 'standaloneLesson.update':
        return patchLmsStandaloneLesson(payload.publicId, payload.body ?? {});
      case 'standaloneLesson.delete':
        return deleteLmsStandaloneLesson(payload.publicId);
      case 'quiz.create':
        return postLmsQuizForModule(payload.modulePublicId, payload.body ?? {});
      case 'quiz.update':
        return patchLmsQuiz(payload.publicId, payload.body ?? {});
      case 'quiz.questions':
        return getLmsQuizQuestions(payload.publicId);
      case 'assignment.create':
        return postLmsAssignmentForModule(payload.modulePublicId, payload.body ?? {});
      case 'assignment.update':
        return patchLmsAssignment(payload.publicId, payload.body ?? {});
      case 'assignment.questions':
        return getLmsAssignmentQuestions(payload.publicId);
      case 'assignment.delete':
        return deleteLmsAssignment(payload.publicId);
      case 'lessonMaterial.assignment.upload':
        return postLessonMaterialForAssignment(payload.assignmentPublicId, payload.file);
      case 'quiz.attempt':
        return postLmsQuizAttempt(payload.publicId, payload.body ?? {});
      case 'assignment.attempt':
        return postLmsAssignmentAttempt(payload.publicId, payload.body ?? {});
      case 'lessonProgress.complete':
        return postLmsLessonProgress(payload.coursePublicId, payload.lessonKey);
      case 'lessonProgress.heartbeat':
        return patchLmsLessonProgress(payload.coursePublicId, payload.body ?? {});
      case 'lessonMaterial.module.upload':
        return postLessonMaterialForModule(
          payload.modulePublicId,
          payload.file,
          payload.options ?? {}
        );
      case 'lessonMaterial.standalone.upload':
        return postLessonMaterialForStandaloneLesson(payload.standalonePublicId, payload.file);
      case 'lessonMaterial.delete':
        return deleteLessonMaterial(payload.publicId);
      default:
        throw new Error(`Unsupported LMS command: ${command}`);
    }
  },
};
