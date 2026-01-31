/**
 * Norðic Table - Scandinavian Meal Kit Landing Page
 * Gentle animations and interactions for warm minimalist experience
 */

(function() {
    'use strict';

    // DOM Elements
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const fadeElements = document.querySelectorAll('.fade-in');
    const subscribeForm = document.getElementById('subscribeForm');

    /**
     * Navigation scroll effect
     * Adds subtle border when scrolled
     */
    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    /**
     * Mobile menu toggle
     */
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Toggle body scroll
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Close mobile menu when clicking a link
     */
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Smooth scroll for anchor links
     */
    function handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        }
    }

    /**
     * Intersection Observer for fade-in animations
     * Creates gentle reveal effect as elements enter viewport
     */
    function initFadeInObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple elements appearing together
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Form submission handler
     * Provides gentle feedback on submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = subscribeForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Processing...
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .spinner {
                width: 20px;
                height: 20px;
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);

        // Simulate form submission
        setTimeout(() => {
            // Show success state
            submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Welcome to Norðic Table!
            `;
            submitBtn.style.backgroundColor = '#8B9E7C';

            // Reset form
            subscribeForm.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    }

    /**
     * Add hover ripple effect to cards
     * Creates warm, tactile interaction
     */
    function initCardInteractions() {
        const cards = document.querySelectorAll('.philosophy-card, .meal-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                this.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }

    /**
     * Parallax effect for hero decoration
     * Subtle movement creates depth
     */
    function initParallax() {
        const heroDecoration = document.querySelector('.hero-decoration');

        if (!heroDecoration) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let ticking = false;

        function updateParallax() {
            const scrolled = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrolled < heroHeight) {
                const yPos = scrolled * 0.3;
                heroDecoration.style.transform = `translateY(${yPos}px)`;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Scroll events
        window.addEventListener('scroll', handleNavScroll, { passive: true });

        // Mobile menu
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu on link click
        const mobileLinks = document.querySelectorAll('.mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Smooth scroll for all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Form submission
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', handleFormSubmit);
        }

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on click outside
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    /**
     * Initialize everything when DOM is ready
     */
    function init() {
        // Check initial scroll position
        handleNavScroll();

        // Initialize components
        initEventListeners();
        initFadeInObserver();
        initCardInteractions();
        initParallax();

        // Add loaded class to body for any initial animations
        document.body.classList.add('loaded');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
