# backend/parsers/task16_parser.py

import re

def parse_task16(filepath: str, task_number: int = None) -> list:
    """Парсинг 16.txt - выбор количества запятых (0, 1, много)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: предложение.*цифра*пояснение
        match = re.search(r'^(.*?)\*(\d+)\*(.*?)$', line)
        if match:
            sentence = match.group(1).strip()
            comma_count = match.group(2).strip()
            explanation = match.group(3).strip()
            
            # Преобразуем количество запятых в ответ
            if comma_count == '0':
                answer = '0'
                answer_text = '0 запятых'
            elif comma_count == '1':
                answer = '1'
                answer_text = '1 запятая'
            else:
                answer = '2'
                answer_text = 'много запятых'
            
            question_data = {
                'sentence': sentence,
                'type': 'select_comma_count',
                'explanation': explanation,
                'correct_count': comma_count
            }
            
            questions.append({
                'question_data': question_data,
                'correct_answer': answer,
                'explanation': f'В этом предложении нужно поставить {answer_text}. {explanation}'
            })
    
    return questions