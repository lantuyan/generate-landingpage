/* ================================================
   FORGE ATHLETICS - Urban Industrial JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initCounters();
    initTestimonials();
    initParallax();
});

/* ================================================
   NAVIGATION
   ================================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    // Scroll behavior for nav background
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================================
   SCROLL ANIMATIONS
   ================================================ */
function initScrollAnimations() {
    // Elements to animate
    const animateElements = document.querySelectorAll('[data-animate-scroll]');

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const delay = entry.target.dataset.animateDelay || 0;
                const siblings = entry.target.parentElement.querySelectorAll('[data-animate-scroll]');
                let siblingIndex = Array.from(siblings).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 100 + delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    animateElements.forEach(el => observer.observe(el));

    // Additional scroll-based effects
    window.addEventListener('scroll', throttle(() => {
        updateScrollProgress();
    }, 50), { passive: true });
}

// Throttle utility
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

// Scroll progress indicator (optional - for future use)
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
}

/* ================================================
   COUNTERS ANIMATION
   ================================================ */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
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
    const target = parseFloat(element.dataset.count);
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const isDecimal = target % 1 !== 0;

    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepDuration);
}

/* ================================================
   TESTIMONIALS SLIDER
   ================================================ */
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const buttons = document.querySelectorAll('.testimonial-btn');
    let currentSlide = 0;
    let autoplayTimer;

    function showSlide(index) {
        // Remove active class from all
        testimonials.forEach(t => t.classList.remove('active'));
        buttons.forEach(b => b.classList.remove('active'));

        // Add active class to current
        testimonials[index].classList.add('active');
        buttons[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % testimonials.length;
        showSlide(next);
    }

    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    // Button click handlers
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
        });
    });

    // Touch/swipe support for testimonials
    const testimonialsContainer = document.querySelector('.testimonials');
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    testimonialsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                const prev = (currentSlide - 1 + testimonials.length) % testimonials.length;
                showSlide(prev);
            }
        }
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    testimonialsContainer.addEventListener('mouseenter', stopAutoplay);
    testimonialsContainer.addEventListener('mouseleave', startAutoplay);
}

/* ================================================
   PARALLAX EFFECTS
   ================================================ */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroGrid = document.querySelector('.hero-grid');

    // Only enable parallax on larger screens
    if (window.innerWidth < 768 || prefersReducedMotion()) {
        return;
    }

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxOffset = scrolled * 0.4;
            const opacityValue = 1 - (scrolled / heroHeight) * 0.5;

            heroContent.style.transform = `translateY(${parallaxOffset}px)`;
            heroContent.style.opacity = opacityValue;
            heroGrid.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    }, 16), { passive: true });

    // Mouse parallax for hero
    hero.addEventListener('mousemove', throttle((e) => {
        if (prefersReducedMotion()) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX - innerWidth / 2) / innerWidth;
        const yPos = (clientY - innerHeight / 2) / innerHeight;

        heroGrid.style.transform = `translate(${xPos * 20}px, ${yPos * 20}px)`;
    }, 50));
}

// Check for reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ================================================
   BUTTON RIPPLE EFFECT
   ================================================ */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (prefersReducedMotion()) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        ripple.animate([
            { width: '0', height: '0', opacity: 1 },
            { width: '300px', height: '300px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    });
});

/* ================================================
   FORM INTERACTIONS (for future use)
   ================================================ */
function initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Floating label effect
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    });
}

/* ================================================
   LOADING ANIMATION
   ================================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero [data-animate]');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

/* ================================================
   KEYBOARD NAVIGATION
   ================================================ */
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* ================================================
   VISIBILITY CHANGE HANDLING
   ================================================ */
document.addEventListener('visibilitychange', () => {
    // Pause animations when tab is not visible
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});

/* ================================================
   SCROLL TO TOP (optional enhancement)
   ================================================ */
function createScrollToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: var(--color-rust);
        color: var(--color-white);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        font-family: var(--font-heading);
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    }, 100), { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
createScrollToTop();
