# backend/app.py

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from database import Database
from import_all import import_all_questions
import sqlite3
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(title="EGE Russian Trainer API")
BLOCKED_IPS = {"192.168.1.100"}  # Ваш IP для блокировки

class IPBlockMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        
        # Если IP в чёрном списке — сразу возвращаем ответ и НЕ вызываем call_next
        if client_ip in BLOCKED_IPS:
            # Возвращаем обычный Response без вызова остальных middleware
            return Response(
                content="Forbidden",
                status_code=403,
                headers={"Connection": "close"}  # Закрываем соединение
            )
        
        # Для остальных IP — продолжаем нормальную работу
        response = await call_next(request)
        return response

# Добавляем middleware ПЕРВЫМ (до CORS)
app.add_middleware(IPBlockMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database()
# ========== МОДЕЛИ ==========

class UserLogin(BaseModel):
    username: str

class AnswerSubmit(BaseModel):
    session_id: str
    task_number: int
    question_id: int
    user_answer: str

# ========== ЭНДПОИНТЫ ==========

@app.get("/")
def root():
    tasks = db.get_all_tasks()
    return {"message": "EGE Russian Trainer API", "tasks_count": len(tasks)}
# backend/app.py - добавить в конец файла
# backend/app.py - добавить новый эндпоинт
# backend/app.py - добавить новый эндпоинт

@app.get("/task_history/{session_id}/{task_number}")
def get_task_history(session_id: str, task_number: int, limit: int = 20):
    """Получить историю ответов по конкретному заданию"""
    user_id = db.get_session_user(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    task = db.get_task(task_number)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    with sqlite3.connect(db.db_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                ah.id,
                ah.user_answer,
                ah.is_correct,
                ah.timestamp,
                q.question_data
            FROM answer_history ah
            JOIN questions q ON q.id = ah.question_id
            WHERE ah.user_id = ? AND ah.task_id = ?
            ORDER BY ah.timestamp DESC
            LIMIT ?
        ''', (user_id, task['id'], limit))
        
        history = []
        for row in cursor.fetchall():
            import json
            question_data = json.loads(row['question_data'])
            
            # Получаем текст вопроса в зависимости от типа
            question_text = (
                question_data.get('display_word') or 
                question_data.get('sentence') or 
                question_data.get('phrase') or 
                question_data.get('word') or
                f"Вопрос #{row['id']}"
            )
            
            history.append({
                'id': row['id'],
                'question_text': question_text,
                'user_answer': row['user_answer'],
                'is_correct': bool(row['is_correct']),
                'timestamp': row['timestamp']
            })
    
    return history
@app.get("/task_progress/{session_id}/{task_number}")
def get_task_progress(session_id: str, task_number: int):
    """Получить прогресс по заданию (сколько уникальных вопросов освоено)"""
    user_id = db.get_session_user(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    task = db.get_task(task_number)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    with sqlite3.connect(db.db_path) as conn:
        cursor = conn.cursor()
        
        # Всего вопросов в задании
        cursor.execute('SELECT COUNT(*) FROM questions WHERE task_id = ?', (task['id'],))
        total_questions = cursor.fetchone()[0]
        
        # Вопросы, на которые пользователь ответил хотя бы раз правильно
        cursor.execute('''
            SELECT COUNT(DISTINCT qs.question_id) 
            FROM question_stats qs
            JOIN questions q ON q.id = qs.question_id
            WHERE qs.user_id = ? AND q.task_id = ? AND qs.correct_count > 0
        ''', (user_id, task['id']))
        mastered_questions = cursor.fetchone()[0]
        # backend/app.py - добавить в конец эндпоинта /stats/{session_id}

        # Получаем прогресс по каждому заданию (уникальные освоенные вопросы)
        cursor.execute('''
            SELECT 
                t.task_number,
                COUNT(DISTINCT q.id) as total,
                COUNT(DISTINCT CASE WHEN qs.correct_count > 0 THEN q.id END) as mastered
            FROM tasks t
            JOIN questions q ON q.task_id = t.id
            LEFT JOIN question_stats qs ON qs.question_id = q.id AND qs.user_id = ?
            GROUP BY t.id
        ''', (user_id,))

        task_progress = {}
        for row in cursor.fetchall():
            task_num = row[0]
            total = row[1]
            mastered = row[2] or 0
            task_progress[task_num] = {
                'total_questions': total,
                'mastered_questions': mastered,
                'remaining_questions': total - mastered,
                'progress_percent': round(mastered / total * 100, 1) if total > 0 else 0
            }
                # Вопросы, на которые пользователь ни разу не ответил правильно
        cursor.execute('''
            SELECT COUNT(DISTINCT q.id)
            FROM questions q
            WHERE q.task_id = ? 
            AND q.id NOT IN (
                SELECT question_id FROM question_stats 
                WHERE user_id = ? AND correct_count > 0
            )
        ''', (task['id'], user_id))
        remaining_questions = cursor.fetchone()[0]
    
    return {
        'task_number': task_number,
        'total_questions': total_questions,
        'mastered_questions': mastered_questions,
        'remaining_questions': remaining_questions,
        'progress_percent': round(mastered_questions / total_questions * 100, 1) if total_questions > 0 else 0,
        'task_progress': task_progress      
    }
@app.post("/login")
def login(user: UserLogin):
    user_data = db.get_or_create_user(user.username)
    session_id = str(uuid.uuid4())
    db.create_session(session_id, user_data['id'])
    return {
        "session_id": session_id,
        "user_id": user_data['id'],
        "username": user_data['username']
    }

@app.get("/tasks")
def get_tasks(session_id: str = Query(...)):
    """Получить список всех заданий"""
    user_id = db.get_session_user(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    return db.get_all_tasks()

# backend/app.py - исправленный эндпоинт

# backend/app.py - полностью исправленный эндпоинт

# backend/app.py - обновить эндпоинт /stats/{session_id}

@app.get("/stats/{session_id}")
def get_user_stats(session_id: str):
    """Получить полную статистику пользователя"""
    user_id = db.get_session_user(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    with sqlite3.connect(db.db_path) as conn:
        cursor = conn.cursor()
        
        # Получаем XP пользователя
        cursor.execute('SELECT total_xp FROM users WHERE id = ?', (user_id,))
        row = cursor.fetchone()
        total_xp = row[0] if row and row[0] is not None else 0
        
        # Общая статистика
        cursor.execute('''
            SELECT 
                COALESCE(SUM(correct_count), 0) as total_correct,
                COALESCE(SUM(wrong_count), 0) as total_wrong
            FROM question_stats
            WHERE user_id = ?
        ''', (user_id,))
        row = cursor.fetchone()
        total_correct = row[0] if row else 0
        total_wrong = row[1] if row else 0
        accuracy = round(total_correct / (total_correct + total_wrong) * 100, 1) if (total_correct + total_wrong) > 0 else 0
        
        # Статистика за сегодня
        from datetime import date
        today = date.today().isoformat()
        cursor.execute('''
            SELECT 
                COUNT(CASE WHEN is_correct = 1 THEN 1 END) as today_correct,
                COUNT(CASE WHEN is_correct = 0 THEN 1 END) as today_wrong
            FROM answer_history
            WHERE user_id = ? AND DATE(timestamp) = ?
        ''', (user_id, today))
        row = cursor.fetchone()
        today_correct = row[0] if row else 0
        today_wrong = row[1] if row else 0
        
        # Получаем ранг
        rank_info = get_rank_by_xp(total_xp)
        
        # ========== НОВАЯ СТАТИСТИКА ПО ЗАДАНИЯМ (уникальные освоенные вопросы) ==========
        cursor.execute('''
            SELECT 
                t.task_number,
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT CASE WHEN qs.correct_count > 0 THEN q.id END) as mastered_questions
            FROM tasks t
            JOIN questions q ON q.task_id = t.id
            LEFT JOIN question_stats qs ON qs.question_id = q.id AND qs.user_id = ?
            GROUP BY t.id
            ORDER BY t.task_number
        ''', (user_id,))
        
        task_progress = {}
        for row in cursor.fetchall():
            task_num = row[0]
            total = row[1]
            mastered = row[2] or 0
            task_progress[task_num] = {
                'total_questions': total,
                'mastered_questions': mastered,
                'remaining_questions': total - mastered,
                'progress_percent': round(mastered / total * 100, 1) if total > 0 else 0
            }
        
        # Старая статистика по заданиям (количество правильных/неправильных ответов)
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
        task_stats = []
        for row in cursor.fetchall():
            task_stats.append({
                'task_number': row[0],
                'correct': row[1],
                'wrong': row[2],
                'accuracy': round(row[1] / (row[1] + row[2]) * 100, 1) if (row[1] + row[2]) > 0 else 0
            })
        
        # История
        cursor.execute('''
            SELECT 
                q.id as question_id,
                q.question_data,
                ah.user_answer,
                ah.is_correct,
                ah.timestamp
            FROM answer_history ah
            JOIN questions q ON q.id = ah.question_id
            WHERE ah.user_id = ?
            ORDER BY ah.timestamp DESC
            LIMIT 20
        ''', (user_id,))
        recent_history = []
        for row in cursor.fetchall():
            import json
            question_data = json.loads(row[1])
            recent_history.append({
                'question_id': row[0],
                'question_text': question_data.get('display_word') or question_data.get('sentence') or question_data.get('phrase') or question_data.get('word') or f"Вопрос #{row[0]}",
                'user_answer': row[2],
                'is_correct': bool(row[3]),
                'timestamp': row[4]
            })
    
    return {
        'total_correct': total_correct,
        'total_wrong': total_wrong,
        'accuracy': accuracy,
        'today_correct': today_correct,
        'today_wrong': today_wrong,
        'total_xp': total_xp,
        'rank': rank_info,
        'task_stats': task_stats,
        'task_progress': task_progress,  # ← новая статистика
        'recent_history': recent_history
    }
@app.get("/question/random")
def get_random_question(
    task_number: int = Query(...),
    session_id: str = Query(...),
    mode: str = Query("random")
):
    """Получить случайный вопрос для задания"""
    user_id = db.get_session_user(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    question = db.get_random_question(task_number, user_id, mode)
    if not question:
        raise HTTPException(status_code=404, detail="No questions found")
    
    # Получаем статистику пользователя
    stats = db.get_question_stats(user_id, question['id'])
    question['user_stats'] = stats
    
    return question

# backend/app.py - обновить submit_answer

# backend/app.py - эндпоинт /answer

# backend/app.py - обновить submit_answer

# backend/app.py - обновить submit_answer для задания 1

# backend/app.py - обновить submit_answer

@app.post("/answer")
def submit_answer(answer: AnswerSubmit):
    user_id = db.get_session_user(answer.session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    question = db.get_question_by_id(answer.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    user_answer_norm = answer.user_answer.strip().lower()
    
    # Для задания 11 - учитываем вариант "нет буквы"
    if answer.task_number == 11:
        correct_answer = question['correct_answer']
        # Если правильный ответ - пустая строка, а пользователь выбрал "нет буквы"
        if correct_answer == '' and user_answer_norm == 'нет буквы':
            is_correct = True
            correct_answer_display = 'нет буквы'
        else:
            is_correct = user_answer_norm == correct_answer
            correct_answer_display = correct_answer if correct_answer != '' else 'нет буквы'
    else:
        # Для остальных заданий
        correct_answer_norm = question['correct_answer'].strip().lower()
        is_correct = user_answer_norm == correct_answer_norm
        correct_answer_display = question['correct_answer']
    
    xp_earned = 10 if is_correct else 0
    
    db.update_question_stat(user_id, answer.question_id, is_correct)
    db.add_answer_history(user_id, answer.task_number, answer.question_id, answer.user_answer, is_correct)
    
    with sqlite3.connect(db.db_path) as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', (xp_earned, user_id))
        conn.commit()
    
    return {
        "is_correct": is_correct,
        "correct_answer": correct_answer_display,
        "explanation": question.get('explanation'),
        "xp_earned": xp_earned
    }
@app.get("/progress/{session_id}")
def get_progress(session_id: str):
    """Получить прогресс пользователя"""
    user_id = db.get_session_user(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    progress = db.get_user_progress(user_id)
    return {
        "progress": progress,
        "rule_stats": [],
        "recent_history": []
    }

@app.get("/rules")
def get_rules():
    """Получить список правил (для задания 11)"""
    tasks = db.get_all_tasks()
    rules = []
    for task in tasks:
        rules.append({
            "name": f"Задание {task['task_number']}: {task['title']}",
            "word_count": 0,
            "task_number": task['task_number']
        })
    return rules
# backend/app.py - добавить функцию

# backend/app.py - исправленная функция

def get_rank_by_xp(xp: int) -> dict:
    """Определяет ранг по количеству XP"""
    if xp < 10000:
        return {
            "name": "Новичок",
            "icon": "🌱",
            "color": "#9ca3af",
            "current_xp": xp,
            "next_rank_name": "Ученик",
            "xp_to_next": 10000 - xp,
            "total_for_next": 10000
        }
    elif xp < 30000:
        return {
            "name": "Ученик",
            "icon": "📚",
            "color": "#6b7280",
            "current_xp": xp - 100,
            "next_rank_name": "Продолжающий",
            "xp_to_next": 30000 - xp,
            "total_for_next": 20000
        }
    elif xp < 60000:
        return {
            "name": "Продолжающий",
            "icon": "🎓",
            "color": "#3b82f6",
            "current_xp": xp - 300,
            "next_rank_name": "Знаток",
            "xp_to_next": 60000 - xp,
            "total_for_next": 30000
        }
    elif xp < 100000:
        return {
            "name": "Знаток",
            "icon": "⭐",
            "color": "#8b5cf6",
            "current_xp": xp - 60000,
            "next_rank_name": "Мастер",
            "xp_to_next": 100000 - xp,
            "total_for_next": 40000
        }
    else:
        return {
            "name": "Мастер",
            "icon": "🏆",
            "color": "#f59e0b",
            "current_xp": 100000,
            "next_rank_name": None,
            "xp_to_next": 0,
            "total_for_next": 0
        }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)