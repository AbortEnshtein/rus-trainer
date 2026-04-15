'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string) => Promise<boolean>;
  loading: boolean;
}

export default function LoginForm({ onLogin, loading }: LoginFormProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const success = await onLogin(username.trim());
      if (success) {
        setUsername('');
      }
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '28rem', width: '100%', padding: '2rem' }}>
        <div className="text-center mb-8">
          <div className="flex-center" style={{ marginBottom: '1rem' }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              📝
            </div>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            ЕГЭ Русский язык
          </h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>ЕГЕ Русский Язык</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Тренажёр заданий</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="username" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              Ваше имя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-500)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--gray-200)'}
              placeholder="Например: Анна"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Вход...' : 'Начать тренировку →'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          <p>✨ Прогресс сохранится за вашим именем</p>
          <p style={{ marginTop: '0.25rem' }}>🔄 Можно использовать на разных устройствах</p>
        </div>
      </div>
    </div>
  );
}