// frontend/app/utils/api.ts - исправленная версия

import axios from 'axios';

const API_BASE_URL = 'http://5.188.24.149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд таймаут
});

// Перехватчик ошибок для логирования
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const login = async (username: string) => {
  const response = await api.post('/login', { username });
  return response.data;
};

export const getTasks = async (sessionId: string) => {
  try {
    const response = await api.get('/tasks', { params: { session_id: sessionId } });
    return response.data;
  } catch (error) {
    console.error('getTasks failed:', error);
    return []; // Возвращаем пустой массив вместо ошибки
  }
};

export const getTaskInfo = async (taskNumber: number, sessionId: string) => {
  const tasks = await getTasks(sessionId);
  return tasks.find((t: any) => t.task_number === taskNumber);
};

export const getRandomQuestion = async (taskNumber: number, sessionId: string, mode: string = 'random') => {
  const response = await api.get('/question/random', {
    params: { task_number: taskNumber, session_id: sessionId, mode }
  });
  return response.data;
};

export const submitAnswer = async (sessionId: string, taskNumber: number, questionId: number, userAnswer: string) => {
  const response = await api.post('/answer', {
    session_id: sessionId,
    task_number: taskNumber,
    question_id: questionId,
    user_answer: userAnswer,
  });
  return response.data;
};

export const getProgress = async (sessionId: string) => {
  try {
    const response = await api.get(`/progress/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('getProgress failed:', error);
    return { total_correct: 0, total_wrong: 0, accuracy: 0 }; // Возвращаем пустую статистику
  }
};
// frontend/app/utils/api.ts - добавить функцию
// frontend/app/utils/api.ts - добавить функцию

export const getTaskProgress = async (sessionId: string, taskNumber: number) => {
  try {
    const response = await api.get(`/task_progress/${sessionId}/${taskNumber}`);
    return response.data;
  } catch (error) {
    console.error('getTaskProgress failed:', error);
    return { 
      task_number: taskNumber,
      total_questions: 0,
      mastered_questions: 0,
      remaining_questions: 0,
      progress_percent: 0
    };
  }
};
// frontend/app/utils/api.ts - добавить функцию

export const getTaskHistory = async (sessionId: string, taskNumber: number, limit: number = 20) => {
  try {
    const response = await api.get(`/task_history/${sessionId}/${taskNumber}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('getTaskHistory failed:', error);
    return [];
  }
};
export const getUserStats = async (sessionId: string) => {
  try {
    const response = await api.get(`/stats/${sessionId}`)
    console.log(JSON.stringify(response.data))
    return response.data;
  } catch (error) {
    console.error('getUserStats failed:', error);
    return { total_correct: 0, total_wrong: 0, accuracy: 0, task_stats: [], recent_history: [] };
  }
};
export default api;