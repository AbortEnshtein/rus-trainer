// frontend/app/components/tasks/Task2YesNo.tsx

'use client';

interface Task2YesNoProps {
  questionData: {
    sentence: string;
    word: string;
    definition: string;
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function Task2YesNo({ questionData, onAnswer, disabled, selectedAnswer, isCorrect }: Task2YesNoProps) {

  const getButtonClass = (value: string) => {
    let className = 'task-yesno-btn';
    
    if (selectedAnswer === value) {
      if (isCorrect !== null && isCorrect !== undefined) {
        className += isCorrect ? ' task-yesno-btn-correct' : ' task-yesno-btn-wrong';
      } else {
        className += ' task-yesno-btn-selected';
      }
    }
    
    return className;
  };

  return (
    <div className="task2-container">
      {/* Предложение - увеличенный размер */}
      <div className="task2-sentence">
        {questionData.sentence}
      </div>

      {/* Подсказка - всегда видна */}
      <div className="task2-hint">
        <div className="task2-hint-title">📖 Определение слова <strong>«{questionData.word}»</strong>:</div>
        <div className="task2-hint-text">{questionData.definition}</div>
      </div>

      {/* Вопрос - более заметный */}
      <div className="task2-question">
        🤔 <strong>Соответствует ли значение слова «{questionData.word}» данному определению в этом контексте?</strong>
      </div>

      {/* Кнопки ответа */}
      <div className="task-yesno-options">
        <button
          onClick={() => onAnswer('yes')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('yes')}
        >
          ✅ Да, соответствует
        </button>
        <button
          onClick={() => onAnswer('no')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('no')}
        >
          ❌ Нет, не соответствует
        </button>
      </div>
    </div>
  );
}