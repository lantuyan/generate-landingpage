/**
 * CashQuest - Bold Color Block Landing Page
 * JavaScript for animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initProgressAnimation();
    initHoverEffects();
});

/**
 * Navbar scroll effects
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (menuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

function closeMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');

    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animationConfig = [
        { selector: '.hero-badge', class: 'fade-in', delay: 0 },
        { selector: '.hero-title', class: 'fade-in', delay: 100 },
        { selector: '.hero-subtitle', class: 'fade-in', delay: 200 },
        { selector: '.hero-cta-group', class: 'fade-in', delay: 300 },
        { selector: '.hero-stats', class: 'fade-in', delay: 400 },
        { selector: '.section-header', class: 'fade-in', delay: 0 },
        { selector: '.feature-card', class: 'scale-in', stagger: 100 },
        { selector: '.step-card', class: 'slide-in-left', stagger: 150 },
        { selector: '.achievement-card', class: 'scale-in', stagger: 100 },
        { selector: '.testimonial-card', class: 'fade-in', stagger: 150 },
        { selector: '.cta-content', class: 'fade-in', delay: 0 },
        { selector: '.float-card', class: 'scale-in', stagger: 200 },
    ];

    // Apply initial classes
    animationConfig.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el, index) => {
            el.classList.add(config.class);
            if (config.stagger) {
                el.style.transitionDelay = `${config.stagger * index}ms`;
            } else if (config.delay) {
                el.style.transitionDelay = `${config.delay}ms`;
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger specific animations
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgress(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });

    // Observe progress bar for animation
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        observer.observe(progressBar);
    }
}

/**
 * Animate the progress bar in the phone mockup
 */
function initProgressAnimation() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        // Reset and animate on load
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = '78%';
        }, 500);
    }
}

function animateProgress(progressBar) {
    const fill = progressBar.querySelector('.progress-fill');
    if (fill) {
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = '78%';
        }, 200);
    }
}

/**
 * Live counter animation
 */
function initCounterAnimation() {
    const counter = document.querySelector('.counter-number');
    if (!counter) return;

    let currentValue = 1247;

    // Simulate live updates
    setInterval(() => {
        const change = Math.random() > 0.5 ? 1 : -1;
        currentValue += change;

        // Keep within reasonable bounds
        if (currentValue < 1000) currentValue = 1000;
        if (currentValue > 2000) currentValue = 2000;

        // Animate the number change
        counter.style.transform = 'scale(1.1)';
        counter.textContent = currentValue.toLocaleString();

        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 200);
    }, 3000);
}

/**
 * Interactive hover effects
 */
function initHoverEffects() {
    // Feature cards - color pulse on hover
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), box-shadow 0.3s ease';
        });
    });

    // Achievement cards - glow effect
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.achievement-glow');
            if (glow) {
                glow.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.achievement-glow');
            if (glow) {
                glow.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });

    // Avatar options - interactive selection
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            const preview = document.querySelector('.avatar-preview');
            const allOptions = document.querySelectorAll('.avatar-option');

            // Remove active from all
            allOptions.forEach(opt => opt.classList.remove('active'));

            // Add active to clicked
            option.classList.add('active');

            // Update preview with animation
            if (preview) {
                preview.style.transform = 'scale(0.8) rotate(-10deg)';
                setTimeout(() => {
                    preview.textContent = option.textContent;
                    preview.style.transform = 'scale(1) rotate(0deg)';
                }, 150);
            }
        });
    });

    // Download buttons - press effect
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(-2px) scale(0.98)';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-5px) scale(1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Primary CTA button - arrow animation
    const primaryBtn = document.querySelector('.btn-primary');
    if (primaryBtn) {
        primaryBtn.addEventListener('mouseenter', () => {
            const arrow = primaryBtn.querySelector('.btn-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(8px)';
            }
        });

        primaryBtn.addEventListener('mouseleave', () => {
            const arrow = primaryBtn.querySelector('.btn-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    }

    // Quest items - completion animation
    document.querySelectorAll('.quest-item:not(.completed)').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.add('completing');
            item.style.background = 'rgba(0, 210, 106, 0.1)';

            const xp = item.querySelector('.xp');
            if (xp) {
                const originalText = xp.textContent;
                xp.textContent = '✓';
                xp.style.color = '#00D26A';

                // Pop animation
                item.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.classList.add('completed');
                }, 200);
            }
        });
    });

    // Floating elements - parallax effect on mouse move
    initParallaxEffect();
}

/**
 * Parallax effect for floating elements
 */
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (!hero || floatingElements.length === 0) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        floatingElements.forEach((el, index) => {
            const speed = (index + 1) * 20;
            const xOffset = x * speed;
            const yOffset = y * speed;

            el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        floatingElements.forEach(el => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s ease';
        });
    });
}

/**
 * Stats counter animation
 */
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasDollar = text.includes('$');
        const hasStar = text.includes('★');

        let finalValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        let suffix = '';

        if (text.includes('M')) suffix = 'M+';
        if (text.includes('★')) suffix = '★';

        // Animate from 0 to final value
        let current = 0;
        const increment = finalValue / 50;
        const interval = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(interval);
            }

            let displayValue = current.toFixed(current < 10 ? 1 : 0);
            if (hasDollar) displayValue = '$' + displayValue + 'M';
            else if (suffix) displayValue = displayValue + suffix;
            else displayValue = displayValue + '+';

            stat.textContent = displayValue;
        }, 30);
    });
}

// Trigger stats animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateStats, 500);
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

/**
 * Add dynamic color transitions between sections
 */
function initSectionTransitions() {
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize section transitions
initSectionTransitions();
