/**
 * MindBridge - Mental Health Telehealth Platform
 * Healthcare/Medical Design Landing Page
 * Smooth, calming interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initFadeInAnimations();
    initFAQ();
    initTestimonialsSlider();
    initSmoothScroll();
    initFormValidation();
    initMoodGraphAnimation();
});

/**
 * Navigation - Mobile menu toggle and scroll behavior
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 145, 185, 0.07)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Scroll Animations - Animate elements when they enter viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.step-card, .service-card, .therapist-card, .testimonial-card, .pricing-card, .faq-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Hero Fade In Animations
 */
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => observer.observe(el));
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items (accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

/**
 * Testimonials Slider
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const cards = document.querySelectorAll('.testimonial-card');

    if (!slider || !dots.length || !cards.length) return;

    let currentSlide = 0;
    const totalSlides = cards.length;

    // Only enable slider on mobile
    function updateSlider() {
        if (window.innerWidth <= 768) {
            // Mobile: Show one slide at a time
            cards.forEach((card, index) => {
                card.style.display = index === currentSlide ? 'block' : 'none';
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        } else {
            // Desktop: Show all cards
            cards.forEach(card => {
                card.style.display = 'block';
            });
        }
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Auto-advance slider on mobile
    let autoSlideInterval;

    function startAutoSlide() {
        if (window.innerWidth <= 768) {
            autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }, 5000);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Handle resize
    window.addEventListener('resize', () => {
        stopAutoSlide();
        updateSlider();
        startAutoSlide();
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Initialize
    updateSlider();
    startAutoSlide();
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Validation with gentle feedback
 */
function initFormValidation() {
    const form = document.querySelector('.cta-form');
    const emailInput = form?.querySelector('input[type="email"]');

    if (!form || !emailInput) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showFormFeedback(emailInput, 'Please enter your email address', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            showFormFeedback(emailInput, 'Please enter a valid email address', 'error');
            return;
        }

        // Success state
        showFormFeedback(emailInput, 'Welcome to MindBridge! Check your email to get started.', 'success');
        emailInput.value = '';

        // Simulate form submission
        const button = form.querySelector('button');
        button.textContent = 'Sent!';
        button.style.background = '#4caf50';

        setTimeout(() => {
            button.textContent = 'Start Free Trial';
            button.style.background = '';
        }, 3000);
    });

    // Clear error state on input
    emailInput.addEventListener('input', () => {
        clearFormFeedback(emailInput);
    });
}

function showFormFeedback(input, message, type) {
    clearFormFeedback(input);

    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: ${type === 'error' ? '#f44336' : '#4caf50'};
        animation: fadeIn 0.3s ease;
    `;

    input.parentElement.parentElement.appendChild(feedback);

    if (type === 'error') {
        input.style.borderColor = '#f44336';
    }
}

function clearFormFeedback(input) {
    const existingFeedback = input.parentElement.parentElement.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    input.style.borderColor = '';
}

/**
 * Mood Graph Animation in Hero Card
 */
function initMoodGraphAnimation() {
    const graphBars = document.querySelectorAll('.graph-bar');

    if (!graphBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMoodGraph(graphBars);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        observer.observe(heroCard);
    }
}

function animateMoodGraph(bars) {
    bars.forEach((bar, index) => {
        const targetHeight = bar.style.getPropertyValue('--height');
        bar.style.height = '0%';

        setTimeout(() => {
            bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.height = targetHeight;
        }, index * 100);
    });
}

/**
 * Gentle hover effects for cards
 */
document.querySelectorAll('.step-card, .service-card, .therapist-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

/**
 * Parallax effect for floating elements
 */
function initParallax() {
    const floatingElements = document.querySelectorAll('.floating-element');

    if (!floatingElements.length || window.innerWidth < 768) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        floatingElements.forEach((el, index) => {
            const speed = 0.05 * (index + 1);
            const yPos = scrolled * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// Initialize parallax if not on mobile
if (window.innerWidth >= 768) {
    initParallax();
}

/**
 * Accessibility: Handle keyboard navigation for FAQ
 */
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

/**
 * Add focus states for accessibility
 */
document.querySelectorAll('a, button, input').forEach(el => {
    el.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-500)';
        this.style.outlineOffset = '2px';
    });

    el.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

/**
 * Respect reduced motion preferences
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero-card, .floating-element').forEach(el => {
        el.style.animation = 'none';
    });
}

/**
 * Console message for developers
 */
console.log('%c MindBridge ', 'background: #0091b9; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;');
console.log('Mental health matters. Thank you for visiting.');
