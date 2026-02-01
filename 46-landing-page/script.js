/**
 * JusticeAI - Landing Page JavaScript
 * High Contrast Design - Crisp, decisive interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    ImpactCounter.init();
    FormHandler.init();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll effects
 */
const Navigation = {
    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.links = document.querySelectorAll('.nav-menu a');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        this.toggle?.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.menu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Smooth scroll for anchor links
        this.links.forEach(link => {
            if (link.getAttribute('href')?.startsWith('#')) {
                link.addEventListener('click', (e) => this.smoothScroll(e, link));
            }
        });
    },

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    },

    smoothScroll(e, link) {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = this.nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
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
    init() {
        this.elements = document.querySelectorAll(
            '.step, .service-card, .testimonial, .impact-card, .problem-content, .cta-content'
        );

        // Add fade-in class to elements
        this.elements.forEach(el => el.classList.add('fade-in'));

        // Use Intersection Observer for efficient scroll detection
        this.createObserver();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on element index within its parent
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('.fade-in');
                    const index = Array.from(siblings).indexOf(entry.target);

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));
    }
};

/**
 * Impact Counter Module
 * Animates numbers when they come into view
 */
const ImpactCounter = {
    init() {
        this.counters = document.querySelectorAll('.impact-number[data-target]');
        this.hasAnimated = new Set();

        this.createObserver();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                    this.hasAnimated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;
        const isCurrency = element.textContent.includes('$');

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            // Format the number
            if (isCurrency) {
                element.textContent = '$' + this.formatNumber(currentValue);
            } else {
                element.textContent = this.formatNumber(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                if (isCurrency) {
                    element.textContent = '$' + this.formatNumber(target);
                } else {
                    element.textContent = this.formatNumber(target);
                }
            }
        };

        requestAnimationFrame(updateCounter);
    },

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toLocaleString();
    }
};

/**
 * Form Handler Module
 * Handles form submission with validation
 */
const FormHandler = {
    init() {
        this.form = document.getElementById('assessment-form');
        this.bindEvents();
    },

    bindEvents() {
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();

        const emailInput = this.form.querySelector('.form-input');
        const email = emailInput.value.trim();

        if (!this.validateEmail(email)) {
            this.showError(emailInput, 'Please enter a valid email address');
            return;
        }

        // Show success state
        this.showSuccess(emailInput);
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showError(input, message) {
        input.style.borderColor = '#DC2626';
        input.classList.add('shake');

        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);

        // Remove error state on focus
        input.addEventListener('focus', () => {
            input.style.borderColor = '';
        }, { once: true });
    },

    showSuccess(input) {
        const button = this.form.querySelector('.btn-primary');
        const originalText = button.textContent;

        // Disable form
        input.disabled = true;
        button.disabled = true;
        button.textContent = 'Starting Assessment...';
        button.style.opacity = '0.7';

        // Simulate submission
        setTimeout(() => {
            button.textContent = '✓ Check Your Email';
            button.style.background = '#059669';
            button.style.borderColor = '#059669';
            input.value = '';
            input.disabled = false;

            // Reset after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.style.borderColor = '';
                button.style.opacity = '';
                button.disabled = false;
            }, 3000);
        }, 1500);
    }
};

// Add shake animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s ease;
    }
`;
document.head.appendChild(style);
