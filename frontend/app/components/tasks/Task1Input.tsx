// frontend/app/components/tasks/Task1Input.tsx

'use client';

import { useState, useRef, useEffect } from 'react';

interface Task1InputProps {
  questionData: {
    term: string;
    sentence: string;
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function Task1Input({ questionData, onAnswer, disabled, selectedAnswer, isCorrect }: Task1InputProps) {
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Сброс состояния при новом вопросе
    setInputValue('');
    setSubmitted(false);
    
    // Фокус на поле ввода при загрузке
    if (!disabled && !submitted && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [questionData, disabled]);

  const handleSubmit = () => {
    if (disabled || submitted) return;
    if (!inputValue.trim()) return;
    
    setSubmitted(true);
    onAnswer(inputValue.trim().toLowerCase());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && !submitted && inputValue.trim()) {
      handleSubmit();
    }
  };

  // Отображаем предложение с полем ввода вместо пропуска
  const renderSentence = () => {
    // Проверяем наличие пропуска (символ …)
    if (!questionData.sentence.includes('…')) {
      return <div className="task1-sentence">{questionData.sentence}</div>;
    }
    
    const parts = questionData.sentence.split('…');
    
    return (
      <div className="task1-sentence">
        {parts.map((part, idx) => (
          <span key={idx} style={{ display: 'inline', whiteSpace: 'normal' }}>
            {part}
            {idx < parts.length - 1 && (
              <span className="task1-gap">
                {submitted ? (
                  <span className={`task1-filled ${selectedAnswer ? (isCorrect ? 'task1-correct' : 'task1-wrong') : ''}`}>
                    {selectedAnswer || inputValue || '______'}
                  </span>
                ) : (
                  <input
                    ref={idx === 0 ? inputRef : undefined}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={disabled || submitted}
                    className="task1-inline-input"
                    placeholder="_____"
                    style={{
                      width: `${Math.min(250, Math.max(80, (inputValue.length || 8) * 11))}px`
                    }}
                  />
                )}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="task1-container">
      {/* Термин */}
      <div className="task1-term">
        📖 {questionData.term}
      </div>

      {/* Предложение с полем ввода */}
      <div className="task1-sentence-wrapper">
        {renderSentence()}
      </div>

      {/* Кнопка проверки */}
      {!submitted && (
        <div className="task1-button-wrapper">
          <button
            onClick={handleSubmit}
            disabled={disabled || !inputValue.trim()}
            className="task1-submit"
          >
            ✅ Проверить
          </button>
        </div>
      )}
    </div>
  );
}