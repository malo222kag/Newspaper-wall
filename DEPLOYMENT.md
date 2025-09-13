# 🚀 Деплой Newspaper Wall на сервер

Полное руководство по развертыванию Django приложения "Block Newspaper Wall" на продакшен сервере.

## 📋 Требования к серверу

- **ОС**: Ubuntu 20.04+ или CentOS 8+
- **RAM**: Минимум 1GB (рекомендуется 2GB+)
- **CPU**: 1 ядро (рекомендуется 2+)
- **Диск**: Минимум 10GB свободного места
- **Python**: 3.11+
- **PostgreSQL**: 12+
- **Nginx**: 1.18+
- **Redis**: 6+ (опционально, для кэширования)

## 🔧 Подготовка сервера

### 1. Обновление системы

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 2. Установка необходимых пакетов

#### Ubuntu/Debian - Установка Python 3.11

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y software-properties-common \
    postgresql postgresql-contrib nginx redis-server \
    git curl wget build-essential libpq-dev

# Добавление deadsnakes PPA для Python 3.11
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Установка Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3.11-distutils

# Установка pip для Python 3.11
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

# Альтернатива: если Python 3.11 недоступен, используйте доступную версию
# sudo apt install -y python3 python3-venv python3-dev python3-pip
```

#### CentOS/RHEL

```bash
sudo yum install -y python3.11 python3.11-pip python3.11-devel \
    postgresql postgresql-server postgresql-devel nginx redis \
    git curl wget gcc gcc-c++ make
```

### 3. Настройка PostgreSQL

```bash
# Создание базы данных
sudo -u postgres psql
CREATE DATABASE newspaper_wall;
CREATE USER newspaper_user WITH PASSWORD 'FanDinhDuy1994MuhinaAnna.';
GRANT ALL PRIVILEGES ON DATABASE newspaper_wall TO newspaper_user;
\q
```

### 4. Настройка Redis (опционально)

```bash
# Ubuntu/Debian
sudo systemctl start redis-server
sudo systemctl enable redis-server

# CentOS/RHEL
sudo systemctl start redis
sudo systemctl enable redis
```

## 📁 Развертывание приложения

### 1. Клонирование репозитория

```bash
# Создание директории для приложения
sudo mkdir -p /var/www
cd /var/www

# Клонирование репозитория
sudo git clone https://github.com/your-username/newspaper-wall.git newspaper_wall
sudo chown -R $USER:$USER /var/www/newspaper_wall
cd /var/www/newspaper_wall
```

### 2. Настройка виртуального окружения

```bash
# Создание виртуального окружения
python3.11 -m venv .venv
source .venv/bin/activate

# Установка зависимостей
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Настройка переменных окружения

```bash
# Копирование примера конфигурации
cp env.example .env

# Редактирование конфигурации
nano .env
```

**Настройте следующие переменные в `.env`:**

```env
SECRET_KEY=your-super-secret-key-here-generate-new-one
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-server-ip

DB_NAME=newspaper_wall
DB_USER=newspaper_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://127.0.0.1:6379/1
```

### 4. Настройка базы данных

```bash
# Активация виртуального окружения
source .venv/bin/activate

# Выполнение миграций
python manage.py migrate --settings=newspaper_wall.settings_production

# Создание суперпользователя
python manage.py createsuperuser --settings=newspaper_wall.settings_production

# Загрузка демо-данных (опционально)
python manage.py loaddata fixtures/projects.json --settings=newspaper_wall.settings_production

# Сбор статических файлов
python manage.py collectstatic --noinput --settings=newspaper_wall.settings_production
```

## ⚙️ Настройка сервисов

### 1. Настройка Gunicorn

```bash
# Копирование systemd сервиса
sudo cp newspaper-wall.service /etc/systemd/system/

# Перезагрузка systemd
sudo systemctl daemon-reload

# Включение автозапуска
sudo systemctl enable newspaper-wall
```

### 2. Настройка Nginx

