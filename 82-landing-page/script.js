/**
 * DRPCLTR - Street Style Landing Page
 * Interactive JavaScript with punchy, street-energy animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    ScrollAnimations.init();
    Marquee.init();
    DropCards.init();
    DesignerShowcase.init();
    FormHandler.init();
    CountdownTimer.init();
});

/**
 * Preloader Module
 * Quick loading animation with street-style glitch effect
 */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        document.body.classList.add('loading');

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.classList.remove('loading');

                // Trigger entrance animations after preloader
                setTimeout(() => {
                    document.querySelectorAll('.fade-in').forEach(el => {
                        el.classList.add('visible');
                    });
                }, 100);
            }, 1500);
        });
    }
};

/**
 * Navigation Module
 * Handles scroll behavior and mobile menu with snappy transitions
 */
const Navigation = {
    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileLinks = document.querySelectorAll('.mobile-link');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    },

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.nav.classList.toggle('scrolled', scrolled);
    },

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    },

    closeMenu() {
        this.toggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
};

/**
 * Scroll Animations Module
 * Intersection Observer for reveal animations with stagger effects
 */
const ScrollAnimations = {
    init() {
        this.setupObservers();
        this.addAnimationClasses();
    },

    addAnimationClasses() {
        // Add animation classes to elements
        const sections = document.querySelectorAll('.drops, .designers, .how-it-works, .community, .cta');
        sections.forEach(section => {
            section.querySelector('.section-header')?.classList.add('fade-in');
        });

        // Drop cards
        document.querySelectorAll('.drop-card').forEach((card, i) => {
            card.classList.add('fade-in');
            card.style.transitionDelay = `${i * 0.1}s`;
        });

        // Designer items
        document.querySelectorAll('.designer-item').forEach((item, i) => {
            item.classList.add('slide-in-left');
            item.style.transitionDelay = `${i * 0.15}s`;
        });

        // Steps
        document.querySelectorAll('.step').forEach((step, i) => {
            step.classList.add('fade-in');
            step.style.transitionDelay = `${i * 0.1}s`;
        });

        // Community features
        document.querySelectorAll('.feature').forEach((feature, i) => {
            feature.classList.add('fade-in');
            feature.style.transitionDelay = `${i * 0.1}s`;
        });

        // CTA
        document.querySelector('.cta-content')?.classList.add('fade-in');
    },

    setupObservers() {
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

        // Observe all animated elements
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }
};

/**
 * Marquee Module
 * Pause on hover with smooth animation
 */
const Marquee = {
    init() {
        const marquees = document.querySelectorAll('.marquee, .testimonials-marquee');

        marquees.forEach(marquee => {
            const track = marquee.querySelector('.marquee-track, .testimonials-track');
            if (!track) return;

            marquee.addEventListener('mouseenter', () => {
                track.style.animationPlayState = 'paused';
            });

            marquee.addEventListener('mouseleave', () => {
                track.style.animationPlayState = 'running';
            });
        });
    }
};

/**
 * Drop Cards Module
 * Hover effects and interactive states
 */
const DropCards = {
    init() {
        const cards = document.querySelectorAll('.drop-card');

        cards.forEach(card => {
            // Mouse tracking for subtle parallax
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    },

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },

    handleMouseLeave(e, card) {
        card.style.transform = '';
    }
};

/**
 * Designer Showcase Module
 * Interactive designer cards with hover effects
 */
const DesignerShowcase = {
    init() {
        const items = document.querySelectorAll('.designer-item');

        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Add active state
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
};

/**
 * Form Handler Module
 * Email form with validation and feedback
 */
const FormHandler = {
    init() {
        const form = document.getElementById('joinForm');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    },

    handleSubmit(e, form) {
        e.preventDefault();

        const input = form.querySelector('.form-input');
        const button = form.querySelector('.btn-submit');
        const email = input.value.trim();

        if (!this.validateEmail(email)) {
            this.showError(input);
            return;
        }

        // Simulate submission
        button.innerHTML = '<span class="btn-text">JOINING...</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<span class="btn-text">YOU\'RE IN ✓</span>';
            button.style.background = '#00ff88';
            input.value = '';

            // Reset after delay
            setTimeout(() => {
                button.innerHTML = '<span class="btn-text">JOIN</span><span class="btn-arrow">→</span>';
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        }, 1500);
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showError(input) {
        input.style.borderColor = '#ff3366';
        input.classList.add('shake');

        setTimeout(() => {
            input.style.borderColor = '';
            input.classList.remove('shake');
        }, 500);
    }
};

/**
 * Countdown Timer Module
 * Live countdown for featured drops
 */
const CountdownTimer = {
    init() {
        const timers = document.querySelectorAll('.drop-timer');

        timers.forEach(timer => {
            this.updateTimer(timer);
            setInterval(() => this.updateTimer(timer), 1000);
        });
    },

    updateTimer(timer) {
        const units = timer.querySelectorAll('.timer-num');
        if (units.length < 3) return;

        // Simulate countdown (in real app, use actual target date)
        const now = new Date();
        const target = new Date(now.getTime() + (2 * 24 + 14) * 60 * 60 * 1000 + 32 * 60 * 1000);
        const diff = target - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        units[0].textContent = String(days).padStart(2, '0');
        units[1].textContent = String(hours).padStart(2, '0');
        units[2].textContent = String(minutes).padStart(2, '0');
    }
};

/**
 * Smooth Scroll Enhancement
 * Snappy scroll behavior for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed nav
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Add shake animation for form validation
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-5px); }
    }
    .shake {
        animation: shake 0.4s ease-in-out;
    }
`;
document.head.appendChild(style);

/**
 * Parallax effect for hero shapes
 */
window.addEventListener('scroll', () => {
    const shapes = document.querySelectorAll('.shape');
    const scrolled = window.pageYOffset;

    shapes.forEach((shape, i) => {
        const speed = 0.1 + (i * 0.05);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/**
 * Mouse cursor effect for interactive elements
 */
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorDot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--color-accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease-out, opacity 0.3s;
    opacity: 0;
    mix-blend-mode: difference;
`;

document.body.appendChild(cursorDot);

document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX - 4 + 'px';
    cursorDot.style.top = e.clientY - 4 + 'px';
    cursorDot.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
});

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .drop-card, .designer-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'scale(3)';
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'scale(1)';
    });
});
