# backend/parsers/task7_parser.py

def parse_task7(filepath: str) -> list:
    """Парсинг 7.txt - морфологические нормы (верно/неверно)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: слово/словосочетание;1; или слово;правильная_форма;
        parts = line.split(';')
        if len(parts) < 2:
            continue
        
        word_form = parts[0].strip()
        correct_form = parts[1].strip()
        
        # Определяем, верна ли форма
        if correct_form == '1' or correct_form == 'запомнить' or correct_form.isdigit():
            correct_answer = 'yes'
            explanation = f'Форма "{word_form}" употреблена ВЕРНО'
        else:
            correct_answer = 'no'
            explanation = f'Форма "{word_form}" употреблена НЕВЕРНО. Правильно: {correct_form}'
        
        question_data = {
            'word_form': word_form,
            'type': 'morphology',
            'task_type': 'yes_no'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation
        })
    
    return questions