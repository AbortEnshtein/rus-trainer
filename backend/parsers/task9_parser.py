# backend/parsers/task9_parser.py

import re
import random

def parse_task9(filepath: str) -> list:
    """Парсинг 9.txt - правописание корней"""
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
        
        # Определяем правило для корней
        rule = detect_rule_task9(word_part, correct_letter)
        
        # Генерируем варианты
        options = generate_options_task9(correct_letter)
        
        question_data = {
            'display_word': word_part,
            'correct_letter': correct_letter,
            'options': options,
            'explanation': explanation,
            'rule': rule,
            'task_type': 'roots'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_letter,
            'explanation': explanation or rule
        })
    
    return questions

def detect_rule_task9(word: str, correct_letter: str) -> str:
    """Определяет правило для корней"""
    # Чередующиеся корни
    if 'бир' in word or 'бер' in word:
        return 'Корни с чередованием -бир-/-бер-'
    if 'тир' in word or 'тер' in word:
        return 'Корни с чередованием -тир-/-тер-'
    if 'мир' in word or 'мер' in word:
        return 'Корни с чередованием -мир-/-мер-'
    if 'стил' in word or 'стел' in word:
        return 'Корни с чередованием -стил-/-стел-'
    if 'жиг' in word or 'жег' in word:
        return 'Корни с чередованием -жиг-/-жег-'
    if 'кос' in word or 'кас' in word:
        return 'Корни с чередованием -кос-/-кас-'
    if 'лож' in word or 'лаг' in word:
        return 'Корни с чередованием -лож-/-лаг-'
    if 'раст' in word or 'ращ' in word or 'рос' in word:
        return 'Корни с чередованием -раст-/-ращ-/-рос-'
    if 'скак' in word or 'скоч' in word:
        return 'Корни с чередованием -скак-/-скоч-'
    if 'плав' in word:
        return 'Корень -плав-'
    if 'равн' in word or 'ровн' in word:
        return 'Корни -равн-/-ровн-'
    if 'мак' in word or 'мок' in word:
        return 'Корни -мак-/-мок-'
    return 'Правописание корней'

def generate_options_task9(correct: str) -> list:
    """Генерирует варианты ответов"""
    if correct == '':
        return ['нет буквы', 'а', 'о', 'и']
    
    options = [correct]
    
    # Парные буквы
    pairs = {
        'а': 'о', 'о': 'а',
        'и': 'е', 'е': 'и',
        'я': 'а', 'ю': 'у'
    }
    
    if correct in pairs:
        options.append(pairs[correct])
    
    # Добавляем отвлекающие варианты
    distractors = ['а', 'о', 'и', 'е', 'я']
    for d in distractors:
        if d not in options and len(options) < 4:
            options.append(d)
    
    random.shuffle(options)
    return options[:4]