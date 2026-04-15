// frontend/app/components/tasks/TaskTwoOptions.tsx

'use client';

interface TaskTwoOptionsProps {
  questionData: {
    phrase?: string;
    word?: string;
    type: string;
  };
  option1: string;
  option2: string;
  value1: string;
  value2: string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
  correctAnswer?: string;
}

export default function TaskTwoOptions({ 
  questionData, 
  option1, 
  option2,
  value1,
  value2,
  onAnswer, 
  disabled, 
  selectedAnswer, 
  isCorrect,
  correctAnswer
}: TaskTwoOptionsProps) {
  
  const getText = () => {
    if (questionData.phrase) return questionData.phrase;
    if (questionData.word) return questionData.word;
    return '';
  };

  const getButtonClass = (value: string) => {
    let className = 'task-two-option';
    
    if (selectedAnswer === value) {
      if (isCorrect !== null && isCorrect !== undefined) {
        className += isCorrect ? ' task-two-option-correct' : ' task-two-option-wrong';
      } else {
        className += ' task-two-option-selected';
      }
    }
    
    return className;
  };

  // Функция для отображения правильного ответа на русском
  const getDisplayAnswer = (answer: string) => {
    if (answer === 'together') return 'слитно';
    if (answer === 'separate') return 'раздельно';
    if (answer === 'n') return 'Н';
    if (answer === 'nn') return 'НН';
    return answer;
  };

  return (
    <div className="task-two-container">
      <div className="task-two-text">
        {getText()}
      </div>

      <div className="task-two-options">
        <button
          onClick={() => onAnswer(value1)}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass(value1)}
        >
          {option1}
        </button>
        <button
          onClick={() => onAnswer(value2)}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass(value2)}
        >
          {option2}
        </button>
      </div>

      {/* Результат будет показан в родительском компоненте */}
    </div>
  );
}