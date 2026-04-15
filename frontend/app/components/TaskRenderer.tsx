// frontend/app/components/TaskRenderer.tsx

'use client';
import Task3Characteristics from './tasks/Task3Characteristics';
import Task11Word from './tasks/Task11Word';
import Task16Select from './tasks/Task16Select';
import Task17Positions from './tasks/Task17Positions';
import TaskYesNo from './tasks/TaskYesNo';
import Task2YesNo from './tasks/Task2YesNo';
import TaskTwoOptions from './tasks/TaskTwoOptions';
import TaskThreeOptions from './tasks/TaskThreeOptions';
import Task1Input from './tasks/Task1Input';
import Task8Match from './tasks/Task8Match';
interface TaskRendererProps {
  taskNumber: number;
  questionData: any;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export default function TaskRenderer({ taskNumber, questionData, onAnswer, disabled, selectedAnswer, isCorrect }: TaskRendererProps) {
  if (taskNumber === 1) {
    return (
      <Task1Input
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }
  // Задание 2 - лексическое значение (с подсказкой)
  if (taskNumber === 2) {
    return (
      <Task2YesNo
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }
  if (taskNumber === 3) {
    return (
      <Task3Characteristics
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }
  // Задания 4, 5, 7 - две кнопки (Верно/Неверно)
  if ([4, 5, 7].includes(taskNumber)) {
    return (
      <TaskYesNo
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }
  if (taskNumber === 8) {
     return (
    <Task8Match
      questionData={questionData}
      onAnswer={onAnswer}
      disabled={disabled}
      selectedAnswer={selectedAnswer}
      isCorrect={isCorrect}
    />
  );
}
  // Задания 9, 10, 11, 12 - выбор буквы
  if ([9, 10, 11, 12].includes(taskNumber)) {
    return (
      <Task11Word
        word={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }

// frontend/app/components/TaskRenderer.tsx - обновить части для 13, 14, 15

  // Задание 13 - НЕ с частями речи (слитно/раздельно)
  if (taskNumber === 13) {
    return (
      <TaskTwoOptions
        questionData={questionData}
        option1="Слитно"
        option2="Раздельно"
        value1="together"
        value2="separate"
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }

  // Задание 14 - слитное/дефисное/раздельное (три варианта)
  if (taskNumber === 14) {
    return (
      <TaskThreeOptions
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }

  // Задание 15 - Н/НН (два варианта)
  if (taskNumber === 15) {
    return (
      <TaskTwoOptions
        questionData={questionData}
        option1="Н"
        option2="НН"
        value1="n"
        value2="nn"
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
      />
    );
  }

  // Задание 16: выбор количества запятых (0, 1, много)
  if (taskNumber === 16) {
    return (
      <Task16Select
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
      />
    );
  }

  // Задания 17, 18, 19, 20: выбор позиций запятых
  if ([17, 18, 19, 20].includes(taskNumber)) {
    return (
      <Task17Positions
        questionData={questionData}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedAnswer={selectedAnswer}
      />
    );
  }

  // Заглушка для остальных заданий
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-2">🚧 В разработке</div>
      <p className="text-gray-500">Задание {taskNumber} будет добавлено в ближайшее время</p>
    </div>
  );
}