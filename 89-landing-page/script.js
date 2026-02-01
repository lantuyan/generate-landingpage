/**
 * FlowSync Landing Page - JavaScript
 * Handles animations, interactions, and dynamic behavior
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initPricingToggle();
    initCounterAnimation();
    initTypingAnimation();
    initFormValidation();
    initSmoothScroll();
});

/**
 * Navbar scroll behavior
 * Adds background and shadow on scroll
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Toggle animation
    toggle.addEventListener('click', function() {
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step-card, .testimonial-card, .pricing-card, ' +
        '.section-header, .integrations-text, .integrations-visual'
    );

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Stagger animation for grids
    const grids = document.querySelectorAll('.features-grid, .testimonials-grid, .pricing-grid');
    grids.forEach(grid => {
        const cards = grid.querySelectorAll('.animate-on-scroll');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
        });
    });
}

/**
 * Pricing toggle between monthly and yearly
 */
function initPricingToggle() {
    const toggle = document.querySelector('.toggle-switch');
    const labels = document.querySelectorAll('.toggle-label');
    const prices = document.querySelectorAll('.price-amount');

    let isYearly = false;

    function updatePricing() {
        prices.forEach(price => {
            const monthly = price.dataset.monthly;
            const yearly = price.dataset.yearly;
            price.textContent = `$${isYearly ? yearly : monthly}`;
        });

        labels.forEach(label => {
            label.classList.toggle('active',
                (isYearly && label.dataset.period === 'yearly') ||
                (!isYearly && label.dataset.period === 'monthly')
            );
        });

        toggle.classList.toggle('active', isYearly);
    }

    toggle.addEventListener('click', () => {
        isYearly = !isYearly;
        updatePricing();
    });

    labels.forEach(label => {
        label.addEventListener('click', () => {
            isYearly = label.dataset.period === 'yearly';
            updatePricing();
        });
    });
}

/**
 * Counter animation for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

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

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/**
 * Typing animation for the chat bubble
 */
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';

    let index = 0;
    let hasStarted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                typeText();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(typingElement);

    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 30 + Math.random() * 30);
        }
    }
}

/**
 * Form validation and submission
 */
function initFormValidation() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const email = input.value.trim();

        if (validateEmail(email)) {
            // Show success state
            const button = form.querySelector('button');
            const originalText = button.innerHTML;

            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Success!
            `;
            button.style.background = 'var(--success)';

            // Reset after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                input.value = '';
            }, 3000);
        } else {
            // Show error state
            input.style.borderColor = 'var(--error)';
            input.style.animation = 'shake 0.5s ease';

            setTimeout(() => {
                input.style.borderColor = '';
                input.style.animation = '';
            }, 500);
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add parallax effect to hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero-visual');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }, { passive: true });
}

/**
 * Add hover effects to workflow nodes
 */
document.querySelectorAll('.workflow-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
        node.style.transform = 'scale(1.05)';
        node.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.2)';
    });

    node.addEventListener('mouseleave', () => {
        node.style.transform = '';
        node.style.boxShadow = '';
    });
});

/**
 * Add shake animation keyframes dynamically
 */
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

/**
 * Intersection Observer for lazy loading images
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
 * Feature card hover connection animation
 */
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon, .feature-icon-large');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });

    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon, .feature-icon-large');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

/**
 * Add connection lines animation between orbit items
 */
function initOrbitAnimation() {
    const orbitItems = document.querySelectorAll('.orbit-item');

    orbitItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = item.style.transform + ' scale(1.2)';
            item.style.zIndex = '100';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = item.style.transform.replace(' scale(1.2)', '');
            item.style.zIndex = '';
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    initOrbitAnimation();
});

/**
 * Accessibility: Handle focus states
 */
document.querySelectorAll('a, button, input').forEach(el => {
    el.addEventListener('focus', () => {
        el.style.outline = '2px solid var(--primary-500)';
        el.style.outlineOffset = '2px';
    });

    el.addEventListener('blur', () => {
        el.style.outline = '';
        el.style.outlineOffset = '';
    });
});

/**
 * Performance: Debounce scroll events
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
 * Add subtle background animation to CTA section
 */
function initCtaBackground() {
    const ctaGrid = document.querySelector('.cta-grid');
    if (!ctaGrid) return;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;

        ctaGrid.style.transform = `translate(${mouseX * 20 - 10}px, ${mouseY * 20 - 10}px)`;
    });
}

// Initialize CTA background animation
document.addEventListener('DOMContentLoaded', initCtaBackground);
