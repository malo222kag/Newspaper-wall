/**
 * BSP (Binary Space Partitioning) Layout Generator
 * Генерирует случайную раскладку блоков без перекрытий и дыр
 */

class LayoutGenerator {
    constructor() {
        this.minWidth = 0.18;  // Минимальная ширина блока (18% от экрана)
        this.minHeight = 0.15; // Минимальная высота блока (15% от экрана)
        this.random = null;
    }

    /**
     * Простой LCG (Linear Congruential Generator) для воспроизводимой рандомизации
     */
    initRandom(seed) {
        if (seed) {
            // Простой LCG
            this.random = () => {
                seed = (seed * 1664525 + 1013904223) % Math.pow(2, 32);
                return seed / Math.pow(2, 32);
            };
        } else {
            this.random = Math.random;
        }
    }

    /**
     * Генерирует раскладку для заданного количества блоков
     */
    generateLayout(blocks, containerWidth, containerHeight, seed = null) {
        this.initRandom(seed);
        
        if (blocks.length === 0) return [];
        if (blocks.length === 1) {
            return [{
                x: 0,
                y: 0,
                width: containerWidth,
                height: containerHeight,
                block: blocks[0]
            }];
        }

        // Создаем прямоугольник экрана в нормированных координатах
        const screenRect = { x: 0, y: 0, width: 1, height: 1 };
        
        // Генерируем разбиение
        const rectangles = this.splitRectangle(screenRect, blocks);
        
        // Конвертируем в пиксели
        return rectangles.map(rect => ({
            x: rect.x * containerWidth,
            y: rect.y * containerHeight,
            width: rect.width * containerWidth,
            height: rect.height * containerHeight,
            block: rect.block
        }));
    }

    /**
     * Рекурсивно разбивает прямоугольник на части
     */
    splitRectangle(rect, blocks) {
        if (blocks.length === 1) {
            return [{
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                block: blocks[0]
            }];
        }

        if (blocks.length === 2) {
            return this.splitTwoBlocks(rect, blocks);
        }

        // Для 3+ блоков используем рекурсивное разбиение
        const splitIndex = this.calculateSplitIndex(blocks);
        const leftBlocks = blocks.slice(0, splitIndex);
        const rightBlocks = blocks.slice(splitIndex);

        // Выбираем направление разбиения
        const isVertical = this.shouldSplitVertically(rect, leftBlocks, rightBlocks);
        
        if (isVertical) {
            return this.splitVertically(rect, leftBlocks, rightBlocks);
        } else {
            return this.splitHorizontally(rect, leftBlocks, rightBlocks);
        }
    }

    /**
     * Разбивает прямоугольник на два блока
     */
    splitTwoBlocks(rect, blocks) {
        const [block1, block2] = blocks;
        const weight1 = this.getBlockWeight(block1);
        const weight2 = this.getBlockWeight(block2);
        const totalWeight = weight1 + weight2;
        
        const ratio = weight1 / totalWeight;
        const isVertical = this.random() > 0.5;
        
        if (isVertical) {
            const splitX = rect.x + rect.width * ratio;
            return [
                {
                    x: rect.x,
                    y: rect.y,
                    width: splitX - rect.x,
                    height: rect.height,
                    block: block1
                },
                {
                    x: splitX,
                    y: rect.y,
                    width: rect.x + rect.width - splitX,
                    height: rect.height,
                    block: block2
                }
            ];
        } else {
            const splitY = rect.y + rect.height * ratio;
            return [
                {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: splitY - rect.y,
                    block: block1
                },
                {
                    x: rect.x,
                    y: splitY,
                    width: rect.width,
                    height: rect.y + rect.height - splitY,
                    block: block2
                }
            ];
        }
    }

    /**
     * Вертикальное разбиение
     */
    splitVertically(rect, leftBlocks, rightBlocks) {
        const leftWeight = this.getTotalWeight(leftBlocks);
        const rightWeight = this.getTotalWeight(rightBlocks);
        const totalWeight = leftWeight + rightWeight;
        
        const ratio = leftWeight / totalWeight;
        const splitX = rect.x + rect.width * ratio;
        
        // Проверяем минимальные размеры
        const leftWidth = splitX - rect.x;
        const rightWidth = rect.x + rect.width - splitX;
        
        if (leftWidth < this.minWidth || rightWidth < this.minWidth) {
            // Если не помещается, пробуем горизонтальное разбиение
            return this.splitHorizontally(rect, leftBlocks, rightBlocks);
        }
        
        const leftRect = {
            x: rect.x,
            y: rect.y,
            width: leftWidth,
            height: rect.height
        };
        
        const rightRect = {
            x: splitX,
            y: rect.y,
            width: rightWidth,
            height: rect.height
        };
        
        return [
            ...this.splitRectangle(leftRect, leftBlocks),
            ...this.splitRectangle(rightRect, rightBlocks)
        ];
    }

