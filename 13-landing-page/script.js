/**
 * ÉLÉVATION - Private Aviation Membership
 * Luxury Minimal Interactive Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollReveal.init();
    SmoothScroll.init();
    FormHandler.init();
});

/**
 * Navigation Module
 * Handles navigation scroll effects and mobile menu
 */
const Navigation = {
    nav: null,
    toggle: null,
    mobileMenu: null,
    scrollThreshold: 50,

    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');

        if (!this.nav) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Scroll event for nav background
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Mobile menu toggle
        if (this.toggle && this.mobileMenu) {
            this.toggle.addEventListener('click', () => this.toggleMobileMenu());

            // Close mobile menu when clicking links
            const mobileLinks = this.mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }
    },

    handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > this.scrollThreshold) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
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
    }
};

/**
 * Scroll Reveal Module
 * Handles elegant scroll-based animations
 */
const ScrollReveal = {
    elements: [],
    observerOptions: {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    },

    init() {
        this.setupElements();
        this.createObserver();
    },

    setupElements() {
        // Add reveal class to elements that should animate
        const selectors = [
            '.experience-header',
            '.experience-text',
            '.experience-features .feature',
            '.fleet-header',
            '.fleet-card',
            '.concierge-content > *',
            '.membership-header',
            '.membership-card',
            '.inquiry-content',
            '.inquiry-form'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                el.classList.add('reveal');
                // Stagger delay for grouped elements
                if (el.parentElement &&
                    (el.parentElement.classList.contains('experience-features') ||
                     el.parentElement.classList.contains('fleet-grid') ||
                     el.parentElement.classList.contains('membership-grid'))) {
                    el.style.transitionDelay = `${index * 0.1}s`;
                }
            });
        });

        this.elements = document.querySelectorAll('.reveal');
    },

    createObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.elements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.elements.forEach(el => observer.observe(el));
    }
};

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
const SmoothScroll = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e, link));
        });
    },

    handleClick(e, link) {
        const href = link.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            const navHeight = document.querySelector('.nav').offsetHeight;
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
 * Handles form validation and submission with elegant feedback
 */
const FormHandler = {
    form: null,

    init() {
        this.form = document.getElementById('inquiry-form');

        if (!this.form) return;

        this.bindEvents();
        this.setupFloatingLabels();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input focus effects
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleFocus(input));
            input.addEventListener('blur', () => this.handleBlur(input));
        });
    },

    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.value) {
                input.parentElement.classList.add('has-value');
            }

            input.addEventListener('input', () => {
                if (input.value) {
                    input.parentElement.classList.add('has-value');
                } else {
                    input.parentElement.classList.remove('has-value');
                }
            });
        });
    },

    handleFocus(input) {
        input.parentElement.classList.add('focused');
    },

    handleBlur(input) {
        input.parentElement.classList.remove('focused');
    },

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) return;

        const submitBtn = this.form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span>Submitting...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showSuccess();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.form.reset();
        }, 1500);
    },

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field);
            } else {
                this.clearFieldError(field);
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    this.showFieldError(field);
                }
            }
        });

        return isValid;
    },

    showFieldError(field) {
        field.style.borderColor = '#B88B5A';
        field.addEventListener('input', () => this.clearFieldError(field), { once: true });
    },

    clearFieldError(field) {
        field.style.borderColor = '';
    },

    showSuccess() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div class="success-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                <h4>Thank You</h4>
                <p>A member of our private client team will contact you within 24 hours.</p>
            </div>
        `;

        // Style the success message
        Object.assign(successMessage.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(42, 40, 38, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        });

        const content = successMessage.querySelector('.success-content');
        Object.assign(content.style, {
            textAlign: 'center',
            color: '#FAF8F5',
            padding: '3rem',
            transform: 'translateY(20px)',
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        });

        const svg = content.querySelector('svg');
        Object.assign(svg.style, {
            color: '#C9A96E',
            marginBottom: '1.5rem'
        });

        const h4 = content.querySelector('h4');
        Object.assign(h4.style, {
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2rem',
            fontWeight: '300',
            marginBottom: '1rem'
        });

        const p = content.querySelector('p');
        Object.assign(p.style, {
            fontSize: '1rem',
            fontWeight: '300',
            color: '#B8AFA6',
            maxWidth: '300px'
        });

        document.body.appendChild(successMessage);

        // Animate in
        requestAnimationFrame(() => {
            successMessage.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        });

        // Remove after delay
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 600);
        }, 3000);
    }
};

/**
 * Parallax Effect for Hero Section
 * Subtle movement for premium feel
 */
const ParallaxHero = {
    hero: null,
    heroImage: null,

    init() {
        this.hero = document.querySelector('.hero');
        this.heroImage = document.querySelector('.hero-image');

        if (!this.hero || !this.heroImage) return;

        // Only enable on larger screens
        if (window.innerWidth > 992) {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        }
    },

    handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.offsetHeight;

        if (scrollY <= heroHeight) {
            const parallaxValue = scrollY * 0.3;
            this.heroImage.style.transform = `scale(1) translateY(${parallaxValue}px)`;
        }
    }
};

// Initialize parallax after DOM load
document.addEventListener('DOMContentLoaded', () => {
    ParallaxHero.init();
});

/**
 * Cursor Trail Effect (Optional - for desktop only)
 * Adds subtle elegance to mouse movement
 */
const CursorEffect = {
    cursor: null,
    enabled: false,

    init() {
        // Only enable on desktop with fine pointer
        if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 992) {
            this.enabled = true;
            this.createCursor();
            this.bindEvents();
        }
    },

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        Object.assign(this.cursor.style, {
            position: 'fixed',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid rgba(201, 169, 110, 0.5)',
            pointerEvents: 'none',
            zIndex: '9999',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.3s, height 0.3s, border-color 0.3s',
            opacity: '0'
        });
        document.body.appendChild(this.cursor);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.handleMove(e));

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.handleHover(true));
            el.addEventListener('mouseleave', () => this.handleHover(false));
        });
    },

    handleMove(e) {
        if (!this.enabled) return;

        this.cursor.style.opacity = '1';
        this.cursor.style.left = e.clientX + 'px';
        this.cursor.style.top = e.clientY + 'px';
    },

    handleHover(isHovering) {
        if (!this.enabled) return;

        if (isHovering) {
            this.cursor.style.width = '24px';
            this.cursor.style.height = '24px';
            this.cursor.style.borderColor = 'rgba(201, 169, 110, 0.8)';
        } else {
            this.cursor.style.width = '8px';
            this.cursor.style.height = '8px';
            this.cursor.style.borderColor = 'rgba(201, 169, 110, 0.5)';
        }
    }
};

// Initialize cursor effect
document.addEventListener('DOMContentLoaded', () => {
    CursorEffect.init();
});
