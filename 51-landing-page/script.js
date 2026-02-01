/**
 * KOLLEKTIV - Constructivist Landing Page
 * JavaScript Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    RevealAnimations.init();
    CounterAnimation.init();
    FormHandler.init();
    SmoothScroll.init();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll-based navigation styling
 */
const Navigation = {
    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.links = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');

        if (this.toggle && this.links) {
            this.bindEvents();
        }
    },

    bindEvents() {
        // Mobile menu toggle
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking nav links
        this.navItems.forEach(item => {
            item.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.links.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Add scroll-based styling
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('active');
        document.body.style.overflow = this.links.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu() {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.nav.style.background = scrolled ? 'rgba(10, 10, 10, 0.98)' : 'var(--black)';
        this.nav.style.boxShadow = scrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none';
    }
};

/**
 * Reveal Animations Module
 * Handles scroll-triggered reveal animations using Intersection Observer
 */
const RevealAnimations = {
    init() {
        this.elements = document.querySelectorAll('.reveal-slide, .reveal-construct, .reveal-slide-diagonal');

        if (this.elements.length === 0) return;

        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (this.prefersReducedMotion) {
            this.elements.forEach(el => el.classList.add('visible'));
            return;
        }

        this.createObserver();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered reveal for multiple elements
                    const delay = this.getStaggerDelay(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => this.observer.observe(el));
    },

    getStaggerDelay(element) {
        const parent = element.parentElement;
        if (!parent) return 0;

        const siblings = parent.querySelectorAll('.reveal-slide, .reveal-construct, .reveal-slide-diagonal');
        const index = Array.from(siblings).indexOf(element);
        return index * 100; // 100ms stagger between elements
    }
};

/**
 * Counter Animation Module
 * Animates numbers counting up when they enter the viewport
 */
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('[data-count]');

        if (this.counters.length === 0) return;

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (this.prefersReducedMotion) {
            this.counters.forEach(counter => {
                counter.textContent = this.formatNumber(parseInt(counter.dataset.count));
            });
            return;
        }

        this.createObserver();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => this.observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function - ease out cubic
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic);
            element.textContent = this.formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    },

    formatNumber(num) {
        return num.toLocaleString();
    }
};

/**
 * Form Handler Module
 * Handles form submission with visual feedback
 */
const FormHandler = {
    init() {
        this.form = document.getElementById('joinForm');

        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add visual feedback on radio selection
        const radioOptions = this.form.querySelectorAll('.form-option');
        radioOptions.forEach(option => {
            option.addEventListener('click', () => {
                radioOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    },

    handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span>JOINING...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>WELCOME, COMRADE!</span>';
            submitBtn.style.background = 'var(--ochre)';

            // Reset form after success
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;

                // Remove selected state from radio options
                this.form.querySelectorAll('.form-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }, 3000);
        }, 1500);
    }
};

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
const SmoothScroll = {
    init() {
        this.links = document.querySelectorAll('a[href^="#"]');

        if (this.links.length === 0) return;

        this.bindEvents();
    },

    bindEvents() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e, link));
        });
    },

    handleClick(e, link) {
        const href = link.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (!target) return;

        e.preventDefault();

        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

/**
 * Geometric Animation Module
 * Adds subtle parallax-like movement to geometric background elements
 */
const GeometricAnimation = {
    init() {
        this.elements = document.querySelectorAll('.geo-circle, .geo-triangle, .geo-rect');

        if (this.elements.length === 0) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.bindEvents();
    },

    bindEvents() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

        if (scrollY > heroHeight) return;

        this.elements.forEach((el, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = scrollY * speed;
            const rotation = scrollY * 0.02;

            if (el.classList.contains('geo-circle')) {
                el.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            } else if (el.classList.contains('geo-triangle')) {
                el.style.transform = `translateY(${-yPos * 0.5}px)`;
            } else {
                el.style.transform = `translateY(${yPos * 0.3}px) rotate(-25deg)`;
            }
        });
    }
};

// Initialize geometric animation
GeometricAnimation.init();

/**
 * Diagonal Line Drawing Animation
 * Creates a drawing effect for decorative lines
 */
const LineDrawing = {
    init() {
        const lines = document.querySelectorAll('.geo-line');

        if (lines.length === 0) return;

        lines.forEach((line, index) => {
            line.style.width = '0';
            line.style.transition = `width 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
        });

        // Trigger animation after a short delay
        setTimeout(() => {
            lines.forEach(line => {
                const originalWidth = getComputedStyle(line).getPropertyValue('--original-width') ||
                    (line.classList.contains('geo-line-1') ? '200px' :
                     line.classList.contains('geo-line-2') ? '150px' : '100px');
                line.style.width = originalWidth;
            });
        }, 800);
    }
};

// Initialize line drawing
LineDrawing.init();

/**
 * Power Card Hover Effect
 * Adds mechanical slide effect on hover
 */
const PowerCardEffect = {
    init() {
        const cards = document.querySelectorAll('.power-card');

        if (cards.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    },

    handleMouseEnter(e, card) {
        const number = card.querySelector('.power-card-number');
        if (number) {
            number.style.transform = 'translateX(-10px) rotate(-5deg)';
            number.style.opacity = '0.8';
        }
    },

    handleMouseLeave(e, card) {
        const number = card.querySelector('.power-card-number');
        if (number) {
            number.style.transform = '';
            number.style.opacity = '';
        }
    }
};

// Initialize power card effect
PowerCardEffect.init();
