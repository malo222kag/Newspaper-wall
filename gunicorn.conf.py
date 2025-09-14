# Gunicorn конфигурация с HTTPS поддержкой

bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2

# Логирование
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"

# Безопасность
forwarded_allow_ips = "*"
secure_scheme_headers = {
    'X-FORWARDED-PROTOCOL': 'ssl',
    'X-FORWARDED-PROTO': 'https',
    'X-FORWARDED-SSL': 'on'
}

# Процесс
daemon = False
pidfile = "/var/run/gunicorn/zuif.pid"
user = "ubuntu"
group = "ubuntu"

# Перезапуск
reload = True
reload_extra_files = [
    "/home/ubuntu/zuif/static/",
    "/home/ubuntu/zuif/templates/"
]
