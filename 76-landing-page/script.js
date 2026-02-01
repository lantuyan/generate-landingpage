/**
 * PathwayAI Landing Page - Educational Design
 * Interactive JavaScript for animations and user interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initTestimonialsSlider();
    initFormHandling();
    initProgressAnimation();
    initSmoothScroll();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
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
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left');
    const steps = document.querySelectorAll('.step');
    const featureCards = document.querySelectorAll('.feature-card');
    const pathCards = document.querySelectorAll('.path-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    // Create observer for fade animations
    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    animatedElements.forEach(el => fadeObserver.observe(el));

    // Create observer for staggered animations
    const staggerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const siblings = entry.target.parentElement.children;
                    const index = Array.from(siblings).indexOf(entry.target);

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);

                    staggerObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        }
    );

    // Apply initial styles and observe
    const staggerElements = [...steps, ...featureCards, ...pathCards];
    staggerElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        staggerObserver.observe(el);
    });

    // Section headers animation
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    headerObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        headerObserver.observe(header);
    });
}

/**
 * Animated number counter for stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart);

        element.textContent = formatNumber(currentValue);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString();
    }
    return num.toString();
}

/**
 * Testimonials slider functionality
 */
function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    const totalSlides = Math.ceil(cards.length / cardsPerView);

    // Update cards per view on resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        updateSlider();
    });

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 32; // Include gap
        const offset = currentIndex * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= cards.length - cardsPerView ? '0.5' : '1';
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, cards.length - cardsPerView));
        updateSlider();
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }

    // Auto-advance slider
    let autoPlayInterval = setInterval(() => {
        if (currentIndex >= cards.length - cardsPerView) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSlider();
    }, 5000);

    // Pause on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    track.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            if (currentIndex >= cards.length - cardsPerView) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        }, 5000);
    });

    updateSlider();
}

/**
 * Form handling with validation
 */
function initFormHandling() {
    const form = document.getElementById('signup-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            shakeElement(emailInput);
            return;
        }

        // Show loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>';
        submitBtn.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = '<span>Success! Check your email</span>';
        submitBtn.style.background = '#10b981';
        emailInput.value = '';

        // Reset after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.style.borderColor = '#ef4444';

    setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
    }, 500);
}

// Add shake animation styles dynamically
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }

    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(37, 99, 235, 0.3);
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(shakeStyles);

/**
 * Dashboard progress bar animation
 */
function initProgressAnimation() {
    const progressFill = document.querySelector('.progress-fill');

    if (!progressFill) return;

    const progressObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reset and animate
                    progressFill.style.width = '0%';
                    setTimeout(() => {
                        progressFill.style.width = '67%';
                    }, 100);
                    progressObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    progressObserver.observe(progressFill);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax effect for hero background elements
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const circles = document.querySelectorAll('.hero-circle');

    circles.forEach((circle, index) => {
        const speed = 0.1 + (index * 0.05);
        circle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/**
 * Add hover effects to interactive elements
 */
document.querySelectorAll('.path-card, .feature-card, .step').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const toggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navLinks && navLinks.classList.contains('active')) {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Prefers reduced motion support
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');

    // Also stop CSS animations
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}
