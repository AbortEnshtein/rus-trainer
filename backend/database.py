# backend/database.py

import sqlite3
from datetime import datetime
from typing import List, Dict, Optional
import json

class Database:
    def __init__(self, db_path: str = 'ege_trainer.db'):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Инициализация таблиц для всех заданий"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            # Ранг
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    total_xp INTEGER DEFAULT 0,
                    level INTEGER DEFAULT 1
                )
            ''')
            # Пользователи
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    total_xp INTEGER DEFAULT 0
                )
            ''')
            
            # Сессии
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    id TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            
            # Задания
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY,
                    task_number INTEGER UNIQUE,
                    title TEXT,
                    description TEXT,
                    question_type TEXT,
                    answer_format TEXT,
                    is_active BOOLEAN DEFAULT TRUE
                )
            ''')
            
            # Вопросы
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS questions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_id INTEGER NOT NULL,
                    question_data TEXT NOT NULL,
                    correct_answer TEXT NOT NULL,
                    explanation TEXT,
                    difficulty INTEGER DEFAULT 1,
                    FOREIGN KEY (task_id) REFERENCES tasks (id)
                )
            ''')
            
            # Статистика по вопросам
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS question_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    question_id INTEGER NOT NULL,
                    correct_count INTEGER DEFAULT 0,
                    wrong_count INTEGER DEFAULT 0,
                    last_attempt TIMESTAMP,
                    UNIQUE(user_id, question_id),
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (question_id) REFERENCES questions (id)
                )
            ''')
            
            # История ответов
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS answer_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    task_id INTEGER NOT NULL,
                    question_id INTEGER NOT NULL,
                    user_answer TEXT,
                    is_correct BOOLEAN,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (task_id) REFERENCES tasks (id),
                    FOREIGN KEY (question_id) REFERENCES questions (id)
                )
            ''')
            
            # Инициализируем задания
            self.init_tasks(cursor)
            conn.commit()
    
    def init_tasks(self, cursor):
        """Создаёт задания 1-26"""
        tasks = [
            (1, 1, "Средства связи предложений", "Самостоятельно подберите местоимение/союз/частицу", "word", "single_word"),
            (2, 2, "Лексическое значение слова", "Укажите варианты ответов, в которых лексическое значение слова соответствует контексту", "digits", "multiple_digits"),
            (3, 3, "Стилистический анализ текста", "Укажите варианты ответов, в которых даны верные характеристики", "digits", "multiple_digits"),
            (4, 4, "Ударение", "Укажите варианты ответов, в которых верно выделена ударная буква", "digits", "multiple_digits"),
            (5, 5, "Паронимы", "Исправьте лексическую ошибку, подобрав пароним", "word", "single_word"),
            (6, 6, "Лексические нормы", "Исправьте лексическую ошибку, заменив неверно употреблённое слово", "word", "single_word"),
            (7, 7, "Морфологические нормы", "Исправьте ошибку в образовании формы слова", "word", "single_word"),
            (8, 8, "Грамматические ошибки", "Установите соответствие между ошибками и предложениями", "match", "five_digits"),
            (9, 9, "Правописание корней", "Укажите варианты ответов, в которых во всех словах пропущена одна и та же буква", "digits", "multiple_digits"),
            (10, 10, "Правописание приставок", "Укажите варианты ответов, в которых во всех словах пропущена одна и та же буква", "digits", "multiple_digits"),
            (11, 11, "Правописание суффиксов", "Укажите варианты ответов, в которых в обоих словах пропущена одна и та же буква", "digits", "multiple_digits"),
            (12, 12, "Личные окончания глаголов", "Укажите варианты ответов, в которых в обоих словах пропущена одна и та же буква", "digits", "multiple_digits"),
            (13, 13, "НЕ с частями речи", "Укажите варианты ответов, в которых НЕ пишется РАЗДЕЛЬНО/СЛИТНО", "digits", "multiple_digits"),
            (14, 14, "Слитное/дефисное/раздельное", "Укажите варианты ответов, в которых выделенные слова пишутся СЛИТНО/РАЗДЕЛЬНО/ЧЕРЕЗ ДЕФИС", "digits", "multiple_digits"),
            (15, 15, "Н/НН", "Укажите варианты ответов, в которых на месте пропуска пишется Н/НН", "digits", "multiple_digits"),
            (16, 16, "Пунктуация в ССП и при однородных", "Укажите предложения, в которых нужно поставить ОДНУ запятую", "digits", "multiple_digits"),
            (17, 17, "Пунктуация при обособлениях", "Укажите цифры, на месте которых должны стоять запятые", "positions", "positions"),
            (18, 18, "Пунктуация при вводных и обращениях", "Укажите цифры, на месте которых должны стоять запятые", "positions", "positions"),
            (19, 19, "Пунктуация в СПП", "Укажите цифры, на месте которых должны стоять запятые", "positions", "positions"),
            (20, 20, "Пунктуация в сложных предложениях", "Укажите цифры, на месте которых должны стоять запятые", "positions", "positions"),
            (21, 21, "Анализ текста (тире)", "Найдите предложения, в которых тире ставится по одному правилу", "digits", "multiple_digits"),
            (22, 22, "Содержательный анализ текста", "Какие высказывания соответствуют содержанию текста?", "digits", "multiple_digits"),
            (23, 23, "Типы речи и связи предложений", "Какие из утверждений являются верными?", "digits", "multiple_digits"),
            (24, 24, "Лексический анализ", "Выпишите фразеологизм/слово из текста", "word", "single_word"),
            (25, 25, "Средства связи предложений", "Найдите предложение, связанное с предыдущим с помощью местоимения/союза", "digits", "multiple_digits"),
            (26, 26, "Изобразительные средства", "Установите соответствие между тропами и примерами", "match", "four_digits"),
        ]
        
        for task in tasks:
            cursor.execute('''
                INSERT OR IGNORE INTO tasks 
                (id, task_number, title, description, question_type, answer_format)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', task)
    
    def get_or_create_user(self, username: str) -> Dict:
        user = self.get_user(username)
        if not user:
            user_id = self.create_user(username)
            user = {'id': user_id, 'username': username}
        return user
    
    def get_user(self, username: str) -> Optional[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def create_user(self, username: str) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username) VALUES (?)', (username,))
            conn.commit()
            return cursor.lastrowid
    
    def create_session(self, session_id: str, user_id: int):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO sessions (id, user_id) VALUES (?, ?)', (session_id, user_id))
            conn.commit()
    
    def get_session_user(self, session_id: str) -> Optional[int]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT user_id FROM sessions WHERE id = ?', (session_id,))
            row = cursor.fetchone()
            return row[0] if row else None
    
    # backend/database.py - обновить add_question

    def add_question(self, task_number: int, question_data: Dict, correct_answer: str, explanation: str = None, correct_answers_list: list = None) -> int:
        """Добавить вопрос"""
        task = self.get_task(task_number)
        if not task:
            raise ValueError(f"Task {task_number} not found")
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Для задания 1 сохраняем список правильных ответов
            if correct_answers_list:
                question_data['correct_answers_list'] = correct_answers_list
            
            cursor.execute('''
                INSERT INTO questions (task_id, question_data, correct_answer, explanation)
                VALUES (?, ?, ?, ?)
            ''', (task['id'], json.dumps(question_data, ensure_ascii=False), correct_answer, explanation))
            conn.commit()
            return cursor.lastrowid
    
    def get_task(self, task_number: int) -> Optional[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM tasks WHERE task_number = ?', (task_number,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_all_tasks(self) -> List[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM tasks ORDER BY task_number')
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    
    def get_random_question(self, task_number: int, user_id: int = None, mode: str = 'random') -> Optional[Dict]:
        """Получить случайный вопрос"""
        task = self.get_task(task_number)
        if not task:
            return None
        
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            if mode == 'weak' and user_id:
                cursor.execute('''
                    SELECT q.* FROM questions q
                    JOIN question_stats qs ON q.id = qs.question_id
                    WHERE q.task_id = ? AND qs.user_id = ? 
                    AND qs.wrong_count > qs.correct_count
                    ORDER BY (qs.wrong_count - qs.correct_count) DESC
                    LIMIT 1
                ''', (task['id'], user_id))
                row = cursor.fetchone()
                if row:
                    q = dict(row)
                    q['question_data'] = json.loads(q['question_data'])
                    return q
            
            cursor.execute('''
                SELECT * FROM questions WHERE task_id = ?
                ORDER BY RANDOM() LIMIT 1
            ''', (task['id'],))
            row = cursor.fetchone()
            
            if row:
                q = dict(row)
                q['question_data'] = json.loads(q['question_data'])
                return q
            return None
    
    def get_question_by_id(self, question_id: int) -> Optional[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM questions WHERE id = ?', (question_id,))
            row = cursor.fetchone()
            if row:
                q = dict(row)
                q['question_data'] = json.loads(q['question_data'])
                return q
            return None
    
    def update_question_stat(self, user_id: int, question_id: int, is_correct: bool):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            if is_correct:
                cursor.execute('''
                    INSERT INTO question_stats (user_id, question_id, correct_count, last_attempt)
                    VALUES (?, ?, 1, CURRENT_TIMESTAMP)
                    ON CONFLICT(user_id, question_id) DO UPDATE SET
                        correct_count = correct_count + 1,
                        last_attempt = CURRENT_TIMESTAMP
                ''', (user_id, question_id))
            else:
                cursor.execute('''
                    INSERT INTO question_stats (user_id, question_id, wrong_count, last_attempt)
                    VALUES (?, ?, 1, CURRENT_TIMESTAMP)
                    ON CONFLICT(user_id, question_id) DO UPDATE SET
                        wrong_count = wrong_count + 1,
                        last_attempt = CURRENT_TIMESTAMP
                ''', (user_id, question_id))
            conn.commit()
    
    def add_answer_history(self, user_id: int, task_id: int, question_id: int, user_answer: str, is_correct: bool):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO answer_history (user_id, task_id, question_id, user_answer, is_correct)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, task_id, question_id, user_answer, is_correct))
            conn.commit()
    
    def get_question_stats(self, user_id: int, question_id: int) -> Dict:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM question_stats 
                WHERE user_id = ? AND question_id = ?
            ''', (user_id, question_id))
            row = cursor.fetchone()
            return dict(row) if row else {'correct_count': 0, 'wrong_count': 0}
    
    def get_user_progress(self, user_id: int) -> Dict:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT 
                    SUM(correct_count) as total_correct,
                    SUM(wrong_count) as total_wrong
                FROM question_stats
                WHERE user_id = ?
            ''', (user_id,))
            stats = cursor.fetchone()
            
            return {
                'total_correct': stats[0] or 0,
                'total_wrong': stats[1] or 0,
                'accuracy': round((stats[0] or 0) / ((stats[0] or 0) + (stats[1] or 0)) * 100, 1) if (stats[0] or 0) + (stats[1] or 0) > 0 else 0
            }