    /**
     * Горизонтальное разбиение
     */
    splitHorizontally(rect, topBlocks, bottomBlocks) {
        const topWeight = this.getTotalWeight(topBlocks);
        const bottomWeight = this.getTotalWeight(bottomBlocks);
        const totalWeight = topWeight + bottomWeight;
        
        const ratio = topWeight / totalWeight;
        const splitY = rect.y + rect.height * ratio;
        
        // Проверяем минимальные размеры
        const topHeight = splitY - rect.y;
        const bottomHeight = rect.y + rect.height - splitY;
        
        if (topHeight < this.minHeight || bottomHeight < this.minHeight) {
            // Если не помещается, пробуем вертикальное разбиение
            return this.splitVertically(rect, topBlocks, bottomBlocks);
        }
        
        const topRect = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: topHeight
        };
        
        const bottomRect = {
            x: rect.x,
            y: splitY,
            width: rect.width,
            height: bottomHeight
        };
        
        return [
            ...this.splitRectangle(topRect, topBlocks),
            ...this.splitRectangle(bottomRect, bottomBlocks)
        ];
    }

    /**
     * Вычисляет индекс для разбиения массива блоков
     */
    calculateSplitIndex(blocks) {
        const totalWeight = this.getTotalWeight(blocks);
        let currentWeight = 0;
        const targetWeight = totalWeight * this.random();
        
        for (let i = 0; i < blocks.length - 1; i++) {
            currentWeight += this.getBlockWeight(blocks[i]);
            if (currentWeight >= targetWeight) {
                return i + 1;
            }
        }
        
        return Math.floor(blocks.length / 2);
    }

    /**
     * Определяет, нужно ли разбивать вертикально
     */
    shouldSplitVertically(rect, leftBlocks, rightBlocks) {
        const aspectRatio = rect.width / rect.height;
        const randomFactor = this.random();
        
        // Если прямоугольник широкий, чаще разбиваем вертикально
        if (aspectRatio > 1.5) return true;
        if (aspectRatio < 0.67) return false;
        
        return randomFactor > 0.5;
    }

    /**
     * Получает вес блока (приоритет + небольшая случайность)
     */
    getBlockWeight(block) {
        const baseWeight = Math.max(1, block.priority || 0);
        const randomFactor = 0.8 + this.random() * 0.4; // ±20% случайности
        return baseWeight * randomFactor;
    }

    /**
     * Получает общий вес группы блоков
     */
    getTotalWeight(blocks) {
        return blocks.reduce((sum, block) => sum + this.getBlockWeight(block), 0);
    }
}

/**
 * Основной класс приложения
 */
class WallApp {
    constructor() {
        this.layoutGenerator = new LayoutGenerator();
        this.isResizing = false;
        this.resizeTimeout = null;
        this.isShuffling = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.layoutTiles();
        this.setupModal();
    }

