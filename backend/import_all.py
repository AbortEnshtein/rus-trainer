# backend/import_all.py

import os
import sqlite3
from database import Database

# Импортируем парсер
from parsers.task8_parser import parse_task8
from parsers.task1_parser import parse_task1
from parsers.task3_parser import parse_task3
from parsers.task13_parser import parse_task13
from parsers.task14_parser import parse_task14
from parsers.task15_parser import parse_task15
from parsers.task2_parser import parse_task2
from parsers.task4_parser import parse_task4
from parsers.task5_parser import parse_task5
from parsers.task7_parser import parse_task7
from parsers.task9_parser import parse_task9
from parsers.task10_parser import parse_task10
from parsers.task11_parser import parse_task11
from parsers.task12_parser import parse_task12
from parsers.task16_parser import parse_task16
from parsers.task17_parser import parse_task17

def import_all_questions(db: Database, data_dir: str = './parsers'):
    """Импорт всех вопросов из файлов (без дублирования)"""
    
    print("\n" + "="*50)
    print("🚀 НАЧАЛО ИМПОРТА ВОПРОСОВ")
    print("="*50 + "\n")
    
    stats = {}
    
    # Список заданий с их парсерами и названиями
    tasks_config = {
        1: {'parser': parse_task1, 'filename': '1.txt', 'name': 'Средства связи предложений', 'available': True},
        2: {'parser': parse_task2, 'filename': '2.txt', 'name': 'Лексическое значение слова', 'available': True},
        3: {'parser': parse_task3, 'filename': '3.txt', 'name': 'Стилистический анализ', 'available': True},
        6: {'parser': None, 'filename': '6.txt', 'name': 'Лексические нормы', 'available': False},

        4: {'parser': parse_task4, 'filename': '4.txt', 'name': 'Ударение', 'available': True},
        5: {'parser': parse_task5, 'filename': '5.txt', 'name': 'Паронимы', 'available': True},
        7: {'parser': parse_task7, 'filename': '7.txt', 'name': 'Морфологические нормы', 'available': True},

        8: {'parser': parse_task8, 'filename': '8.txt', 'name': 'Грамматические ошибки', 'available': True},

        9: {'parser': parse_task9, 'filename': '9.txt', 'name': 'Правописание корней', 'available': True},
        10: {'parser': parse_task10, 'filename': '10.txt', 'name': 'Правописание приставок', 'available': True},
        11: {'parser': parse_task11, 'filename': '11.txt', 'name': 'Правописание суффиксов', 'available': True},
        12: {'parser': parse_task12, 'filename': '12.txt', 'name': 'Личные окончания глаголов', 'available': True},

        13: {'parser': parse_task13, 'filename': '13.txt', 'name': 'НЕ с частями речи', 'available': True},
        14: {'parser': parse_task14, 'filename': '14.txt', 'name': 'Слитное/дефисное/раздельное', 'available': True},
        15: {'parser': parse_task15, 'filename': '15.txt', 'name': 'Н/НН', 'available': True},

        16: {'parser': parse_task16, 'filename': '16.txt', 'name': 'Пунктуация в ССП', 'available': True},
        17: {'parser': parse_task17, 'filename': '17.txt', 'name': 'Пунктуация при обособлениях', 'available': True},
        18: {'parser': parse_task17, 'filename': '18.txt', 'name': 'Пунктуация при вводных словах', 'available': True},
        19: {'parser': parse_task17, 'filename': '19.txt', 'name': 'Пунктуация в СПП', 'available': True},
        20: {'parser': parse_task17, 'filename': '20.txt', 'name': 'Пунктуация в сложных предложениях', 'available': True},

        21: {'parser': None, 'filename': '21.txt', 'name': 'Анализ текста (тире)', 'available': False},
        22: {'parser': None, 'filename': '22.txt', 'name': 'Содержательный анализ', 'available': False},
        23: {'parser': None, 'filename': '23.txt', 'name': 'Типы речи', 'available': False},
        24: {'parser': None, 'filename': '24.txt', 'name': 'Лексический анализ', 'available': False},
        25: {'parser': None, 'filename': '25.txt', 'name': 'Средства связи предложений', 'available': False},
        26: {'parser': None, 'filename': '26.txt', 'name': 'Изобразительные средства', 'available': False},
    }
    
    # Импорт заданий
    for task_num, config in tasks_config.items():
        filename = config['filename']
        filepath = data_dir+"/"+filename
        if config['available'] and config['parser'] and os.path.exists(filepath):
            try:
                # Проверяем, есть ли уже вопросы для этого задания
                task = db.get_task(task_num)
                if task:
                    with sqlite3.connect(db.db_path) as conn:
                        cursor = conn.cursor()
                        cursor.execute('SELECT COUNT(*) FROM questions WHERE task_id = ?', (task['id'],))
                        existing_count = cursor.fetchone()[0]
                        
                        if existing_count > 0:
                            print(f"📖 Задание {task_num} ({config['name']})...")
                            print(f"   ⏭️ Пропущено (уже есть {existing_count} вопросов)")
                            stats[task_num] = existing_count
                            continue
                
                print(f"📖 Задание {task_num} ({config['name']})...")
                
                # Для заданий 16-20 передаём task_number вторым аргументом
                if task_num >= 16:
                    questions = config['parser'](filepath, task_num)
                else:
                    questions = config['parser'](filepath)
                
                count = 0
                for q in questions:
                    db.add_question(task_num, q['question_data'], q['correct_answer'], q['explanation'])
                    count += 1
                stats[task_num] = count
                print(f"   ✅ Импортировано {count} вопросов")
            except Exception as e:
                print(f"   ❌ Ошибка: {e}")
                stats[task_num] = 0
        elif config['available'] and not config['parser']:
            print(f"⚠️ Задание {task_num} ({config['name']}) - парсер не реализован")
            stats[task_num] = 0
        elif config['available'] and not os.path.exists(filepath):
            print(f"⚠️ Задание {task_num} ({config['name']}) - файл {filename} не найден")
            stats[task_num] = 0
        else:
            # Задания, которые ещё не реализованы, пропускаем без ошибки
            pass
    
    # Вывод итоговой статистики
    print("\n" + "="*50)
    print("📊 ИТОГОВАЯ СТАТИСТИКА ИМПОРТА")
    print("="*50)
    print(f"{'Задание':<10} {'Название':<35} {'Вопросов':<10}")
    print("-"*55)
    
    total = 0
    for task_num in sorted(stats.keys()):
        count = stats.get(task_num, 0)
        total += count
        name = tasks_config.get(task_num, {}).get('name', 'Неизвестно')
        print(f"{task_num:<10} {name:<35} {count:<10}")
    
    print("-"*55)
    print(f"{'ВСЕГО':<10} {'':<35} {total:<10}")
    print("="*50)
    
    if total == 0:
        print("\n❌ НЕ ЗАГРУЖЕНО НИ ОДНОГО ВОПРОСА!")
        print("\nПроверьте:")
        print("  1. Файлы с вопросами находятся в папке backend")
        print("  2. Формат файлов соответствует ожидаемому")
    else:
        print(f"\n🎉 Успешно загружено {total} вопросов!")

if __name__ == "__main__":
    db = Database()
    import_all_questions(db)