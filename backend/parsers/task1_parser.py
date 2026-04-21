# backend/parsers/task1_parser.py

import re

def parse_task1(filepath: str) -> list:
    """Парсинг 1.txt - средства связи предложений (ввод слова)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: термин*предложение_с_пропуском*правильный_вариант
        parts = line.split('*')
        if len(parts) < 3:
            continue
        
        term = parts[0].strip()
        sentence = parts[1].strip()
        correct_answers_raw = parts[2].strip()
        
        # Пропуск теперь обозначается символом |
        # Заменяем | на … для отображения
        sentence_display = sentence.replace('|', '…')
        
        # Разбиваем правильные ответы (могут быть через /)
        if '/' in correct_answers_raw:
            correct_answers_list = [ans.strip().lower() for ans in correct_answers_raw.split('/')]
        else:
            correct_answers_list = [correct_answers_raw.strip().lower()]
        
        question_data = {
            'term': term,
            'sentence': sentence_display,  # Для отображения с …
            'sentence_raw': sentence,       # Оригинал с | для парсинга
            'type': 'fill_in',
            'task_type': 'text_input',
            'correct_answers_list': correct_answers_list
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answers_raw,
            'correct_answers_list': correct_answers_list,
            'explanation': f'Правильный Ответ:{correct_answers_raw}. {term}'
        })
    
    print(f"  Задание 1: обработано {len(questions)} вопросов")
    return questions