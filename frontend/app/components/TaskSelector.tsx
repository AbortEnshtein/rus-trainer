// frontend/app/components/TaskSelector.tsx

'use client';

import Link from 'next/link';

interface Task {
  id: number;
  task_number: number;
  title: string;
  description: string;
  question_type: string;
}

interface TaskSelectorProps {
  tasks: Task[];
  loading: boolean;
}

export default function TaskSelector({ tasks, loading }: TaskSelectorProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Загрузка заданий...</p>
      </div>
    );
  }

  // Группировка заданий по типам
  const part1 = tasks.filter(t => t.task_number <= 26);
  const part2 = tasks.filter(t => t.task_number === 27);

  return (
    <div className="space-y-8">
      {/* Часть 1: Задания 1-26 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
          Часть 1 (задания 1–26)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {part1.map((task) => (
            <Link
              key={task.task_number}
              href={`/task/${task.task_number}`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
            >
              <div className="text-2xl font-bold text-blue-600 mb-1">{task.task_number}</div>
              <div className="text-xs text-gray-500 line-clamp-2">{task.title}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Часть 2: Задание 27 */}
      {part2.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
            Часть 2 (задание 27)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {part2.map((task) => (
              <Link
                key={task.task_number}
                href={`/task/${task.task_number}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">{task.task_number}</div>
                <div className="text-xs text-gray-500">{task.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}