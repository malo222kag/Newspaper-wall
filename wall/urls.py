from django.urls import path
from . import views

app_name = 'wall'

urlpatterns = [
    path('', views.index, name='index'),
    path('p/<slug:slug>/', views.project_detail, name='project_detail'),
    path('api/projects/', views.api_projects, name='api_projects'),
]
