class AdaptiveLayoutGenerator {
    constructor(containerWidth, containerHeight) {
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.padding = 20;
    }

    generateLayout(projects) {
        if (projects.length === 0) return [];
        
        // Перемешиваем проекты
        const shuffledProjects = this.shuffleArray([...projects]);
        
        // Специальные случайные раскладки для малого количества проектов
        if (projects.length === 2) {
            return this.generateTwoBlockLayout(shuffledProjects);
        }
        if (projects.length === 3) {
            return this.generateThreeBlockLayout(shuffledProjects);
        }
        if (projects.length === 4) {
            return this.generateFourBlockLayout(shuffledProjects);
        }
        if (projects.length === 5) {
            return this.generateFiveBlockLayout(shuffledProjects);
        }
        if (projects.length === 6) {
            return this.generateSixBlockLayout(shuffledProjects);
        }
        if (projects.length === 7) {
            return this.generateSevenBlockLayout(shuffledProjects);
        }
        if (projects.length === 8) {
            return this.generateEightBlockLayout(shuffledProjects);
        }
        
        // Для большего количества используем стандартную сетку
        const { rows, cols } = this.calculateGridDimensions(projects.length);
        const blockWidth = (this.containerWidth - this.padding * (cols + 1)) / cols;
        const blockHeight = (this.containerHeight - this.padding * (rows + 1)) / rows;
        
        const rectangles = [];
        
        for (let i = 0; i < shuffledProjects.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            const x = this.padding + col * (blockWidth + this.padding);
            const y = this.padding + row * (blockHeight + this.padding);
            
            rectangles.push({
                project: shuffledProjects[i],
                x: x,
                y: y,
                width: blockWidth,
                height: blockHeight
            });
        }
        
        return rectangles;
    }

    generateTwoBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Два блока рядом
            () => {
                const blockWidth = (this.containerWidth - this.padding * 3) / 2;
                const blockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: blockWidth,
                    height: blockHeight
                });
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding * 2 + blockWidth,
                    y: this.padding,
                    width: blockWidth,
                    height: blockHeight
                });
            },
            // Вариант 2: Один сверху, один снизу
            () => {
                const blockWidth = this.containerWidth - this.padding * 2;
                const blockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: blockWidth,
                    height: blockHeight
                });
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding,
                    y: this.padding * 2 + blockHeight,
                    width: blockWidth,
                    height: blockHeight
                });
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    generateThreeBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Один большой сверху, два маленьких снизу
            () => {
                const topBlockWidth = this.containerWidth - this.padding * 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding,
                    y: this.padding * 2 + topBlockHeight,
                    width: bottomBlockWidth,
                    height: bottomBlockHeight
                });
                
                rectangles.push({
                    project: projects[2],
                    x: this.padding * 2 + bottomBlockWidth,
                    y: this.padding * 2 + topBlockHeight,
                    width: bottomBlockWidth,
                    height: bottomBlockHeight
                });
            },
            // Вариант 2: Один большой слева, два маленьких справа
            () => {
                const leftBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const leftBlockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: leftBlockWidth,
                    height: leftBlockHeight
                });
                
                const rightBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const rightBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding * 2 + leftBlockWidth,
                    y: this.padding,
                    width: rightBlockWidth,
                    height: rightBlockHeight
                });
                
                rectangles.push({
                    project: projects[2],
                    x: this.padding * 2 + leftBlockWidth,
                    y: this.padding * 2 + rightBlockHeight,
                    width: rightBlockWidth,
                    height: rightBlockHeight
                });
            },
            // Вариант 3: Два маленьких сверху, один большой снизу
            () => {
                const topBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding * 2 + topBlockWidth,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = this.containerWidth - this.padding * 2;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[2],
                    x: this.padding,
                    y: this.padding * 2 + topBlockHeight,
                    width: bottomBlockWidth,
                    height: bottomBlockHeight
                });
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    generateFourBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Стандартная сетка 2x2
            () => {
                const blockWidth = (this.containerWidth - this.padding * 3) / 2;
                const blockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 0; i < 4; i++) {
                    const row = Math.floor(i / 2);
                    const col = i % 2;
                    
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + col * (blockWidth + this.padding),
                        y: this.padding + row * (blockHeight + this.padding),
                        width: blockWidth,
                        height: blockHeight
                    });
                }
            },
            // Вариант 2: Один большой слева, три маленьких справа
            () => {
                const leftBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const leftBlockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: leftBlockWidth,
                    height: leftBlockHeight
                });
                
                const rightBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const rightBlockHeight = (this.containerHeight - this.padding * 4) / 3;
                
                for (let i = 1; i < 4; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding * 2 + leftBlockWidth,
                        y: this.padding + (i - 1) * (rightBlockHeight + this.padding),
                        width: rightBlockWidth,
                        height: rightBlockHeight
                    });
                }
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    generateFiveBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Один большой сверху, четыре маленьких снизу
            () => {
                const topBlockWidth = this.containerWidth - this.padding * 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = (this.containerWidth - this.padding * 5) / 4;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 1; i < 5; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + (i - 1) * (bottomBlockWidth + this.padding),
                        y: this.padding * 2 + topBlockHeight,
                        width: bottomBlockWidth,
                        height: bottomBlockHeight
                    });
                }
            },
            // Вариант 2: Один большой слева, четыре маленьких справа
            () => {
                const leftBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const leftBlockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: leftBlockWidth,
                    height: leftBlockHeight
                });
                
                const rightBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const rightBlockHeight = (this.containerHeight - this.padding * 5) / 4;
                
                for (let i = 1; i < 5; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding * 2 + leftBlockWidth,
                        y: this.padding + (i - 1) * (rightBlockHeight + this.padding),
                        width: rightBlockWidth,
                        height: rightBlockHeight
                    });
                }
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    generateSixBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Стандартная сетка 2x3
            () => {
                const blockWidth = (this.containerWidth - this.padding * 4) / 3;
                const blockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 0; i < 6; i++) {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + col * (blockWidth + this.padding),
                        y: this.padding + row * (blockHeight + this.padding),
                        width: blockWidth,
                        height: blockHeight
                    });
                }
            },
            // Вариант 2: Один большой слева, пять маленьких справа
            () => {
                const leftBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const leftBlockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: leftBlockWidth,
                    height: leftBlockHeight
                });
                
                const rightBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const rightBlockHeight = (this.containerHeight - this.padding * 6) / 5;
                
                for (let i = 1; i < 6; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding * 2 + leftBlockWidth,
                        y: this.padding + (i - 1) * (rightBlockHeight + this.padding),
                        width: rightBlockWidth,
                        height: rightBlockHeight
                    });
                }
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    generateSevenBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Один большой сверху, шесть маленьких снизу
            () => {
                const topBlockWidth = this.containerWidth - this.padding * 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = (this.containerWidth - this.padding * 7) / 6;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 1; i < 7; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + (i - 1) * (bottomBlockWidth + this.padding),
                        y: this.padding * 2 + topBlockHeight,
                        width: bottomBlockWidth,
                        height: bottomBlockHeight
                    });
                }
            },
            // Вариант 2: Один большой слева, шесть маленьких справа
            () => {
                const leftBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const leftBlockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: leftBlockWidth,
                    height: leftBlockHeight
                });
                
                const rightBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const rightBlockHeight = (this.containerHeight - this.padding * 7) / 6;
                
                for (let i = 1; i < 7; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding * 2 + leftBlockWidth,
                        y: this.padding + (i - 1) * (rightBlockHeight + this.padding),
                        width: rightBlockWidth,
                        height: rightBlockHeight
                    });
                }
            },
            // Вариант 3: Два больших сверху, пять маленьких снизу
            () => {
                const topBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding * 2 + topBlockWidth,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = (this.containerWidth - this.padding * 6) / 5;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 2; i < 7; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + (i - 2) * (bottomBlockWidth + this.padding),
                        y: this.padding * 2 + topBlockHeight,
                        width: bottomBlockWidth,
                        height: bottomBlockHeight
                    });
                }
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    generateEightBlockLayout(projects) {
        const rectangles = [];
        const layouts = [
            // Вариант 1: Один большой сверху, семь маленьких снизу
            () => {
                const topBlockWidth = this.containerWidth - this.padding * 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = (this.containerWidth - this.padding * 8) / 7;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 1; i < 8; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + (i - 1) * (bottomBlockWidth + this.padding),
                        y: this.padding * 2 + topBlockHeight,
                        width: bottomBlockWidth,
                        height: bottomBlockHeight
                    });
                }
            },
            // Вариант 2: Один большой слева, семь маленьких справа
            () => {
                const leftBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const leftBlockHeight = this.containerHeight - this.padding * 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: leftBlockWidth,
                    height: leftBlockHeight
                });
                
                const rightBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const rightBlockHeight = (this.containerHeight - this.padding * 8) / 7;
                
                for (let i = 1; i < 8; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding * 2 + leftBlockWidth,
                        y: this.padding + (i - 1) * (rightBlockHeight + this.padding),
                        width: rightBlockWidth,
                        height: rightBlockHeight
                    });
                }
            },
            // Вариант 3: Два больших сверху, шесть маленьких снизу
            () => {
                const topBlockWidth = (this.containerWidth - this.padding * 3) / 2;
                const topBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                rectangles.push({
                    project: projects[0],
                    x: this.padding,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                rectangles.push({
                    project: projects[1],
                    x: this.padding * 2 + topBlockWidth,
                    y: this.padding,
                    width: topBlockWidth,
                    height: topBlockHeight
                });
                
                const bottomBlockWidth = (this.containerWidth - this.padding * 7) / 6;
                const bottomBlockHeight = (this.containerHeight - this.padding * 3) / 2;
                
                for (let i = 2; i < 8; i++) {
                    rectangles.push({
                        project: projects[i],
                        x: this.padding + (i - 2) * (bottomBlockWidth + this.padding),
                        y: this.padding * 2 + topBlockHeight,
                        width: bottomBlockWidth,
                        height: bottomBlockHeight
                    });
                }
            }
        ];
        
        const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
        randomLayout();
        return rectangles;
    }

    calculateGridDimensions(count) {
        if (count === 1) return { rows: 1, cols: 1 };
        if (count === 2) return { rows: 1, cols: 2 };
        if (count === 3) return { rows: 2, cols: 2 }; // 2x2 с одним пустым местом
        if (count === 4) return { rows: 2, cols: 2 };
        if (count === 5) return { rows: 2, cols: 3 }; // 2x3 с одним пустым местом
        if (count === 6) return { rows: 2, cols: 3 };
        if (count === 7) return { rows: 3, cols: 3 }; // 3x3 с двумя пустыми местами
        if (count === 8) return { rows: 3, cols: 3 }; // 3x3 с одним пустым местом
        if (count === 9) return { rows: 3, cols: 3 };
        
        // Для большего количества проектов
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        return { rows, cols };
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

class WallApp {
    constructor() {
        this.container = document.getElementById('wall-container');
        this.mobileContainer = document.getElementById('mobile-wall-container');
        this.projects = window.wallData.projects;
        this.seed = window.wallData.seed;
        this.isResizing = false;
        this.resizeTimeout = null;
        
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

        // Обработчик клика по кнопкам "Подробнее" и блокам
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tile-more-btn')) {
                e.stopPropagation();
                const slug = e.target.dataset.slug;
                this.openModal(slug);
            } else if (e.target.closest('.tile')) {
                const tile = e.target.closest('.tile');
                const slug = tile.dataset.slug;
                if (slug) {
                    this.openModal(slug);
                }
            }
        });
    }

    layoutTiles() {
        // Скрываем все контейнеры сначала
        if (this.container) this.container.style.display = 'none';
        if (this.mobileContainer) this.mobileContainer.style.display = 'none';
        
        if (window.innerWidth <= 768) {
            this.layoutMobileTiles();
        } else {
            this.layoutDesktopTiles();
        }
    }

    layoutDesktopTiles() {
        this.container.style.display = 'block';
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        
        const generator = new AdaptiveLayoutGenerator(containerWidth, containerHeight);
        const rectangles = generator.generateLayout(this.projects);
        
        this.container.innerHTML = '';
        
        rectangles.forEach((rect, index) => {
            const tile = this.createTile(rect.project, index);
            this.positionTile(tile, rect);
            this.container.appendChild(tile);
        });

        this.bindTileEvents();
        this.animateTilesAppearance();
    }

    layoutMobileTiles() {
        this.mobileContainer.style.display = 'flex';
        this.mobileContainer.innerHTML = `
            <div class="mobile-indicators"></div>
        `;
        
        // Перемешиваем проекты для мобильной версии
        this.mobileProjects = this.shuffleArray([...this.projects]);
        
        this.mobileProjects.forEach((project, index) => {
            const tile = this.createMobileTile(project, index);
            this.mobileContainer.appendChild(tile);
        });

        this.createMobileIndicators();
        this.showMobileProject(0);
        this.bindMobileTileEvents();
    }

    createTile(project, index) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.projectId = project.id;
        tile.dataset.slug = project.slug;
        
        
        // Применяем стили напрямую
        tile.style.position = 'absolute';
        tile.style.background = '#fafafa';
        tile.style.borderRadius = '6px';
        tile.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        tile.style.cursor = 'pointer';
        tile.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.6s ease';
        tile.style.overflow = 'hidden';
        tile.style.border = '1px solid #d1d5db';
        tile.style.opacity = '0';
        tile.style.transform = 'scale(0.8)';
        
        const content = document.createElement('div');
        content.className = 'tile-content';
        content.style.position = 'relative';
        content.style.zIndex = '2';
        content.style.padding = '1rem';
        content.style.height = '100%';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.justifyContent = 'flex-start';
        content.style.textAlign = 'left';
        content.style.overflow = 'hidden';
        
        const title = document.createElement('h2');
        title.className = 'tile-title';
        title.textContent = project.title;
        title.style.fontSize = '1.2rem';
        title.style.fontWeight = '600';
        title.style.lineHeight = '1.2';
        title.style.marginBottom = '0.5rem';
        title.style.color = '#374151';
        title.style.wordWrap = 'break-word';
        
        const excerpt = document.createElement('p');
        excerpt.className = 'tile-excerpt';
        excerpt.textContent = project.excerpt;
        excerpt.style.fontSize = '0.9rem';
        excerpt.style.lineHeight = '1.4';
        excerpt.style.color = '#6b7280';
        excerpt.style.wordWrap = 'break-word';
        excerpt.style.flexGrow = '1';
        excerpt.style.overflow = 'hidden';
        excerpt.style.textOverflow = 'ellipsis';
        excerpt.style.display = '-webkit-box';
        excerpt.style.webkitLineClamp = '4';
        excerpt.style.webkitBoxOrient = 'vertical';
        
        const moreBtn = document.createElement('button');
        moreBtn.className = 'tile-more-btn';
        moreBtn.textContent = 'Подробнее';
        moreBtn.dataset.slug = project.slug;
        moreBtn.style.position = 'absolute';
        moreBtn.style.bottom = '0.5rem';
        moreBtn.style.right = '0.5rem';
        moreBtn.style.background = 'rgba(255, 255, 255, 0.9)';
        moreBtn.style.border = '1px solid #d1d5db';
        moreBtn.style.borderRadius = '4px';
        moreBtn.style.padding = '0.25rem 0.5rem';
        moreBtn.style.fontSize = '0.75rem';
        moreBtn.style.color = '#374151';
        moreBtn.style.cursor = 'pointer';
        moreBtn.style.transition = 'all 0.2s ease';
        moreBtn.style.zIndex = '4';
        moreBtn.style.backdropFilter = 'blur(5px)';
        moreBtn.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        
        content.appendChild(title);
        content.appendChild(excerpt);
        content.appendChild(moreBtn);
        tile.appendChild(content);
        
        return tile;
    }

    createMobileTile(project, index) {
        const tile = document.createElement('div');
        tile.className = 'tile mobile-tile';
        tile.dataset.projectId = project.id;
        tile.dataset.slug = project.slug;
        tile.style.display = index === 0 ? 'flex' : 'none';
        
        const content = document.createElement('div');
        content.className = 'tile-content';
        
        const title = document.createElement('h2');
        title.className = 'tile-title';
        title.textContent = project.title;
        
        const excerpt = document.createElement('p');
        excerpt.className = 'tile-excerpt';
        excerpt.textContent = project.excerpt;
        
        const moreBtn = document.createElement('button');
        moreBtn.className = 'tile-more-btn';
        moreBtn.textContent = 'Подробнее';
        moreBtn.dataset.slug = project.slug;
        
        content.appendChild(title);
        content.appendChild(excerpt);
        content.appendChild(moreBtn);
        tile.appendChild(content);
        
        return tile;
    }

    positionTile(tile, rect) {
        tile.style.width = `${rect.width}px`;
        tile.style.height = `${rect.height}px`;
        tile.style.left = `${rect.x}px`;
        tile.style.top = `${rect.y}px`;
        
        this.truncateText(tile, rect.width, rect.height);
    }

    truncateText(tile, width, height) {
        const title = tile.querySelector('.tile-title');
        const excerpt = tile.querySelector('.tile-excerpt');
        
        if (title) {
            title.style.setProperty('-webkit-line-clamp', 'none');
        }
        
        if (excerpt) {
            const lineHeight = 20;
            const titleHeight = 60;
            const buttonHeight = 40;
            const availableHeight = height - titleHeight - buttonHeight - 20;
            const maxLines = Math.floor(availableHeight / lineHeight);
            
            excerpt.style.setProperty('-webkit-line-clamp', Math.max(1, maxLines));
        }
    }

    bindTileEvents() {
        // Обработчики уже привязаны в bindEvents()
    }

    bindMobileTileEvents() {
        // Обработчики уже привязаны в bindEvents()
        
        // Добавляем поддержку свайпов
        let startX = 0;
        let startY = 0;
        let isSwipe = false;
        
        this.mobileContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
        });
        
        this.mobileContainer.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Проверяем, что это горизонтальный свайп
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                isSwipe = true;
                e.preventDefault(); // Предотвращаем скролл страницы
            }
        });
        
        this.mobileContainer.addEventListener('touchend', (e) => {
            if (!isSwipe) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Свайп влево - следующий проект
                    this.nextMobileProject();
                } else {
                    // Свайп вправо - предыдущий проект
                    this.prevMobileProject();
                }
            }
            
            startX = 0;
            startY = 0;
            isSwipe = false;
        });
    }

    createMobileIndicators() {
        const indicatorsContainer = this.mobileContainer.querySelector('.mobile-indicators');
        indicatorsContainer.innerHTML = '';
        
        this.mobileProjects.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'mobile-indicator';
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                this.showMobileProject(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    showMobileProject(index) {
        const tiles = this.mobileContainer.querySelectorAll('.mobile-tile');
        const indicators = this.mobileContainer.querySelectorAll('.mobile-indicator');
        
        tiles.forEach((tile, i) => {
            if (i === index) {
                tile.style.display = 'flex';
                tile.style.opacity = '1';
                tile.style.transform = 'scale(1)';
            } else {
                tile.style.display = 'none';
                tile.style.opacity = '0';
                tile.style.transform = 'scale(0.9)';
            }
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        this.currentMobileIndex = index;
    }

    nextMobileProject() {
        if (this.currentMobileIndex < this.mobileProjects.length - 1) {
            this.showMobileProject(this.currentMobileIndex + 1);
        }
    }

    prevMobileProject() {
        if (this.currentMobileIndex > 0) {
            this.showMobileProject(this.currentMobileIndex - 1);
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    setupModal() {
        const modal = document.getElementById('project-modal');
        const backdrop = modal?.querySelector('.modal-backdrop');
        const closeBtn = modal?.querySelector('.modal-close');

        // Закрытие модалки
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeModal());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    async openModal(slug) {
        console.log('Opening modal for slug:', slug);
        const project = this.projects.find(p => p.slug === slug);
        console.log('Found project:', project);
        
        if (!project) {
            console.error('Project not found for slug:', slug);
            return;
        }

        const modal = document.getElementById('project-modal');
        const modalBody = modal.querySelector('.modal-body');
        
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
        console.log('Modal opened successfully');
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    animateTilesAppearance() {
        const tiles = this.container.querySelectorAll('.tile');
        const indices = Array.from({length: tiles.length}, (_, i) => i);
        
        // Перемешиваем индексы для случайной анимации
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        tiles.forEach((tile, index) => {
            tile.style.opacity = '0';
            tile.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                tile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                tile.style.opacity = '1';
                tile.style.transform = 'scale(1)';
            }, index * 100);
        });
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