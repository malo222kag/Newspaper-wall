#!/bin/bash
# Скрипт для очистки дублированных статических файлов

echo "🧹 Очистка дублированных статических файлов..."

# Очищаем папку staticfiles/wall
if [ -d "staticfiles/wall" ]; then
    echo "Удаляем дублированные файлы из staticfiles/wall/"
    rm -rf staticfiles/wall/*.js
    rm -rf staticfiles/wall/*.css
    rm -rf staticfiles/wall/*.gz
    echo "✅ Дублированные файлы удалены"
else
    echo "Папка staticfiles/wall не найдена"
fi

# Собираем статические файлы заново
echo "📦 Собираем статические файлы..."
python manage.py collectstatic --noinput

echo "✅ Готово! Дубли больше не будут создаваться"
