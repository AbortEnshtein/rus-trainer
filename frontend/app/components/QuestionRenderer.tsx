// frontend/app/components/QuestionRenderer.tsx

'use client';

import Task1Word from './tasks/Task1Word';
import TaskSentencesSelect from './tasks/Task17Positions';
import TaskPositionsSelect from './tasks/Task16Select';
import Task11Default from './tasks/Task11Word';

interface QuestionRendererProps {
  taskNumber: number;
  questionData: any;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({ taskNumber, questionData, onAnswer, disabled }: QuestionRendererProps) {
  // Задание 1: выбор/ввод слова
  if (taskNumber === 1) {
    return <Task1Word questionData={questionData} onAnswer={onAnswer} disabled={disabled} />;
  }
  
  // Задание 11: правописание суффиксов (уже есть)
  if (taskNumber === 11) {
    return <Task11Default word={questionData} onAnswer={onAnswer} disabled={disabled} />;
  }
  
  // Задания 16-21: выбор предложений
  if ([16, 21, 22, 23].includes(taskNumber)) {
    return <TaskSentencesSelect questionData={questionData} onAnswer={onAnswer} disabled={disabled} />;
  }
  
  // Задания 17-20: выбор позиций запятых
  if ([17, 18, 19, 20].includes(taskNumber)) {
    return <TaskPositionsSelect questionData={questionData} onAnswer={onAnswer} disabled={disabled} />;
  }
  
  // Заглушка для остальных заданий
  return (
    <div className="text-center py-8 text-gray-500">
      Задание {taskNumber} в разработке...
    </div>
  );
}