from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Project
import re


def is_mobile_device(request):
    """Определяет, является ли устройство мобильным"""
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
    mobile_patterns = [
        'mobile', 'android', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'opera mini', 'iemobile'
    ]
    return any(pattern in user_agent for pattern in mobile_patterns)


def index(request):
    """Главная страница с мозаикой проектов"""
    projects = Project.objects.all()
    
    # Получаем seed для генерации раскладки
    seed = request.GET.get('seed', '')
    
    # Определяем тип устройства
    is_mobile = is_mobile_device(request)
    
    context = {
        'projects': projects,
        'seed': seed,
        'is_mobile': is_mobile,
    }
    
    # Выбираем шаблон в зависимости от устройства
    template = 'wall/mobile.html' if is_mobile else 'wall/index.html'
    return render(request, template, context)


def project_detail(request, slug):
    """Детальная страница проекта (для модалки)"""
    project = get_object_or_404(Project, slug=slug)
    return render(request, 'wall/project_modal.html', {'project': project})


def api_projects(request):
    """API для получения списка проектов в JSON"""
    projects = Project.objects.all()
    
    projects_data = []
    for project in projects:
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'slug': project.slug,
            'description': project.description,
            'excerpt': project.get_excerpt(),
            'accent_color': project.accent_color,
            'priority': project.priority,
            'cover_url': project.cover.url if project.cover else None,
            'created_at': project.created_at.isoformat(),
        })
    
    return JsonResponse({
        'projects': projects_data,
    })
