/**
 * OceanGuard - Coastal Design Landing Page
 * Interactive JavaScript for fluid, wave-like interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    StatsCounter.init();
    Carousel.init();
    NewsletterForm.init();
    RippleEffect.init();
});

/**
 * Navigation Module
 * Handles navbar scroll effects and mobile toggle
 */
const Navigation = {
    init() {
        this.navbar = document.querySelector('.navbar');
        this.toggle = document.querySelector('.nav-toggle');
        this.links = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');

        this.bindEvents();
        this.checkScroll();
    },

    bindEvents() {
        // Scroll effect
        window.addEventListener('scroll', () => this.checkScroll());

        // Mobile toggle
        this.toggle?.addEventListener('click', () => this.toggleMobile());

        // Close mobile nav on link click
        this.navItems.forEach(item => {
            item.addEventListener('click', () => this.closeMobile());
        });

        // Close mobile nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMobile();
        });
    },

    checkScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar?.classList.toggle('scrolled', scrolled);
    },

    toggleMobile() {
        this.toggle?.classList.toggle('active');
        this.links?.classList.toggle('active');
        document.body.style.overflow = this.links?.classList.contains('active') ? 'hidden' : '';
    },

    closeMobile() {
        this.toggle?.classList.remove('active');
        this.links?.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Scroll Animations Module
 * Handles fade-in animations on scroll using Intersection Observer
 */
const ScrollAnimations = {
    init() {
        this.animatedElements = document.querySelectorAll(
            '.section-header, .program-card, .stat-item, .timeline-item, .membership-card, .story-card'
        );

        this.setupObserver();
        this.addFadeClass();
    },

    addFadeClass() {
        this.animatedElements.forEach(el => {
            el.classList.add('fade-in');
        });
    },

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay for grid items
                    const parent = entry.target.parentElement;
                    if (parent?.classList.contains('programs-grid') ||
                        parent?.classList.contains('membership-options') ||
                        parent?.classList.contains('mission-stats') ||
                        parent?.classList.contains('impact-timeline')) {
                        const siblings = Array.from(parent.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.15}s`;
                    }

                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(el => observer.observe(el));
    }
};

/**
 * Stats Counter Module
 * Animated number counting for statistics
 */
const StatsCounter = {
    init() {
        this.stats = document.querySelectorAll('.stat-number[data-count]');
        this.setupObserver();
    },

    setupObserver() {
        const options = {
            root: null,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.stats.forEach(stat => observer.observe(stat));
    },

    animateCount(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const updateCount = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

            element.textContent = this.formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };

        requestAnimationFrame(updateCount);
    },

    formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    }
};

/**
 * Carousel Module
 * Stories carousel with navigation
 */
const Carousel = {
    init() {
        this.container = document.querySelector('.stories-carousel');
        this.cards = document.querySelectorAll('.story-card');
        this.dots = document.querySelectorAll('.carousel-dots .dot');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.currentIndex = 0;
        this.autoplayInterval = null;

        if (this.cards.length === 0) return;

        this.bindEvents();
        this.startAutoplay();
    },

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => {
            this.navigate(-1);
            this.resetAutoplay();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.navigate(1);
            this.resetAutoplay();
        });

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goTo(index);
                this.resetAutoplay();
            });
        });

        // Pause autoplay on hover
        this.container?.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container?.addEventListener('mouseleave', () => this.startAutoplay());

        // Keyboard navigation
        this.container?.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigate(-1);
                this.resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                this.navigate(1);
                this.resetAutoplay();
            }
        });

        // Touch/swipe support
        this.setupSwipe();
    },

    setupSwipe() {
        let startX = 0;
        let endX = 0;

        this.container?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.container?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.navigate(1);
                } else {
                    this.navigate(-1);
                }
                this.resetAutoplay();
            }
        }, { passive: true });
    },

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex < 0) {
            this.goTo(this.cards.length - 1);
        } else if (newIndex >= this.cards.length) {
            this.goTo(0);
        } else {
            this.goTo(newIndex);
        }
    },

    goTo(index) {
        // Update cards
        this.cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    },

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.navigate(1);
        }, 6000);
    },

    pauseAutoplay() {
        clearInterval(this.autoplayInterval);
    },

    resetAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }
};

/**
 * Newsletter Form Module
 * Handles form submission with visual feedback
 */
const NewsletterForm = {
    init() {
        this.form = document.getElementById('newsletter-form');
        this.bindEvents();
    },

    bindEvents() {
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();
        const input = this.form.querySelector('input[type="email"]');
        const button = this.form.querySelector('button[type="submit"]');
        const email = input.value;

        if (!this.validateEmail(email)) {
            this.showError(input, 'Please enter a valid email address');
            return;
        }

        // Simulate form submission
        button.disabled = true;
        button.textContent = 'Sending...';

        setTimeout(() => {
            this.showSuccess(input, button);
        }, 1500);
    },

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    showError(input, message) {
        input.style.borderColor = '#e74c3c';

        // Remove existing error message
        const existingError = this.form.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorEl = document.createElement('p');
        errorEl.className = 'error-message';
        errorEl.style.cssText = 'color: #e74c3c; font-size: 0.85rem; margin-top: 0.5rem;';
        errorEl.textContent = message;
        this.form.querySelector('.input-wrapper').after(errorEl);

        setTimeout(() => {
            input.style.borderColor = '';
            errorEl.remove();
        }, 3000);
    },

    showSuccess(input, button) {
        input.value = '';
        button.textContent = 'Subscribed!';
        button.style.background = '#5BB5C5';

        // Update note text
        const note = this.form.querySelector('.form-note');
        note.textContent = 'Welcome aboard! Check your inbox for confirmation.';
        note.style.color = '#3D8A9C';

        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Subscribe';
            button.style.background = '';
            note.textContent = 'Join 50,000+ ocean guardians. Unsubscribe anytime.';
            note.style.color = '';
        }, 4000);
    }
};

/**
 * Ripple Effect Module
 * Creates water ripple effect on button clicks
 */
const RippleEffect = {
    init() {
        this.buttons = document.querySelectorAll('.btn');
        this.bindEvents();
    },

    bindEvents() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    },

    createRipple(e, button) {
        // Remove any existing ripple
        const existingRipple = button.querySelector('.ripple-wave');
        if (existingRipple) existingRipple.remove();

        const ripple = document.createElement('span');
        ripple.className = 'ripple-wave';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out forwards;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
};

/**
 * Smooth Scroll Enhancement
 * Adds offset for fixed header
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Add ripple animation keyframes dynamically
 */
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

/**
 * Parallax effect for hero waves
 */
const heroWaves = document.querySelector('.hero-waves');
if (heroWaves) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        if (scrolled < heroHeight) {
            heroWaves.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
}

/**
 * Gentle floating animation for elements
 */
const addGentleFloat = () => {
    const floatElements = document.querySelectorAll('.float-circle');
    floatElements.forEach((el, i) => {
        el.style.animationDelay = `${i * -5}s`;
    });
};
addGentleFloat();
