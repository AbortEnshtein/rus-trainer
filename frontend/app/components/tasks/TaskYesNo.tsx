// frontend/app/components/tasks/TaskYesNo.tsx

'use client';

interface TaskYesNoProps {
  questionData: {
    word?: string;
    phrase?: string;
    word_form?: string;
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function TaskYesNo({ questionData, onAnswer, disabled, selectedAnswer, isCorrect }: TaskYesNoProps) {
  
  // Получаем текст вопроса в зависимости от типа
  const getQuestionText = () => {
    if (questionData.word) {
      return `В слове "${questionData.word}" правильно выделено ударение?`;
    }
    if (questionData.phrase) {
      return `В словосочетании "${questionData.phrase}" слово употреблено верно?`;
    }
    if (questionData.word_form) {
      return `Форма "${questionData.word_form}" употреблена верно?`;
    }
    return 'Верно ли употребление?';
  };

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
    <div className="task-yesno-container">
      <div className="task-yesno-question">
        {getQuestionText()}
      </div>

      <div className="task-yesno-options">
        <button
          onClick={() => onAnswer('yes')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('yes')}
        >
          ✅ Верно
        </button>
        <button
          onClick={() => onAnswer('no')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('no')}
        >
          ❌ Неверно
        </button>
      </div>
    </div>
  );
}