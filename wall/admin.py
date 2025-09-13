from django.contrib import admin
from django.utils.html import format_html
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'accent_color_display', 'cover_preview', 'created_at']
    list_filter = ['created_at', 'priority']
    search_fields = ['title', 'description']
    list_editable = ['priority']
    readonly_fields = ['slug', 'created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'slug', 'description')
        }),
        ('Визуальное оформление', {
            'fields': ('cover', 'accent_color', 'priority')
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def accent_color_display(self, obj):
        return format_html(
            '<span style="display: inline-block; width: 20px; height: 20px; background-color: {}; border: 1px solid #ccc; vertical-align: middle;"></span> {}',
            obj.accent_color,
            obj.accent_color
        )
    accent_color_display.short_description = 'Цвет акцента'

    def cover_preview(self, obj):
        if obj.cover:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.cover.url
            )
        return 'Нет обложки'
    cover_preview.short_description = 'Превью обложки'
