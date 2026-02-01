/**
 * Art Nouveau Landing Page Scripts
 * Floraison Parfumerie
 *
 * Organic animations and interactions inspired by flowing botanical forms
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initBotanicalIllustration();
    initTestimonialsCarousel();
    initContactForm();
    initSmoothScroll();
    initParallaxEffects();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scroll behavior for navigation
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
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

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = [
        { selector: '.perfume-card', stagger: 150 },
        { selector: '.process-step', stagger: 200 },
        { selector: '.section-ornament', stagger: 0 },
        { selector: '.about-content', stagger: 0 },
        { selector: '.contact-content', stagger: 0 }
    ];

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add visible class with optional delay for staggering
                const delay = element.dataset.delay || 0;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';

                    // Trigger ornament animations
                    if (element.classList.contains('section-ornament')) {
                        element.classList.add('ornament-animate');
                    }
                }, delay);

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Apply observer to elements with staggered delays
    animatedElements.forEach(({ selector, stagger }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.dataset.delay = index * stagger;
            observer.observe(el);
        });
    });
}

/**
 * Botanical illustration animation
 */
function initBotanicalIllustration() {
    const botanical = document.querySelector('.botanical-svg');
    if (!botanical) return;

    const stem = botanical.querySelector('.stem');
    const petals = botanical.querySelectorAll('.petal');
    const center = botanical.querySelector('.flower-center');
    const leaves = botanical.querySelectorAll('.leaf');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate stem drawing
                animatePath(stem, 2000);

                // Animate petals blooming
                petals.forEach((petal, index) => {
                    setTimeout(() => {
                        petal.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                        petal.style.opacity = '1';
                        petal.style.transform = 'scale(1)';
                    }, 1500 + (index * 150));
                });

                // Animate flower center
                setTimeout(() => {
                    center.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    center.style.opacity = '1';
                    center.style.transform = 'scale(1)';
                }, 2500);

                // Animate leaves
                leaves.forEach((leaf, index) => {
                    setTimeout(() => {
                        leaf.style.transition = 'opacity 0.6s ease-out';
                        leaf.style.opacity = '0.7';
                    }, 1000 + (index * 300));
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(botanical);
}

/**
 * Animate SVG path drawing
 */
function animatePath(path, duration) {
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = `stroke-dashoffset ${duration}ms ease-out`;

    // Trigger animation
    requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0';
    });
}

/**
 * Testimonials carousel
 */
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    let currentIndex = 0;
    let autoplayInterval;

    function showSlide(index) {
        // Handle wrap-around
        if (index >= cards.length) index = 0;
        if (index < 0) index = cards.length - 1;

        // Update cards
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === index) {
                card.classList.add('active');
            } else if (i === currentIndex) {
                card.classList.add('prev');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        startAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
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

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        if (!data.name || !data.email) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;

        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            showFormMessage('Thank you for your inquiry. We will respond within 24 hours.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
        }, 1500);
    });

    // Add floating label effect
    const inputs = form.querySelectorAll('input, select, textarea');
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.innerHTML = `
        <span>${message}</span>
    `;

    // Style the message
    Object.assign(messageEl.style, {
        padding: '1rem',
        marginBottom: '1rem',
        textAlign: 'center',
        borderRadius: '2px',
        animation: 'fade-up 0.5s ease-out',
        background: type === 'success' ? 'rgba(139, 154, 107, 0.2)' : 'rgba(107, 45, 60, 0.2)',
        border: `1px solid ${type === 'success' ? '#8B9A6B' : '#6B2D3C'}`,
        color: type === 'success' ? '#2A5446' : '#6B2D3C'
    });

    // Insert before form
    const form = document.getElementById('contactForm');
    form.insertBefore(messageEl, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => messageEl.remove(), 500);
    }, 5000);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Subtle parallax effects
 */
function initParallaxEffects() {
    const heroOrnaments = document.querySelectorAll('.hero-ornament');
    const sectionOrnaments = document.querySelectorAll('.section-ornament');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Hero ornaments parallax
                heroOrnaments.forEach(ornament => {
                    const speed = 0.15;
                    ornament.style.transform = `translateY(${scrolled * speed}px)`;
                });

                // Section ornaments subtle movement
                sectionOrnaments.forEach(ornament => {
                    const rect = ornament.getBoundingClientRect();
                    const visible = rect.top < window.innerHeight && rect.bottom > 0;

                    if (visible) {
                        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                        const offset = (progress - 0.5) * 20;
                        ornament.style.transform = `translateX(-50%) translateY(${offset}px)`;
                    }
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Flower blooming effect on hover (for perfume cards)
 */
document.querySelectorAll('.perfume-card').forEach(card => {
    const bottle = card.querySelector('.bottle-liquid');
    if (!bottle) return;

    card.addEventListener('mouseenter', () => {
        bottle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        bottle.style.transform = 'scale(1.1)';
        bottle.style.opacity = '0.8';
    });

    card.addEventListener('mouseleave', () => {
        bottle.style.transform = 'scale(1)';
        bottle.style.opacity = '0.6';
    });
});

/**
 * Organic cursor trail effect (desktop only)
 */
function initCursorTrail() {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const trail = [];
    const trailLength = 8;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        Object.assign(dot.style, {
            position: 'fixed',
            width: `${8 - i * 0.8}px`,
            height: `${8 - i * 0.8}px`,
            borderRadius: '50%',
            background: `rgba(180, 132, 108, ${0.6 - i * 0.07})`,
            pointerEvents: 'none',
            zIndex: '9999',
            transition: `transform ${0.1 + i * 0.02}s ease-out`,
            opacity: '0'
        });
        document.body.appendChild(dot);
        trail.push({ el: dot, x: 0, y: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;
    let isVisible = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            trail.forEach(dot => dot.el.style.opacity = '1');
        }
    });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        trail.forEach(dot => dot.el.style.opacity = '0');
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            const nextX = x;
            const nextY = y;

            dot.x += (nextX - dot.x) * 0.3;
            dot.y += (nextY - dot.y) * 0.3;

            dot.el.style.transform = `translate(${dot.x - 4}px, ${dot.y - 4}px)`;

            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// Initialize cursor trail on desktop
if (window.innerWidth > 768) {
    initCursorTrail();
}

/**
 * Reveal animations for text content
 */
function initTextReveal() {
    const revealElements = document.querySelectorAll('.section-title, .section-label');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
}

// Initialize text reveal
initTextReveal();
