# backend/parsers/task15_parser.py

def parse_task15(filepath: str) -> list:
    """Парсинг 15.txt - Н/НН в суффиксах"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: слово;н/нн; пояснение
        parts = line.split(';')
        if len(parts) < 2:
            continue
        
        word = parts[0].strip()
        answer_code = parts[1].strip()
        explanation = parts[2].strip() if len(parts) > 2 else ""
        
        # Преобразуем код ответа
        if answer_code == 'н':
            correct_answer = 'n'
            answer_text = 'Н'
        elif answer_code == 'нн':
            correct_answer = 'nn'
            answer_text = 'НН'
        else:
            continue
        
        question_data = {
            'word': word,
            'type': 'nn_suffixes',
            'task_type': 'choose_two'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation or f'Пишется {answer_text}'
        })
    
    return questions