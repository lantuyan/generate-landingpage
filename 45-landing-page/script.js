/**
 * NestWell - Postpartum Wellness Platform
 * Gentle interactions and smooth animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initFormHandling();
});

/**
 * Navigation scroll effects
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
        const scrollY = window.scrollY;

        // Add scrolled class when scrolled down
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar();
            });
            ticking = true;
        }
    }, { passive: true });
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

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delayed');

    if (!animatedElements.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // If reduced motion is preferred, show all elements immediately
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form handling with gentle feedback
 */
function initFormHandling() {
    const form = document.querySelector('.cta-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        const email = input.value.trim();

        if (!isValidEmail(email)) {
            showFormMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        button.disabled = true;
        button.innerHTML = '<span class="loading">Sending...</span>';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success state
            input.value = '';
            button.innerHTML = '✓ Welcome!';
            showFormMessage(form, 'Thank you! Check your inbox for a gentle welcome.', 'success');

            // Reset button after delay
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = 'Get Started';
            }, 3000);

        } catch (error) {
            button.disabled = false;
            button.innerHTML = 'Get Started';
            showFormMessage(form, 'Something went wrong. Please try again.', 'error');
        }
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form message with gentle animation
 */
function showFormMessage(form, message, type) {
    // Remove existing message if any
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('p');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        text-align: center;
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.4s ease;
        ${type === 'success'
            ? 'background: #D5E8E0; color: #5A7A6E;'
            : 'background: #F5E1E1; color: #8B6B6B;'}
    `;

    form.appendChild(messageEl);

    // Trigger animation
    requestAnimationFrame(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    });

    // Auto-remove after delay
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-10px)';
        setTimeout(() => messageEl.remove(), 400);
    }, 5000);
}

/**
 * Add gentle hover effects to cards
 */
document.querySelectorAll('.service-card, .testimonial-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

/**
 * Parallax effect for hero shapes (subtle, respects reduced motion)
 */
function initParallax() {
    const shapes = document.querySelectorAll('.shape');

    if (!shapes.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                shapes.forEach((shape, index) => {
                    const speed = 0.05 * (index + 1);
                    shape.style.transform = `translateY(${scrollY * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Initialize parallax on load
initParallax();

/**
 * Lazy loading for images (native with fallback)
 */
document.querySelectorAll('img').forEach(img => {
    if ('loading' in HTMLImageElement.prototype) {
        img.loading = 'lazy';
    }
});

/**
 * Add gentle ripple effect to buttons
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out forwards;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Trust avatars hover effect
 */
const trustAvatars = document.querySelectorAll('.trust-avatars img');
trustAvatars.forEach((avatar, index) => {
    avatar.addEventListener('mouseenter', () => {
        avatar.style.transform = 'scale(1.15) translateY(-5px)';
        avatar.style.zIndex = '10';
    });

    avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = '';
        avatar.style.zIndex = '';
    });
});

/**
 * Pricing card feature animation on hover
 */
document.querySelectorAll('.pricing-card').forEach(card => {
    const features = card.querySelectorAll('.pricing-features li');

    card.addEventListener('mouseenter', () => {
        features.forEach((feature, index) => {
            feature.style.transition = `transform 0.3s ease ${index * 0.05}s`;
            feature.style.transform = 'translateX(5px)';
        });
    });

    card.addEventListener('mouseleave', () => {
        features.forEach(feature => {
            feature.style.transform = '';
        });
    });
});

/**
 * Service card icon animation
 */
document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-icon');

    card.addEventListener('mouseenter', () => {
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (icon) {
            icon.style.transform = '';
        }
    });
});

// Add transition to service icons
document.querySelectorAll('.service-icon').forEach(icon => {
    icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
});
