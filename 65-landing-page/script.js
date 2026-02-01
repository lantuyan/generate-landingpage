/**
 * Harvest & Hearth - Farmhouse Modern Landing Page
 * JavaScript for animations, interactions, and form handling
 */

(function() {
    'use strict';

    // =====================================================
    // DOM ELEMENTS
    // =====================================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const subscribeForm = document.getElementById('subscribeForm');
    const animatedElements = document.querySelectorAll('[data-animate]');

    // =====================================================
    // NAVBAR SCROLL EFFECT
    // =====================================================
    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // =====================================================
    // MOBILE NAVIGATION TOGGLE
    // =====================================================
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent body scroll when nav is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile nav when clicking a link
    function closeMobileNav() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close mobile nav when clicking outside
    function handleOutsideClick(e) {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMobileNav();
        }
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    function handleSmoothScroll(e) {
        const link = e.target.closest('a[href^="#"]');

        if (link) {
            const targetId = link.getAttribute('href');

            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile nav if open
                    closeMobileNav();
                }
            }
        }
    }

    // =====================================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================================
    function createScrollObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        return observer;
    }

    // =====================================================
    // FORM HANDLING
    // =====================================================
    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(subscribeForm);
        const data = Object.fromEntries(formData.entries());

        // Validate ZIP code (simple US ZIP validation)
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(data.zip)) {
            showFormMessage('Please enter a valid ZIP code.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = subscribeForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Processing...</span>';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = '<span>Welcome to the Table!</span>';
            submitBtn.style.backgroundColor = 'var(--color-sage)';

            showFormMessage('Thank you! Check your email for your welcome box details.', 'success');

            // Reset form after delay
            setTimeout(() => {
                subscribeForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    }

    function showFormMessage(message, type) {
        // Remove existing message if any
        const existingMessage = subscribeForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            padding: 0.75rem 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            text-align: center;
            animation: fadeIn 0.3s ease;
            background-color: ${type === 'success' ? 'rgba(122, 155, 109, 0.15)' : 'rgba(232, 93, 76, 0.15)'};
            color: ${type === 'success' ? 'var(--color-sage-dark)' : 'var(--color-tomato)'};
        `;

        subscribeForm.appendChild(messageEl);

        // Auto-remove after delay
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }

    // =====================================================
    // BUTTON HOVER EFFECTS
    // =====================================================
    function addButtonRippleEffect() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Only add ripple if not submitting form
                if (this.type === 'submit') return;

                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.cssText = `
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    animation: ripple 0.6s ease-out forwards;
                `;

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // =====================================================
    // PARALLAX EFFECT FOR HERO
    // =====================================================
    function handleParallax() {
        const heroVisual = document.querySelector('.hero-visual');
        const scrollY = window.scrollY;

        if (heroVisual && scrollY < window.innerHeight) {
            const parallaxOffset = scrollY * 0.3;
            heroVisual.style.transform = `translateY(${parallaxOffset}px)`;
        }
    }

    // =====================================================
    // COUNTER ANIMATION FOR TRUST NUMBERS
    // =====================================================
    function animateCounters() {
        const trustNumbers = document.querySelectorAll('.trust-number');

        const observerOptions = {
            root: null,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateNumber(entry.target);
                }
            });
        }, observerOptions);

        trustNumbers.forEach(number => observer.observe(number));
    }

    function animateNumber(element) {
        const text = element.textContent;
        const numericPart = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');

        if (isNaN(numericPart)) return;

        const duration = 1500;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.floor(numericPart * easeOutQuart);

            element.textContent = currentNumber + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = text; // Restore original text
            }
        }

        requestAnimationFrame(updateNumber);
    }

    // =====================================================
    // NAVBAR ACTIVE SECTION HIGHLIGHTING
    // =====================================================
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;

                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${activeId}`) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // =====================================================
    // ADD DYNAMIC STYLES FOR ANIMATIONS
    // =====================================================
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }

            @keyframes ripple {
                to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
            }

            .nav-links a.active {
                color: var(--color-sage) !important;
            }

            .nav-links a.active::after {
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
    }

    // =====================================================
    // THROTTLE FUNCTION FOR SCROLL EVENTS
    // =====================================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================
    function init() {
        // Inject animation styles
        injectAnimationStyles();

        // Initialize scroll observer for animations
        createScrollObserver();

        // Initialize counter animations
        animateCounters();

        // Initialize active section highlighting
        highlightActiveSection();

        // Add button ripple effects
        addButtonRippleEffect();

        // Event listeners
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
        window.addEventListener('scroll', throttle(handleParallax, 16));

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }

        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleSmoothScroll);

        if (subscribeForm) {
            subscribeForm.addEventListener('submit', handleFormSubmit);
        }

        // Handle escape key to close mobile nav
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileNav();
            }
        });

        // Initial checks
        handleNavbarScroll();

        // Log initialization
        console.log('Harvest & Hearth - Landing page initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
