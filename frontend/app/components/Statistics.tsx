// frontend/app/components/Statistics.tsx - исправленная версия

'use client';

import { UserProgress } from '../types';

interface StatisticsProps {
  progress: UserProgress;
  onClose: () => void;
}

export default function Statistics({ progress, onClose }: StatisticsProps) {
  // Безопасное получение данных
  const stats = progress?.progress || {
    total_correct: 0,
    total_wrong: 0,
    accuracy: 0,
    today_correct: 0,
    today_wrong: 0,
    mastered_words: 0
  };
  
  const rule_stats = progress?.rule_stats || [];
  const recent_history = progress?.recent_history || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '56rem' }}>
        <div className="modal-header">
          <h2 className="modal-title">Моя статистика</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          {/* Общая статистика */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-value stat-value-success">{stats.total_correct}</div>
              <div className="stat-label">Правильных ответов</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-value-error">{stats.total_wrong}</div>
              <div className="stat-label">Неправильных</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-value-primary">{stats.accuracy}%</div>
              <div className="stat-label">Точность</div>
            </div>
          </div>

          {/* Сегодняшняя статистика */}
          <div style={{ background: 'var(--gray-50)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Сегодня</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--success-500)' }}>✓ {stats.today_correct}</span>
              <span style={{ color: 'var(--error-500)' }}>✗ {stats.today_wrong}</span>
            </div>
          </div>

          {/* Статистика по правилам */}
          {rule_stats.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Прогресс по правилам</h3>
              <div style={{ maxHeight: '15rem', overflowY: 'auto' }}>
                {rule_stats.map((rule) => {
                  const total = (rule.correct_count || 0) + (rule.wrong_count || 0);
                  const percent = total > 0 ? ((rule.correct_count || 0) / total) * 100 : 0;
                  
                  return (
                    <div key={rule.rule_name} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '500' }}>{rule.rule_name}</span>
                        <span>✓ {rule.correct_count || 0} / ✗ {rule.wrong_count || 0}</span>
                      </div>
                      <div style={{ background: 'var(--gray-200)', borderRadius: '9999px', height: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, background: 'var(--success-500)', height: '100%', transition: 'width 0.3s' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* История ответов */}
          {recent_history.length > 0 && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Последние ответы</h3>
              <div style={{ maxHeight: '15rem', overflowY: 'auto' }}>
                {recent_history.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      borderRadius: '0.5rem',
                      background: item.is_correct ? 'var(--success-50)' : 'var(--error-50)',
                      borderLeft: `4px solid ${item.is_correct ? 'var(--success-500)' : 'var(--error-500)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span>Слово #{item.word_id}</span>
                      <span>{item.is_correct ? '✓ Правильно' : '✗ Неправильно'}</span>
                    </div>
                    {!item.is_correct && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                        Ответ:
{item.user_answer}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}