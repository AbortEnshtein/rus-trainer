# backend/parsers/task14_parser.py

def parse_task14(filepath: str) -> list:
    """Парсинг 14.txt - слитное/дефисное/раздельное написание"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: словосочетание;1/2/3; пояснение
        # 1 - слитно, 2 - раздельно, 3 - через дефис
        parts = line.split(';')
        if len(parts) < 2:
            continue
        
        phrase = parts[0].strip()
        answer_code = parts[1].strip()
        explanation = parts[2].strip() if len(parts) > 2 else ""
        
        # Преобразуем код ответа
        if answer_code == '1':
            correct_answer = 'together'
            answer_text = 'слитно'
        elif answer_code == '2':
            correct_answer = 'separate'
            answer_text = 'раздельно'
        elif answer_code == '3':
            correct_answer = 'hyphen'
            answer_text = 'через дефис'
        else:
            continue
        
        question_data = {
            'phrase': phrase,
            'type': 'compound_words',
            'task_type': 'choose_three'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation or f'Пишется {answer_text}'
        })
    
    return questions