# backend/parsers/task10_parser.py

import re
import random

def parse_task10(filepath: str) -> list:
    """Парсинг 10.txt - правописание приставок"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: слово_с_пропуском,правильная_буква
        parts = line.split(',')
        if len(parts) < 2:
            continue
        
        word_part = parts[0].strip()
        correct_letter = parts[1].strip()
        
        # Извлекаем пояснение из скобок
        explanation = None
        if '(' in word_part and ')' in word_part:
            match = re.search(r'\((.*?)\)', word_part)
            if match:
                explanation = match.group(1)
                word_part = re.sub(r'\s*\(.*?\)', '', word_part)
        
        # Определяем правило для приставок
        rule = detect_rule_task10(word_part, correct_letter)
        
        # Генерируем варианты в зависимости от правила
        options = generate_options_task10(correct_letter, rule)
        
        question_data = {
            'display_word': word_part,
            'correct_letter': correct_letter,
            'options': options,
            'explanation': explanation,
            'rule': rule,
            'task_type': 'prefixes'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_letter,
            'explanation': explanation or rule
        })
    
    return questions

def detect_rule_task10(word: str, correct_letter: str) -> str:
    """Определяет правило для приставок"""
    # Приставки на З/С
    if correct_letter in ['з', 'с']:
        return 'Приставки на -з/-с'
    
    # Приставки ПРЕ/ПРИ
    if correct_letter in ['е', 'и']:
        # Проверяем по слову
        if word.startswith(('пре', 'пр')):
            return 'Приставки ПРЕ-/ПРИ-'
    
    # Буквы Ы/И после приставок
    if correct_letter in ['ы', 'и']:
        return 'Буквы Ы/И после приставок'
    
    # Разделительные Ъ и Ь
    if correct_letter in ['ъ', 'ь']:
        return 'Разделительные Ъ и Ь'
    
    return 'Правописание приставок'

def generate_options_task10(correct: str, rule: str) -> list:
    """Генерирует варианты ответов в зависимости от правила"""
    
    # Приставки на З/С
    if rule == 'Приставки на -з/-с':
        options = ['з', 'с']
        # Добавляем отвлекающие варианты
        distractors = ['а', 'о', 'е', 'и']
        for d in distractors:
            if d not in options and len(options) < 4:
                options.append(d)
        random.shuffle(options)
        return options
    
    # Приставки ПРЕ-/ПРИ-
    elif rule == 'Приставки ПРЕ-/ПРИ-':
        options = ['е', 'и']
        # Добавляем отвлекающие варианты
        distractors = ['а', 'о', 'ы']
        for d in distractors:
            if d not in options and len(options) < 4:
                options.append(d)
        random.shuffle(options)
        return options
    
    # Буквы Ы/И после приставок
    elif rule == 'Буквы Ы/И после приставок':
        options = ['ы', 'и']
        # Добавляем отвлекающие варианты
        distractors = ['е', 'а', 'о']
        for d in distractors:
            if d not in options and len(options) < 4:
                options.append(d)
        random.shuffle(options)
        return options
    
    # Разделительные Ъ и Ь
    elif rule == 'Разделительные Ъ и Ь':
        options = ['ъ', 'ь']
        # Добавляем отвлекающие варианты
        distractors = ['е', 'и', 'а']
        for d in distractors:
            if d not in options and len(options) < 4:
                options.append(d)
        random.shuffle(options)
        return options
    
    # Общий случай
    else:
        options = [correct]
        # Парные буквы
        pairs = {
            'з': 'с', 'с': 'з',
            'е': 'и', 'и': 'е',
            'ы': 'и', 'и': 'ы',
            'ъ': 'ь', 'ь': 'ъ'
        }
        
        if correct in pairs:
            options.append(pairs[correct])
        
        # Добавляем отвлекающие варианты
        distractors = ['а', 'о', 'е', 'и', 'ы', 'ъ', 'ь']
        for d in distractors:
            if d not in options and len(options) < 4:
                options.append(d)
        
        random.shuffle(options)
        return options[:4]