// frontend/app/components/tasks/Task1Word.tsx

'use client';

import { useState } from 'react';

interface Task1WordProps {
  questionData: {
    term: string;
    sentence: string;
    options: string[];
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function Task1Word({ questionData, onAnswer, disabled }: Task1WordProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  // Отображаем предложение с пропуском
  const renderSentence = () => {
    const parts = questionData.sentence.split('…');
    return (
      <div className="text-lg leading-relaxed">
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="inline-block min-w-[80px] border-b-3 border-blue-500 mx-1"></span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Термин: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{questionData.term}</span>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        {renderSentence()}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {questionData.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={!!selectedAnswer || disabled}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              selectedAnswer === option
                ? selectedAnswer === option
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}