# backend/check_file.py

with open("./parsers/8.txt", 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
print(f"Всего строк в файле: {len(lines)}")
print("\nПервые 30 строк:")
print("="*50)
for i, line in enumerate(lines[:30]):
    print(f"{i+1}: {line.rstrip()}")