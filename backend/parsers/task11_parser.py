# backend/parsers/task11_parser.py

import re
import random

def parse_task11(filepath: str) -> list:
    """Парсинг 11.txt для задания 11 (правописание суффиксов)"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Формат: слово_с_пропуском,правильная_буква
        # Пример: замоч_к,е
        parts = line.split(',')
        if len(parts) < 2:
            continue
        
        word_part = parts[0].strip()
        correct_letter = parts[1].strip()
        
        # Обработка дефиса (пустая буква)
        if correct_letter == '-':
            correct_letter = ''
        
        # Извлекаем пояснение из скобок
        explanation = None
        if '(' in word_part and ')' in word_part:
            match = re.search(r'\((.*?)\)', word_part)
            if match:
                explanation = match.group(1)
                word_part = re.sub(r'\s*\(.*?\)', '', word_part)
        
        # Определяем правило
        rule = detect_rule(word_part, correct_letter)
        
        # Генерируем варианты ответов
        options = generate_options(correct_letter)
        
        question_data = {
            'display_word': word_part,
            'correct_letter': correct_letter,
            'options': options,
            'explanation': explanation,
            'rule': rule,
            'has_no_letter': correct_letter == ''
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_letter,
            'explanation': explanation or rule
        })
    
    return questions

def detect_rule(word: str, correct_letter: str) -> str:
    """Определяет правило на основе слова"""
    if '_к' in word and correct_letter in ['е', 'и']:
        return 'Суффиксы -ек-/-ик-'
    if '_чик' in word or '_щик' in word:
        return 'Суффиксы -чик-/-щик-'
    if '_ц' in word:
        return 'Суффиксы -ец-/-иц-'
    if '_ив' in word or '_ев' in word:
        return 'Суффиксы -ив-/-ев-'
    if '_чив' in word:
        return 'Суффикс -чив-'
    if '_оват' in word or '_еват' in word:
        return 'Суффиксы -оват-/-еват-'
    if '_ва' in word:
        return 'Суффиксы -ыва-/-ива-'
    if word.endswith('_'):
        return 'Наречия (О/А на конце)'
    return 'Правописание суффиксов'

def generate_options(correct: str) -> list:
    """Генерирует 4 варианта ответа"""
    if correct == '':
        return ['нет буквы', 'е', 'и', 'о']
    
    options = [correct]
    
    # Парные буквы
    pairs = {
        'е': 'и', 'и': 'е',
        'о': 'е', 'а': 'я',
        'ч': 'щ', 'щ': 'ч',
        'у': 'ю', 'ю': 'у',
        'ы': 'и', 'и': 'ы'
    }
    
    if correct in pairs:
        options.append(pairs[correct])
    
    # Добавляем отвлекающие варианты
    distractors = ['е', 'и', 'о', 'а', 'я']
    for d in distractors:
        if d not in options and len(options) < 4:
            options.append(d)
    
    random.shuffle(options)
    return options[:4]