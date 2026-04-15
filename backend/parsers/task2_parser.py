# backend/parsers/task2_parser.py

import re

def parse_task2(filepath: str) -> list:
    """Парсинг 2.txt - лексическое значение слова (верно/неверно)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: предложение.|СЛОВО. Определение...*в* или *н*
        # Пример: Снова открылись передо мной торжественные ансамбли...|АНСАМБЛЬ. Исполнительский коллектив...*н*
        
        if '|' not in line:
            continue
        
        parts = line.split('|')
        if len(parts) < 2:
            continue
        
        sentence = parts[0].strip()
        rest = parts[1].strip()
        
        # Ищем слово (заглавными буквами) до точки
        word_match = re.match(r'^([А-ЯЁ]+)\.', rest)
        if not word_match:
            continue
        
        word = word_match.group(1)
        
        # Ищем определение (всё после точки до *)
        def_match = re.search(r'^[А-ЯЁ]+\.\s*(.*?)\*([вн])\*$', rest)
        if not def_match:
            continue
        
        definition = def_match.group(1).strip()
        is_correct = def_match.group(2)
        
        # Определяем, верно ли значение
        if is_correct == 'в':
            correct_answer = 'yes'
            explanation = f'ВЕРНО: В данном контексте слово "{word}" означает: {definition}'
        else:
            correct_answer = 'no'
            explanation = f'НЕВЕРНО: В данном контексте слово "{word}" НЕ означает: {definition}'
        
        question_data = {
            'sentence': sentence,
            'word': word,
            'definition': definition,
            'is_correct': is_correct == 'в',
            'type': 'lexical_meaning',
            'task_type': 'yes_no_with_hint'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answer,
            'explanation': explanation
        })
    
    return questions