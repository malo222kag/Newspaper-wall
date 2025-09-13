# ⚡ Быстрый деплой Newspaper Wall

## 🐳 Деплой через Docker (Рекомендуется)

### 1. Клонирование и настройка

```bash
# Клонирование репозитория
git clone https://github.com/your-username/newspaper-wall.git
cd newspaper-wall

# Настройка переменных окружения
cp env.example .env
nano .env  # Отредактируйте настройки
```

### 2. Запуск через Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Выполнение миграций
docker-compose exec web python manage.py migrate --settings=newspaper_wall.settings_production

# Создание суперпользователя
docker-compose exec web python manage.py createsuperuser --settings=newspaper_wall.settings_production

# Загрузка демо-данных
docker-compose exec web python manage.py loaddata fixtures/projects.json --settings=newspaper_wall.settings_production
```

### 3. Проверка работы

```bash
# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f web

# Приложение доступно по адресу: http://localhost
```

## 🚀 Деплой на VPS (Ubuntu)

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y software-properties-common \
    postgresql postgresql-contrib nginx git curl

# Добавление deadsnakes PPA для Python 3.11
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Установка Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3.11-distutils
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

# Альтернатива: если Python 3.11 недоступен
# sudo apt install -y python3 python3-venv python3-dev python3-pip

# Настройка PostgreSQL
sudo -u postgres psql
CREATE DATABASE newspaper_wall;
CREATE USER newspaper_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE newspaper_wall TO newspaper_user;
\q
```

### 2. Развертывание приложения

```bash
# Клонирование репозитория
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/your-username/newspaper-wall.git newspaper_wall
sudo chown -R $USER:$USER /var/www/newspaper_wall
cd /var/www/newspaper_wall

# Настройка виртуального окружения
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Настройка переменных окружения
cp env.example .env
nano .env  # Настройте переменные

# Настройка базы данных
python manage.py migrate --settings=newspaper_wall.settings_production
python manage.py createsuperuser --settings=newspaper_wall.settings_production
python manage.py loaddata fixtures/projects.json --settings=newspaper_wall.settings_production
python manage.py collectstatic --noinput --settings=newspaper_wall.settings_production
```

### 3. Настройка сервисов

```bash
# Настройка Gunicorn
sudo cp newspaper-wall.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable newspaper-wall

# Настройка Nginx
sudo cp nginx_newspaper_wall.conf /etc/nginx/sites-available/newspaper_wall
sudo ln -s /etc/nginx/sites-available/newspaper_wall /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Настройка прав
sudo chown -R www-data:www-data /var/www/newspaper_wall
sudo chmod -R 755 /var/www/newspaper_wall
sudo chmod +x /var/www/newspaper_wall/deploy.sh
```

### 4. Запуск

```bash
# Запуск сервисов
sudo systemctl start newspaper-wall
sudo systemctl start nginx

# Проверка статуса
sudo systemctl status newspaper-wall
sudo systemctl status nginx
```

## 🔄 Обновление приложения

### Docker

```bash
# Обновление кода
git pull origin main

# Пересборка и перезапуск
docker-compose down
docker-compose up -d --build

# Выполнение миграций
docker-compose exec web python manage.py migrate --settings=newspaper_wall.settings_production
```

### VPS

```bash
# Использование скрипта деплоя
cd /var/www/newspaper_wall
./deploy.sh
```

## 🔧 Настройка домена

### 1. DNS настройки

Добавьте A-запись в DNS:
```
your-domain.com -> YOUR_SERVER_IP
www.your-domain.com -> YOUR_SERVER_IP
```

### 2. Обновление конфигурации

```bash
# Обновление .env файла
nano .env
# Измените ALLOWED_HOSTS на ваш домен

# Обновление Nginx конфигурации
sudo nano /etc/nginx/sites-available/newspaper_wall
# Измените server_name на ваш домен

# Перезапуск сервисов
sudo systemctl restart newspaper-wall
sudo systemctl restart nginx
```

## 🔒 SSL сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Мониторинг

```bash
# Проверка логов
sudo journalctl -u newspaper-wall -f
sudo tail -f /var/log/nginx/error.log

# Проверка ресурсов
htop
df -h
free -h

# Проверка портов
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :8000
```

## 🎉 Готово!

Ваше приложение развернуто и доступно по адресу:
- **HTTP**: http://your-domain.com
- **Админка**: http://your-domain.com/admin/

### Следующие шаги:

1. ✅ Настройте домен в DNS
2. ✅ Получите SSL сертификат
3. ✅ Настройте мониторинг
4. ✅ Создайте регулярные бэкапы
5. ✅ Настройте уведомления об ошибках

### Полезные команды:

```bash
# Перезапуск приложения
sudo systemctl restart newspaper-wall

# Просмотр логов
sudo journalctl -u newspaper-wall -f

# Обновление приложения
cd /var/www/newspaper_wall && ./deploy.sh

# Бэкап базы данных
sudo -u postgres pg_dump newspaper_wall > backup.sql
```
