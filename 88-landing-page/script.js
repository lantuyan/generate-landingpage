/**
 * FLUX EV - Automotive Landing Page
 * Dynamic Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    HeroAnimations.init();
    VehicleParallax.init();
    CounterAnimation.init();
    ScrollAnimations.init();
    FormHandler.init();
});

/**
 * Navigation Module
 * Handles navbar scroll effects and mobile menu
 */
const Navigation = {
    init() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },

    setupScrollEffect() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },

    setupMobileMenu() {
        if (!this.mobileMenuBtn) return;

        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenuBtn.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenuBtn.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Hero Animations Module
 * Handles particle effects and ambient animations
 */
const HeroAnimations = {
    init() {
        this.particlesContainer = document.getElementById('particles');
        this.createParticles();
        this.animateParticles();
    },

    createParticles() {
        if (!this.particlesContainer) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${Math.random() > 0.5 ? '#00d4ff' : '#00ff88'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                pointer-events: none;
            `;
            this.particlesContainer.appendChild(particle);
        }
    },

    animateParticles() {
        const particles = document.querySelectorAll('.particle');

        particles.forEach((particle, index) => {
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;

            particle.animate([
                { transform: 'translate(0, 0)', opacity: particle.style.opacity },
                { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`, opacity: 0.1 },
                { transform: 'translate(0, 0)', opacity: particle.style.opacity }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        });
    }
};

/**
 * Vehicle Parallax Module
 * Handles mouse-responsive vehicle movement
 */
const VehicleParallax = {
    init() {
        this.heroVehicle = document.getElementById('heroVehicle');
        if (!this.heroVehicle) return;

        this.setupMouseTracking();
        this.setupWheelRotation();
    },

    setupMouseTracking() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            targetX = (e.clientX - rect.left - centerX) / centerX;
            targetY = (e.clientY - rect.top - centerY) / centerY;
        });

        hero.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        const animate = () => {
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;

            const rotateY = currentX * 5;
            const rotateX = -currentY * 3;
            const translateX = currentX * 20;
            const translateY = currentY * 10;

            this.heroVehicle.style.transform = `
                perspective(1000px)
                rotateY(${rotateY}deg)
                rotateX(${rotateX}deg)
                translateX(${translateX}px)
                translateY(${translateY}px)
            `;

            requestAnimationFrame(animate);
        };

        animate();
    },

    setupWheelRotation() {
        const wheels = document.querySelectorAll('.wheel-rim');

        let rotation = 0;
        const rotateWheels = () => {
            rotation += 0.5;
            wheels.forEach(wheel => {
                wheel.style.transform = `rotate(${rotation}deg)`;
                wheel.style.transformOrigin = 'center';
            });
            requestAnimationFrame(rotateWheels);
        };

        rotateWheels();
    }
};

/**
 * Counter Animation Module
 * Handles animated number counters
 */
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('[data-count]');
        this.setupIntersectionObserver();
    },

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
};

/**
 * Scroll Animations Module
 * Handles reveal animations on scroll
 */
const ScrollAnimations = {
    init() {
        this.setupFadeElements();
        this.setupVehicleCardAnimations();
        this.setupFeatureCardAnimations();
        this.setupPlanCardAnimations();
    },

    setupFadeElements() {
        const fadeElements = document.querySelectorAll(
            '.section-header, .vehicle-card, .feature-card, .plan-card, .cta-content'
        );

        fadeElements.forEach(el => el.classList.add('fade-in'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    },

    setupVehicleCardAnimations() {
        const cards = document.querySelectorAll('.vehicle-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const svg = card.querySelector('.vehicle-svg');
                if (svg) {
                    svg.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            });

            // Add glow effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.left = `${x}px`;
                    glow.style.top = `${y}px`;
                    glow.style.transform = 'translate(-50%, -50%)';
                }
            });
        });
    },

    setupFeatureCardAnimations() {
        const cards = document.querySelectorAll('.feature-card');

        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    },

    setupPlanCardAnimations() {
        const cards = document.querySelectorAll('.plan-card');

        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;

            // Highlight effect on hover
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => {
                    if (c !== card && !c.classList.contains('featured')) {
                        c.style.opacity = '0.7';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                cards.forEach(c => {
                    c.style.opacity = '1';
                });
            });
        });
    }
};

/**
 * Form Handler Module
 * Handles form submission and validation
 */
const FormHandler = {
    init() {
        this.form = document.getElementById('subscribeForm');
        if (!this.form) return;

        this.setupFormSubmission();
    },

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = this.form.querySelector('input[type="email"]');
            const button = this.form.querySelector('button');
            const originalText = button.innerHTML;

            // Validate email
            if (!this.validateEmail(emailInput.value)) {
                this.showError(emailInput, 'Please enter a valid email address');
                return;
            }

            // Show loading state
            button.innerHTML = `
                <span>Processing...</span>
                <svg class="spinner" viewBox="0 0 24 24" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30 70" stroke-linecap="round"/>
                </svg>
            `;
            button.disabled = true;

            // Add spinner animation
            const style = document.createElement('style');
            style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
            document.head.appendChild(style);

            // Simulate API call
            setTimeout(() => {
                button.innerHTML = `
                    <span>You're on the list!</span>
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                `;
                button.style.background = '#00ff88';
                emailInput.value = '';

                // Reset after 3 seconds
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                }, 3000);
            }, 1500);
        });
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showError(input, message) {
        input.style.borderColor = '#ff3366';
        input.style.animation = 'shake 0.5s ease-in-out';

        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            input.style.borderColor = '';
            input.style.animation = '';
        }, 1500);
    }
};

/**
 * Additional Effects
 * Light streak animation on scroll
 */
const LightStreak = {
    init() {
        this.createStreak();
    },

    createStreak() {
        const streak = document.createElement('div');
        streak.className = 'light-streak';
        streak.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00d4ff, #00ff88, transparent);
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
        `;
        document.body.appendChild(streak);

        let isScrolling = false;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                streak.style.opacity = '0.8';
                streak.style.left = '0';
                streak.style.transition = 'left 0.8s ease-out, opacity 0.3s';
            }

            isScrolling = true;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                streak.style.opacity = '0';
                streak.style.left = '100%';

                setTimeout(() => {
                    streak.style.transition = 'none';
                    streak.style.left = '-100%';
                }, 800);
            }, 150);
        });
    }
};

// Initialize light streak effect
LightStreak.init();

/**
 * Performance optimization
 * Throttle and debounce utilities
 */
const Utils = {
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};

/**
 * Preloader (optional enhancement)
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                setTimeout(() => el.classList.add('visible'), index * 100);
            }
        });
    }, 100);
});
