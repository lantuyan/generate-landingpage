/**
 * Summit Expeditions - Mountain/Alpine Landing Page
 * JavaScript for animations and interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    HeroAnimations.init();
    ScrollReveal.init();
    Carousel.init();
    ContactForm.init();
    CounterAnimation.init();
    ParallaxEffects.init();
});

/**
 * Navigation Module
 * Handles navbar scroll effects and mobile menu
 */
const Navigation = {
    navbar: null,
    navToggle: null,
    navLinks: null,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');

        this.setupScrollListener();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },

    setupScrollListener() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll(window.scrollY);
                    lastScrollY = window.scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        this.handleScroll(window.scrollY);
    },

    handleScroll(scrollY) {
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    setupMobileMenu() {
        if (!this.navToggle) return;

        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
            document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const links = this.navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.navToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Hero Animations Module
 * Handles hero section entry animations
 */
const HeroAnimations = {
    init() {
        // Animate mountain layers on load
        this.animateMountains();
    },

    animateMountains() {
        const layers = document.querySelectorAll('.mountain-layer');

        layers.forEach((layer, index) => {
            layer.style.opacity = '0';
            layer.style.transform = 'translateY(50px)';

            setTimeout(() => {
                layer.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                layer.style.opacity = '';
                layer.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }
};

/**
 * Scroll Reveal Module
 * Reveals elements as they enter the viewport
 */
const ScrollReveal = {
    elements: [],

    init() {
        // Select all elements that should be revealed
        const selectors = [
            '.expedition-card',
            '.timeline-item',
            '.guide-card',
            '.section-header',
            '.contact-info',
            '.contact-form'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal');
                this.elements.push(el);
            });
        });

        this.setupObserver();
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
                    entry.target.classList.add('visible');
                    // Optionally unobserve after revealing
                    // observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));
    }
};

/**
 * Carousel Module
 * Handles testimonial story carousel
 */
const Carousel = {
    cards: [],
    dots: [],
    currentIndex: 0,
    autoplayInterval: null,

    init() {
        this.cards = document.querySelectorAll('.story-card');
        this.dots = document.querySelectorAll('.carousel-dots .dot');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        if (this.cards.length === 0) return;

        // Setup controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        // Setup dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Start autoplay
        this.startAutoplay();

        // Pause autoplay on hover
        const carousel = document.querySelector('.stories-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport(carousel)) {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    },

    goTo(index) {
        // Remove active from current
        this.cards[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active to new
        this.cards[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    },

    next() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goTo(nextIndex);
    },

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.goTo(prevIndex);
    },

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), 6000);
    },

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    },

    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * Contact Form Module
 * Handles form validation and submission
 */
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add input animations
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleFocus(input));
            input.addEventListener('blur', () => this.handleBlur(input));
        });
    },

    handleFocus(input) {
        input.parentElement.classList.add('focused');
    },

    handleBlur(input) {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    },

    handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="40" stroke-linecap="round"/>
            </svg>
        `;
        submitBtn.querySelector('.spinner').style.animation = 'spin 1s linear infinite';

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = `
                <span>Journey Started!</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            `;
            submitBtn.style.background = '#22c55e';

            // Reset form after delay
            setTimeout(() => {
                this.form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    },

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showError(field, 'This field is required');
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                isValid = false;
                this.showError(field, 'Please enter a valid email');
            } else {
                this.clearError(field);
            }
        });

        return isValid;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showError(field, message) {
        field.style.borderColor = '#ef4444';
        // Could add error message display here
    },

    clearError(field) {
        field.style.borderColor = '';
    }
};

/**
 * Counter Animation Module
 * Animates statistics numbers
 */
const CounterAnimation = {
    counters: [],
    hasAnimated: false,

    init() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        if (this.counters.length === 0) return;

        this.setupObserver();
    },

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateCounters();
                }
            });
        }, options);

        // Observe the hero stats container
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    },

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (target - start) * easeOutQuart);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }
};

/**
 * Parallax Effects Module
 * Creates subtle parallax effects on scroll
 */
const ParallaxEffects = {
    elements: [],

    init() {
        // Only enable on larger screens
        if (window.innerWidth < 768) return;

        this.setupMountainParallax();
        this.setupScrollListener();
    },

    setupMountainParallax() {
        const mountainLayers = document.querySelectorAll('.mountain-layer');
        mountainLayers.forEach((layer, index) => {
            this.elements.push({
                element: layer,
                speed: 0.1 * (index + 1),
                type: 'translate'
            });
        });

        // Snow particles
        const snow = document.querySelector('.snow-particles');
        if (snow) {
            this.elements.push({
                element: snow,
                speed: 0.05,
                type: 'translate'
            });
        }
    },

    setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

        // Only apply parallax within hero section
        if (scrollY > heroHeight) return;

        this.elements.forEach(({ element, speed, type }) => {
            if (type === 'translate') {
                const yPos = scrollY * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
};

/**
 * Add CSS for spinner animation
 */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .form-group.focused label {
        color: #3b82f6;
    }

    .spinner {
        width: 20px;
        height: 20px;
    }
`;
document.head.appendChild(styleSheet);

/**
 * Performance: Use passive event listeners where appropriate
 */
const passiveSupported = (() => {
    let passive = false;
    try {
        const options = {
            get passive() {
                passive = true;
                return false;
            }
        };
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch (e) {
        passive = false;
    }
    return passive;
})();

/**
 * Utility: Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function for scroll events
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
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', debounce(() => {
    // Re-initialize parallax on resize
    if (window.innerWidth >= 768) {
        ParallaxEffects.init();
    }
}, 250));
