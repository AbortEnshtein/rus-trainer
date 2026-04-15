// frontend/app/components/tasks/Task16Select.tsx

'use client';

interface Task16SelectProps {
  questionData: {
    sentence: string;
    explanation?: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
}

export default function Task16Select({ questionData, onAnswer, disabled, selectedAnswer }: Task16SelectProps) {

  const handleAnswer = (answer: string) => {
    if (disabled || selectedAnswer) return;
    onAnswer(answer);
  };

  const getButtonClass = (value: string) => {
    let className = 'task16-btn';
    if (selectedAnswer === value) {
      className += ' task16-btn-active';
    }
    return className;
  };

  return (
    <div className="task16-container">
      <div className="task16-sentence">
        {questionData.sentence}
      </div>

      <div className="task16-options">
        <button
          onClick={() => handleAnswer('0')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('0')}
        >
          0 запятых
        </button>
        <button
          onClick={() => handleAnswer('1')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('1')}
        >
          1 запятая
        </button>
        <button
          onClick={() => handleAnswer('2')}
          disabled={disabled || !!selectedAnswer}
          className={getButtonClass('2')}
        >
          Много запятых
        </button>
      </div>
    </div>
  );
}