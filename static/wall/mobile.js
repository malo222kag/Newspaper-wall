class MobileApp {
    constructor() {
        this.currentIndex = 0;
        this.projects = this.shuffleArray([...window.mobileData.projects]);
        this.totalSlides = this.projects.length;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.preloadImages();
    }

    bindEvents() {
        // Навигационные кнопки
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.prevSlide();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextSlide();
        });

        // Индикаторы
        document.querySelectorAll('.mobile-indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Кнопки "Подробнее"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mobile-slide-btn')) {
                const slug = e.target.dataset.slug;
                this.openModal(slug);
            }
        });

        // События касания
        this.setupTouchEvents();

        // Модалка
        this.setupModal();

        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupTouchEvents() {
        const carousel = document.getElementById('mobile-carousel');
        
        carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Предотвращаем скролл страницы
        });

        carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Минимальное расстояние для свайпа
        const minSwipeDistance = 50;
        
        // Проверяем, что свайп горизонтальный
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    setupModal() {
        const modal = document.getElementById('project-modal');
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.modal-close');

        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeModal());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        const prevIndex = this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        // Обновляем позицию карусели
        const carousel = document.getElementById('mobile-carousel');
        carousel.style.transform = `translateX(-${index * 100}vw)`;
        
        // Обновляем UI
        this.updateUI();
        
        // Сбрасываем флаг анимации
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    updateUI() {
        // Обновляем индикаторы
        document.querySelectorAll('.mobile-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Обновляем счетчик
        const counter = document.getElementById('slide-counter');
        counter.textContent = `${this.currentIndex + 1} / ${this.totalSlides}`;

        // Обновляем кнопки навигации
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex === this.totalSlides - 1;

        // Добавляем активный класс к текущему слайду
        document.querySelectorAll('.mobile-slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    recreateSlides() {
        const carousel = document.getElementById('mobile-carousel');
        carousel.innerHTML = '';
        
        this.projects.forEach((project, index) => {
            const slide = this.createSlide(project, index);
            carousel.appendChild(slide);
        });
        
        // Пересоздаем индикаторы
        this.recreateIndicators();
    }

    createSlide(project, index) {
        const slide = document.createElement('div');
        slide.className = 'mobile-slide';
        slide.dataset.projectId = project.id;
        slide.dataset.slug = project.slug;
        
        const content = document.createElement('div');
        content.className = 'mobile-slide-content';
        
        if (project.cover_url) {
            const cover = document.createElement('div');
            cover.className = 'mobile-slide-cover';
            cover.style.backgroundImage = `url('${project.cover_url}')`;
            content.appendChild(cover);
        }
        
        const text = document.createElement('div');
        text.className = 'mobile-slide-text';
        
        const title = document.createElement('h2');
        title.className = 'mobile-slide-title';
        title.textContent = project.title;
        
        const excerpt = document.createElement('p');
        excerpt.className = 'mobile-slide-excerpt';
        excerpt.textContent = project.excerpt;
        
        const btn = document.createElement('button');
        btn.className = 'mobile-slide-btn';
        btn.textContent = 'Подробнее';
        btn.dataset.slug = project.slug;
        
        text.appendChild(title);
        text.appendChild(excerpt);
        text.appendChild(btn);
        content.appendChild(text);
        slide.appendChild(content);
        
        return slide;
    }

    recreateIndicators() {
        const indicatorsContainer = document.querySelector('.mobile-indicators');
        indicatorsContainer.innerHTML = '';
        
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'mobile-indicator';
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    preloadImages() {
        this.projects.forEach(project => {
            if (project.cover_url) {
                const img = new Image();
                img.src = project.cover_url;
            }
        });
    }

    async openModal(slug) {
        const modal = document.getElementById('project-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        // Показываем базовую информацию о проекте
        const project = this.projects.find(p => p.slug === slug);
        if (project) {
            modalBody.innerHTML = `
                <div class="project-detail">
                    <h2 class="project-title">${project.title}</h2>
                    <div class="project-meta">
                        <p><strong>Дата создания:</strong> ${project.created_at}</p>
                    </div>
                    <div class="project-content">
                        <p class="project-description">${project.description}</p>
                    </div>
                </div>
            `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    try {
        new MobileApp();
    } catch (error) {
        console.error('Error initializing MobileApp:', error);
    }
});
