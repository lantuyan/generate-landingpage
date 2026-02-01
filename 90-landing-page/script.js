/**
 * Verdant Capital - Finance/Banking Landing Page
 * JavaScript for animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initPeriodTabs();
    initFormHandling();
    initSmoothScroll();
});

/**
 * Navigation Toggle for Mobile
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Counter Animations for Stats
 */
function initCounterAnimations() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    if (statValues.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
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

    statValues.forEach(stat => {
        observer.observe(stat);
    });
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;
    const isLargeNumber = target > 1000;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = target * easeOutQuart;

        if (isLargeNumber) {
            element.textContent = formatLargeNumber(currentValue);
        } else if (isDecimal) {
            element.textContent = currentValue.toFixed(1);
        } else {
            element.textContent = Math.floor(currentValue);
        }

        // Add $ prefix for AUM stat
        if (element.textContent.includes('B') || target === 2.4) {
            element.textContent = '$' + element.textContent;
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Format large numbers (e.g., 47000 -> 47,000)
 */
function formatLargeNumber(num) {
    return Math.floor(num).toLocaleString();
}

/**
 * Period Tabs for Performance Chart
 */
function initPeriodTabs() {
    const periodBtns = document.querySelectorAll('.period-btn');
    const verdantBar = document.querySelector('.chart-bar.verdant');
    const sp500Bar = document.querySelector('.chart-bar.sp500');

    if (periodBtns.length === 0) return;

    const performanceData = {
        '1y': { verdant: 14.2, sp500: 12.8 },
        '3y': { verdant: 38.5, sp500: 32.1 },
        '5y': { verdant: 68.4, sp500: 58.2 },
        '10y': { verdant: 156.8, sp500: 134.5 }
    };

    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Get data for selected period
            const period = btn.dataset.period;
            const data = performanceData[period];

            // Calculate bar heights (max 30% = 100% height)
            const maxValue = period === '10y' ? 180 : (period === '5y' ? 80 : (period === '3y' ? 45 : 30));
            const verdantHeight = (data.verdant / maxValue) * 100;
            const sp500Height = (data.sp500 / maxValue) * 100;

            // Animate bars
            if (verdantBar && sp500Bar) {
                verdantBar.style.setProperty('--bar-height', `${verdantHeight}%`);
                verdantBar.querySelector('.bar-value').textContent = `${data.verdant}%`;

                sp500Bar.style.setProperty('--bar-height', `${sp500Height}%`);
                sp500Bar.querySelector('.bar-value').textContent = `${data.sp500}%`;
            }
        });
    });
}

/**
 * Form Handling
 */
function initFormHandling() {
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = signupForm.querySelector('input[type="email"]');
            const submitBtn = signupForm.querySelector('button[type="submit"]');

            if (emailInput && emailInput.value) {
                // Show loading state
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                    </svg>
                    Processing...
                `;
                submitBtn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    submitBtn.innerHTML = `
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Welcome aboard!
                    `;
                    submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';

                    // Show success message
                    showToast('Check your email to complete signup!', 'success');

                    // Reset after delay
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        emailInput.value = '';
                    }, 3000);
                }, 1500);
            }
        });
    }
}

/**
 * Toast Notification
 */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor">
            ${type === 'success'
                ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'
                : '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>'
            }
        </svg>
        <span>${message}</span>
    `;

    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#059669' : '#2563eb'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    toast.querySelector('svg').style.cssText = `
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    `;

    // Add animation keyframes
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .spinner {
                width: 20px;
                height: 20px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after delay
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
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

/**
 * Animate chart line on scroll
 */
function initChartAnimation() {
    const chartLine = document.querySelector('.chart-line');

    if (!chartLine) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chartLine.style.animation = 'drawLine 2s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(chartLine);
}

/**
 * Add parallax effect to hero visual
 */
function initParallax() {
    const heroVisual = document.querySelector('.portfolio-preview');

    if (!heroVisual || window.innerWidth < 768) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.15;

        if (scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
}

/**
 * Initialize all on-load animations
 */
window.addEventListener('load', () => {
    // Add loaded class for initial animations
    document.body.classList.add('loaded');

    // Initialize additional effects
    initChartAnimation();
    initParallax();

    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});
