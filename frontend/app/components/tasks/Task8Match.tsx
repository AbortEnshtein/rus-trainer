// frontend/app/components/tasks/Task8Input.tsx

'use client';

import { useState, useEffect, useRef } from 'react';

interface Task8InputProps {
  questionData: {
    errors: { [key: string]: string };
    sentences: { [key: number]: string };
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function Task8Input({ 
  questionData, 
  onAnswer, 
  disabled, 
  selectedAnswer, 
  isCorrect 
}: Task8InputProps) {
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue('');
    setSubmitted(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionData]);

  const handleSubmit = () => {
    if (disabled || submitted) return;
    if (inputValue.length !== 5) return;
    if (!/^\d+$/.test(inputValue)) return;
    
    setSubmitted(true);
    onAnswer(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && !submitted && inputValue.length === 5) {
      handleSubmit();
    }
  };

  const letters = ['А', 'Б', 'В', 'Г', 'Д'];

  return (
    <div className="task8-container">
      {/* Ошибки */}
      <div className="task8-errors">
        <div className="task8-title">📋 ГРАММАТИЧЕСКИЕ ОШИБКИ</div>
        {letters.map(letter => (
          <div key={letter} className="task8-error-item">
            <span className="task8-error-letter">{letter})</span>
            <span className="task8-error-text">{questionData.errors[letter]}</span>
          </div>
        ))}
      </div>

      {/* Предложения */}
      <div className="task8-sentences">
        <div className="task8-title">📝 ПРЕДЛОЖЕНИЯ</div>
        {Object.keys(questionData.sentences).sort((a,b)=>Number(a)-Number(b)).map(num => (
          <div key={num} className="task8-sentence-item">
            <span className="task8-sentence-number">{num})</span>
            <span className="task8-sentence-text">{questionData.sentences[Number(num)]}</span>
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div className="task8-input-area">
        <div className="task8-title">✏️ ВВЕДИТЕ ОТВЕТ</div>
        <div className="task8-input-hint">
          Введите пять цифр подряд (например, <strong>43827</strong>), где:
          <br />
          первая цифра — номер предложения для ошибки А,
          вторая — для ошибки Б, и так далее
        </div>
        
        {!submitted && !selectedAnswer ? (
          <div className="task8-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
                setInputValue(val);
              }}
              onKeyPress={handleKeyPress}
              placeholder="_____"
              maxLength={5}
              className="task8-input"
              disabled={disabled}
            />
            <button
              onClick={handleSubmit}
              disabled={inputValue.length !== 5}
              className="task8-submit"
            >
              ✅ Проверить
            </button>
          </div>
        ) : (
          <div className="task8-answer-display">
            Ваш ответ: <strong>{selectedAnswer || inputValue}</strong>
          </div>
        )}
      </div>
    </div>
  );
}