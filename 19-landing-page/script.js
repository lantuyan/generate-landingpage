/**
 * GEOMÉTRIE - Neo-Geo Landing Page
 * Interactive geometric animations and effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initGeometricCanvas();
    initCollectionArt();
    initCounterAnimation();
    initFormHandler();
    initRevealAnimations();
});

/**
 * Navigation Module
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    // Scroll detection
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll Effects Module
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for geometric shapes
    const geoShapes = document.querySelectorAll('.geo-shape');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        geoShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/**
 * Geometric Canvas Art Generator
 */
function initGeometricCanvas() {
    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    heroCanvas.appendChild(canvas);

    function resize() {
        canvas.width = heroCanvas.offsetWidth;
        canvas.height = heroCanvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Color palette
    const colors = {
        coral: '#ff6b5b',
        teal: '#00b4a0',
        yellow: '#ffd23f',
        indigo: '#1a1a4e'
    };

    // Geometric shapes array
    const shapes = [];
    const shapeCount = 15;

    class GeometricShape {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 60 + 20;
            this.type = Math.floor(Math.random() * 4); // 0: circle, 1: triangle, 2: square, 3: hexagon
            this.color = Object.values(colors)[Math.floor(Math.random() * 4)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.filled = Math.random() > 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;

            // Wrap around edges
            if (this.x < -this.size) this.x = canvas.width + this.size;
            if (this.x > canvas.width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = canvas.height + this.size;
            if (this.y > canvas.height + this.size) this.y = -this.size;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            if (this.filled) {
                ctx.fillStyle = this.color;
            } else {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
            }

            switch (this.type) {
                case 0: // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    this.filled ? ctx.fill() : ctx.stroke();
                    break;

                case 1: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                    this.filled ? ctx.fill() : ctx.stroke();
                    break;

                case 2: // Square
                    if (this.filled) {
                        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    } else {
                        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    }
                    break;

                case 3: // Hexagon
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI / 3) * i - Math.PI / 2;
                        const x = (this.size / 2) * Math.cos(angle);
                        const y = (this.size / 2) * Math.sin(angle);
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.closePath();
                    this.filled ? ctx.fill() : ctx.stroke();
                    break;
            }

            ctx.restore();
        }
    }

    // Create shapes
    for (let i = 0; i < shapeCount; i++) {
        shapes.push(new GeometricShape());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connecting lines between nearby shapes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < shapes.length; i++) {
            for (let j = i + 1; j < shapes.length; j++) {
                const dx = shapes[i].x - shapes[j].x;
                const dy = shapes[i].y - shapes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.globalAlpha = (1 - distance / 150) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(shapes[i].x, shapes[i].y);
                    ctx.lineTo(shapes[j].x, shapes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw shapes
        shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Mouse interaction
    let mouse = { x: null, y: null };
    heroCanvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        // Repel shapes from mouse
        shapes.forEach(shape => {
            const dx = shape.x - mouse.x;
            const dy = shape.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                shape.vx += (dx / distance) * force * 0.5;
                shape.vy += (dy / distance) * force * 0.5;
            }
        });
    });
}

/**
 * Collection Art Generator
 */
function initCollectionArt() {
    const artCanvases = [
        { id: 'art-1', pattern: 'circles' },
        { id: 'art-2', pattern: 'triangles' },
        { id: 'art-3', pattern: 'hexagons' },
        { id: 'art-4', pattern: 'squares' }
    ];

    const workThumbs = [
        { id: 'work-1', pattern: 'mandala' },
        { id: 'work-2', pattern: 'spiral' },
        { id: 'work-3', pattern: 'grid' }
    ];

    const colors = {
        coral: '#ff6b5b',
        teal: '#00b4a0',
        yellow: '#ffd23f',
        indigo: '#1a1a4e',
        indigoDeep: '#0d0d2b'
    };

    function createPatternCanvas(container, pattern) {
        if (!container) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            draw();
        }

        function draw() {
            // Background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, colors.indigoDeep);
            gradient.addColorStop(1, colors.indigo);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            switch (pattern) {
                case 'circles':
                    drawCirclePattern(ctx, canvas);
                    break;
                case 'triangles':
                    drawTrianglePattern(ctx, canvas);
                    break;
                case 'hexagons':
                    drawHexagonPattern(ctx, canvas);
                    break;
                case 'squares':
                    drawSquarePattern(ctx, canvas);
                    break;
                case 'mandala':
                    drawMandalaPattern(ctx, canvas);
                    break;
                case 'spiral':
                    drawSpiralPattern(ctx, canvas);
                    break;
                case 'grid':
                    drawGridPattern(ctx, canvas);
                    break;
            }
        }

        function drawCirclePattern(ctx, canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;

            for (let i = 8; i > 0; i--) {
                const radius = (maxRadius / 8) * i;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.strokeStyle = i % 2 === 0 ? colors.coral : colors.teal;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.3 + (i * 0.05);
                ctx.stroke();
            }

            // Inner filled circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = colors.yellow;
            ctx.globalAlpha = 0.8;
            ctx.fill();
        }

        function drawTrianglePattern(ctx, canvas) {
            const size = Math.min(canvas.width, canvas.height) * 0.25;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let layer = 0; layer < 4; layer++) {
                const layerSize = size * (1 + layer * 0.5);
                const rotation = layer * 0.3;

                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(rotation);

                ctx.beginPath();
                ctx.moveTo(0, -layerSize);
                ctx.lineTo(layerSize * 0.866, layerSize * 0.5);
                ctx.lineTo(-layerSize * 0.866, layerSize * 0.5);
                ctx.closePath();

                ctx.strokeStyle = layer % 2 === 0 ? colors.coral : colors.teal;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.4 - (layer * 0.08);
                ctx.stroke();

                ctx.restore();
            }

            // Center triangle filled
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.3);
            ctx.lineTo(size * 0.26, size * 0.15);
            ctx.lineTo(-size * 0.26, size * 0.15);
            ctx.closePath();
            ctx.fillStyle = colors.yellow;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.restore();
        }

        function drawHexagonPattern(ctx, canvas) {
            const size = Math.min(canvas.width, canvas.height) * 0.12;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            function drawHexagon(x, y, s, color, filled) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    const hx = x + s * Math.cos(angle);
                    const hy = y + s * Math.sin(angle);
                    if (i === 0) {
                        ctx.moveTo(hx, hy);
                    } else {
                        ctx.lineTo(hx, hy);
                    }
                }
                ctx.closePath();
                if (filled) {
                    ctx.fillStyle = color;
                    ctx.fill();
                } else {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }

            // Center hexagon
            ctx.globalAlpha = 0.8;
            drawHexagon(centerX, centerY, size, colors.coral, true);

            // Surrounding hexagons
            const ringColors = [colors.teal, colors.yellow, colors.coral];
            for (let ring = 1; ring <= 2; ring++) {
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    const hx = centerX + size * 1.75 * ring * Math.cos(angle);
                    const hy = centerY + size * 1.75 * ring * Math.sin(angle);
                    ctx.globalAlpha = 0.4 - (ring * 0.1);
                    drawHexagon(hx, hy, size * 0.8, ringColors[(i + ring) % 3], false);
                }
            }
        }

        function drawSquarePattern(ctx, canvas) {
            const size = Math.min(canvas.width, canvas.height) * 0.2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 5; i > 0; i--) {
                const squareSize = size * (i * 0.4);
                const rotation = i * 0.15;

                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(rotation);
                ctx.globalAlpha = 0.2 + (i * 0.1);

                if (i === 1) {
                    ctx.fillStyle = colors.yellow;
                    ctx.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
                } else {
                    ctx.strokeStyle = i % 2 === 0 ? colors.coral : colors.teal;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
                }

                ctx.restore();
            }
        }

        function drawMandalaPattern(ctx, canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.35;

            for (let ring = 0; ring < 3; ring++) {
                const ringRadius = radius * (0.4 + ring * 0.3);
                const segments = 8 + ring * 4;

                for (let i = 0; i < segments; i++) {
                    const angle = (Math.PI * 2 / segments) * i;
                    const x = centerX + Math.cos(angle) * ringRadius;
                    const y = centerY + Math.sin(angle) * ringRadius;

                    ctx.beginPath();
                    ctx.arc(x, y, 5 - ring, 0, Math.PI * 2);
                    ctx.fillStyle = ring === 0 ? colors.coral : ring === 1 ? colors.teal : colors.yellow;
                    ctx.globalAlpha = 0.6;
                    ctx.fill();
                }
            }
        }

        function drawSpiralPattern(ctx, canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.beginPath();
            ctx.globalAlpha = 0.5;

            for (let i = 0; i < 200; i++) {
                const angle = 0.1 * i;
                const radius = 2 * i * 0.15;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.strokeStyle = colors.coral;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        function drawGridPattern(ctx, canvas) {
            const gridSize = 8;
            const cellWidth = canvas.width / gridSize;
            const cellHeight = canvas.height / gridSize;

            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if ((x + y) % 3 === 0) {
                        ctx.fillStyle = colors.coral;
                        ctx.globalAlpha = 0.4;
                        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 2, cellHeight - 2);
                    } else if ((x + y) % 3 === 1) {
                        ctx.strokeStyle = colors.teal;
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 0.5;
                        ctx.strokeRect(x * cellWidth + 4, y * cellHeight + 4, cellWidth - 10, cellHeight - 10);
                    }
                }
            }
        }

        resize();
        window.addEventListener('resize', resize);
    }

    // Create all art canvases
    artCanvases.forEach(({ id, pattern }) => {
        const container = document.getElementById(id);
        createPatternCanvas(container, pattern);
    });

    workThumbs.forEach(({ id, pattern }) => {
        const container = document.getElementById(id);
        createPatternCanvas(container, pattern);
    });
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(easeOutQuart * target);
            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Form Handler
 */
function initFormHandler() {
    const form = document.getElementById('subscribe-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.querySelector('.btn-text').textContent;

        // Add loading state
        button.disabled = true;
        button.querySelector('.btn-text').textContent = 'Subscribing...';

        // Simulate API call
        setTimeout(() => {
            button.querySelector('.btn-text').textContent = 'Subscribed!';
            button.style.background = '#00b4a0';
            input.value = '';

            // Reset after delay
            setTimeout(() => {
                button.disabled = false;
                button.querySelector('.btn-text').textContent = originalText;
                button.style.background = '';
            }, 3000);
        }, 1500);
    });
}

/**
 * Reveal Animations on Scroll
 */
function initRevealAnimations() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-header, .process-step, .collection-item, .pricing-card, .testimonial, .artists-info, .artists-visual'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Stagger children for specific containers
    const staggerContainers = document.querySelectorAll('.process-grid, .collection-grid, .pricing-grid, .testimonials-grid');
    staggerContainers.forEach(container => container.classList.add('stagger-children'));

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Add transition to stagger children
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    staggerContainers.forEach(el => observer.observe(el));
}

/**
 * Tilt Effect for Collection Items
 */
document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});
