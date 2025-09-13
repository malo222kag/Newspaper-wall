"""
WSGI config for newspaper_wall project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newspaper_wall.settings')

application = get_wsgi_application()
