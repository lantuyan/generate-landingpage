/**
 * ChromaForge AI - Gradient Modern Landing Page
 * Interactive animations and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initScrollAnimations();
    initCounterAnimation();
    initMobileMenu();
    initFormHandling();
    initTestimonialSlider();
    initGradientInteractions();
    initSmoothScroll();
});

/**
 * Navbar scroll effects
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when past threshold
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
}

/**
 * Scroll-triggered animations (AOS-style)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply delay if specified
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Animated counter for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('mobile-open');
        navActions.classList.toggle('mobile-open');
        document.body.style.overflow = toggle.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('mobile-open');
            navActions.classList.remove('mobile-open');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Form submission handling
 */
function initFormHandling() {
    const form = document.querySelector('#cta-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Simulate form submission
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Show success state
            submitBtn.innerHTML = '<span>✓ Welcome aboard!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            emailInput.value = '';

            // Reset after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

/**
 * Testimonial slider for mobile
 */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;

    if (dots.length === 0) return;

    const showTestimonial = (index) => {
        cards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    // Auto-advance on mobile
    const autoAdvance = () => {
        if (window.innerWidth <= 768) {
            showTestimonial((currentIndex + 1) % cards.length);
        }
    };

    let autoAdvanceInterval = setInterval(autoAdvance, 5000);

    // Pause on interaction
    const testimonialSection = document.querySelector('.testimonials-slider');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', () => {
            clearInterval(autoAdvanceInterval);
        });

        testimonialSection.addEventListener('mouseleave', () => {
            autoAdvanceInterval = setInterval(autoAdvance, 5000);
        });
    }

    // Handle responsive visibility
    const handleResize = () => {
        if (window.innerWidth > 768) {
            cards.forEach(card => card.style.display = '');
        } else {
            showTestimonial(currentIndex);
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
}

/**
 * Interactive gradient effects
 */
function initGradientInteractions() {
    // Mouse-following gradient on hero
    const hero = document.querySelector('.hero');
    const orbs = document.querySelectorAll('.gradient-orb');

    if (hero && orbs.length) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            orbs.forEach((orb, index) => {
                const moveX = (x - 0.5) * 50 * (index + 1);
                const moveY = (y - 0.5) * 50 * (index + 1);
                orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            orbs.forEach(orb => {
                orb.style.transform = '';
            });
        });
    }

    // Gradient shift on feature cards
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Parallax effect on scroll for orbs
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                orbs.forEach((orb, index) => {
                    const speed = 0.1 * (index + 1);
                    orb.style.transform = `translateY(${scrollY * speed}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });

    // CTA orb animations
    const ctaOrbs = document.querySelectorAll('.cta-orb');
    const cta = document.querySelector('.cta');

    if (cta && ctaOrbs.length) {
        cta.addEventListener('mousemove', (e) => {
            const rect = cta.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            ctaOrbs.forEach((orb, index) => {
                const moveX = (x - 0.5) * 30 * (index + 1);
                const moveY = (y - 0.5) * 30 * (index + 1);
                orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Debounce function
 */
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

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Add gradient cursor trail effect (optional enhancement)
 */
function initCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

/**
 * Preloader (optional)
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    });
}
