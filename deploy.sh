#!/bin/bash

# Скрипт развертывания с HTTPS

echo "🚀 Развертывание с HTTPS поддержкой"

# Активируем виртуальное окружение
source .venv/bin/activate

# Обновляем код
git pull origin main

# Устанавливаем зависимости
pip install -r requirements.txt

# Собираем статические файлы
python manage.py collectstatic --noinput

# Применяем миграции
python manage.py migrate

# Создаем директории для логов
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/run/gunicorn
sudo chown -R ubuntu:ubuntu /var/log/gunicorn
sudo chown -R ubuntu:ubuntu /var/run/gunicorn

# Копируем systemd сервис
sudo cp zuif.service /etc/systemd/system/
sudo systemctl daemon-reload

# Останавливаем старый сервис
sudo systemctl stop zuif.service 2>/dev/null || true

# Запускаем новый сервис с HTTPS
sudo systemctl start zuif.service
sudo systemctl enable zuif.service

# Проверяем статус
sudo systemctl status zuif.service

echo "✅ Развертывание завершено!"
echo "🌐 Сайт доступен по HTTPS: https://zuif.ru"
echo "📊 Статус: sudo systemctl status zuif.service"
echo "📝 Логи: sudo journalctl -u zuif.service -f"
