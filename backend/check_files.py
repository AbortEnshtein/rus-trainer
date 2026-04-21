# backend/show_users.py

import sqlite3
from datetime import datetime

def show_users():
    """Красивый вывод всех пользователей"""
    
    db_path = 'ege_trainer.db'
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Проверяем существование таблицы
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            print("❌ Таблица users не найдена. База данных пуста или повреждена.")
            return
        
        # Получаем всех пользователей
        cursor.execute('''
            SELECT 
                u.id, 
                u.username, 
                u.total_xp, 
                u.created_at,
                COALESCE(SUM(qs.correct_count), 0) as total_correct,
                COALESCE(SUM(qs.wrong_count), 0) as total_wrong
            FROM users u
            LEFT JOIN question_stats qs ON qs.user_id = u.id
            GROUP BY u.id
            ORDER BY u.total_xp DESC
        ''')
        
        rows = cursor.fetchall()
        
        if not rows:
            print("❌ Нет зарегистрированных пользователей")
            return
        
        # Подсчёт общей статистики
        total_xp = sum(row[2] for row in rows)
        total_correct = sum(row[4] for row in rows)
        total_wrong = sum(row[5] for row in rows)
        
        # Вывод
        print("\n" + "="*80)
        print("👥 ПОЛЬЗОВАТЕЛИ ТРЕНАЖЁРА")
        print("="*80)
        print()
        
        for row in rows:
            user_id, username, xp, created_at, correct, wrong = row
            
            # Определяем ранг по XP
            if xp < 10000:
                rank_icon = "🌱"
                rank_name = "Новичок"
                rank_color = "\033[90m"  # серый
            elif xp < 30000:
                rank_icon = "📚"
                rank_name = "Ученик"
                rank_color = "\033[90m"
            elif xp < 60000:
                rank_icon = "🎓"
                rank_name = "Продолжающий"
                rank_color = "\033[94m"  # синий
            elif xp < 100000:
                rank_icon = "⭐"
                rank_name = "Знаток"
                rank_color = "\033[95m"  # фиолетовый
            else:
                rank_icon = "🏆"
                rank_name = "Мастер"
                rank_color = "\033[93m"  # жёлтый
            
            total_answers = correct + wrong
            accuracy = round(correct / total_answers * 100, 1) if total_answers > 0 else 0
            
            # Форматируем дату
            if created_at:
                try:
                    date_obj = datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S')
                    created_str = date_obj.strftime('%d.%m.%Y')
                except:
                    created_str = created_at[:10]
            else:
                created_str = "неизвестно"
            
            print(f"{rank_color}{rank_icon} {rank_name}\033[0m")
            print(f"   📝 Имя: {username}")
            print(f"   🎯 XP: {xp}")
            print(f"   📊 Статистика: ✓{correct} ✗{wrong} (точность {accuracy}%)")
            print(f"   📅 Зарегистрирован: {created_str}")
            print()
        
        print("-"*80)
        print(f"📊 ИТОГО:")
        print(f"   👥 Пользователей: {len(rows)}")
        print(f"   🎯 Всего XP: {total_xp}")
        print(f"   ✓ Всего правильных: {total_correct}")
        print(f"   ✗ Всего неправильных: {total_wrong}")
        print(f"   📈 Общая точность: {round(total_correct / (total_correct + total_wrong) * 100, 1) if (total_correct + total_wrong) > 0 else 0}%")
        print("="*80)
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"❌ Ошибка базы данных: {e}")
    except Exception as e:
        print(f"❌ Ошибка: {e}")

def show_user_detail(username: str):
    """Показать детальную статистику по конкретному пользователю"""
    
    db_path = 'ege_trainer.db'
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Получаем пользователя
        cursor.execute('SELECT id, username, total_xp, created_at FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ Пользователь '{username}' не найден")
            return
        
        user_id, username, xp, created_at = user
        
        # Получаем статистику по заданиям
        cursor.execute('''
            SELECT 
                t.task_number,
                COALESCE(SUM(qs.correct_count), 0) as correct,
                COALESCE(SUM(qs.wrong_count), 0) as wrong
            FROM tasks t
            LEFT JOIN questions q ON q.task_id = t.id
            LEFT JOIN question_stats qs ON qs.question_id = q.id AND qs.user_id = ?
            GROUP BY t.id
            ORDER BY t.task_number
        ''', (user_id,))
        
        task_stats = cursor.fetchall()
        
        print("\n" + "="*80)
        print(f"📊 ДЕТАЛЬНАЯ СТАТИСТИКА: {username}")
        print("="*80)
        print(f"🎯 Всего XP: {xp}")
        print(f"📅 Зарегистрирован: {created_at[:10] if created_at else 'неизвестно'}")
        print()
        print("📋 ПРОГРЕСС ПО ЗАДАНИЯМ:")
        print("-"*80)
        print(f"{'Задание':<10} {'Правильно':<12} {'Неправильно':<12} {'Точность':<10}")
        print("-"*80)
        
        for task_num, correct, wrong in task_stats:
            total = correct + wrong
            accuracy = round(correct / total * 100, 1) if total > 0 else 0
            bar = "█" * int(accuracy / 5) + "░" * (20 - int(accuracy / 5))
            print(f"{task_num:<10} {correct:<12} {wrong:<12} {accuracy}% {bar}")
        
        print("="*80)
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"❌ Ошибка базы данных: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Если передан аргумент - показываем детали пользователя
        show_user_detail(sys.argv[1])
    else:
        # Иначе - список всех пользователей
        show_users()