```bash
# Копирование конфигурации Nginx
sudo cp nginx_newspaper_wall.conf /etc/nginx/sites-available/newspaper_wall

# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/newspaper_wall /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации
sudo rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 3. Настройка прав доступа

```bash
# Установка правильных прав
sudo chown -R www-data:www-data /var/www/newspaper_wall
sudo chmod -R 755 /var/www/newspaper_wall
sudo chmod +x /var/www/newspaper_wall/deploy.sh

# Создание директорий для логов
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/run/gunicorn
sudo chown -R www-data:www-data /var/log/gunicorn
sudo chown -R www-data:www-data /var/run/gunicorn
```

## 🚀 Запуск приложения

### 1. Запуск сервисов

```bash
# Запуск Gunicorn
sudo systemctl start newspaper-wall

# Запуск Nginx
sudo systemctl start nginx

# Проверка статуса
sudo systemctl status newspaper-wall
sudo systemctl status nginx
```

### 2. Проверка работы

```bash
# Проверка локально
curl http://localhost/

# Проверка логов
sudo journalctl -u newspaper-wall -f
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Автоматический деплой

Используйте скрипт `deploy.sh` для автоматического обновления:

```bash
# Запуск деплоя
./deploy.sh
```

Скрипт автоматически:
- Создает бэкап текущей версии
- Останавливает сервисы
- Обновляет код из Git
- Устанавливает зависимости
- Выполняет миграции
- Собирает статические файлы
- Перезапускает сервисы
- Проверяет работоспособность

## 🔒 Настройка SSL (Let's Encrypt)

### 1. Установка Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### 2. Получение SSL сертификата

```bash
# Получение сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавить строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Обновление конфигурации Nginx

После получения SSL сертификата, раскомментируйте HTTPS секцию в `/etc/nginx/sites-available/newspaper_wall` и обновите настройки Django:

```bash
# В .env файле раскомментируйте:
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

## 📊 Мониторинг и логи

### 1. Просмотр логов

```bash
# Логи Gunicorn
sudo journalctl -u newspaper-wall -f

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Логи приложения
tail -f /var/www/newspaper_wall/logs/django.log
```

### 2. Мониторинг производительности

```bash
# Статус сервисов
sudo systemctl status newspaper-wall nginx

# Использование ресурсов
htop
df -h
free -h
```

## 🔧 Обслуживание

### 1. Обновление приложения

```bash
cd /var/www/newspaper_wall
git pull origin main
./deploy.sh
```

### 2. Резервное копирование

```bash
# Создание бэкапа базы данных
sudo -u postgres pg_dump newspaper_wall > backup_$(date +%Y%m%d).sql

# Создание бэкапа медиа файлов
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### 3. Восстановление из бэкапа

```bash
# Восстановление базы данных
sudo -u postgres psql newspaper_wall < backup_20240101.sql

# Восстановление медиа файлов
tar -xzf media_backup_20240101.tar.gz
```

## 🐛 Устранение неполадок

### 1. Приложение не запускается

```bash
# Проверка логов
sudo journalctl -u newspaper-wall --no-pager -l

# Проверка конфигурации
python manage.py check --settings=newspaper_wall.settings_production

# Проверка подключения к БД
python manage.py dbshell --settings=newspaper_wall.settings_production
```

### 2. Статические файлы не загружаются

```bash
# Пересборка статических файлов
python manage.py collectstatic --noinput --settings=newspaper_wall.settings_production

# Проверка прав доступа
ls -la /var/www/newspaper_wall/staticfiles/
```

### 3. Nginx ошибки

```bash
# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи сервисов
2. Убедитесь, что все сервисы запущены
3. Проверьте права доступа к файлам
4. Убедитесь, что порты не заняты другими процессами

## 🎉 Готово!

Ваше приложение "Block Newspaper Wall" теперь развернуто и готово к использованию!

**URL**: http://your-domain.com
**Админка**: http://your-domain.com/admin/

Не забудьте:
- Настроить домен в DNS
- Получить SSL сертификат
- Настроить мониторинг
- Создать регулярные бэкапы
