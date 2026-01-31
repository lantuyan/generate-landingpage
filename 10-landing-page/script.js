/**
 * FLORAE - Organic/Fluid Design Landing Page
 * JavaScript for animations, interactions, and liquid effects
 */

// ============================================
// Utility Functions
// ============================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
};

// ============================================
// Navbar Scroll Effect
// ============================================
class NavbarController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        this.lastScrollY = 0;
        this.isScrollingDown = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.checkScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', debounce(() => this.checkScroll(), 10));

        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());

        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    checkScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }

    toggleMobileMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================
class ScrollAnimator {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.setupElements();
        this.createObserver();
    }

    setupElements() {
        // Add animation classes to elements
        const fadeElements = [
            '.hero-label',
            '.hero-title',
            '.hero-description',
            '.hero-actions',
            '.section-label',
            '.section-title',
            '.section-description',
            '.section-subtitle'
        ];

        fadeElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.closest('.hero')) {
                    el.classList.add('fade-in');
                    this.animatedElements.push(el);
                }
            });
        });

        // Value items
        document.querySelectorAll('.value-item').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 0.15}s`;
            this.animatedElements.push(el);
        });

        // Product cards
        document.querySelectorAll('.product-card').forEach((el, i) => {
            el.classList.add('scale-in');
            el.style.transitionDelay = `${i * 0.2}s`;
            this.animatedElements.push(el);
        });

        // Ritual steps
        document.querySelectorAll('.ritual-step').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.2}s`;
            this.animatedElements.push(el);
        });

        // Stat circles
        document.querySelectorAll('.stat-circle').forEach((el, i) => {
            el.classList.add('scale-in');
            el.style.transitionDelay = `${i * 0.15}s`;
            this.animatedElements.push(el);
        });

        // Science benefits
        document.querySelectorAll('.benefit-item').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 0.15}s`;
            this.animatedElements.push(el);
        });

        // Testimonial cards
        document.querySelectorAll('.testimonial-card').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 0.1}s`;
            this.animatedElements.push(el);
        });
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.animatedElements.forEach(el => observer.observe(el));
    }
}

