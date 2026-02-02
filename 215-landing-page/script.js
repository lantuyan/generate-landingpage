/**
 * HAVEN CALENDAR — Zen Kinetics & Interactions
 * Gentle, mindful interactions that honor the emotional nature of the experience
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        scrollReveal: {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        },
        sparks: {
            interval: 8000,     // Time between spark waves
            density: 3,         // Sparks per wave
            enabled: true
        },
        nav: {
            scrollThreshold: 100
        }
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const elements = {
        nav: document.getElementById('nav'),
        navToggle: document.querySelector('.nav-toggle'),
        navLinks: document.querySelector('.nav-links'),
        navLinksItems: document.querySelectorAll('.nav-link'),
        sparksContainer: document.querySelector('.sparks-container'),
        revealElements: document.querySelectorAll('.island, .feature-island, .testimonial-island, .section-header, .begin-content'),
        featureIslands: document.querySelectorAll('.feature-island'),
        calendarCells: document.querySelectorAll('.calendar-cell.marked')
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    const utils = {
        // Throttle function for performance
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if reduced motion is preferred
        prefersReducedMotion: () => {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        // Random number between min and max
        random: (min, max) => Math.random() * (max - min) + min,

        // Generate random integer
        randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };

    // ============================================
    // NAVIGATION
    // ============================================
    
    const Navigation = {
        init() {
            this.bindEvents();
            this.checkScroll();
        },

        bindEvents() {
            // Scroll handling for nav background
            window.addEventListener('scroll', utils.throttle(() => {
                this.checkScroll();
            }, 100));

            // Mobile menu toggle
            if (elements.navToggle) {
                elements.navToggle.addEventListener('click', () => {
                    this.toggleMenu();
                });
            }

            // Close menu when clicking a link
            elements.navLinksItems.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });
        },

        checkScroll() {
            const scrollY = window.scrollY;
            if (scrollY > CONFIG.nav.scrollThreshold) {
                elements.nav.classList.add('nav--scrolled');
            } else {
                elements.nav.classList.remove('nav--scrolled');
            }
        },

        toggleMenu() {
            const isOpen = elements.navLinks.classList.contains('active');
            if (isOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },

        openMenu() {
            elements.navLinks.classList.add('active');
            elements.nav.classList.add('nav--menu-open');
            elements.navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        },

        closeMenu() {
            elements.navLinks.classList.remove('active');
            elements.nav.classList.remove('nav--menu-open');
            elements.navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    };

    // ============================================
    // SCROLL REVEAL
    // ============================================
    
    const ScrollReveal = {
        observer: null,

        init() {
            if (utils.prefersReducedMotion()) {
                // Show all elements immediately if reduced motion is preferred
                elements.revealElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.reveal(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: CONFIG.scrollReveal.threshold,
                rootMargin: CONFIG.scrollReveal.rootMargin
            });

            elements.revealElements.forEach(el => {
                el.classList.add('reveal');
                this.observer.observe(el);
            });

            // Feature islands get staggered reveal
            const featureGrid = document.querySelector('.features-grid');
            if (featureGrid) {
                featureGrid.classList.add('reveal-children');
                this.observer.observe(featureGrid);
            }
        },

        reveal(element) {
            // Add a small random delay for natural feel
            const delay = utils.random(0, 150);
            setTimeout(() => {
                element.classList.add('visible');
            }, delay);
        }
    };

    // ============================================
    // RARE SPARKS — Gentle ambient particles
    // ============================================
    
    const Sparks = {
        interval: null,

        init() {
            if (utils.prefersReducedMotion() || !CONFIG.sparks.enabled) {
                return;
            }

            this.start();
        },

        start() {
            // Create initial spark after a short delay
            setTimeout(() => this.createWave(), 2000);
            
            // Continue creating sparks at intervals
            this.interval = setInterval(() => {
                this.createWave();
            }, CONFIG.sparks.interval);
        },

        stop() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        },

        createWave() {
            const count = utils.randomInt(1, CONFIG.sparks.density);
            for (let i = 0; i < count; i++) {
                setTimeout(() => this.createSpark(), i * 400);
            }
        },

        createSpark() {
            if (!elements.sparksContainer) return;

            const spark = document.createElement('div');
            spark.className = 'spark';
            
            // Random horizontal position
            const x = utils.random(5, 95);
            spark.style.left = `${x}%`;
            spark.style.bottom = '-10px';
            
            // Random size variation
            const size = utils.random(2, 4);
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            
            // Random animation duration
            const duration = utils.random(6, 12);
            spark.style.animationDuration = `${duration}s`;

            elements.sparksContainer.appendChild(spark);

            // Clean up after animation
            setTimeout(() => {
                if (spark.parentNode) {
                    spark.parentNode.removeChild(spark);
                }
            }, duration * 1000);
        }
    };

    // ============================================
    // FEATURE ISLANDS — Interactive hover effects
    // ============================================
    
    const FeatureIslands = {
        init() {
            elements.featureIslands.forEach(island => {
                island.addEventListener('mouseenter', (e) => {
                    this.onHover(e.currentTarget);
                });
                
                island.addEventListener('mouseleave', (e) => {
                    this.onLeave(e.currentTarget);
                });
            });
        },

        onHover(island) {
            // Subtle parallax effect on icon
            const icon = island.querySelector('.feature-icon');
            if (icon && !utils.prefersReducedMotion()) {
                icon.style.transform = 'translateY(-4px)';
            }
        },

        onLeave(island) {
            const icon = island.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = '';
            }
        }
    };

    // ============================================
    // CALENDAR INTERACTIONS
    // ============================================
    
    const CalendarPreview = {
        init() {
            elements.calendarCells.forEach(cell => {
                cell.addEventListener('click', () => {
                    this.onCellClick(cell);
                });
            });
        },

        onCellClick(cell) {
            // Gentle feedback without being jarring
            cell.style.transform = 'scale(0.95)';
            setTimeout(() => {
                cell.style.transform = '';
            }, 150);

            // Could show a tooltip or modal in a full implementation
            const date = cell.querySelector('.date-number')?.textContent;
            if (date) {
                console.log(`Date ${date} selected - In full app, this would show preparation options`);
            }
        }
    };

    // ============================================
    // SMOOTH SCROLL — Gentle easing
    // ============================================
    
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.scrollTo(target);
                    }
                });
            });
        },

        scrollTo(target) {
            const navHeight = elements.nav?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            if (utils.prefersReducedMotion()) {
                window.scrollTo(0, targetPosition);
                return;
            }

            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let startTime = null;

            const easeInOutCubic = (t) => {
                return t < 0.5 
                    ? 4 * t * t * t 
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };

            const animate = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    };

    // ============================================
    // GENTLE CURSOR — Optional ambient effect
    // ============================================
    
    const GentleCursor = {
        cursor: null,
        isActive: false,

        init() {
            // Skip on touch devices
            if (window.matchMedia('(pointer: coarse)').matches) return;
            if (utils.prefersReducedMotion()) return;

            this.createCursor();
            this.bindEvents();
        },

        createCursor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'gentle-cursor';
            this.cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border: 1px solid rgba(212, 165, 116, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.15s ease-out, opacity 0.3s ease;
                opacity: 0;
                mix-blend-mode: difference;
            `;
            document.body.appendChild(this.cursor);
        },

        bindEvents() {
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                if (!this.isActive) {
                    this.isActive = true;
                    this.cursor.style.opacity = '1';
                    this.animate();
                }
            });

            document.addEventListener('mouseleave', () => {
                this.cursor.style.opacity = '0';
                this.isActive = false;
            });

            // Scale up on interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .island, .feature-island');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.transform = 'scale(2)';
                    this.cursor.style.borderColor = 'rgba(212, 165, 116, 0.6)';
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursor.style.borderColor = 'rgba(212, 165, 116, 0.3)';
                });
            });

            this.animate = () => {
                if (!this.isActive) return;

                // Smooth follow
                cursorX += (mouseX - cursorX) * 0.15;
                cursorY += (mouseY - cursorY) * 0.15;

                this.cursor.style.left = `${cursorX - 10}px`;
                this.cursor.style.top = `${cursorY - 10}px`;

                requestAnimationFrame(this.animate);
            };
        }
    };

    // ============================================
    // FORM HANDLING
    // ============================================
    
    const FormHandler = {
        init() {
            const form = document.querySelector('.signup-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    this.handleSubmit(e, form);
                });
            }
        },

        handleSubmit(e, form) {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button[type="submit"]');
            
            if (input && input.value) {
                // Show gentle feedback
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="btn-text">Welcome to Haven</span>';
                button.style.background = 'var(--color-spark)';
                button.style.borderColor = 'var(--color-spark)';
                button.style.color = 'var(--color-gray-900)';
                
                input.value = '';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.style.borderColor = '';
                    button.style.color = '';
                }, 3000);
            }
        }
    };

    // ============================================
    // VISIBILITY API — Pause animations when tab hidden
    // ============================================
    
    const VisibilityHandler = {
        init() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    Sparks.stop();
                } else {
                    Sparks.start();
                }
            });
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        Navigation.init();
        ScrollReveal.init();
        Sparks.init();
        FeatureIslands.init();
        CalendarPreview.init();
        SmoothScroll.init();
        FormHandler.init();
        VisibilityHandler.init();
        
        // Gentle cursor is optional - uncomment to enable
        // GentleCursor.init();

        console.log('🕯️ Haven Calendar initialized — Gentle support for difficult days');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
