class LayoutGenerator {
    constructor(containerWidth, containerHeight) {
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.minWidth = 0.18;
        this.minHeight = 0.15;
    }

    generateLayout(projects, seed) {
        const random = new SeededRandom(seed);
        const rectangles = [];
        
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            const rect = this.createRectangle(project, random);
            rectangles.push(rect);
        }
        
        return rectangles;
    }

    createRectangle(project, random) {
        const width = this.minWidth + random.next() * (1 - this.minWidth);
        const height = this.minHeight + random.next() * (1 - this.minHeight);
        
        return {
            project: project,
            width: width,
            height: height,
            x: 0,
            y: 0
        };
    }
}

class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

class WallApp {
    constructor() {
        this.container = document.getElementById('wall-container');
        this.mobileContainer = document.getElementById('mobile-wall-container');
        this.projects = window.wallData.projects;
        this.seed = window.wallData.seed;
        this.isShuffling = false;
        this.currentMobileIndex = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.layoutTiles();
    }

    bindEvents() {
        // Desktop shuffle button
        document.getElementById('shuffle-btn').addEventListener('click', () => {
            this.shuffleLayout();
        });

        // Mobile shuffle button
        document.getElementById('mobile-shuffle-btn').addEventListener('click', () => {
            this.shuffleMobileLayout();
        });

        // Modal events
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('project-modal').addEventListener('click', (e) => {
            if (e.target.id === 'project-modal') {
                this.closeModal();
            }
        });

        // Mobile touch events
        this.setupMobileTouchEvents();

        // Window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.layoutTiles();
            }, 250);
        });
    }

    setupMobileTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;

        this.mobileContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });

        this.mobileContainer.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);

            if (diffX > diffY) {
                isScrolling = true;
                e.preventDefault();
            }
        });

        this.mobileContainer.addEventListener('touchend', (e) => {
            if (!isScrolling) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextMobileProject();
                } else {
                    this.prevMobileProject();
                }
            }

            startX = 0;
            startY = 0;
            isScrolling = false;
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
        
        const generator = new LayoutGenerator(containerWidth, containerHeight);
        const rectangles = generator.generateLayout(this.projects, this.seed);
        
        this.container.innerHTML = '<button id="shuffle-btn" class="shuffle-btn">🎲</button>';
        
        rectangles.forEach((rect, index) => {
            const tile = this.createTile(rect.project, index);
            this.positionTile(tile, rect, containerWidth, containerHeight);
            this.container.appendChild(tile);
        });

        this.bindTileEvents();
    }

    layoutMobileTiles() {
        this.mobileContainer.style.display = 'flex';
        this.mobileContainer.innerHTML = `
            <button id="mobile-shuffle-btn" class="shuffle-btn">🎲</button>
            <div class="mobile-indicators"></div>
        `;
        
        this.projects.forEach((project, index) => {
            const tile = this.createMobileTile(project, index);
            this.mobileContainer.appendChild(tile);
        });

        this.createMobileIndicators();
        this.showMobileProject(0);
        this.bindMobileTileEvents();
    }

    createMobileIndicators() {
        const indicatorsContainer = this.mobileContainer.querySelector('.mobile-indicators');
        indicatorsContainer.innerHTML = '';
        
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'mobile-indicator';
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                this.showMobileProject(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    createTile(project, index) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.projectId = project.id;
        
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
        
        content.appendChild(title);
        content.appendChild(excerpt);
        content.appendChild(moreBtn);
        tile.appendChild(content);
        
        return tile;
    }

    positionTile(tile, rect, containerWidth, containerHeight) {
        const padding = 8;
        const width = Math.max(rect.width * containerWidth - padding * 2, 100);
        const height = Math.max(rect.height * containerHeight - padding * 2, 100);
        const x = rect.x * containerWidth + padding;
        const y = rect.y * containerHeight + padding;
        
        tile.style.width = `${width}px`;
        tile.style.height = `${height}px`;
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
        
        this.truncateText(tile, width, height);
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
        document.getElementById('shuffle-btn').addEventListener('click', () => {
            this.shuffleLayout();
        });

        document.querySelectorAll('.tile-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tile = e.target.closest('.tile');
                const projectId = tile.dataset.projectId;
                this.openModal(projectId);
            });
        });
    }

    bindMobileTileEvents() {
        document.getElementById('mobile-shuffle-btn').addEventListener('click', () => {
            this.shuffleMobileLayout();
        });

        document.querySelectorAll('.mobile-tile .tile-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tile = e.target.closest('.tile');
                const projectId = tile.dataset.projectId;
                this.openModal(projectId);
            });
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
        const nextIndex = (this.currentMobileIndex + 1) % this.projects.length;
        this.showMobileProject(nextIndex);
    }

    prevMobileProject() {
        const prevIndex = this.currentMobileIndex === 0 ? this.projects.length - 1 : this.currentMobileIndex - 1;
        this.showMobileProject(prevIndex);
    }

    shuffleLayout() {
        if (this.isShuffling) return;
        
        this.isShuffling = true;
        this.seed = Math.random() * 1000000;
        
        const url = new URL(window.location);
        url.searchParams.set('seed', this.seed);
        window.history.pushState({}, '', url);
        
        this.layoutTiles();
        
        setTimeout(() => {
            this.isShuffling = false;
        }, 1000);
    }

    shuffleMobileLayout() {
        if (this.isShuffling) return;
        
        this.isShuffling = true;
        this.currentMobileIndex = Math.floor(Math.random() * this.projects.length);
        this.showMobileProject(this.currentMobileIndex);
        
        setTimeout(() => {
            this.isShuffling = false;
        }, 500);
    }

    openModal(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;

        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <p><strong>Дата создания:</strong> ${new Date(project.created_at).toLocaleDateString('ru-RU')}</p>
        `;
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('project-modal').style.display = 'none';
    }

    animateTilesAppearance() {
        const tiles = this.container.querySelectorAll('.tile');
        const indices = Array.from({length: tiles.length}, (_, i) => i);
        
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WallApp();
});