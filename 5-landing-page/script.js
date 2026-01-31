/**
 * Serenity Cloud - Glassmorphism Landing Page
 * Interactive JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initAnimateOnScroll();
    initCounterAnimation();
    initTestimonialSlider();
    initPricingToggle();
    initFormSubmission();
    initRippleEffect();
    initParallaxEffects();
});

/**
 * Navigation scroll effect
 */
function initNavigation() {
    const nav = document.querySelector('.glass-nav');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class for background change
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll (optional)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    };

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
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

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Animate elements on scroll (AOS-like functionality)
 */
function initAnimateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));

    // Animate elements that don't have data-aos but should animate
    const animatableElements = document.querySelectorAll(
        '.feature-card, .experience-item, .testimonial-card, .pricing-card'
    );

    animatableElements.forEach((el, index) => {
        if (!el.hasAttribute('data-aos')) {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (index % 4) * 100);
            observer.observe(el);
        }
    });
}

/**
 * Counter animation for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            counter.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K+';
        }
        return num.toString() + (num < 100 ? '%' : '+');
    };

    // Observe counters
    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Testimonial slider
 */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 30; // Include gap
    let autoplayInterval;

    const updateSlider = () => {
        // Recalculate card width on resize
        cardWidth = cards[0].offsetWidth + 30;

        const offset = -currentIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateSlider();
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    };

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoplay();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    }, { passive: true });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    // Handle resize
    window.addEventListener('resize', updateSlider);

    // Start autoplay
    startAutoplay();
}

/**
 * Pricing toggle (monthly/yearly)
 */
function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    const prices = document.querySelectorAll('.price');
    const labels = document.querySelectorAll('.toggle-label');

    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isYearly = toggle.checked;

        // Update labels
        labels.forEach((label, index) => {
            label.classList.toggle('active', isYearly ? index === 1 : index === 0);
        });

        // Animate price change
        prices.forEach(price => {
            const monthly = price.getAttribute('data-monthly');
            const yearly = price.getAttribute('data-yearly');

            // Fade out
            price.style.opacity = '0';
            price.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                price.textContent = isYearly ? yearly : monthly;
                price.style.opacity = '1';
                price.style.transform = 'translateY(0)';
            }, 200);
        });
    });

    // Add transition styles
    prices.forEach(price => {
        price.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
}

/**
 * Form submission with validation
 */
function initFormSubmission() {
    const form = document.getElementById('signup-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            shakeElement(emailInput);
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate API call
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = '<span>Welcome to Serenity! ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';

            // Show success message
            showNotification('Welcome! Check your email for next steps.', 'success');

            // Reset after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                emailInput.value = '';
            }, 3000);
        }, 1500);
    });
}

/**
 * Shake animation for invalid input
 */
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.style.borderColor = '#f5576c';

    setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
    }, 500);
}

/**
 * Add shake keyframes dynamically
 */
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    });

    document.body.appendChild(notification);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = 'background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;';
    closeBtn.addEventListener('click', () => removeNotification(notification));

    // Auto remove
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => notification.remove(), 300);
}

// Add notification animations
const notificationKeyframes = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

styleSheet.textContent += notificationKeyframes;

/**
 * Ripple effect on buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .glass-card');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                left: ${x}px;
                top: ${y}px;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Parallax effects for background elements
 */
function initParallaxEffects() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const shapes = document.querySelectorAll('.shape');

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const animate = () => {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 10;
            orb.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
        });

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 5;
            shape.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
        });

        requestAnimationFrame(animate);
    };

    animate();

    // Scroll parallax for hero section
    const heroVisual = document.querySelector('.hero-main-visual');
    const heroCards = document.querySelectorAll('.floating-card');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
        }

        heroCards.forEach((card, index) => {
            const speed = 0.05 * (index + 1);
            card.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/**
 * Breathing animation sync
 */
function initBreathingAnimation() {
    const breathCore = document.querySelector('.breath-core span');
    if (!breathCore) return;

    const breathPhases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
    let phase = 0;

    setInterval(() => {
        breathCore.style.opacity = '0';
        setTimeout(() => {
            breathCore.textContent = breathPhases[phase];
            breathCore.style.opacity = '1';
            phase = (phase + 1) % breathPhases.length;
        }, 500);
    }, 4000);
}

// Initialize breathing animation
initBreathingAnimation();

/**
 * Lazy loading for images (if any are added later)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Preloader (optional)
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero [data-aos], .hero-tagline, .hero-title, .hero-description');
    heroElements.forEach(el => el.classList.add('aos-animate'));
});
