# backend/parsers/task13_parser.py

def parse_task13(filepath: str) -> list:
    """Парсинг 13.txt - НЕ с частями речи (слитно/раздельно)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: словосочетание;1 или 2; пояснение
        # 1 - раздельно, 2 - слитно
        parts = line.split(';')
        if len(parts) < 2:
            continue
        
        phrase = parts[0].strip()
        answer_code = parts[1].strip()
        explanation = parts[2].strip() if len(parts) > 2 else ""
        
        # Преобразуем код ответа
        if answer_code == '1':
            correct_answer = 'separate'
            answer_text = 'раздельно'
        elif answer_code == '2':
            correct_answer = 'together'
            answer_text = 'слитно'
        else:
            continue
        
        question_data = {
            'phrase': phrase,
            'type': 'not_with_words',
            'task_type': 'choose_two'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation or f'Пишется {answer_text}'
        })
    
    return questions