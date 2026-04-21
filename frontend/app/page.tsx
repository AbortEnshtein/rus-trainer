// frontend/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import { getTasks } from './utils/api';

export default function Home() {
  const { session, loading: authLoading, login, logout, progress, taskProgress } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRankTooltip, setShowRankTooltip] = useState(false);

  useEffect(() => {
    if (session) {
      loadTasks();
    }
  }, [session]);

  const loadTasks = async () => {
    try {
      const data = await getTasks(session!.session_id);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <LoginForm onLogin={login} loading={authLoading} />;
  }

  const part1Tasks = tasks.filter((t: any) => t.task_number >= 1 && t.task_number <= 26);
  const part2Tasks = tasks.filter((t: any) => t.task_number === 27);

  const getTaskColorClass = (num: number) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo', 'red', 'teal'];
    return `task-card-${colors[(num - 1) % colors.length]}`;
  };

  // Цвет прогресс-бара в зависимости от процента
  const getProgressColor = (percent: number) => {
    if (percent < 30) return '#dc2626';
    if (percent < 60) return '#f59e0b';
    if (percent < 85) return '#3b82f6';
    return '#22c55e';
  };

  // Безопасное получение данных
  const totalCorrect = progress?.total_correct ?? 0;
  const totalWrong = progress?.total_wrong ?? 0;
  const accuracy = progress?.accuracy ?? 0;
  const totalXp = progress?.total_xp ?? 0;
  const rank = progress?.rank || { 
    name: "Новичок", 
    icon: "🌱", 
    color: "#9ca3af", 
    current_xp: 0, 
    next_rank_name: "Ученик",
    xp_to_next: 100 
  };

  // Таблица рангов для тултипа
  const ranksTable = [
    { icon: "🌱", name: "Новичок", xp: "0–10к", color: "#9ca3af" },
    { icon: "📚", name: "Ученик", xp: "10к–30к", color: "#6b7280" },
    { icon: "🎓", name: "Продолжающий", xp: "30к–60к", color: "#3b82f6" },
    { icon: "⭐", name: "Знаток", xp: "60к–100к", color: "#8b5cf6" },
    { icon: "🏆", name: "Мастер", xp: "100к+", color: "#f59e0b" }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #dbeafe 100%)' }}>
      {/* Декоративные круги */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10rem', right: '-10rem', width: '20rem', height: '20rem', background: '#bfdbfe', borderRadius: '50%', filter: 'blur(3rem)', opacity: 0.3, animation: 'pulse 3s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', bottom: '-10rem', left: '-10rem', width: '20rem', height: '20rem', background: '#c7d2fe', borderRadius: '50%', filter: 'blur(3rem)', opacity: 0.3, animation: 'pulse 3s ease-in-out infinite 1s' }}></div>
      </div>

      {/* Шапка */}
      <div className="header">
        <div className="header-content">
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              📝 ЕГЭ Русский язык
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.125rem' }}>Тренажёр для подготовки к экзамену</p>
          </div>
          
          {session && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Прогресс: <span style={{ color: '#16a34a', fontWeight: '600' }}>{totalCorrect}</span>
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>/{totalWrong}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>точность {accuracy}%</div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '2rem',
                    background: `${rank.color}15`,
                    border: `1px solid ${rank.color}30`
                  }}
                  onMouseEnter={() => setShowRankTooltip(true)}
                  onMouseLeave={() => setShowRankTooltip(false)}
                >
                  <span style={{ fontSize: '1.25rem' }}>{rank.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: rank.color }}>{rank.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>▼</span>
                </div>
                
                {showRankTooltip && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '0.75rem',
                    minWidth: '220px',
                    zIndex: 50,
                    border: '1px solid #e5e7eb',
                    animation: 'tooltipFadeIn 0.2s ease-out'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                      📊 Система рангов
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {ranksTable.map((r, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: idx < ranksTable.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>{r.icon}</span>
                            <span style={{ fontWeight: '500', color: r.color }}>{r.name}</span>
                          </div>
                          <span style={{ color: '#6b7280' }}>{r.xp} XP</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center' }}>
                      ⭐ +10 XP за правильный ответ
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: rank.color, textAlign: 'center', background: `${rank.color}10`, padding: '0.25rem', borderRadius: '0.5rem' }}>
                      Ваш прогресс: <strong>{totalXp}</strong> XP
                    </div>
                  </div>
                )}
              </div>
              
              <button onClick={logout} className="btn-danger" style={{ padding: '0.5rem 1rem' }}>Выйти</button>
            </div>
          )}
        </div>
      </div>

      {/* Основной контент */}
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Приветственная карточка */}
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #3b82f6, #4f46e5)', borderRadius: '1rem', marginBottom: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Добро пожаловать, <span className="title-gradient">{session.username}</span>!
          </h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Если что-то не пашет пишите мне в <a href='https://t.me/Zeby4rek'>тг</a></p>
          
          <div className="stats-grid" style={{ marginTop: '1rem', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="stat-card">
              <div className="stat-value stat-value-success">{totalCorrect}</div>
              <div className="stat-label">всего ✓</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-value-error">{totalWrong}</div>
              <div className="stat-label">всего ✗</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-value-primary">{accuracy}%</div>
              <div className="stat-label">точность</div>
            </div>
          </div>
        </div>

        {/* Часть 1 - задания 1-26 */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="flex" style={{ alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '0.25rem', height: '1.75rem', background: 'linear-gradient(to bottom, #3b82f6, #2563eb)', borderRadius: '9999px' }}></div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Часть 1</h3>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>задания 1–26</span>
          </div>
          
          {loading ? (
            <div className="tasks-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{ background: '#e5e7eb', borderRadius: '0.75rem', height: '7rem', opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
              ))}
            </div>
          ) : (
            <div className="tasks-grid">
              {part1Tasks.map((task: any) => {
                // ✅ ВОТ ЗДЕСЬ используем taskProgress для каждого задания
                const taskProg = (taskProgress as any)[task.task_number];
                const total = taskProg?.total_questions || 0;
                const mastered = taskProg?.mastered_questions || 0;
                const progressPercent = taskProg?.progress_percent || 0;
                
                return (
                  <Link
                    key={task.task_number}
                    href={`/task/${task.task_number}`}
                    className={`task-card ${getTaskColorClass(task.task_number)} animate-fade-in`}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    {/* Прогресс-бар снизу */}
                    {total > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '4px',
                        width: `${progressPercent}%`,
                        background: `linear-gradient(90deg, ${getProgressColor(progressPercent)}, ${getProgressColor(progressPercent)}dd)`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    )}
                    
                    <div className="task-number">{task.task_number}</div>
                    <div className="task-title">{task.title}</div>
                    
                    {/* Показываем прогресс текстом */}
                    {total > 0 && (
                      <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '0.5rem', fontWeight: '500' }}>
                        {mastered} / {total} слов
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Часть 2 - задание 27 */}
        {part2Tasks.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="flex" style={{ alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '0.25rem', height: '1.75rem', background: 'linear-gradient(to bottom, #9333ea, #7e22ce)', borderRadius: '9999px' }}></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Часть 2</h3>
              <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>задание 27</span>
            </div>
            <div className="tasks-grid">
              {part2Tasks.map((task: any) => {
                const taskProg = (taskProgress as any)[task.task_number];
                const total = taskProg?.total_questions || 0;
                const mastered = taskProg?.mastered_questions || 0;
                const progressPercent = taskProg?.progress_percent || 0;
                
                return (
                  <Link
                    key={task.task_number}
                    href={`/task/${task.task_number}`}
                    className="task-card task-card-purple"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    {total > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '4px',
                        width: `${progressPercent}%`,
                        background: `linear-gradient(90deg, ${getProgressColor(progressPercent)}, ${getProgressColor(progressPercent)}dd)`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    )}
                    <div className="task-number">{task.task_number}</div>
                    <div className="task-title">{task.title}</div>
                    {total > 0 && (
                      <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '0.5rem', fontWeight: '500' }}>
                        {mastered} / {total} слов
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Прогресс до следующего ранга */}
        {rank.next_rank_name && (
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>До звания {rank.next_rank_name}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: rank.color }}>{rank.current_xp} / {rank.current_xp + rank.xp_to_next} XP</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(rank.current_xp / (rank.current_xp + rank.xp_to_next)) * 100}%`, background: `linear-gradient(135deg, ${rank.color}, ${rank.color}dd)` }}></div>
            </div>
          </div>
        )}

        {/* Общий прогресс */}
        <div className="card" style={{ padding: '1rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Общий прогресс</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb' }}>{totalCorrect} / {totalCorrect + totalWrong}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${accuracy}%` }}></div>
          </div>
          <div className="flex-between" style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#9ca3af' }}>
            <span>🌱 Новичок</span><span>📚 Ученик</span><span>🎓 Продолжающий</span><span>⭐ Знаток</span><span>🏆 Мастер</span>
          </div>
        </div>

        {/* Совет дня */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>💡 Совет: регулярно тренируйтесь, чтобы улучшить свои результаты</p>
        </div>
      </div>

      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}