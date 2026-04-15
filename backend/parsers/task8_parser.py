# backend/parsers/task8_parser.py

import re

def parse_task8(filepath: str) -> list:
    """Парсинг 8.txt - грамматические ошибки (сопоставление)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    i = 0
    total_lines = len(lines)
    
    while i < total_lines:
        line = lines[i].strip()
        
        # Ищем начало блока: "ГРАММАТИЧЕСКИЕ ОШИБКИ"
        if line == 'ГРАММАТИЧЕСКИЕ ОШИБКИ':
            i += 1
            
            # Парсим 5 ошибок (А, Б, В, Г, Д)
            errors = {}
            errors_count = 0
            while errors_count < 5 and i < total_lines:
                error_line = lines[i].strip()
                if error_line and len(error_line) > 2 and error_line[1] == ')':
                    letter = error_line[0]
                    description = error_line[2:].strip()
                    errors[letter] = description
                    errors_count += 1
                i += 1
            
            # Пропускаем пустые строки
            while i < total_lines and not lines[i].strip():
                i += 1
            
            # Ищем "ПРЕДЛОЖЕНИЯ"
            if i < total_lines and lines[i].strip() == 'ПРЕДЛОЖЕНИЯ':
                i += 1
                
                # Парсим 9 предложений
                sentences = {}
                sentences_count = 0
                while sentences_count < 9 and i < total_lines:
                    sent_line = lines[i].strip()
                    if sent_line and len(sent_line) > 2 and sent_line[1] == ')':
                        num = int(sent_line[0])
                        text = sent_line[2:].strip()
                        sentences[num] = text
                        sentences_count += 1
                    i += 1
                
                # Пропускаем пустые строки
                while i < total_lines and not lines[i].strip():
                    i += 1
                
                # Ищем "ОТВЕТ:" - может быть на текущей строке или следующей
                answer = None
                if i < total_lines:
                    answer_line = lines[i].strip()
                    if answer_line.startswith('ОТВЕТ:'):
                        match = re.search(r'ОТВЕТ:\s*(\d+)', answer_line)
                        if match:
                            answer = match.group(1)
                        i += 1
                    # Проверяем, может ответ на следующей строке
                    elif i + 1 < total_lines and lines[i + 1].strip().isdigit():
                        answer = lines[i + 1].strip()
                        i += 2
                    else:
                        # Пропускаем пустые строки и ищем ответ дальше
                        while i < total_lines and not lines[i].strip():
                            i += 1
                        if i < total_lines and lines[i].strip().isdigit():
                            answer = lines[i].strip()
                            i += 1
                        elif i < total_lines and lines[i].strip().startswith('ОТВЕТ:'):
                            match = re.search(r'ОТВЕТ:\s*(\d+)', lines[i].strip())
                            if match:
                                answer = match.group(1)
                            i += 1
                
                if answer and len(errors) == 5 and len(sentences) >= 9:
                    # Преобразуем "43827" в словарь
                    correct_map = {}
                    letters = ['А', 'Б', 'В', 'Г', 'Д']
                    for j, letter in enumerate(letters):
                        if j < len(answer):
                            correct_map[letter] = int(answer[j])
                    
                    question_data = {
                        'errors': errors,
                        'sentences': sentences,
                        'type': 'match',
                        'task_type': 'match_errors'
                    }
                    
                    questions.append({
                        'question_data': question_data,
                        'correct_answer': answer,
                        'correct_map': correct_map,
                        'explanation': f'Правильные ответы: А-{correct_map["А"]}, Б-{correct_map["Б"]}, В-{correct_map["В"]}, Г-{correct_map["Г"]}, Д-{correct_map["Д"]}'
                    })
                else:
                    pass
        else:
            i += 1
    return questions