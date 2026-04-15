// frontend/app/components/tasks/Task3Characteristics.tsx

'use client';

import { useState, useEffect } from 'react';

interface Task3CharacteristicsProps {
  questionData: {
    text: string;
    characteristics: Array<{ number: number; text: string }>;
    correct_list?: number[];
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function Task3Characteristics({ 
  questionData, 
  onAnswer, 
  disabled, 
  selectedAnswer, 
  isCorrect 
}: Task3CharacteristicsProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Сброс состояния при новом вопросе
  useEffect(() => {
    setSelectedOptions([]);
    setHasSubmitted(false);
  }, [questionData]);

  // Если ответ уже пришёл от родителя (после отправки)
  useEffect(() => {
    if (selectedAnswer && !hasSubmitted) {
      setHasSubmitted(true);
      const answers = selectedAnswer.split('').map(Number);
      setSelectedOptions(answers);
    }
  }, [selectedAnswer]);

  const toggleOption = (num: number) => {
    if (disabled || hasSubmitted) return;
    
    setSelectedOptions(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const handleSubmit = () => {
    if (disabled || hasSubmitted) return;
    if (selectedOptions.length === 0) return;
    
    setHasSubmitted(true);
    const answer = selectedOptions.sort((a, b) => a - b).join('');
    onAnswer(answer);
  };

  // Получаем правильные ответы - проверяем разные возможные места
  const correctAnswers = questionData.correct_list || 
                         (questionData as any).correctList || 
                         [];

  console.log('Correct answers:', correctAnswers);
  console.log('Selected options:', selectedOptions);

  const getOptionClass = (num: number) => {
    const isSelected = selectedOptions.includes(num);
    const isCorrectAnswer = correctAnswers.includes(num);
    
    // До отправки
    if (!hasSubmitted) {
      if (isSelected) {
        return 'task3-option task3-option-selected';
      }
      return 'task3-option';
    }
    
    // После отправки
    if (isSelected && isCorrectAnswer) {
      return 'task3-option task3-option-correct';
    }
    if (isSelected && !isCorrectAnswer) {
      return 'task3-option task3-option-wrong';
    }
    if (!isSelected && isCorrectAnswer) {
      return 'task3-option task3-option-missed';
    }
    return 'task3-option';
  };

  const canSubmit = !disabled && !hasSubmitted && selectedOptions.length > 0;

  return (
    <div className="task3-container">
      {/* Текст */}
      <div className="task3-text">
        {questionData.text.split('\n').map((paragraph, idx) => (
          <p key={idx} className="task3-paragraph">{paragraph}</p>
        ))}
      </div>

      {/* Заголовок характеристик */}
      <div className="task3-title">
        📋 ХАРАКТЕРИСТИКИ
      </div>

      {/* Список характеристик */}
      <div className="task3-list">
        {questionData.characteristics.map((char) => (
          <div
            key={char.number}
            onClick={() => toggleOption(char.number)}
            className={getOptionClass(char.number)}
          >
            <span className="task3-option-number">{char.number})</span>
            <span className="task3-option-text">{char.text}</span>
          </div>
        ))}
      </div>

      {/* Кнопка проверки */}
      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="task3-submit"
        >
          ✅ Проверить ответ
        </button>
      )}
    </div>
  );
}