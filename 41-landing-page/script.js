/* ============================================
   SONICVERSE STUDIO - JAVASCRIPT
   Interactions, Animations, and Color Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initTestimonialSlider();
    initFormHandling();
    initScrollReveal();
    initParallaxEffects();
});

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu
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

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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

/* ============================================
   SCROLL EFFECTS
   ============================================ */

function initScrollEffects() {
    // Hide scroll indicator when scrolling down
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });

    // Animate stats when in view
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

function animateValue(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasM = text.includes('M');
    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = numericValue * easeProgress;

        let displayValue;
        if (hasM) {
            displayValue = currentValue.toFixed(1) + 'M';
        } else if (numericValue >= 100) {
            displayValue = Math.floor(currentValue).toString();
        } else {
            displayValue = Math.floor(currentValue).toString();
        }

        if (hasPlus) displayValue += '+';
        element.textContent = displayValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */

function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentIndex = 0;
    let autoplayInterval;

    function showSlide(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });

        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        const next = (currentIndex + 1) % cards.length;
        showSlide(next);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
        });
    });

    // Touch/swipe support
    const slider = document.querySelector('.testimonials-slider');
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                showSlide((currentIndex + 1) % cards.length);
            } else {
                // Swipe right - previous
                showSlide((currentIndex - 1 + cards.length) % cards.length);
            }
        }
    }

    // Start autoplay
    startAutoplay();
}

/* ============================================
   FORM HANDLING
   ============================================ */

function initFormHandling() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Add loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.remove('loading');
        form.classList.add('form-submitted');
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.classList.remove('form-submitted');
        }, 3000);
    });

    // Add floating label effect
    const inputs = form.querySelectorAll('input, textarea, select');
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

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */

function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = [
        '.section-header',
        '.work-card',
        '.service-card',
        '.process-step',
        '.about-image',
        '.about-content',
        '.testimonial-card',
        '.contact-content',
        '.contact-form'
    ];

    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    // Observe and reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Stagger children in grids
    const staggerContainers = [
        '.work-grid',
        '.services-grid',
        '.process-timeline'
    ];

    staggerContainers.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            container.classList.add('stagger-children');

            const containerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.2 });

            containerObserver.observe(container);
        }
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */

function initParallaxEffects() {
    const hero = document.querySelector('.hero-bg');
    const heroPattern = document.querySelector('.hero-pattern');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        if (hero) {
            hero.style.transform = `translateY(${rate * 0.3}px)`;
        }

        if (heroPattern) {
            heroPattern.style.transform = `translateY(${rate * 0.1}px)`;
        }
    });

    // Mouse movement parallax for hero
    const heroContent = document.querySelector('.hero-content');

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;

        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        if (heroPattern) {
            heroPattern.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
    });
}

/* ============================================
   DUOTONE COLOR SHIFT EFFECT
   ============================================ */

// Add hover effect for duotone images with color transition
document.querySelectorAll('.duotone-image').forEach(image => {
    image.addEventListener('mouseenter', function() {
        this.style.setProperty('--shift-amount', '1');
    });

    image.addEventListener('mouseleave', function() {
        this.style.setProperty('--shift-amount', '0');
    });
});

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

// Create a reusable intersection observer for animations
function createAnimationObserver(threshold = 0.1) {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold });
}

/* ============================================
   PRELOADER (Optional)
   ============================================ */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations after load
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 100);
});

/* ============================================
   KEYBOARD ACCESSIBILITY
   ============================================ */

// Handle keyboard navigation for testimonials
document.addEventListener('keydown', (e) => {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const isSliderFocused = slider.contains(document.activeElement);

    if (isSliderFocused) {
        const dots = document.querySelectorAll('.testimonial-dot');
        const activeDot = document.querySelector('.testimonial-dot.active');
        const currentIndex = Array.from(dots).indexOf(activeDot);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % dots.length;
            dots[nextIndex].click();
            dots[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + dots.length) % dots.length;
            dots[prevIndex].click();
            dots[prevIndex].focus();
        }
    }
});

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll-heavy functions
const throttledScroll = throttle(() => {
    // Any scroll-intensive operations here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll, { passive: true });
