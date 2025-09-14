#!/bin/bash

# Скрипт для настройки SSL сертификата

echo "🔐 Настройка SSL сертификата для zuif.ru"

# Обновляем систему
sudo apt update

# Устанавливаем certbot
sudo apt install -y certbot python3-certbot-nginx

# Останавливаем nginx
sudo systemctl stop nginx

# Получаем SSL сертификат
sudo certbot certonly --standalone -d zuif.ru -d www.zuif.ru

# Копируем конфигурацию nginx
sudo cp nginx.conf /etc/nginx/sites-available/zuif.ru
sudo ln -sf /etc/nginx/sites-available/zuif.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
sudo nginx -t

# Запускаем nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Настраиваем автообновление сертификата
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ SSL сертификат настроен!"
echo "🌐 Сайт доступен по HTTPS: https://zuif.ru"
