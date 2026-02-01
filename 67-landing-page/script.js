/**
 * Plantopia - Biophilic Design Landing Page
 * Interactive animations and functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initTestimonialsSlider();
    initPlantFilters();
    initNewsletterForm();
    initSmoothScroll();
    initLeafAnimations();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // For staggered animations on grid items
                if (entry.target.classList.contains('steps-container')) {
                    animateChildren(entry.target, '.step', 150);
                }
                if (entry.target.classList.contains('features-grid')) {
                    animateChildren(entry.target, '.feature-card', 100);
                }
                if (entry.target.classList.contains('plants-grid')) {
                    animateChildren(entry.target, '.plant-item:not(.hidden)', 80);
                }
                if (entry.target.classList.contains('pricing-grid')) {
                    animateChildren(entry.target, '.pricing-card', 150);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.step, .feature-card, .plant-item, .pricing-card, ' +
        '.steps-container, .features-grid, .plants-grid, .pricing-grid'
    );

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
}

/**
 * Animate children with staggered delay
 */
function animateChildren(parent, childSelector, delayMs) {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate');
        }, index * delayMs);
    });
}

/**
 * Counter animation for hero stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Animate a counter from 0 to target
 */
function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);

        // Format number with K for thousands
        if (target >= 1000) {
            element.textContent = current >= 1000
                ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K+'
                : current;
        } else {
            element.textContent = current + (target === 98 ? '%' : '+');
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Final value
            if (target >= 1000) {
                element.textContent = (target / 1000) + 'K+';
            } else {
                element.textContent = target + (target === 98 ? '%' : '+');
            }
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Testimonials slider
 */
function initTestimonialsSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalSlides = cards.length;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

/**
 * Plant category filters
 */
function initPlantFilters() {
    const buttons = document.querySelectorAll('.category-btn');
    const plants = document.querySelectorAll('.plant-item');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter plants with animation
            plants.forEach((plant, index) => {
                const plantCategories = plant.dataset.category || '';
                const shouldShow = category === 'all' || plantCategories.includes(category);

                if (shouldShow) {
                    plant.classList.remove('hidden');
                    plant.style.transitionDelay = `${index * 50}ms`;
                    // Trigger reflow for animation
                    plant.offsetHeight;
                    plant.classList.add('animate');
                } else {
                    plant.classList.remove('animate');
                    setTimeout(() => {
                        plant.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/**
 * Newsletter form handling
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button');
        const email = input.value;

        if (!isValidEmail(email)) {
            shakeElement(input);
            return;
        }

        // Simulate form submission
        button.innerHTML = '<span>Subscribing...</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<span>Subscribed!</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
            button.style.background = 'var(--green-600)';
            input.value = '';

            // Reset after 3 seconds
            setTimeout(() => {
                button.innerHTML = '<span>Subscribe</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        }, 1500);
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Shake animation for invalid input
 */
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

// Add shake keyframes dynamically
const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Floating leaf animations with random properties
 */
function initLeafAnimations() {
    const leaves = document.querySelectorAll('.leaf');

    leaves.forEach((leaf, index) => {
        // Set random rotation for each leaf
        const rotation = (Math.random() - 0.5) * 60;
        leaf.style.setProperty('--rotation', `${rotation}deg`);

        // Randomize animation duration slightly
        const baseDuration = 20;
        const variance = Math.random() * 10 - 5;
        leaf.style.animationDuration = `${baseDuration + variance}s`;
    });
}

/**
 * Parallax effect for hero section (subtle)
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const shapes = hero.querySelectorAll('.organic-shape');
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}, { passive: true });

/**
 * Intersection Observer for lazy loading effects
 */
function observeVisibility(elements, callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { ...defaultOptions, ...options });

    elements.forEach(el => observer.observe(el));
}

/**
 * Add organic hover effects to plant cards
 */
document.querySelectorAll('.plant-item, .plant-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/**
 * Prefers reduced motion check
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.leaf').forEach(leaf => {
        leaf.style.animation = 'none';
    });

    document.querySelectorAll('.organic-shape').forEach(shape => {
        shape.style.animation = 'none';
    });
}

/**
 * Initialize AI badge pulse on scroll
 */
const aiBadge = document.querySelector('.ai-badge');
if (aiBadge) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            aiBadge.style.animationPlayState = 'running';
        }
    }, { passive: true });
}
