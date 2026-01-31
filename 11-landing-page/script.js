/**
 * The Broadsheet — Typography First Landing Page
 * JavaScript for reading-focused interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    RevealAnimations.init();
    SmoothScroll.init();
    FormHandler.init();
});

/**
 * Navigation Module
 * Handles navbar scroll behavior and mobile menu
 */
const Navigation = {
    nav: null,
    navToggle: null,
    mobileMenu: null,
    mobileLinks: null,
    lastScrollY: 0,

    init() {
        this.nav = document.getElementById('nav');
        this.navToggle = document.getElementById('nav-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileLinks = document.querySelectorAll('.mobile-link');

        if (!this.nav || !this.navToggle || !this.mobileMenu) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Scroll handler for nav background
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu on link click
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    },

    handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        this.lastScrollY = scrollY;
    },

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Reveal Animations Module
 * Creates elegant text reveal effects on scroll
 */
const RevealAnimations = {
    elements: null,
    observer: null,

    init() {
        this.elements = document.querySelectorAll('.reveal-text');

        if (!this.elements.length) return;

        this.createObserver();
        this.observeElements();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },

    observeElements() {
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    },

    revealElement(element) {
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add('revealed');
        }, parseInt(delay));
    }
};

/**
 * Smooth Scroll Module
 * Handles anchor link navigation with smooth scrolling
 */
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e, link));
        });
    },

    handleClick(e, link) {
        const href = link.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

/**
 * Form Handler Module
 * Handles newsletter subscription form
 */
const FormHandler = {
    form: null,

    init() {
        this.form = document.getElementById('subscribe-form');

        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();

        const input = this.form.querySelector('.form-input');
        const button = this.form.querySelector('.form-btn');
        const email = input.value.trim();

        if (!this.validateEmail(email)) {
            this.showError(input, 'Please enter a valid email address');
            return;
        }

        // Simulate form submission
        this.setLoading(button, true);

        setTimeout(() => {
            this.setLoading(button, false);
            this.showSuccess(input, button);
            input.value = '';
        }, 1500);
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    setLoading(button, isLoading) {
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.textContent = button.dataset.originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }
    },

    showError(input, message) {
        input.style.borderColor = '#c0392b';

        // Create or update error message
        let errorEl = input.parentNode.querySelector('.form-error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            errorEl.style.cssText = 'color: #c0392b; font-size: 0.875rem; margin-top: 0.5rem; display: block;';
            input.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;

        // Remove error after 3 seconds
        setTimeout(() => {
            input.style.borderColor = '';
            if (errorEl) errorEl.remove();
        }, 3000);
    },

    showSuccess(input, button) {
        const originalBtnText = button.dataset.originalText;

        // Show success state
        button.textContent = 'Welcome aboard!';
        button.style.backgroundColor = '#27ae60';
        button.style.borderColor = '#27ae60';

        // Reset after 3 seconds
        setTimeout(() => {
            button.textContent = originalBtnText;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 3000);
    }
};

/**
 * Text Typing Effect for Hero
 * Optional: Creates a subtle typewriter effect
 */
const TypeWriter = {
    init() {
        const elements = document.querySelectorAll('[data-typewriter]');
        elements.forEach(el => this.animate(el));
    },

    animate(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';

        let i = 0;
        const speed = parseInt(element.dataset.speed) || 50;

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    }
};

/**
 * Reading Progress Indicator
 * Shows reading progress for long-form content
 */
const ReadingProgress = {
    progressBar: null,

    init() {
        this.createProgressBar();
        this.bindEvents();
    },

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'reading-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background-color: #8b4513;
            width: 0%;
            z-index: 101;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(this.progressBar);
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    },

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        this.progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
};

// Initialize reading progress
document.addEventListener('DOMContentLoaded', () => {
    ReadingProgress.init();
});

/**
 * Parallax Effect for Hero
 * Subtle parallax scrolling effect
 */
const ParallaxHero = {
    hero: null,
    title: null,

    init() {
        this.hero = document.querySelector('.hero');
        this.title = document.querySelector('.hero-title');

        if (!this.hero || !this.title) return;

        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.offsetHeight;

        if (scrollY < heroHeight) {
            const translateY = scrollY * 0.3;
            const opacity = 1 - (scrollY / heroHeight) * 0.5;

            this.title.style.transform = `translateY(${translateY}px)`;
            this.title.style.opacity = opacity;
        }
    }
};

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', () => {
    ParallaxHero.init();
});
