/**
 * TechConnect Seniors - Accessible JavaScript
 * Gentle animations, clear feedback, and accessibility features
 */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================

    const CONFIG = {
        // Respect user's motion preference
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

        // Animation settings (slower for visibility)
        animationDuration: 500,
        scrollOffset: 100,

        // Intersection observer threshold
        observerThreshold: 0.1
    };

    // ========================================
    // Mobile Menu Toggle
    // ========================================

    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = mobileMenu?.querySelectorAll('a');

        if (!menuToggle || !mobileMenu) return;

        function toggleMenu() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);

            // Announce state change to screen readers
            menuToggle.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');

            // Focus management
            if (!isExpanded && mobileLinks?.length > 0) {
                // When opening, focus first link after a brief delay
                setTimeout(() => mobileLinks[0].focus(), 100);
            }
        }

        function closeMenu() {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-label', 'Open menu');
        }

        // Toggle on click
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        mobileLinks?.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                if (menuToggle.getAttribute('aria-expanded') === 'true') {
                    closeMenu();
                }
            }
        });
    }

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // Skip for skip-link (handled by browser)
                if (targetId === '#main-content') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    // Calculate offset for sticky header
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    // Smooth scroll or instant based on preference
                    if (CONFIG.prefersReducedMotion) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }

                    // Set focus to target for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    // ========================================
    // Fade-in Animation on Scroll
    // ========================================

    function initScrollAnimations() {
        // Skip animations if user prefers reduced motion
        if (CONFIG.prefersReducedMotion) {
            // Make all elements visible immediately
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        // Elements to animate
        const animatedElements = document.querySelectorAll(
            '.service-card, .step, .benefit-card, .testimonial-card, .pricing-card, .faq-item'
        );

        // Add fade-in class
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
        });

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class with slight delay for stagger effect
                    const delay = Array.from(animatedElements).indexOf(entry.target) % 4 * 100;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animated elements
        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Form Handling with Clear Feedback
    // ========================================

    function initFormHandling() {
        const form = document.querySelector('.contact-form');

        if (!form) return;

        // Add clear visual feedback on input focus
        const inputs = form.querySelectorAll('.form-input, .form-textarea');

        inputs.forEach(input => {
            // Add aria-describedby for error messages
            const errorId = `${input.id}-error`;

            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');

                // Validate on blur with clear feedback
                if (this.required && !this.value.trim()) {
                    showInputError(this, 'This field is required');
                } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    showInputError(this, 'Please enter a valid email address');
                } else if (this.type === 'tel' && this.value && !isValidPhone(this.value)) {
                    showInputError(this, 'Please enter a valid phone number');
                } else {
                    clearInputError(this);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all required fields
            let isValid = true;
            const requiredInputs = form.querySelectorAll('[required]');

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    showInputError(input, 'This field is required');
                    isValid = false;
                }
            });

            // Validate email if provided
            const emailInput = form.querySelector('#email');
            if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Validate phone
            const phoneInput = form.querySelector('#phone');
            if (phoneInput && phoneInput.value && !isValidPhone(phoneInput.value)) {
                showInputError(phoneInput, 'Please enter a valid phone number');
                isValid = false;
            }

            if (!isValid) {
                // Focus first error field
                const firstError = form.querySelector('.form-group.has-error .form-input, .form-group.has-error .form-textarea');
                if (firstError) {
                    firstError.focus();
                    announceToScreenReader('Please correct the errors in the form');
                }
                return;
            }

            // Show success state
            showFormSuccess(form);
        });
    }

    function showInputError(input, message) {
        const group = input.closest('.form-group');
        group.classList.add('has-error');

        // Create or update error message
        let error = group.querySelector('.form-error');
        if (!error) {
            error = document.createElement('span');
            error.className = 'form-error';
            error.id = `${input.id}-error`;
            error.setAttribute('role', 'alert');
            group.appendChild(error);
        }
        error.textContent = message;

        // Link error to input for accessibility
        input.setAttribute('aria-describedby', error.id);
        input.setAttribute('aria-invalid', 'true');

        // Add error styling
        input.style.borderColor = 'var(--color-error)';
    }

    function clearInputError(input) {
        const group = input.closest('.form-group');
        group.classList.remove('has-error');

        const error = group.querySelector('.form-error');
        if (error) {
            error.remove();
        }

        input.removeAttribute('aria-describedby');
        input.removeAttribute('aria-invalid');
        input.style.borderColor = '';
    }

    function showFormSuccess(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        // Update button state
        button.textContent = 'Request Sent Successfully!';
        button.style.background = 'var(--color-success)';
        button.style.borderColor = 'var(--color-success)';
        button.disabled = true;

        // Announce success
        announceToScreenReader('Your consultation request has been sent successfully. We will contact you soon.');

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.setAttribute('role', 'status');
        successMessage.innerHTML = `
            <p style="color: var(--color-success); font-size: var(--font-size-lg); font-weight: 600; text-align: center; margin-top: var(--spacing-md);">
                ✓ Thank you! We'll be in touch within one business day.
            </p>
        `;
        form.appendChild(successMessage);

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            button.textContent = originalText;
            button.style.background = '';
            button.style.borderColor = '';
            button.disabled = false;
            successMessage.remove();
        }, 5000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        // Accept various phone formats
        return /^[\d\s\-\(\)\+\.]{7,}$/.test(phone);
    }

    // ========================================
    // FAQ Accordion
    // ========================================

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const summary = item.querySelector('summary');

            // Enhance keyboard interaction
            summary.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.open = !item.open;
                }
            });

            // Announce state change
            item.addEventListener('toggle', function() {
                const state = this.open ? 'expanded' : 'collapsed';
                announceToScreenReader(`FAQ ${state}`);
            });
        });
    }

    // ========================================
    // Accessibility Helpers
    // ========================================

    function announceToScreenReader(message) {
        // Create or get announcer element
        let announcer = document.getElementById('sr-announcer');

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(announcer);
        }

        // Clear and set message (triggers announcement)
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    // ========================================
    // Header Scroll Effect
    // ========================================

    function initHeaderScroll() {
        const header = document.querySelector('.header');

        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const currentScrollY = window.scrollY;

            // Add shadow when scrolled
            if (currentScrollY > 10) {
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // Button Feedback
    // ========================================

    function initButtonFeedback() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            // Add click feedback
            button.addEventListener('click', function() {
                // Brief scale animation for feedback
                if (!CONFIG.prefersReducedMotion) {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }
            });

            // Ensure focus is visible
            button.addEventListener('focus', function() {
                this.style.boxShadow = 'var(--shadow-focus)';
            });

            button.addEventListener('blur', function() {
                this.style.boxShadow = '';
            });
        });
    }

    // ========================================
    // Initialize All Features
    // ========================================

    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initFormHandling();
        initFAQ();
        initHeaderScroll();
        initButtonFeedback();

        // Log initialization for debugging
        console.log('TechConnect Seniors: All features initialized');

        // Announce page load complete for screen readers
        setTimeout(() => {
            announceToScreenReader('TechConnect Seniors page loaded. Navigate using the menu above.');
        }, 1000);
    }

    // Start initialization
    init();

})();
