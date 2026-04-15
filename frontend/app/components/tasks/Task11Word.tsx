// frontend/app/components/tasks/Task11Word.tsx

'use client';

interface Task11WordProps {
  word: {
    display_word: string;
    options: string[];
    explanation?: string;
    rule?: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function Task11Word({ word, onAnswer, disabled, selectedAnswer, isCorrect }: Task11WordProps) {
  
  // Отображаем слово с пропуском (заменяем _ на подчёркивание)
  const renderWordWithGap = (displayWord: string) => {
    // Просто заменяем _ на визуальный пропуск
    const displayText = displayWord.replace(/_/g, '_');
    
    return (
      <div className="task11-word-text">
        {displayText}
      </div>
    );
  };

  const getOptionClass = (option: string) => {
    let className = 'task11-option';
    
    // Показываем цвет только после того, как получили isCorrect
    if (selectedAnswer && option === selectedAnswer && isCorrect !== null && isCorrect !== undefined) {
      className += isCorrect ? ' task11-option-correct' : ' task11-option-wrong';
    }
    
    return className;
  };

  return (
    <div>
      {/* Слово с пропуском */}
      <div className="task11-word">
        {renderWordWithGap(word.display_word)}
      </div>

      {/* Пояснение */}
      {word.explanation && (
        <div className="task11-explanation">
          <span className="task11-explanation-badge">
            💡 {word.explanation}
          </span>
        </div>
      )}

      {/* Варианты ответов */}
      <div className="task11-options">
        {word.options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            disabled={disabled || !!selectedAnswer}
            className={selectedAnswer ? getOptionClass(option) : 'task11-option'}
          >
            {option === '' ? 'нет буквы' : option}
          </button>
        ))}
      </div>
    </div>
  );
}