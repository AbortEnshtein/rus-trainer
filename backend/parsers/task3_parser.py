# backend/parsers/task3_parser.py

import re

def parse_task3(filepath: str) -> list:
    """Парсинг 3.txt - выбор верных характеристик текста"""
    questions = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Разбиваем по "ТЕКСТ"
    sections = content.split('ТЕКСТ')
    
    for section in sections:
        if not section.strip():
            continue
        
        # Ищем сам текст (до "ХАРАКТЕРИСТИКИ")
        text_match = re.search(r'^(.*?)ХАРАКТЕРИСТИКИ', section, re.DOTALL)
        if not text_match:
            continue
        
        text = text_match.group(1).strip()
        
        # Ищем характеристики (1) ... 2) ... 3) ... и ответ
        chars_section = section[text_match.end():]
        
        # Извлекаем все характеристики
        characteristics = []
        char_matches = re.findall(r'(\d+)\)\s*(.*?)(?=\n\d+\)|\nОтвет:|$)', chars_section, re.DOTALL)
        
        for num, char_text in char_matches:
            characteristics.append({
                'number': int(num),
                'text': char_text.strip()
            })
        
        # Ищем ответ (после "Ответ:")
        answer_match = re.search(r'Ответ:\s*(\d+)', chars_section)
        if not answer_match:
            continue
        
        correct_answers = answer_match.group(1).strip()
        # Преобразуем "1345" в список [1,3,4,5]
        correct_list = [int(d) for d in correct_answers]
        
        print(f"  Найден текст с ответами: {correct_list}")  # Отладка
        
        # Формируем вопрос
        question_data = {
            'text': text,
            'characteristics': characteristics,
            'correct_list': correct_list,  # ← Сохраняем список
            'correct_answers_str': correct_answers,  # ← Сохраняем строку
            'type': 'select_multiple',
            'task_type': 'choose_characteristics'
        }
        
        questions.append({
            'question_data': question_data,
            'correct_answer': correct_answers,
            'explanation': f'Правильные ответы: {", ".join(str(c) for c in correct_list)}'
        })
    
    print(f"  Задание 3: обработано {len(questions)} текстов")
    return questions