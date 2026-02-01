/**
 * ReCircle - Circular Economy Marketplace
 * Eco/Sustainable Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initCounterAnimation();
    initImpactChart();
    initTestimonialSlider();
    initFormHandling();
});

/**
 * Navigation Functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Scroll effect for navbar
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

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
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

/**
 * Hero Section Animations
 */
function initHeroAnimations() {
    // Add staggered animation classes
    const heroElements = document.querySelectorAll('.hero-badge, .hero h1, .hero-description, .hero-actions, .hero-stats');

    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });

    // Parallax effect for floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    const earthIllustration = document.querySelector('.earth-illustration');

    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;

        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 10;
            const x = mouseX * speed;
            const y = mouseY * speed;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });

        if (earthIllustration) {
            earthIllustration.style.transform = `translate(${mouseX * 5}px, ${mouseY * 5}px) scale(1)`;
        }
    });
}

/**
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Stagger animation for process steps
                if (entry.target.classList.contains('process-step')) {
                    const delay = entry.target.dataset.step * 200;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.process-step, .feature-card, .testimonial-card, .metric, .chart-bar'
    );

    animatedElements.forEach(el => observer.observe(el));

    // Fade-in animations for sections
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-header, .impact-content, .cta-content').forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });
}

/**
 * Counter Animation for Hero Stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = formatNumber(Math.floor(current));
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = formatNumber(target);
                }
            };

            updateCounter();
        });

        animated = true;
    };

    // Trigger when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(animateCounters, 500);
        }
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
}

/**
 * Format numbers with K/M suffix
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

/**
 * Impact Section Chart Animation
 */
function initImpactChart() {
    const chartBars = document.querySelectorAll('.chart-bar');

    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const value = bar.dataset.value;
                bar.style.setProperty('--bar-width', `${value}%`);
                bar.classList.add('animate');
            }
        });
    }, { threshold: 0.3 });

    chartBars.forEach(bar => chartObserver.observe(bar));
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;
    const cardWidth = cards[0].offsetWidth + 32; // Including gap

    const updateSlider = (index) => {
        // Handle wrap-around
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;

        currentIndex = index;

        // Calculate transform based on viewport
        let translateX;
        if (window.innerWidth <= 768) {
            translateX = -currentIndex * (window.innerWidth - 48); // Full width minus padding
        } else {
            translateX = -currentIndex * cardWidth;
        }

        track.style.transform = `translateX(${translateX}px)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    // Button events
    prevBtn.addEventListener('click', () => {
        updateSlider(currentIndex - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        updateSlider(currentIndex + 1);
        resetAutoplay();
    });

    // Dot events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            resetAutoplay();
        });
    });

    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            updateSlider(currentIndex + 1);
        }, 5000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateSlider(currentIndex + 1);
            } else {
                updateSlider(currentIndex - 1);
            }
            resetAutoplay();
        }
    };

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider(currentIndex);
        }, 250);
    });

    // Start autoplay
    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', startAutoplay);
}

/**
 * Form Handling
 */
function initFormHandling() {
    const form = document.getElementById('signup-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]');
        const select = form.querySelector('select');
        const button = form.querySelector('button[type="submit"]');

        // Basic validation
        if (!email.value || !email.validity.valid) {
            shakeElement(email);
            return;
        }

        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Joining...</span>';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        button.innerHTML = '<span>Welcome to the Circle!</span>';
        button.style.background = 'var(--sage-green)';

        // Show success message
        showSuccessMessage(form);

        // Reset form
        setTimeout(() => {
            email.value = '';
            select.selectedIndex = 0;
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 3000);
    });
}

/**
 * Shake animation for invalid inputs
 */
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });

    // Add shake keyframes if not exists
    if (!document.querySelector('#shake-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shake-keyframes';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-8px); }
                40%, 80% { transform: translateX(8px); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show success message
 */
function showSuccessMessage(form) {
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) existingMessage.remove();

    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>Check your email for next steps!</span>
    `;
    message.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        margin-top: 16px;
        background: rgba(74, 124, 89, 0.1);
        color: var(--moss-green);
        border-radius: 12px;
        font-weight: 600;
        animation: fadeInUp 0.5s ease forwards;
    `;
    message.querySelector('svg').style.cssText = 'width: 20px; height: 20px;';

    form.appendChild(message);

    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => message.remove(), 500);
    }, 4000);

    // Add fadeOut keyframes
    if (!document.querySelector('#fadeout-keyframes')) {
        const style = document.createElement('style');
        style.id = 'fadeout-keyframes';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Lazy load images (for future use)
 */
function lazyLoadImages() {
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
 * Reduce motion for users who prefer it
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-smooth', '0.01ms');
    document.documentElement.style.setProperty('--transition-organic', '0.01ms');
}
