/**
 * POPSTAR VAULT - Pop Art Landing Page JavaScript
 * Handles animations, interactions, and dynamic effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    CounterAnimation.init();
    FormHandler.init();
    ParallaxEffects.init();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and smooth scrolling
 */
const Navigation = {
    init() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.nav = document.querySelector('.nav');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Scroll event for nav styling
        window.addEventListener('scroll', () => this.handleScroll());

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    },

    closeMenu() {
        this.navToggle?.classList.remove('active');
        this.navLinks?.classList.remove('active');
    },

    handleScroll() {
        const scrolled = window.scrollY > 50;
        if (this.nav) {
            this.nav.style.boxShadow = scrolled
                ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                : 'none';
        }
    }
};

/**
 * Scroll Animations Module
 * Handles reveal animations as elements come into view
 */
const ScrollAnimations = {
    init() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.setupObservers();
    },

    setupObservers() {
        // Feature cards animation
        const featureCards = document.querySelectorAll('.feature-card');
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                }
            });
        }, this.observerOptions);

        featureCards.forEach(card => featureObserver.observe(card));

        // Gallery items animation
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'popIn 0.5s ease-out forwards';
                }
            });
        }, this.observerOptions);

        galleryItems.forEach(item => {
            item.style.opacity = '0';
            galleryObserver.observe(item);
        });

        // Generic fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in, .scale-in');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        fadeElements.forEach(el => fadeObserver.observe(el));

        // Section titles animation
        const sectionTitles = document.querySelectorAll('.section-title');
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'popIn 0.6s ease-out forwards';
                }
            });
        }, { ...this.observerOptions, threshold: 0.5 });

        sectionTitles.forEach(title => {
            title.style.opacity = '0';
            titleObserver.observe(title);
        });
    }
};

/**
 * Counter Animation Module
 * Animates numbers counting up when in view
 */
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = new Set();

        this.setupObserver();
    },

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                // Add suffix based on content
                if (element.closest('.stat-item')?.querySelector('.stat-label')?.textContent.includes('%')) {
                    element.textContent = target + '%';
                } else if (target >= 1000) {
                    element.textContent = target.toLocaleString() + '+';
                }
            }
        };

        requestAnimationFrame(updateCounter);
    }
};

/**
 * Form Handler Module
 * Handles form submission with pop art style feedback
 */
const FormHandler = {
    init() {
        this.form = document.getElementById('join-form');
        if (this.form) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();

        const input = this.form.querySelector('input[type="email"]');
        const button = this.form.querySelector('button');
        const email = input.value;

        if (!this.validateEmail(email)) {
            this.showFeedback(input, 'INVALID EMAIL!', 'error');
            return;
        }

        // Simulate submission
        button.textContent = 'JOINING...';
        button.disabled = true;

        setTimeout(() => {
            this.showSuccessMessage();
            input.value = '';
            button.textContent = 'SIGN UP!';
            button.disabled = false;
        }, 1500);
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showFeedback(element, message, type) {
        element.style.borderColor = type === 'error' ? '#FF3B3B' : '#00FF66';
        element.style.animation = 'shake 0.5s ease';

        setTimeout(() => {
            element.style.borderColor = '';
            element.style.animation = '';
        }, 1000);
    },

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-popup';
        message.innerHTML = `
            <div class="popup-content">
                <span class="popup-icon">🎉</span>
                <h3>WELCOME TO THE VAULT!</h3>
                <p>You're now part of the collector's club!</p>
            </div>
        `;

        // Style the popup
        Object.assign(message.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            background: '#FFE500',
            border: '4px solid #000',
            boxShadow: '8px 8px 0 #000',
            padding: '40px',
            textAlign: 'center',
            zIndex: '9999',
            fontFamily: "'Bangers', cursive",
            animation: 'popIn 0.5s ease forwards'
        });

        document.body.appendChild(message);

        // Remove after delay
        setTimeout(() => {
            message.style.animation = 'popOut 0.3s ease forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
};

/**
 * Parallax Effects Module
 * Adds depth to scrolling experience
 */
const ParallaxEffects = {
    init() {
        this.icons = document.querySelectorAll('.icon-star, .icon-burst');
        this.heroContent = document.querySelector('.hero-content');

        if (this.icons.length || this.heroContent) {
            this.bindEvents();
        }
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
    },

    handleScroll() {
        const scrolled = window.scrollY;

        // Parallax for floating icons
        this.icons.forEach((icon, index) => {
            const speed = 0.1 + (index * 0.05);
            icon.style.transform = `translateY(${scrolled * speed}px)`;
        });
    },

    handleMouseMove(e) {
        if (!this.heroContent || window.scrollY > window.innerHeight) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        // Subtle movement on hero content
        this.heroContent.style.transform = `translate(${xPercent * 5}px, ${yPercent * 5}px)`;
    }
};

/**
 * Add pop-out animation keyframe dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes popOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }

    .success-popup .popup-icon {
        font-size: 4rem;
        display: block;
        margin-bottom: 15px;
    }

    .success-popup h3 {
        font-size: 2rem;
        margin-bottom: 10px;
        color: #FF3B3B;
    }

    .success-popup p {
        font-size: 1.2rem;
        font-family: 'Anton', sans-serif;
    }
`;
document.head.appendChild(style);

/**
 * Gallery Item Hover Effects
 * Adds comic-style interaction on gallery items
 */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';

        // Random rotation on hover
        const rotation = (Math.random() - 0.5) * 6;
        this.style.transform = `scale(1.05) rotate(${rotation}deg)`;
    });

    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '';
        this.style.transform = '';
    });
});

/**
 * Button Click Effects
 * Adds pop art style click feedback
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out forwards;
        `;

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/**
 * Speech Bubble Random Pop
 * Adds random pop animations to speech bubbles
 */
const speechBubbles = document.querySelectorAll('.speech-bubble-mini');
speechBubbles.forEach((bubble, index) => {
    setInterval(() => {
        bubble.style.animation = 'popIn 0.3s ease';
        setTimeout(() => {
            bubble.style.animation = '';
        }, 300);
    }, 3000 + (index * 1000));
});

/**
 * Smooth Scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed nav
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
