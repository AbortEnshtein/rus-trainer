// frontend/app/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { login, getUserStats } from '../utils/api';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState(null);
  const [taskProgress, setTaskProgress] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem('ege_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setSession(parsed);
      loadStats(parsed.session_id);
    }
  }, []);

  const loadStats = async (sessionId: string) => {
    try {
      const stats = await getUserStats(sessionId);
      setProgress(stats);
      if (stats.task_progress) {
        setTaskProgress(stats.task_progress);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleLogin = async (username: string) => {
    setLoading(true);
    try {
      const data = await login(username);
      setSession(data);
      localStorage.setItem('ege_session', JSON.stringify(data));
      await loadStats(data.session_id);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ege_session');
    setSession(null);
    setProgress(null);
    setTaskProgress({});
  };

  const refreshProgress = async () => {
    if (session) {
      await loadStats(session.session_id);
    }
  };

  return {
    session,
    progress,
    taskProgress,
    loading,
    login: handleLogin,
    logout,
    refreshProgress,
  };
};