// ============================================
// Smooth Scroll
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

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
    }

    scrollTo(target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// Blob Mouse Interaction
// ============================================
class BlobInteraction {
    constructor() {
        this.blobs = document.querySelectorAll('.blob');
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        if (window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
                this.mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
            });

            this.animate();
        }
    }

    animate() {
        this.currentX = lerp(this.currentX, this.mouseX, 0.05);
        this.currentY = lerp(this.currentY, this.mouseY, 0.05);

        this.blobs.forEach((blob, i) => {
            const factor = (i + 1) * 0.3;
            blob.style.transform = `translate(${this.currentX * factor}px, ${this.currentY * factor}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Product Card Hover Effects
// ============================================
class ProductCardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.product-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseEnter(e, card) {
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease-out';
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }

    handleMouseLeave(e, card) {
        card.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ============================================
// Testimonial Slider
// ============================================
class TestimonialSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.dots = document.querySelectorAll('.slider-dots .dot');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        if (!this.slider || !this.dots.length) return;

        this.bindEvents();
        this.startAutoplay();
    }

    bindEvents() {
        // Dot click
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Scroll snap detection
        this.slider.addEventListener('scroll', debounce(() => {
            this.updateActiveSlide();
        }, 100));

        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());

        // Touch support
        this.slider.addEventListener('touchstart', () => this.stopAutoplay());
        this.slider.addEventListener('touchend', () => this.startAutoplay());
    }

    updateActiveSlide() {
        const scrollLeft = this.slider.scrollLeft;
        const cardWidth = this.cards[0].offsetWidth + 24; // Including gap
        const newIndex = Math.round(scrollLeft / cardWidth);

        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.dots.length) {
            this.setActiveSlide(newIndex);
        }
    }

    setActiveSlide(index) {
        this.currentIndex = index;
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    goToSlide(index) {
        const cardWidth = this.cards[0].offsetWidth + 24;
        this.slider.scrollTo({
            left: cardWidth * index,
            behavior: 'smooth'
        });
        this.setActiveSlide(index);
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.cards.length;
            this.goToSlide(nextIndex);
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// ============================================
// Form Handling
// ============================================
class FormHandler {
    constructor() {
        this.form = document.querySelector('.cta-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const input = this.form.querySelector('input[type="email"]');
        const button = this.form.querySelector('button');
        const email = input.value;

        if (!this.validateEmail(email)) {
            this.showError(input, 'Please enter a valid email address');
            return;
        }

        // Simulate form submission
        button.innerHTML = '<span>Joining...</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<span>Welcome to Florae!</span>';
            input.value = '';

            setTimeout(() => {
                button.innerHTML = `
                    <span>Join the Journey</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                `;
                button.disabled = false;
            }, 3000);
        }, 1500);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(input, message) {
        input.style.outline = '2px solid #E57373';
        input.placeholder = message;

        setTimeout(() => {
            input.style.outline = '';
            input.placeholder = 'Enter your email';
        }, 3000);
    }
}

// ============================================
// Liquid Cursor Effect
// ============================================
class LiquidCursor {
    constructor() {
        this.cursor = null;
        this.cursorInner = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.innerX = 0;
        this.innerY = 0;

        this.init();
    }

    init() {
        // Only enable on devices with fine pointer
        if (!window.matchMedia('(pointer: fine)').matches) return;

        this.createCursor();
        this.bindEvents();
        this.animate();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'liquid-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(139, 168, 134, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease-out, width 0.3s ease, height 0.3s ease;
            mix-blend-mode: multiply;
        `;

        this.cursorInner = document.createElement('div');
        this.cursorInner.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(139, 168, 134, 0.8);
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
        `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorInner);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .product-card, .value-item');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '60px';
                this.cursor.style.height = '60px';
                this.cursor.style.background = 'radial-gradient(circle, rgba(232, 180, 158, 0.4) 0%, transparent 70%)';
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.background = 'radial-gradient(circle, rgba(139, 168, 134, 0.3) 0%, transparent 70%)';
            });
        });
    }

    animate() {
        // Smooth follow for outer cursor
        this.cursorX = lerp(this.cursorX, this.mouseX, 0.15);
        this.cursorY = lerp(this.cursorY, this.mouseY, 0.15);

        // Faster follow for inner cursor
        this.innerX = lerp(this.innerX, this.mouseX, 0.3);
        this.innerY = lerp(this.innerY, this.mouseY, 0.3);

        this.cursor.style.left = `${this.cursorX}px`;
        this.cursor.style.top = `${this.cursorY}px`;

        this.cursorInner.style.left = `${this.innerX}px`;
        this.cursorInner.style.top = `${this.innerY}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Parallax Effect for Hero
// ============================================
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.floatingElements = document.querySelectorAll('.floating-element');
        this.mainProduct = document.querySelector('.main-product');

        this.init();
    }

    init() {
        if (!this.hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.offsetHeight;

        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;

            this.floatingElements.forEach((el, i) => {
                const speed = (i + 1) * 0.2;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });

            if (this.mainProduct) {
                this.mainProduct.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`;
            }
        }
    }
}

// ============================================
// Counter Animation
// ============================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = new Set();

        this.init();
    }

    init() {
        if (!this.counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);

        if (!match) return;

        const targetValue = parseInt(match[0]);
        const suffix = text.replace(/\d+/g, '');
        let currentValue = 0;
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            currentValue = Math.round(targetValue * easeOutQuart);

            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ============================================
// Ripple Effect on Buttons
// ============================================
class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .product-btn');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.style.overflow = 'hidden';
            button.style.position = 'relative';

            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    }

    createRipple(e, button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Hero Entry Animation
// ============================================
class HeroAnimation {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.elements = {
            label: document.querySelector('.hero-label'),
            title: document.querySelector('.hero-title'),
            description: document.querySelector('.hero-description'),
            actions: document.querySelector('.hero-actions'),
            visual: document.querySelector('.hero-visual')
        };

        this.init();
    }

    init() {
        if (!this.hero) return;

        // Set initial state
        Object.values(this.elements).forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            }
        });

        // Animate in sequence
        window.addEventListener('load', () => this.animate());
    }

    animate() {
        const delays = [100, 300, 500, 700, 400];
        const keys = Object.keys(this.elements);

        keys.forEach((key, i) => {
            const el = this.elements[key];
            if (el) {
                setTimeout(() => {
                    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delays[i]);
            }
        });
    }
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new NavbarController();
    new SmoothScroll();
    new ScrollAnimator();
    new FormHandler();

    // Visual effects
    new HeroAnimation();
    new BlobInteraction();
    new ParallaxEffect();
    new CounterAnimation();
    new TestimonialSlider();

    // Interactive effects
    new ProductCardEffects();
    new RippleEffect();
    new LiquidCursor();

    console.log('Florae - Organic/Fluid Design Landing Page Initialized');
});

// ============================================
// Performance: Pause animations when tab is hidden
// ============================================
document.addEventListener('visibilitychange', () => {
    const blobs = document.querySelectorAll('.blob');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (document.hidden) {
        blobs.forEach(blob => blob.style.animationPlayState = 'paused');
        floatingElements.forEach(el => el.style.animationPlayState = 'paused');
    } else {
        blobs.forEach(blob => blob.style.animationPlayState = 'running');
        floatingElements.forEach(el => el.style.animationPlayState = 'running');
    }
});
