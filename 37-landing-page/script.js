/* =====================================================
   CityVision Studio - Interactive Script
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initTestimonialSlider();
    initCounterAnimation();
    initFormHandling();
    initSmoothScroll();
    initParallaxEffects();
});

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scroll behavior for navbar
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.service-card, .process-step, .project-card, .stat-item'
    );

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for cards
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Animate isometric buildings in hero on load
    animateHeroBuildings();
}

function animateHeroBuildings() {
    const buildings = document.querySelectorAll('.iso-building');

    buildings.forEach((building, index) => {
        const delay = building.dataset.delay || index * 100;
        building.style.animationDelay = `${delay}ms`;
    });
}

/* =====================================================
   TESTIMONIAL SLIDER
   ===================================================== */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Remove active class from all
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        cards[index].classList.add('active');
        dots[index].classList.add('active');

        currentIndex = index;
    }

    function nextSlide() {
        const next = (currentIndex + 1) % cards.length;
        showSlide(next);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const testimonialSection = document.querySelector('.testimonials');
        const rect = testimonialSection?.getBoundingClientRect();

        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                stopAutoSlide();
                showSlide((currentIndex - 1 + cards.length) % cards.length);
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            }
        }
    });

    // Start auto-slide
    startAutoSlide();
}

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(target * easeOutQuart);

                counter.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }
}

/* =====================================================
   FORM HANDLING
   ===================================================== */
function initFormHandling() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <div class="btn-iso-icon" style="animation: pulse 1s infinite;"></div>
        `;

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <div class="btn-iso-icon" style="background: #4CAF50;"></div>
        `;
        submitBtn.style.background = '#4CAF50';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
        }, 3000);
    });

    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   PARALLAX EFFECTS
   ===================================================== */
function initParallaxEffects() {
    const heroVisual = document.querySelector('.hero-visual');
    const ctaVisual = document.querySelector('.cta-visual');

    // Only enable on desktop
    if (window.innerWidth < 768) return;

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Parallax on scroll
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;

        if (heroVisual) {
            const heroRect = heroVisual.getBoundingClientRect();
            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                const offset = scrollY * 0.1;
                heroVisual.style.transform = `translateY(${offset}px)`;
            }
        }
    }, 16));

    // Mouse parallax for hero buildings
    const isometricCity = document.querySelector('.isometric-city');

    if (isometricCity) {
        document.addEventListener('mousemove', throttle((e) => {
            const heroSection = document.querySelector('.hero');
            const rect = heroSection.getBoundingClientRect();

            // Only apply when hero is visible
            if (rect.top > window.innerHeight || rect.bottom < 0) return;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Subtle rotation based on mouse position
            const rotateX = 60 + (mouseY / centerY) * 3;
            const rotateZ = -45 + (mouseX / centerX) * 3;

            isometricCity.style.transform = `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
        }, 50));
    }

    // Interactive building hover effects
    const buildings = document.querySelectorAll('.iso-building');

    buildings.forEach(building => {
        building.addEventListener('mouseenter', () => {
            building.style.transition = 'transform 0.3s ease';
            building.style.transform = 'translateZ(20px)';
        });

        building.addEventListener('mouseleave', () => {
            building.style.transform = '';
        });
    });
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent features
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.querySelector('.nav-toggle').classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

/* =====================================================
   LOADING ANIMATION
   ===================================================== */
window.addEventListener('load', () => {
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');

    // Trigger hero animations
    const heroElements = document.querySelectorAll('.hero-tag, .hero-text h1, .hero-text > p, .hero-buttons');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
});

/* =====================================================
   ACCESSIBILITY ENHANCEMENTS
   ===================================================== */

// Skip to main content
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Reduce motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable non-essential animations
    document.documentElement.style.setProperty('--transition-build', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
        document.documentElement.style.setProperty('--transition-build', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    } else {
        document.documentElement.style.setProperty('--transition-build', '0.6s cubic-bezier(0.34, 1.56, 0.64, 1)');
        document.documentElement.style.setProperty('--transition-slow', '0.5s ease');
    }
});
