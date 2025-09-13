from django.db import models
from django.utils.text import slugify
from django.urls import reverse


class Project(models.Model):
    title = models.CharField('Заголовок', max_length=200)
    slug = models.SlugField('URL', unique=True, blank=True)
    description = models.TextField('Описание', help_text='Поддерживает простые переносы строк')
    cover = models.ImageField('Обложка', upload_to='covers/', blank=True, null=True)
    accent_color = models.CharField(
        'Цвет акцента', 
        max_length=7, 
        default='#111827',
        help_text='HEX цвет для рамки/фона блока'
    )
    priority = models.IntegerField(
        'Приоритет', 
        default=0,
        help_text='Влияет на размер блока (больше = больше площадь)'
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['-priority', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('wall:project_detail', kwargs={'slug': self.slug})

    def get_excerpt(self, max_length=200):
        """Возвращает сокращенное описание для отображения в блоке"""
        if len(self.description) <= max_length:
            return self.description
        return self.description[:max_length].rsplit(' ', 1)[0] + '...'

    def __str__(self):
        return self.title
