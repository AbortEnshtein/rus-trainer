// frontend/app/task/[taskId]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import TaskRenderer from '@/app/components/TaskRenderer';
import { getRandomQuestion, submitAnswer, getTaskInfo, getTaskHistory } from '@/app/utils/api';

export default function TaskPage() {
  const { taskId } = useParams();
  const router = useRouter();
  const { session, refreshProgress, progress, taskProgress } = useAuth();
  const [question, setQuestion] = useState(null);
  const [taskInfo, setTaskInfo] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [mode, setMode] = useState('random');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  const loadTaskInfo = async () => {
    try {
      const info = await getTaskInfo(parseInt(taskId as string), session!.session_id);
      setTaskInfo(info);
    } catch (error) {
      console.error('Failed to load task info:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await getTaskHistory(session!.session_id, parseInt(taskId as string));
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const loadQuestion = async () => {
    if (!session) return;
    setLoading(true);
    setFeedback(null);
    setSelectedAnswer(null);
    
    try {
      const data = await getRandomQuestion(parseInt(taskId as string), session.session_id, mode);
      setQuestion(data);
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadTaskInfo();
      loadHistory();
      loadQuestion();
    }
  }, [taskId, session, mode]);

  const handleAnswer = async (answer: string) => {
    if (!session || !question || selectedAnswer) return;
    
    setSelectedAnswer(answer);
    setLoading(true);
    
    try {
      const result = await submitAnswer(
        session.session_id,
        parseInt(taskId as string),
        question.id,
        answer
      );
      setFeedback(result);
      await refreshProgress();
      await loadHistory();
      
      setTimeout(() => {
        loadQuestion();
      }, 1500);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTaskStats = () => {
    if (!progress?.task_stats) return null;
    return progress.task_stats.find((s: any) => s.task_number === parseInt(taskId as string));
  };

  const getCurrentTaskProgress = () => {
    if (!taskProgress) return null;
    return taskProgress[parseInt(taskId as string)];
  };

  const taskStats = getCurrentTaskStats();
  const taskProg = getCurrentTaskProgress();

  const getProgressColor = (percent: number) => {
    if (percent < 30) return '#dc2626';
    if (percent < 60) return '#f59e0b';
    if (percent < 85) return '#3b82f6';
    return '#22c55e';
  };

  if (loading && !question) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="animate-spin" style={{ width: '3rem', height: '3rem', border: '3px solid #bfdbfe', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#6b7280' }}>Загрузка вопроса...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #dbeafe 100%)' }}>
      {/* Шапка */}
      <div className="header">
        <div className="header-content">
          <button onClick={() => router.push('/')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ← На главную
          </button>
          
          <div className="text-center">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              ЕГЭ Русский язык
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Задание №{taskId} • {taskInfo?.title || 'Тренажёр'}</p>
          </div>
          
          <div style={{ width: '4rem' }}></div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container-custom" style={{ padding: '2rem 1rem' }}>
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Левая колонка - вопрос и статистика */}
          <div style={{ flex: showHistory ? 2 : 1, minWidth: '380px' }}>
            {/* Информация о задании */}
            {taskInfo && (
              <div className="card" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>{taskInfo.title}</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{taskInfo.description}</p>
              </div>
            )}

            {/* Режимы тренировки */}
            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setMode('random')}
                  className={mode === 'random' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  🎲 Случайные вопросы
                </button>
                <button
                  onClick={() => setMode('weak')}
                  className={mode === 'weak' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  💪 Слабые вопросы
                </button>
              </div>
            </div>

            {/* Карточка с вопросом */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              {question && (
                <TaskRenderer
                  taskNumber={parseInt(taskId as string)}
                  questionData={question.question_data}
                  onAnswer={handleAnswer}
                  disabled={!!selectedAnswer}
                  selectedAnswer={selectedAnswer}
                  isCorrect={feedback?.is_correct}
                />
              )}

              {/* Результат ответа */}
              {feedback && (
                <div className={`task11-result ${feedback.is_correct ? 'task11-result-correct' : 'task11-result-wrong'}`} style={{ marginTop: '1.5rem' }}>
                  <div className="task11-result-title">
                    {feedback.is_correct ? '✅ Правильно!' : '❌ Неправильно!'}
                  </div>
                  {!feedback.is_correct && (
                    <div className="task11-result-answer">
                      Правильно: <strong>{feedback.correct_answer}</strong>
                    </div>
                  )}
                  <div className="task11-result-next">
                    Следующий вопрос через секунду...
                  </div>
                </div>
              )}
            </div>

            {/* Прогресс по заданию */}
            {taskProg && taskProg.total_questions > 0 && (
              <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  📊 Прогресс по заданию
                </h3>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Освоено слов</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb' }}>
                    {taskProg.mastered_questions} / {taskProg.total_questions}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${taskProg.progress_percent}%`,
                      background: `linear-gradient(90deg, ${getProgressColor(taskProg.progress_percent)}, ${getProgressColor(taskProg.progress_percent)}dd)`
                    }}
                  ></div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: '#9ca3af' }}>
                  {taskProg.progress_percent}% завершено
                </div>
              </div>
            )}

            {/* Статистика правильных/неправильных ответов */}
            {taskStats && (
              <div className="task-stats">
                <div className="task-stat-card">
                  <div className="task-stat-value task-stat-value-success">{taskStats.correct || 0}</div>
                  <div className="task-stat-label">правильных ответов</div>
                </div>
                <div className="task-stat-card">
                  <div className="task-stat-value task-stat-value-error">{taskStats.wrong || 0}</div>
                  <div className="task-stat-label">неправильных ответов</div>
                </div>
                <div className="task-stat-card">
                  <div className="task-stat-value task-stat-value-primary">{taskStats.accuracy || 0}%</div>
                  <div className="task-stat-label">точность</div>
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - история ответов */}
          {showHistory && (
            <div style={{ flex: 1, minWidth: '260px', maxWidth: '360px' }}>
              <div className="card" style={{ padding: '1rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>📜 История ответов</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.25rem' }}
                    title="Скрыть историю"
                  >
                    ×
                  </button>
                </div>
                
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    <p>Пока нет ответов</p>
                    <p style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>Начните тренировку, чтобы видеть историю</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {history.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          background: item.is_correct ? '#f0fdf4' : '#fef2f2',
                          borderLeft: `4px solid ${item.is_correct ? '#22c55e' : '#ef4444'}`
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                          {item.question_text}
                        </div>
                        <div style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: item.is_correct ? '#16a34a' : '#dc2626' }}>
                            {item.is_correct ? '✓ Правильно' : '✗ Неправильно'}
                          </span>
                          <span style={{ color: '#9ca3af' }}>
                            Ответ: <strong>{item.user_answer || 'нет ответа'}</strong>
                          </span>
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Кнопка показа истории, если она скрыта */}
          {!showHistory && (
            <button
              onClick={() => setShowHistory(true)}
              style={{
                position: 'fixed',
                right: '1rem',
                bottom: '1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                zIndex: 50
              }}
            >
              📜 История
            </button>
          )}
        </div>
        
        {/* Пояснение */}
        <div style={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center', marginTop: '1.5rem' }}>
          💡 «Освоено слов» — слова, на которые вы ответили правильно хотя бы один раз
        </div>
      </div>
    </div>
  );
}