# backend/parsers/task17_parser.py

import re

def parse_task17(filepath: str, task_number: int) -> list:
    """Парсинг 17-20.txt - выбор позиций запятых"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Ищем строки с *цифры*
        match = re.search(r'^(.*?)\*(\d+)\*$', line)
        if match:
            sentence = match.group(1).strip()
            correct_positions = match.group(2).strip()
            
            # Находим все позиции (1), (2) и т.д.
            positions = re.findall(r'\((\d+)\)', sentence)
            
            if positions:
                question_data = {
                    'sentence': sentence,
                    'positions': [int(p) for p in positions],
                    'type': 'select_positions'
                }
                
                questions.append({
                    'question_data': question_data,
                    'correct_answer': correct_positions,
                    'explanation': f'Запятые на местах: {", ".join(correct_positions)}'
                })
    
    return questions