    bindEvents() {
        // Обработка ресайза с debounce
        window.addEventListener('resize', () => {
            if (this.isResizing) return;
            
            this.isResizing = true;
            clearTimeout(this.resizeTimeout);
            
            this.resizeTimeout = setTimeout(() => {
                this.layoutTiles();
                this.isResizing = false;
            }, 100);
        });

        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Кнопка перемешивания
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                this.shuffleLayout();
            });
        }
    }

    layoutTiles() {
        const container = document.getElementById('wall-container');
        if (!container) return;

        const tiles = container.querySelectorAll('.tile');
        if (tiles.length === 0) return;

        const containerRect = container.getBoundingClientRect();
        const blocks = Array.from(tiles).map(tile => ({
            priority: parseInt(tile.dataset.priority) || 0,
            element: tile
        }));

        // Генерируем seed из URL или создаем новый
        const urlParams = new URLSearchParams(window.location.search);
        let seed = urlParams.get('seed');
        if (!seed) {
            seed = Math.floor(Math.random() * 1000000);
            // Обновляем URL с новым seed
            const url = new URL(window.location);
            url.searchParams.set('seed', seed);
            window.history.replaceState({}, '', url.toString());
        }

        const layout = this.layoutGenerator.generateLayout(
            blocks,
            containerRect.width,
            containerRect.height,
            parseInt(seed)
        );

        // Применяем позиции к элементам с батчингом и случайной анимацией
        requestAnimationFrame(() => {
            // Сначала скрываем все блоки
            tiles.forEach(tile => {
                tile.style.opacity = '0';
                tile.style.transform = 'scale(0.8)';
            });

            // Применяем позиции
            layout.forEach((item, index) => {
                const tile = tiles[index];
                if (!tile) return;

                // Добавляем отступы для видимости фона
                const padding = 8;
                tile.style.left = `${item.x + padding}px`;
                tile.style.top = `${item.y + padding}px`;
                tile.style.width = `${item.width - padding * 2}px`;
                tile.style.height = `${item.height - padding * 2}px`;

                // Применяем цвет акцента
                const accentColor = tile.dataset.accentColor || '#111827';
                tile.style.borderColor = accentColor;
                tile.style.setProperty('--accent-color', accentColor);

                // Определяем контраст текста
                this.setContrast(tile, accentColor);
                
                // Обрезаем текст в зависимости от размера блока
                this.truncateText(tile, item.width, item.height);
            });

            // Случайная анимация появления
            this.animateTilesAppearance(tiles);
        });
    }

    animateTilesAppearance(tiles) {
        // Создаем массив индексов и перемешиваем их
        const indices = Array.from({ length: tiles.length }, (_, i) => i);
        this.shuffleArray(indices);

        // Анимируем появление каждого блока с задержкой
        indices.forEach((index, i) => {
            const tile = tiles[index];
            if (!tile) return;

            setTimeout(() => {
                tile.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                tile.style.opacity = '1';
                tile.style.transform = 'scale(1)';
            }, i * 100 + Math.random() * 200); // Случайная задержка 100-300ms
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    truncateText(tile, width, height) {
        const title = tile.querySelector('.tile-title');
        const excerpt = tile.querySelector('.tile-excerpt');
        
        if (!title || !excerpt) return;
        
        // Определяем максимальное количество строк в зависимости от размера
        const maxTitleLines = Math.max(1, Math.floor(height / 60));
        const maxExcerptLines = Math.max(2, Math.floor(height / 40));
        
        // Устанавливаем стили для обрезания
        title.style.setProperty('-webkit-line-clamp', maxTitleLines);
        excerpt.style.setProperty('-webkit-line-clamp', maxExcerptLines);
        
        // Обрезаем текст программно для надежности
        const titleText = title.textContent;
        const excerptText = excerpt.textContent;
        
        if (titleText.length > 50) {
            title.textContent = titleText.substring(0, 47) + '...';
        }
        
        if (excerptText.length > 150) {
            excerpt.textContent = excerptText.substring(0, 147) + '...';
        }
    }

    setContrast(tile, accentColor) {
        // Простое определение контраста на основе яркости цвета
        const rgb = this.hexToRgb(accentColor);
        if (!rgb) return;

        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const isLight = brightness > 128;

        const content = tile.querySelector('.tile-content');
        if (content) {
            content.classList.toggle('text-light', !isLight);
            content.classList.toggle('text-dark', isLight);
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    setupModal() {
        const modal = document.getElementById('project-modal');
        const backdrop = modal?.querySelector('.modal-backdrop');
        const closeBtn = modal?.querySelector('.modal-close');

        // Клик по блоку
        document.addEventListener('click', (e) => {
            const tile = e.target.closest('.tile');
            if (tile) {
                this.openModal(tile);
            }
        });

        // Закрытие модалки
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeModal());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    async openModal(tile) {
        const slug = tile.dataset.slug;
        if (!slug) return;

        const modal = document.getElementById('project-modal');
        const modalBody = modal.querySelector('.modal-body');

        try {
            const response = await fetch(`/p/${slug}/`);
            const html = await response.text();
            modalBody.innerHTML = html;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Ошибка загрузки проекта:', error);
        }
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }


    shuffleLayout() {
        // Защита от множественных нажатий
        if (this.isShuffling) return;
        
        this.isShuffling = true;
        
        // Генерируем новый seed и перестраиваем раскладку без перезагрузки
        const newSeed = Math.floor(Math.random() * 1000000);
        
        // Обновляем URL без перезагрузки
        const url = new URL(window.location);
        url.searchParams.set('seed', newSeed);
        window.history.pushState({}, '', url.toString());
        
        // Перестраиваем раскладку с новым seed
        this.layoutTiles();
        
        // Сбрасываем флаг через небольшую задержку
        setTimeout(() => {
            this.isShuffling = false;
        }, 500);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    try {
        new WallApp();
    } catch (error) {
        console.error('Error initializing WallApp:', error);
    }
});
