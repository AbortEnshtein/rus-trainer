# backend/parsers/task4_parser.py

import random

def parse_task4(filepath: str) -> list:
    """Парсинг 4.txt - ударение (верно/неверно)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: слово,1 или слово,2
        # 1 - правильно, 2 - неправильно
        parts = line.split(',')
        if len(parts) < 2:
            continue
        
        word = parts[0].strip()
        is_correct = parts[1].strip()
        
        # Определяем, верное ли ударение
        if is_correct == '1':
            correct_answer = 'yes'
            explanation = f'В слове "{word}" ударение поставлено ВЕРНО'
        else:
            correct_answer = 'no'
            explanation = f'В слове "{word}" ударение поставлено НЕВЕРНО'
        
        question_data = {
            'word': word,
            'type': 'stress',
            'task_type': 'yes_no'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation
        })
    
    return questions