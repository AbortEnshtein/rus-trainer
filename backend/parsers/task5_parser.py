# backend/parsers/task5_parser.py

def parse_task5(filepath: str) -> list:
    """Парсинг 5.txt - паронимы (верно/неверно)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: словосочетание;1; или словосочетание;правильное_слово;
        parts = line.split(';')
        if len(parts) < 2:
            continue
        
        phrase = parts[0].strip()
        correct_word = parts[1].strip()
        
        # Определяем, верно ли употребление
        # Если correct_word == '1' или число - значит верно, иначе нужно исправление
        if correct_word == '1' or correct_word.isdigit():
            correct_answer = 'yes'
            explanation = f'В словосочетании "{phrase}" слово употреблено ВЕРНО'
        else:
            correct_answer = 'no'
            explanation = f'В словосочетании "{phrase}" слово употреблено НЕВЕРНО. Правильно: {correct_word}'
        
        question_data = {
            'phrase': phrase,
            'type': 'paronyms',
            'task_type': 'yes_no'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation
        })
    
    return questions