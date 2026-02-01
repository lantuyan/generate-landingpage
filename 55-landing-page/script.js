/**
 * IRONWORKS BREWING CO. - Industrial Landing Page
 * JavaScript functionality with mechanical animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initMeterAnimations();
    initProcessTimeline();
    initBeerFilter();
    initNewsletterForm();
    initSmoothScroll();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll behavior
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScrollY = window.scrollY;
    let ticking = false;

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Hide/show nav on scroll
    function updateNav() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });
}

/**
 * Scroll Animations Module
 * Intersection Observer for reveal animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .about-visual, .feature, .taproom-card, .beer-card, .contact-content, .contact-info, .info-card');

    // Add animation classes
    animatedElements.forEach((el, index) => {
        if (el.classList.contains('feature') || el.classList.contains('taproom-card') || el.classList.contains('beer-card') || el.classList.contains('info-card')) {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index % 4 * 100}ms`;
        } else if (el.classList.contains('about-content') || el.classList.contains('contact-content')) {
            el.classList.add('slide-in-left');
        } else if (el.classList.contains('about-visual') || el.classList.contains('contact-info')) {
            el.classList.add('slide-in-right');
        } else {
            el.classList.add('fade-in');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Counter Animations Module
 * Animates statistics numbers with mechanical feel
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    // Mechanical easing function
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const timer = setInterval(() => {
        current++;
        const progress = easeOutExpo(current / steps);
        const value = Math.round(progress * target);
        element.textContent = value;

        // Add mechanical click sound effect (visual)
        if (current % 5 === 0) {
            element.style.transform = 'scale(1.02)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 50);
        }

        if (current >= steps) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, stepDuration);
}

/**
 * Meter Animations Module
 * Animates the progress bars in the about section
 */
function initMeterAnimations() {
    const meters = document.querySelectorAll('.meter-fill');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.width = `${width}%`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    meters.forEach(meter => observer.observe(meter));
}

/**
 * Process Timeline Module
 * Handles scroll-based timeline progression
 */
function initProcessTimeline() {
    const timeline = document.querySelector('.process-timeline');
    const trackProgress = document.querySelector('.track-progress');
    const steps = document.querySelectorAll('.step');

    if (!timeline || !trackProgress || steps.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
    };

    // Individual step observers
    steps.forEach((step, index) => {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activate current step
                    step.classList.add('active');

                    // Update track progress
                    const progressPercent = ((index + 1) / steps.length) * 100;
                    trackProgress.style.height = `${progressPercent}%`;

                    // Add mechanical animation
                    const marker = step.querySelector('.marker-dot');
                    if (marker) {
                        marker.style.animation = 'none';
                        marker.offsetHeight; // Trigger reflow
                        marker.style.animation = null;
                    }
                }
            });
        }, observerOptions);

        stepObserver.observe(step);
    });
}

/**
 * Beer Filter Module
 * Handles the beer category filtering
 */
function initBeerFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const beerCards = document.querySelectorAll('.beer-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter cards with mechanical animation
            beerCards.forEach((card, index) => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-10px)';

                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/**
 * Newsletter Form Module
 * Handles form submission with industrial feedback
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = form?.querySelector('input[type="email"]');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput?.value.trim();

        if (!email || !isValidEmail(email)) {
            // Shake animation for error
            emailInput?.classList.add('shake');
            setTimeout(() => emailInput?.classList.remove('shake'), 500);
            return;
        }

        // Loading state
        const originalText = submitBtn?.querySelector('.btn-text');
        if (originalText) {
            originalText.textContent = 'PROCESSING...';
        }
        submitBtn?.classList.add('loading');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        if (originalText) {
            originalText.textContent = 'SUBSCRIBED ✓';
        }
        submitBtn?.classList.remove('loading');
        submitBtn.disabled = true;
        emailInput.disabled = true;

        // Reset after delay
        setTimeout(() => {
            if (originalText) {
                originalText.textContent = 'SUBSCRIBE';
            }
            submitBtn.disabled = false;
            emailInput.disabled = false;
            emailInput.value = '';
        }, 3000);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Smooth Scroll Module
 * Enhanced smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Parallax Effect for Hero
 * Subtle parallax for depth
 */
(function initParallax() {
    const hero = document.querySelector('.hero');
    const pipes = document.querySelector('.hero-pipes');

    if (!hero || !pipes) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const heroHeight = hero.offsetHeight;

                if (scrolled < heroHeight) {
                    const parallaxValue = scrolled * 0.3;
                    pipes.style.transform = `translateY(${parallaxValue}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });
})();

/**
 * Utility: Cursor Effect
 * Industrial-style cursor follower (optional enhancement)
 */
(function initCursorEffect() {
    // Only on desktop
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';

        // Add styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #d4a84b;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            .cursor-ring {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 2px solid #d4a84b;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, border-color 0.2s;
            }
            .custom-cursor.hover .cursor-ring {
                width: 60px;
                height: 60px;
                border-color: #e6c06c;
            }
            @media (max-width: 768px) {
                .custom-cursor { display: none; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor following
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .beer-card, .taproom-card, .feature');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
})();

/**
 * Utility: Gauge Animation
 * Animate the SVG gauge in about section
 */
(function initGaugeAnimation() {
    const gaugeProgress = document.querySelector('.gauge-progress');

    if (!gaugeProgress) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate from full offset to target offset (70)
                gaugeProgress.style.strokeDashoffset = '70';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(gaugeProgress);
})();

/**
 * Utility: Add mechanical hover sounds (visual feedback)
 * Creates visual ripple effect on buttons
 */
(function initMechanicalFeedback() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: rippleExpand 0.6s ease-out forwards;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleExpand {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();
