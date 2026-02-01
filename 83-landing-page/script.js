/* ========================================
   APEX AI - Athletic/Sports Landing Page
   JavaScript Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initHeroAnimations();
    initCounterAnimations();
    initScrollAnimations();
    initTestimonialSlider();
    initFormSubmission();
    initMobileMenu();
    initSmoothScroll();
});

/* ========================================
   Navbar Scroll Effect
   ======================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when past hero
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Hero Animations
   ======================================== */
function initHeroAnimations() {
    // Animate hero stats numbers
    const heroStats = document.querySelectorAll('.hero-stats .stat-number');

    heroStats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        animateValue(stat, 0, target, 2000);
    });
}

/* ========================================
   Counter Animations
   ======================================== */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    const statFills = document.querySelectorAll('.stat-fill');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.dataset.target);
                const isDecimal = target % 1 !== 0;

                animateCounter(counter, target, isDecimal);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // Animate stat bars
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                statObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statFills.forEach(fill => statObserver.observe(fill));
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for dynamic feel
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (range * easeOutQuart));

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function animateCounter(element, target, isDecimal) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Athletic momentum easing
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = target * easeOutExpo;

        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ========================================
   Scroll Animations (AOS-like)
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;

                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);

                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));
}

/* ========================================
   Testimonial Slider
   ======================================== */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoplayInterval;

    function showSlide(index) {
        // Remove active classes
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active classes
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

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
        });
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.querySelector('.testimonial-slider');

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                showSlide((currentIndex + 1) % cards.length);
            } else {
                // Swipe right - prev
                showSlide((currentIndex - 1 + cards.length) % cards.length);
            }
        }
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', stopAutoplay);
        testimonialSection.addEventListener('mouseleave', startAutoplay);
    }
}

/* ========================================
   Form Submission
   ======================================== */
function initFormSubmission() {
    const form = document.getElementById('signup-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const originalText = button.querySelector('.btn-text').textContent;

            // Validate email
            if (!isValidEmail(input.value)) {
                shakeElement(input);
                return;
            }

            // Show loading state
            button.disabled = true;
            button.querySelector('.btn-text').textContent = 'Starting...';
            button.querySelector('.btn-icon').textContent = '⚡';

            // Simulate API call
            setTimeout(() => {
                // Success state
                button.querySelector('.btn-text').textContent = 'You\'re In!';
                button.querySelector('.btn-icon').textContent = '✓';
                input.value = '';

                // Create success pulse effect
                createSuccessPulse(form);

                // Reset after delay
                setTimeout(() => {
                    button.disabled = false;
                    button.querySelector('.btn-text').textContent = originalText;
                    button.querySelector('.btn-icon').textContent = '→';
                }, 3000);
            }, 1500);
        });
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'shake 0.5s ease';

    // Add shake keyframes if not exists
    if (!document.querySelector('#shake-styles')) {
        const style = document.createElement('style');
        style.id = 'shake-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createSuccessPulse(element) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border: 2px solid #ff4d00;
        border-radius: 8px;
        animation: successPulse 0.6s ease-out forwards;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.appendChild(pulse);

    // Add animation keyframes if not exists
    if (!document.querySelector('#success-pulse-styles')) {
        const style = document.createElement('style');
        style.id = 'success-pulse-styles';
        style.textContent = `
            @keyframes successPulse {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => pulse.remove(), 600);
}

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navbar = document.querySelector('.navbar');

    // Create mobile nav
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#coaches">Coaches</a>
        <a href="#stats">Results</a>
        <a href="#cta" class="mobile-cta">Start Training</a>
    `;
    document.body.appendChild(mobileNav);

    if (toggle) {
        toggle.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('menu-open');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
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

/* ========================================
   Parallax Effects
   ======================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero parallax
    const heroDiagonal = document.querySelector('.hero-diagonal');
    if (heroDiagonal) {
        heroDiagonal.style.transform = `skewX(-15deg) translateY(${scrolled * 0.1}px)`;
    }

    // Data pulses parallax
    const pulses = document.querySelectorAll('.data-pulse');
    pulses.forEach((pulse, index) => {
        pulse.style.transform = `translateY(${scrolled * 0.05 * (index + 1)}px)`;
    });
});

/* ========================================
   Feature Cards Hover Effect
   ======================================== */
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ========================================
   Progress Chart Animation
   ======================================== */
const chartBars = document.querySelectorAll('.chart-bar');
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            chartBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.animation = 'growBar 0.6s ease forwards';
                }, index * 100);
            });
            chartObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const progressChart = document.querySelector('.progress-chart');
if (progressChart) {
    chartObserver.observe(progressChart);

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes growBar {
            from { height: 0; }
            to { height: var(--height); }
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   Dynamic Badge Animation
   ======================================== */
document.querySelectorAll('.coach-badge, .featured-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'skewX(-5deg) scale(1.1)';
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'skewX(-5deg) scale(1)';
    });
});

/* ========================================
   Intersection Observer for Performance
   ======================================== */
// Lazy load heavy animations only when in view
const lazyAnimations = document.querySelectorAll('.data-pulse, .brain-pulse');
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        } else {
            entry.target.style.animationPlayState = 'paused';
        }
    });
}, { threshold: 0 });

lazyAnimations.forEach(el => {
    el.style.animationPlayState = 'paused';
    lazyObserver.observe(el);
});
