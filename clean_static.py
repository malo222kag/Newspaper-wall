#!/usr/bin/env python3
"""
Скрипт для очистки дублированных статических файлов
"""
import os
import shutil
from pathlib import Path

def clean_static_files():
    """Очищает дублированные статические файлы"""
    staticfiles_dir = Path('staticfiles')
    
    if not staticfiles_dir.exists():
        print("Папка staticfiles не найдена")
        return
    
    # Очищаем папку wall в staticfiles
    wall_dir = staticfiles_dir / 'wall'
    if wall_dir.exists():
        print(f"Очищаем папку {wall_dir}")
        shutil.rmtree(wall_dir)
        wall_dir.mkdir()
        print("Папка очищена")
    
    print("Дублированные файлы удалены")

if __name__ == '__main__':
    clean_static_files()
