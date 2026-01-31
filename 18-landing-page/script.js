/**
 * WealthFlow - Neumorphic Landing Page
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initSlider();
    initDial();
    initToggles();
    initPricingToggle();
    initButtonEffects();
    initSidebarNavigation();
});

/**
 * Navigation scroll behavior
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    closeMobileMenu();
                }
            }
        });
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .account-card');

    // Add animation class
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delay
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Animate chart bars on scroll
    const chartBars = document.querySelectorAll('.bar');
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateChartBars();
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const chartPlaceholder = document.querySelector('.chart-placeholder');
    if (chartPlaceholder) {
        chartObserver.observe(chartPlaceholder);
    }
}

function animateChartBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        const height = bar.style.getPropertyValue('--height');
        bar.style.height = '0';
        setTimeout(() => {
            bar.style.transition = 'height 0.6s ease';
            bar.style.height = height;
        }, index * 100);
    });
}

/**
 * Neumorphic slider interaction
 */
function initSlider() {
    const slider = document.getElementById('savingsSlider');
    const sliderValue = document.getElementById('savingsValue');
    const progressFill = document.getElementById('progressFill');

    if (!slider) return;

    // Update on input
    slider.addEventListener('input', () => {
        const value = slider.value;
        sliderValue.textContent = value;
        progressFill.style.width = `${value}%`;

        // Add haptic feedback simulation (visual pulse)
        sliderValue.style.transform = 'scale(1.1)';
        setTimeout(() => {
            sliderValue.style.transform = 'scale(1)';
        }, 100);
    });

    // Add transition for smooth value display
    sliderValue.style.transition = 'transform 0.1s ease';
}

/**
 * Rotary dial interaction
 */
function initDial() {
    const dial = document.getElementById('budgetDial');
    const dialMarker = document.getElementById('dialMarker');
    const dialValue = document.getElementById('dialValue');

    if (!dial) return;

    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0;

    const minValue = 1000;
    const maxValue = 10000;
    const minAngle = -135;
    const maxAngle = 135;

    // Calculate angle from mouse position
    function getAngle(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        return Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    }

    // Update dial value based on rotation
    function updateDial(rotation) {
        // Clamp rotation
        rotation = Math.max(minAngle, Math.min(maxAngle, rotation));
        currentRotation = rotation;

        // Update marker
        dialMarker.style.transform = `translateX(-50%) rotate(${rotation}deg)`;

        // Calculate value
        const percentage = (rotation - minAngle) / (maxAngle - minAngle);
        const value = Math.round(minValue + percentage * (maxValue - minValue));

        dialValue.textContent = `$${value.toLocaleString()}`;
    }

    // Mouse/Touch events
    dial.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngle(e, dial) - currentRotation;
        dial.style.cursor = 'grabbing';
    });

    dial.addEventListener('touchstart', (e) => {
        isDragging = true;
        startAngle = getAngle(e, dial) - currentRotation;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const angle = getAngle(e, dial) - startAngle;
        updateDial(angle);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const angle = getAngle(e, dial) - startAngle;
        updateDial(angle);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        dial.style.cursor = 'pointer';
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Initialize dial position
    updateDial(0);
}

/**
 * Feature toggle interactions
 */
function initToggles() {
    const toggleInputs = document.querySelectorAll('.toggle-input');

    toggleInputs.forEach(input => {
        input.addEventListener('change', () => {
            const label = input.nextElementSibling;
            const textSpan = label.querySelector('.toggle-text');

            if (input.checked) {
                textSpan.textContent = 'Active';
                // Add subtle animation
                label.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 150);
            } else {
                textSpan.textContent = 'Inactive';
            }
        });
    });
}

/**
 * Pricing toggle (monthly/yearly)
 */
function initPricingToggle() {
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');
    const priceElements = document.querySelectorAll('.price');

    if (!pricingToggle) return;

    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        // Update labels
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);

        // Animate price change
        priceElements.forEach(el => {
            const monthly = el.dataset.monthly;
            const yearly = el.dataset.yearly;

            // Add transition effect
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                el.textContent = isYearly ? yearly : monthly;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150);
        });
    });

    // Add transitions
    priceElements.forEach(el => {
        el.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    });

    // Set initial state
    monthlyLabel.classList.add('active');
}

/**
 * Button press effects
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav, .btn-pricing, .btn-cta-primary');

    buttons.forEach(button => {
        // Add press effect class
        button.classList.add('press-effect');

        // Create ripple effect on click
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnimation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Sidebar navigation interaction
 */
function initSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Add press animation
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

/**
 * Parallax effect for hero shapes
 */
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

/**
 * Number counter animation
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format number
        if (target >= 1000000000) {
            element.textContent = `$${(current / 1000000000).toFixed(1)}B`;
        } else if (target >= 1000) {
            element.textContent = `${Math.floor(current / 1000)}K+`;
        } else {
            element.textContent = current.toFixed(1);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            // Trigger counter animation could be added here
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

/**
 * Account card interactions
 */
document.querySelectorAll('.account-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });

    card.addEventListener('mousedown', () => {
        card.style.boxShadow = 'inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light)';
    });

    card.addEventListener('mouseup', () => {
        card.style.boxShadow = '';
    });
});

/**
 * Smooth reveal for floating cards
 */
const floatingCards = document.querySelectorAll('.floating-card');
const floatingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.3 });

floatingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    floatingObserver.observe(card);
});
