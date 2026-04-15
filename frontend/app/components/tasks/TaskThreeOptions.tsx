// frontend/app/components/tasks/TaskThreeOptions.tsx

'use client';

interface TaskThreeOptionsProps {
  questionData: {
    phrase: string;
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
  correctAnswer?: string;
}

export default function TaskThreeOptions({ 
  questionData, 
  onAnswer, 
  disabled, 
  selectedAnswer, 
  isCorrect,
  correctAnswer
}: TaskThreeOptionsProps) {
  
  const getButtonClass = (value: string) => {
    let className = 'task-three-option';
    
    if (selectedAnswer === value) {
      if (isCorrect !== null && isCorrect !== undefined) {
        className += isCorrect ? ' task-three-option-correct' : ' task-three-option-wrong';
      } else {
        className += ' task-three-option-selected';
      }
    }
    
    return className;
  };

  // Функция для отображения правильного ответа на русском
  const getDisplayAnswer = (answer: string) => {
    if (answer === 'together') return 'слитно';
    if (answer === 'separate') return 'раздельно';
    if (answer === 'hyphen') return 'через дефис';
    return answer;
  };

  return (
    <div className="task-three-container">
      <div className="task-three-text">
        {questionData.phrase}
      </div>

      <div className="task-three-options">
        <button
          onClick={() => onAnswer('together')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('together')}
        >
          Слитно
        </button>
        <button
          onClick={() => onAnswer('separate')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('separate')}
        >
          Раздельно
        </button>
        <button
          onClick={() => onAnswer('hyphen')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('hyphen')}
        >
          Через дефис
        </button>
      </div>
    </div>
  );
}