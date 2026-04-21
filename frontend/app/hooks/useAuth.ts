// frontend/app/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { login, getUserStats } from '../utils/api';
interface SessionData {
  session_id: string;
  user_id: number;
  username: string;
}

interface UserProgress {
  total_correct: number;
  total_wrong: number;
  accuracy: number;
  today_correct: number;
  today_wrong: number;
  total_xp: number;
  rank: {
    name: string;
    icon: string;
    color: string;
    current_xp: number;
    next_rank_name: string | null;
    xp_to_next: number;
  };
  task_stats: Array<{
    task_number: number;
    correct: number;
    wrong: number;
    accuracy: number;
  }>;
  task_progress: {
    [key: number]: {
      total_questions: number;
      mastered_questions: number;
      remaining_questions: number;
      progress_percent: number;
    };
  };
  recent_history: Array<{
    question_id: number;
    question_text: string;
    user_answer: string;
    is_correct: boolean;
    timestamp: string;
  }>;
}

export const useAuth = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
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