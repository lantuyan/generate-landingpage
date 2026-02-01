/**
 * LUMINA - Art Installation Landing Page
 * Interactive JavaScript for immersive experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    CustomCursor.init();
    Navigation.init();
    ScrollAnimations.init();
    ParallaxEffects.init();
    InteractiveElements.init();
});

/**
 * Custom Cursor Module
 * Creates an art-gallery-like cursor that follows mouse movement
 */
const CustomCursor = {
    cursor: null,
    ring: null,
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    ringX: 0,
    ringY: 0,

    init() {
        this.cursor = document.querySelector('.cursor-follower');
        this.ring = document.querySelector('.cursor-ring');

        if (!this.cursor || !this.ring || window.innerWidth <= 768) return;

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.addHoverListeners();
        this.animate();
    },

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    },

    animate() {
        // Smooth cursor follow with easing
        const cursorEase = 0.2;
        const ringEase = 0.1;

        this.cursorX += (this.mouseX - this.cursorX) * cursorEase;
        this.cursorY += (this.mouseY - this.cursorY) * cursorEase;

        this.ringX += (this.mouseX - this.ringX) * ringEase;
        this.ringY += (this.mouseY - this.ringY) * ringEase;

        this.cursor.style.left = `${this.cursorX}px`;
        this.cursor.style.top = `${this.cursorY}px`;

        this.ring.style.left = `${this.ringX}px`;
        this.ring.style.top = `${this.ringY}px`;

        requestAnimationFrame(() => this.animate());
    },

    addHoverListeners() {
        const interactiveElements = document.querySelectorAll('a, button, .exhibition-card, .feature, .visit-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.ring.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.ring.classList.remove('hover');
            });
        });
    }
};

/**
 * Navigation Module
 * Handles sticky nav, mobile menu, and smooth scrolling
 */
const Navigation = {
    nav: null,
    toggle: null,
    mobileMenu: null,
    lastScroll: 0,

    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');

        if (!this.nav) return;

        this.bindEvents();
    },

    bindEvents() {
        // Scroll handling for nav background
        window.addEventListener('scroll', () => this.onScroll());

        // Mobile menu toggle
        if (this.toggle && this.mobileMenu) {
            this.toggle.addEventListener('click', () => this.toggleMobileMenu());

            // Close menu when clicking links
            const mobileLinks = this.mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });
    },

    onScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class for nav background
        if (currentScroll > 100) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
    },

    toggleMobileMenu() {
        this.toggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.toggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    },

    smoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
};

/**
 * Scroll Animations Module
 * Reveals elements as they enter the viewport
 */
const ScrollAnimations = {
    elements: [],
    observer: null,

    init() {
        this.setupObserver();
        this.observeElements();
    },

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optionally unobserve after reveal
                    // this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },

    observeElements() {
        // Add reveal class to elements that should animate
        const selectors = [
            '.section-header',
            '.exhibition-card',
            '.feature',
            '.about-content',
            '.about-visual',
            '.visit-card',
            '.visit-info .info-item',
            '.experience-quote'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal');
                this.observer.observe(el);
            });
        });

        // Stagger animation for grid items
        this.staggerElements('.exhibition-grid .exhibition-card', 100);
        this.staggerElements('.experience-features .feature', 100);
        this.staggerElements('.visit-options .visit-card', 100);
    },

    staggerElements(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * delay}ms`;
        });
    }
};

/**
 * Parallax Effects Module
 * Creates depth and movement effects based on scroll
 */
const ParallaxEffects = {
    layers: [],
    ticking: false,

    init() {
        this.layers = [
            { el: document.querySelector('.projection-1'), speed: 0.05 },
            { el: document.querySelector('.projection-2'), speed: 0.08 },
            { el: document.querySelector('.projection-3'), speed: 0.03 },
            { el: document.querySelector('.hero-content'), speed: 0.02 }
        ].filter(layer => layer.el);

        if (this.layers.length === 0) return;

        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    },

    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateParallax();
                this.ticking = false;
            });
            this.ticking = true;
        }
    },

    updateParallax() {
        const scrollY = window.pageYOffset;

        this.layers.forEach(layer => {
            const yOffset = scrollY * layer.speed;
            layer.el.style.transform = `translateY(${yOffset}px)`;
        });
    },

    onMouseMove(e) {
        // Subtle mouse parallax for hero projections
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom < 0) return; // Skip if hero is not visible

        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        const projections = document.querySelectorAll('.projection-layer');
        projections.forEach((proj, index) => {
            const depth = (index + 1) * 10;
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            proj.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
};

/**
 * Interactive Elements Module
 * Handles card interactions and dynamic effects
 */
const InteractiveElements = {
    init() {
        this.initCardEffects();
        this.initLightBeams();
        this.initCounterAnimation();
    },

    initCardEffects() {
        const cards = document.querySelectorAll('.exhibition-card, .visit-card, .feature');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleCardHover(e, card));
            card.addEventListener('mouseleave', () => this.resetCard(card));
        });
    },

    handleCardHover(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    },

    resetCard(card) {
        card.style.transform = '';
    },

    initLightBeams() {
        const beams = document.querySelectorAll('.light-beam');

        // Randomize beam positions on load
        beams.forEach(beam => {
            const randomDelay = Math.random() * 5;
            beam.style.animationDelay = `-${randomDelay}s`;
        });
    },

    initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number, .about-stat-number');

        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    },

    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/^(\d+)/);

        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = text.replace(match[1], '');
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let current = 0;

        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, stepDuration);
    }
};

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Page Load Enhancements
 */
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');

    // Initialize any lazy-loaded content
    initLazyContent();
});

function initLazyContent() {
    // Placeholder for lazy loading implementation
    // Could be used for images or heavy content
}

/**
 * Resize Handler
 */
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments
    if (window.innerWidth <= 768) {
        // Mobile-specific adjustments
        document.querySelector('.cursor-follower')?.style.setProperty('display', 'none');
        document.querySelector('.cursor-ring')?.style.setProperty('display', 'none');
    } else {
        document.querySelector('.cursor-follower')?.style.removeProperty('display');
        document.querySelector('.cursor-ring')?.style.removeProperty('display');
    }
}, 250));
