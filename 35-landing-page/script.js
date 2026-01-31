/* ============================================
   Bloom & Brushstroke - Script
   Soft, organic animations and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    TestimonialsSlider.init();
    ContactForm.init();
    ParallaxEffects.init();
});

/* ============================================
   Navigation Module
   ============================================ */
const Navigation = {
    nav: null,
    navToggle: null,
    navLinks: null,
    lastScrollY: 0,

    init() {
        this.nav = document.getElementById('nav');
        this.navToggle = document.getElementById('navToggle');
        this.navLinks = document.getElementById('navLinks');

        if (!this.nav || !this.navToggle || !this.navLinks) return;

        this.bindEvents();
    },

    bindEvents() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Close menu on link click
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMobileMenu();
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleScroll() {
        const scrollY = window.scrollY;

        // Add/remove scrolled class for background
        if (scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        this.lastScrollY = scrollY;
    }
};

/* ============================================
   Scroll Animations Module
   Soft fade-in effects like paint drying
   ============================================ */
const ScrollAnimations = {
    elements: [],
    observer: null,

    init() {
        this.elements = document.querySelectorAll('.fade-in');

        if (this.elements.length === 0) return;

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
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation for multiple elements
                    const delay = this.getStaggerDelay(entry.target);

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },

    getStaggerDelay(element) {
        // Get siblings that are also fade-in elements
        const parent = element.parentElement;
        const siblings = parent.querySelectorAll('.fade-in');
        const index = Array.from(siblings).indexOf(element);

        // Stagger delay: 100ms between each element
        return Math.min(index * 100, 400);
    },

    observeElements() {
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
};

/* ============================================
   Testimonials Slider Module
   Gentle crossfade transitions
   ============================================ */
const TestimonialsSlider = {
    cards: [],
    dots: [],
    currentIndex: 0,
    autoPlayInterval: null,
    autoPlayDelay: 6000,

    init() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');

        if (this.cards.length === 0 || this.dots.length === 0) return;

        this.bindEvents();
        this.startAutoPlay();
    },

    bindEvents() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Pause on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    },

    goToSlide(index) {
        // Remove active state from current
        this.cards[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active state to new
        this.cards[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    },

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    },

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    },

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    },

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
};

/* ============================================
   Contact Form Module
   Elegant form handling
   ============================================ */
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contactForm');

        if (!this.form) return;

        this.bindEvents();
        this.enhanceInputs();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    enhanceInputs() {
        const inputs = this.form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                if (input.value) {
                    input.parentElement.classList.add('filled');
                } else {
                    input.parentElement.classList.remove('filled');
                }
            });
        });
    },

    handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('span').textContent;

        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';

        // Simulate form submission
        setTimeout(() => {
            this.showMessage('Thank you for reaching out! We\'ll be in touch soon.', 'success');
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = originalText;

            // Clear filled states
            this.form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('filled');
            });
        }, 1500);
    },

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.parentElement.classList.add('error');
            } else {
                field.parentElement.classList.remove('error');
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    field.parentElement.classList.add('error');
                }
            }
        });

        return isValid;
    },

    showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;

        // Style the message
        Object.assign(message.style, {
            padding: '16px 24px',
            marginTop: '16px',
            borderRadius: '4px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            textAlign: 'center',
            animation: 'fadeSlideUp 0.5s ease-out'
        });

        if (type === 'success') {
            message.style.background = 'rgba(168, 197, 168, 0.2)';
            message.style.color = '#5a7a5a';
            message.style.border = '1px solid rgba(168, 197, 168, 0.4)';
        } else {
            message.style.background = 'rgba(212, 165, 165, 0.2)';
            message.style.color = '#8a5a5a';
            message.style.border = '1px solid rgba(212, 165, 165, 0.4)';
        }

        // Insert after form
        this.form.parentElement.appendChild(message);

        // Remove after delay
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            message.style.transition = 'all 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
};

/* ============================================
   Parallax Effects Module
   Subtle organic movements
   ============================================ */
const ParallaxEffects = {
    elements: [],
    ticking: false,

    init() {
        // Only enable on larger screens
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.innerWidth < 768) return;

        this.setupElements();
        this.bindEvents();
    },

    setupElements() {
        // Watercolor washes
        this.elements = [
            { el: document.querySelector('.wash-1'), speed: 0.02 },
            { el: document.querySelector('.wash-2'), speed: 0.03 },
            { el: document.querySelector('.wash-3'), speed: 0.015 },
            { el: document.querySelector('.hero-floral-left'), speed: 0.04 },
            { el: document.querySelector('.hero-floral-right'), speed: 0.04 }
        ].filter(item => item.el);
    },

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    },

    updateParallax() {
        const scrollY = window.scrollY;

        this.elements.forEach(({ el, speed }) => {
            const yOffset = scrollY * speed;
            el.style.transform = `translateY(${yOffset}px)`;
        });
    }
};

/* ============================================
   Smooth Scroll Enhancement
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

/* ============================================
   Gallery Hover Effects
   ============================================ */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        // Add soft scale effect
        const image = this.querySelector('.gallery-image');
        if (image) {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });

    item.addEventListener('mouseleave', function() {
        const image = this.querySelector('.gallery-image');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

/* ============================================
   CSS Animation Keyframes (injected)
   ============================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeSlideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #d4a5a5;
        box-shadow: 0 0 0 3px rgba(212, 165, 165, 0.2);
    }

    .form-group.focused label {
        color: var(--gold);
    }

    .gallery-item {
        overflow: hidden;
    }

    .gallery-item .gallery-image {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(styleSheet);

/* ============================================
   Watercolor Paint Drip Effect on Load
   ============================================ */
window.addEventListener('load', () => {
    // Add a subtle entrance animation to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Animate hero florals
    const florals = document.querySelectorAll('.hero-floral');
    florals.forEach((floral, index) => {
        floral.style.opacity = '0';
        floral.style.transform = index === 0 ? 'translateX(-30px)' : 'translateX(30px)';

        setTimeout(() => {
            floral.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
            floral.style.opacity = '0.6';
            floral.style.transform = 'translateX(0)';
        }, 500 + (index * 200));
    });
});

/* ============================================
   Service Cards Paint Splash Animation
   ============================================ */
document.querySelectorAll('.service-card').forEach(card => {
    const watercolor = card.querySelector('.service-watercolor');
    if (!watercolor) return;

    card.addEventListener('mouseenter', () => {
        watercolor.style.transform = 'scale(1.2) rotate(15deg)';
        watercolor.style.opacity = '0.7';
    });

    card.addEventListener('mouseleave', () => {
        watercolor.style.transform = 'scale(1) rotate(0deg)';
        watercolor.style.opacity = '0.5';
    });
});

/* ============================================
   Process Timeline Animation
   ============================================ */
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const step = entry.target;
            const index = Array.from(document.querySelectorAll('.process-step')).indexOf(step);

            // Animate the watercolor background
            const watercolor = step.querySelector('.step-watercolor');
            if (watercolor) {
                setTimeout(() => {
                    watercolor.style.transform = 'scale(1.1)';
                    watercolor.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }, index * 150);
            }
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '-50px 0px'
});

document.querySelectorAll('.process-step').forEach(step => {
    processObserver.observe(step);
});
