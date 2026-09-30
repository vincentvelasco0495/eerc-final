import axios from 'src/lib/axios';
import { CONFIG } from 'src/global-config';

import { mockResponseForKey } from './lms.service';

/**
 * Modular LMS read API. Keys must match SWR cache (full path + querystring).
 */
export async function lmsGet(path) {
  if (path == null) {
    return null;
  }
  if (!CONFIG.serverUrl?.trim()) {
    return mockResponseForKey(path);
  }

  try {
    const { data } = await axios.get(path);
    return data;
  } catch (error) {
    const status = error?.response?.status ?? error?.status;
    if (status === 401 || status === 403) {
      // Public read fallback: when not logged in, keep LMS pages usable via local mock data.
      return mockResponseForKey(path);
    }
    throw error;
  }
}

export const getUser = () => lmsGet('/api/user');
export const getMeta = () => lmsGet('/api/meta');
export const getPrograms = () => lmsGet('/api/programs');
export const getCourses = (page = 1, limit = 20) =>
  lmsGet(`/api/courses?page=${page}&limit=${limit}`);
export const getEnrollments = () => lmsGet('/api/enrollments');
export const getModulesForCourse = (courseId) =>
  lmsGet(`/api/modules?courseId=${encodeURIComponent(courseId)}`);
export const getModulesByIds = (ids) =>
  lmsGet(`/api/modules?ids=${encodeURIComponent(ids.join(','))}`);
export const getQuizzes = (moduleId) =>
  moduleId
    ? lmsGet(`/api/quizzes?moduleId=${encodeURIComponent(moduleId)}`)
    : lmsGet('/api/quizzes');
export const getQuizResults = (userId) =>
  userId
    ? lmsGet(`/api/quiz-results?userId=${encodeURIComponent(userId)}`)
    : lmsGet('/api/quiz-results');
export const getLeaderboard = (type = 'daily') =>
  lmsGet(`/api/leaderboard?type=${encodeURIComponent(type)}`);
export const getAnalytics = () => lmsGet('/api/analytics');
export const getAdmin = () => lmsGet('/api/admin');
