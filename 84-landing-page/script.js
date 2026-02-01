/* ========================================
   RESONANCE - Music/Entertainment Landing Page
   JavaScript - Rhythmic Animations & Interactions
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimations();
    initTestimonialsSlider();
    initFormSubmission();
    initSmoothScroll();
    initParallaxEffects();
});

/* ========================================
   Navigation
======================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background change
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction (optional - commented out for now)
        // if (currentScroll > lastScroll && currentScroll > 100) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

/* ========================================
   Mobile Menu
======================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   Scroll Animations (Intersection Observer)
======================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Stagger children animations if present
                const staggerChildren = entry.target.querySelectorAll('.stagger-child');
                staggerChildren.forEach((child, index) => {
                    child.style.animationDelay = `${index * 100}ms`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);

    // Observe elements with animation triggers
    const animateElements = document.querySelectorAll(`
        .section-header,
        .artist-card,
        .step,
        .feature-card,
        .pricing-card,
        .cta-content
    `);

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add base styles for animations
    addScrollAnimationStyles();
}

function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .artist-card.animate-on-scroll:nth-child(1) { transition-delay: 0ms; }
        .artist-card.animate-on-scroll:nth-child(2) { transition-delay: 100ms; }
        .artist-card.animate-on-scroll:nth-child(3) { transition-delay: 200ms; }
        .artist-card.animate-on-scroll:nth-child(4) { transition-delay: 300ms; }

        .step.animate-on-scroll:nth-of-type(1) { transition-delay: 0ms; }
        .step.animate-on-scroll:nth-of-type(2) { transition-delay: 150ms; }
        .step.animate-on-scroll:nth-of-type(3) { transition-delay: 300ms; }

        .feature-card.animate-on-scroll:nth-child(1) { transition-delay: 0ms; }
        .feature-card.animate-on-scroll:nth-child(2) { transition-delay: 80ms; }
        .feature-card.animate-on-scroll:nth-child(3) { transition-delay: 160ms; }
        .feature-card.animate-on-scroll:nth-child(4) { transition-delay: 240ms; }
        .feature-card.animate-on-scroll:nth-child(5) { transition-delay: 320ms; }
        .feature-card.animate-on-scroll:nth-child(6) { transition-delay: 400ms; }
    `;
    document.head.appendChild(style);
}

/* ========================================
   Counter Animations
======================================== */
function initCounterAnimations() {
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
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const isPrice = counter.textContent.includes('$');
        let frame = 0;

        const easeOutQuad = (t) => t * (2 - t);

        const animate = () => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentValue = Math.round(target * progress);

            if (isPrice) {
                counter.textContent = '$' + formatNumber(currentValue);
            } else {
                counter.textContent = formatNumber(currentValue);
            }

            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                if (isPrice) {
                    counter.textContent = '$' + formatNumber(target);
                } else {
                    counter.textContent = formatNumber(target);
                }
            }
        };

        requestAnimationFrame(animate);
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

/* ========================================
   Testimonials Slider
======================================== */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    // Clone testimonials for infinite scroll effect
    const testimonials = slider.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        slider.appendChild(clone);
    });

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        slider.style.animationPlayState = 'paused';
    });

    slider.addEventListener('mouseleave', () => {
        slider.style.animationPlayState = 'running';
    });

    // Touch support for mobile
    let startX, scrollLeft;
    let isDown = false;

    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.animationPlayState = 'paused';
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

/* ========================================
   Form Submission
======================================== */
function initFormSubmission() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        const email = input.value;

        if (!validateEmail(email)) {
            showFormFeedback(input, 'Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const originalContent = button.innerHTML;
        button.innerHTML = '<span class="loading-spinner"></span>';
        button.disabled = true;

        // Simulate API call
        await delay(1500);

        // Success state
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 10l4 4 8-8"/>
            </svg>
            <span>You're In!</span>
        `;
        button.style.background = 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';

        input.value = '';
        showFormFeedback(input, 'Welcome to Resonance! Check your email for next steps.', 'success');

        // Reset after delay
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    });

    // Add loading spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .form-feedback {
            margin-top: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.875rem;
            animation: fadeInUp 0.3s ease-out;
        }

        .form-feedback.error {
            background: rgba(239, 68, 68, 0.15);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .form-feedback.success {
            background: rgba(34, 197, 94, 0.15);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormFeedback(input, message, type) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;

    input.closest('.form-group').insertAdjacentElement('afterend', feedback);

    // Auto-remove after delay
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-10px)';
        feedback.style.transition = 'all 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
    }, 5000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ========================================
   Smooth Scroll
======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ========================================
   Parallax Effects
======================================== */
function initParallaxEffects() {
    const orbs = document.querySelectorAll('.gradient-orb');
    let ticking = false;

    // Reduce motion if user prefers
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                orbs.forEach((orb, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = scrollY * speed;
                    orb.style.transform = `translate(0, ${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // Mouse parallax for orbs (desktop only)
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const mouseX = (e.clientX / window.innerWidth) - 0.5;
                    const mouseY = (e.clientY / window.innerHeight) - 0.5;

                    orbs.forEach((orb, index) => {
                        const speed = 20 + (index * 10);
                        const x = mouseX * speed;
                        const y = mouseY * speed;
                        orb.style.transform = `translate(${x}px, ${y}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

/* ========================================
   Play Button Hover Effect (Auditory Synesthesia)
======================================== */
document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            animation: ripple 0.6s ease-out forwards;
        `;
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0.8);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/* ========================================
   Artist Card Hover Sound Wave Effect
======================================== */
document.querySelectorAll('.artist-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add subtle pulse animation to the card
        card.style.animation = 'card-pulse 0.3s ease-out';
    });

    card.addEventListener('animationend', () => {
        card.style.animation = '';
    });
});

const cardPulseStyle = document.createElement('style');
cardPulseStyle.textContent = `
    @keyframes card-pulse {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-4px) scale(1.01); }
        100% { transform: translateY(-8px) scale(1); }
    }
`;
document.head.appendChild(cardPulseStyle);

/* ========================================
   Beat Animation on CTA Button
======================================== */
const ctaButton = document.querySelector('.hero-cta .btn-primary');
if (ctaButton) {
    // Add subtle beat animation
    setInterval(() => {
        ctaButton.style.transform = 'translateY(-2px) scale(1.02)';
        setTimeout(() => {
            ctaButton.style.transform = '';
        }, 150);
    }, 2000);
}

/* ========================================
   Keyboard Navigation Enhancement
======================================== */
document.addEventListener('keydown', (e) => {
    // Add focus ring for keyboard users
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid var(--primary) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);

/* ========================================
   Initialize Visual Equalizer Effect
======================================== */
function initEqualizerEffect() {
    const soundwaves = document.querySelectorAll('.soundwave span');

    // Randomize initial animation delays for more organic feel
    soundwaves.forEach(bar => {
        const randomDelay = Math.random() * 1;
        const randomDuration = 0.8 + Math.random() * 0.4;
        bar.style.animationDelay = `${randomDelay}s`;
        bar.style.animationDuration = `${randomDuration}s`;
    });
}

// Initialize equalizer on load
initEqualizerEffect();
