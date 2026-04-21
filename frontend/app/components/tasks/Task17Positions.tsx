// frontend/app/components/tasks/Task17Positions.tsx

'use client';

import { useState, useEffect } from 'react';

interface Task17PositionsProps {
  questionData: {
    sentence: string;
    positions: number[];
    type: string;
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
}

export default function Task17Positions({ questionData, onAnswer, disabled, selectedAnswer }: Task17PositionsProps) {
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedPositions([]);
    setSubmitted(false);
  }, [questionData]);

  if (!questionData?.sentence) {
    return <div className="text-center text-red-500 py-8">Ошибка загрузки данных</div>;
  }

  const togglePosition = (pos: number) => {
    if (disabled || submitted || selectedAnswer) return;
    
    setSelectedPositions(prev => 
      prev.includes(pos) 
        ? prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  };

  const handleSubmit = () => {
    if (disabled || submitted || selectedAnswer) return;
    const answer = selectedPositions.sort((a, b) => a - b).join('');
    onAnswer(answer);
    setSubmitted(true);
  };

  const renderSentence = () => {
    const parts: Array<{ type: 'text'; content: string } | { type: 'button'; position: number; isSelected: boolean }> = [];
    let currentPos = 0;
    const regex = /\((\d+)\)/g;
    const matches = [...questionData.sentence.matchAll(regex)];
    
    if (matches.length === 0) {
      return <div className="task17-sentence">{questionData.sentence}</div>;
    }
    
    for (const match of matches) {
      const pos = parseInt(match[1], 10);
      const matchIndex = match.index!;
      
      if (matchIndex > currentPos) {
        parts.push({
          type: 'text',
          content: questionData.sentence.substring(currentPos, matchIndex)
        });
      }
      
      parts.push({
        type: 'button',
        position: pos,
        isSelected: selectedPositions.includes(pos)
      });
      
      currentPos = matchIndex + match[0].length;
    }
    
    if (currentPos < questionData.sentence.length) {
      parts.push({
        type: 'text',
        content: questionData.sentence.substring(currentPos)
      });
    }
    
    return (
      <div className="task17-sentence">
        {parts.map((item, idx) => {
          if (item.type === 'text') {
            return <span key={idx}>{item.content}</span>;
          } else {
            return (
              <button
                key={idx}
                onClick={() => togglePosition(item.position)}
                disabled={disabled || !!selectedAnswer || submitted}
                className={`task17-position ${item.isSelected ? 'task17-position-selected' : ''}`}
              >
                {item.position}
              </button>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="task17-container">
      <div className="task17-hint">
        🔘 Кликните на номера позиций, где должны стоять запятые
      </div>

      {renderSentence()}

      {!submitted && !selectedAnswer && (
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="task17-submit"
        >
          ✅ Проверить ответ
        </button>
      )}
    </div>
  );
}