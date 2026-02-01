/**
 * Casa Olearia - Mediterranean Landing Page
 * JavaScript for animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initTestimonials();
    initSmoothScroll();
    initNewsletterForm();
    initParallaxEffects();
});

/**
 * Navigation functionality
 * - Scroll-based styling
 * - Mobile menu toggle
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll handler for nav styling
    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleNavScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', throttle(handleNavScroll, 100));
    handleNavScroll(); // Initial check

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll Reveal Animation
 * Elements with .reveal class animate when entering viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    // Intersection Observer configuration
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid children
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.querySelectorAll('.reveal'));
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }

                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Testimonials Slider
 * Auto-rotating with manual dot navigation
 */
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoPlayInterval;

    function showTestimonial(index) {
        // Remove active class from all
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        // Add active class to current
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        const next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextTestimonial, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            showTestimonial(index);
            startAutoPlay();
        });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Start auto-play
    startAutoPlay();
}

/**
 * Smooth Scroll for anchor links
 * Enhanced scroll with offset for fixed navigation
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const navHeight = document.getElementById('nav').offsetHeight;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Newsletter Form
 * Handles form submission with validation
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const button = form.querySelector('button');

        if (!isValidEmail(email)) {
            shakeElement(emailInput);
            return;
        }

        // Simulate form submission
        const originalText = button.textContent;
        button.textContent = 'Subscribing...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Subscribed!';
            emailInput.value = '';

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }, 1000);
    });
}

/**
 * Parallax Effects
 * Subtle parallax on hero and decorative elements
 */
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (!hero || !heroContent) return;

    // Only apply parallax on larger screens
    if (window.matchMedia('(min-width: 768px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                const translateY = scrolled * 0.3;

                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        }, 16));
    }

    // Warm glow effect on hover for cards
    const cards = document.querySelectorAll('.experience-card, .oil-card, .tier');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Utility Functions
 */

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Shake animation for invalid input
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

// Add shake keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(styleSheet);

/**
 * Additional Mediterranean Ambiance Effects
 */

// Golden hour glow effect that subtly shifts based on time
function initGoldenHourEffect() {
    const hour = new Date().getHours();

    // During "golden hours" (6-8 AM or 5-7 PM), add warm overlay
    if ((hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 19)) {
        document.body.classList.add('golden-hour');
    }
}

// Olive leaf floating animation on hero (decorative)
function createFloatingLeaves() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const leafCount = 5;
    const leafContainer = document.createElement('div');
    leafContainer.className = 'floating-leaves';
    leafContainer.style.cssText = `
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.innerHTML = '🌿';
        leaf.style.cssText = `
            position: absolute;
            font-size: ${1 + Math.random() * 1}rem;
            opacity: ${0.1 + Math.random() * 0.2};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatLeaf ${15 + Math.random() * 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * -20}s;
        `;
        leafContainer.appendChild(leaf);
    }

    hero.appendChild(leafContainer);

    // Add floating animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes floatLeaf {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(20px, -30px) rotate(10deg);
            }
            50% {
                transform: translate(-10px, -20px) rotate(-5deg);
            }
            75% {
                transform: translate(15px, -10px) rotate(5deg);
            }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Initialize ambient effects
initGoldenHourEffect();
createFloatingLeaves();
