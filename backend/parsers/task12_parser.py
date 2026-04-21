# backend/parsers/task12_parser.py

import re
import random

def parse_task12(filepath: str) -> list:
    """Парсинг 12.txt - личные окончания глаголов"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: словосочетание;правильная_буква;пояснение
        parts = line.split(';')
        if len(parts) < 2:
            continue
        
        word_part = parts[0].strip()
        correct_letter = parts[1].strip()
        explanation = parts[2].strip() if len(parts) > 2 else None
        
        # Определяем правило для глаголов
        rule = detect_rule_task12(word_part, correct_letter, explanation)
        
        # Генерируем варианты
        options = generate_options_task12(correct_letter)
        
        question_data = {
            'display_word': word_part,
            'correct_letter': correct_letter,
            'options': options,
            'explanation': explanation,
            'rule': rule,
            'task_type': 'verbs'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_letter,
            'explanation': explanation or rule
        })
    
    return questions

def detect_rule_task12(word: str, correct_letter: str, explanation: str = None) -> str:
    """Определяет правило для глаголов"""
    if explanation:
        if '1 спр' in explanation:
            return 'Глаголы 1 спряжения (буквы Е, У, Ю)'
        if '2 спр' in explanation:
            return 'Глаголы 2 спряжения (буквы И, А, Я)'
        if 'искл' in explanation:
            return 'Глаголы-исключения'
        if 'разноспрягаемый' in explanation:
            return 'Разноспрягаемые глаголы'
    
    # Определяем по окончанию
    if correct_letter in ['е', 'у', 'ю']:
        return 'Глаголы 1 спряжения'
    elif correct_letter in ['и', 'а', 'я']:
        return 'Глаголы 2 спряжения'
    
    return 'Личные окончания глаголов'

def generate_options_task12(correct: str) -> list:
    """Генерирует варианты ответов"""
    options = [correct]
    
    # Парные буквы
    if correct in ['е', 'и']:
        options.append('и' if correct == 'е' else 'е')
        options.append('я')
        options.append('ю')
    elif correct in ['у', 'ю']:
        options.append('ю' if correct == 'у' else 'у')
        options.append('а')
        options.append('я')
    elif correct in ['а', 'я']:
        options.append('я' if correct == 'а' else 'а')
        options.append('у')
        options.append('ю')
    else:
        options.append('е')
        options.append('и')
        options.append('а')
    
    # Убираем дубликаты и перемешиваем
    options = list(set(options))
    random.shuffle(options)
    return options[:4]