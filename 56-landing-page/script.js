/* ========================================
   Verdant Haven - Tropical Landing Page Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Navigation.init();
    ScrollReveal.init();
    Testimonials.init();
    FormHandler.init();
    ParallaxEffects.init();
    TropicalEffects.init();
});

/* ========================================
   Navigation Module
   ======================================== */

const Navigation = {
    navbar: null,
    navToggle: null,
    navLinks: null,
    lastScrollY: 0,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');

        if (!this.navbar) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Scroll event for navbar styling
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu on link click
        if (this.navLinks) {
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (this.navLinks?.classList.contains('active') &&
                !this.navLinks.contains(e.target) &&
                !this.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });
    },

    handleScroll() {
        const scrollY = window.scrollY;

        // Add/remove scrolled class
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = scrollY;
    },

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.navToggle?.classList.remove('active');
        this.navLinks?.classList.remove('active');
        document.body.style.overflow = '';
    },

    smoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
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
    }
};

/* ========================================
   Scroll Reveal Module
   ======================================== */

const ScrollReveal = {
    elements: [],
    observer: null,

    init() {
        this.setupElements();
        this.createObserver();
    },

    setupElements() {
        // Add reveal classes to sections
        const sections = [
            { selector: '.destinations .section-header', class: 'reveal' },
            { selector: '.destination-card', class: 'reveal' },
            { selector: '.philosophy-text', class: 'reveal-left' },
            { selector: '.philosophy-visual', class: 'reveal-right' },
            { selector: '.philosophy-pillars', class: 'stagger-reveal' },
            { selector: '.experience .section-header', class: 'reveal' },
            { selector: '.experience-item', class: 'reveal' },
            { selector: '.sustainability-visual', class: 'reveal-left' },
            { selector: '.sustainability-content', class: 'reveal-right' },
            { selector: '.sustainability-item', class: 'reveal' },
            { selector: '.testimonials .section-header', class: 'reveal' },
            { selector: '.testimonial-card', class: 'reveal-scale' },
            { selector: '.contact-content', class: 'reveal' }
        ];

        sections.forEach(({ selector, class: className }) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add(className);
                el.style.transitionDelay = `${index * 0.1}s`;
                this.elements.push(el);
            });
        });
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: unobserve after reveal
                    // this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => this.observer.observe(el));
    }
};

/* ========================================
   Testimonials Slider Module
   ======================================== */

const Testimonials = {
    track: null,
    cards: [],
    dots: [],
    prevBtn: null,
    nextBtn: null,
    currentIndex: 0,
    autoplayInterval: null,

    init() {
        this.track = document.querySelector('.testimonial-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.testimonial-btn.prev');
        this.nextBtn = document.querySelector('.testimonial-btn.next');

        if (!this.track || this.cards.length === 0) return;

        this.bindEvents();
        this.startAutoplay();
    },

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Pause autoplay on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    },

    updateSlider() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    },

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateSlider();
    },

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateSlider();
    },

    goTo(index) {
        this.currentIndex = index;
        this.updateSlider();
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
    }
};

/* ========================================
   Form Handler Module
   ======================================== */

const FormHandler = {
    form: null,

    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.bindEvents();
        this.setupFloatingLabels();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Add focus/blur animations
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check initial state
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateForm(data)) return;

        // Simulate form submission
        this.showSubmitAnimation();
    },

    validateForm(data) {
        let isValid = true;
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter your name');
            isValid = false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }

        if (!isValid) {
            this.showErrors(errors);
        }

        return isValid;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showErrors(errors) {
        // Remove existing error messages
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());

        // Could add visual error indicators here
        console.log('Form errors:', errors);
    },

    showSubmitAnimation() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Thank You!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #228b22, #44b09e)';

            // Reset form
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    }
};

/* ========================================
   Parallax Effects Module
   ======================================== */

const ParallaxEffects = {
    elements: [],
    ticking: false,

    init() {
        this.setupElements();
        if (this.elements.length === 0) return;

        this.bindEvents();
    },

    setupElements() {
        // Hero foliage layers
        const foliageLayers = document.querySelectorAll('.foliage-layer');
        foliageLayers.forEach((layer, index) => {
            this.elements.push({
                el: layer,
                speed: 0.1 + (index * 0.05),
                type: 'translateY'
            });
        });

        // Floating leaves
        const leaves = document.querySelectorAll('.leaf');
        leaves.forEach((leaf, index) => {
            this.elements.push({
                el: leaf,
                speed: 0.02 + (index * 0.01),
                type: 'translateY'
            });
        });
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updatePositions();
                this.ticking = false;
            });
            this.ticking = true;
        }
    },

    updatePositions() {
        const scrollY = window.scrollY;

        this.elements.forEach(({ el, speed, type }) => {
            const offset = scrollY * speed;

            if (type === 'translateY') {
                el.style.transform = `translateY(${offset}px)`;
            }
        });
    }
};

/* ========================================
   Tropical Effects Module
   ======================================== */

const TropicalEffects = {
    init() {
        this.createRaindrops();
        this.setupHoverEffects();
    },

    createRaindrops() {
        // Subtle rain effect in hero section (optional, disabled by default)
        // Uncomment to enable tropical rain effect
        /*
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-container';
        rainContainer.style.cssText = `
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            opacity: 0.3;
        `;

        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.cssText = `
                position: absolute;
                width: 1px;
                height: ${Math.random() * 20 + 10}px;
                background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3));
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: rainFall ${Math.random() * 1 + 0.5}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            rainContainer.appendChild(drop);
        }

        hero.appendChild(rainContainer);

        // Add rain animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainFall {
                to {
                    transform: translateY(100vh);
                }
            }
        `;
        document.head.appendChild(style);
        */
    },

    setupHoverEffects() {
        // Add bloom effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createRipple(e, btn);
            });
        });

        // Add sway effect to cards on hover
        document.querySelectorAll('.destination-card, .experience-item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.handleCardTilt(e, card);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    },

    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    },

    handleCardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }
};

/* ========================================
   Add ripple animation styles
   ======================================== */

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/* ========================================
   Preloader (Optional)
   ======================================== */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});
