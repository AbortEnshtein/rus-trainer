// frontend/app/components/tasks/Task17Positions.tsx

'use client';

import { useState, useEffect } from 'react';

interface Task17PositionsProps {
  questionData: {
    sentence: string;
    positions: number[];
  };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
}

export default function Task17Positions({ questionData, onAnswer, disabled, selectedAnswer }: Task17PositionsProps) {
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);

  // Сбрасываем выбранные позиции при загрузке нового вопроса
  useEffect(() => {
    setSelectedPositions([]);
  }, [questionData]);

  if (!questionData?.sentence) {
    return <div className="text-center text-red-500 py-8">Ошибка загрузки данных</div>;
  }

  const togglePosition = (pos: number) => {
    if (disabled || selectedAnswer) return;
    
    setSelectedPositions(prev => 
      prev.includes(pos) 
        ? prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  };

  const handleSubmit = () => {
    if (disabled || selectedAnswer) return;
    const answer = selectedPositions.sort((a, b) => a - b).join('');
    onAnswer(answer);
  };

  // Форматируем предложение: заменяем / на <br/> для переноса строки
  const formatSentence = (sentence: string) => {
    // Заменяем / на <br/> и убираем лишние пробелы
    const parts = sentence.split('/');
    return parts.map((part, index) => (
      <span key={index}>
        {part.trim()}
        {index < parts.length - 1 && <br />}
      </span>
    ));
  };

  const renderSentence = () => {
    const parts = [];
    let currentPos = 0;
    const regex = /\((\d+)\)/g;
    
    // Сначала заменяем / на временный маркер, чтобы не сломать позиции
    let tempSentence = questionData.sentence;
    
    const matches = [...tempSentence.matchAll(regex)];
    
    if (matches.length === 0) {
      // Нет позиций - просто возвращаем отформатированное предложение
      return <div className="task17-sentence">{formatSentence(tempSentence)}</div>;
    }
    
    // Разбиваем предложение на части
    for (const match of matches) {
      const pos = parseInt(match[1]);
      const matchIndex = match.index!;
      
      if (matchIndex > currentPos) {
        const textPart = tempSentence.substring(currentPos, matchIndex);
        parts.push({
          type: 'text',
          content: formatSentence(textPart)
        });
      }
      
      parts.push({
        type: 'button',
        position: pos,
        isSelected: selectedPositions.includes(pos)
      });
      
      currentPos = matchIndex + match[0].length;
    }
    
    if (currentPos < tempSentence.length) {
      const textPart = tempSentence.substring(currentPos);
      parts.push({
        type: 'text',
        content: formatSentence(textPart)
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
                disabled={disabled || !!selectedAnswer}
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

      {!selectedAnswer && (
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