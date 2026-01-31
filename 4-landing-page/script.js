/**
 * ARCHVIZ Studio - Swiss/International Design
 * JavaScript functionality with precise, functional animations
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const metrics = document.querySelectorAll('.metric-value[data-count]');
    const animatedElements = document.querySelectorAll('.section-header, .service-card, .process-step, .portfolio-item, .contact-info, .contact-form');

    // ============================================
    // State
    // ============================================
    let lastScrollY = 0;
    let isMenuOpen = false;
    let hasCountedMetrics = false;

    // ============================================
    // Navigation
    // ============================================

    /**
     * Handle scroll behavior for navigation
     */
    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && !isMenuOpen) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
        } else {
            nav.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ============================================
    // Smooth Scroll
    // ============================================

    /**
     * Smooth scroll to target element
     * @param {string} targetId - The ID of the target element
     */
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Handle anchor link clicks
     * @param {Event} e - Click event
     */
    function handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            closeMobileMenu();
            smoothScrollTo(href);
        }
    }

    // ============================================
    // Counter Animation
    // ============================================

    /**
     * Animate counting numbers
     * @param {HTMLElement} element - The element to animate
     */
    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeProgress = easeOutQuart(progress);
            const currentCount = Math.round(target * easeProgress);

            element.textContent = currentCount;

            if (frame === totalFrames) {
                clearInterval(counter);
                element.textContent = target;
            }
        }, frameDuration);
    }

    /**
     * Easing function for smooth animation
     * @param {number} t - Progress (0 to 1)
     * @returns {number} - Eased value
     */
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================

    /**
     * Create intersection observer for scroll animations
     */
    function createScrollObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        animatedElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${(index % 4) * 100}ms`;
            observer.observe(element);
        });
    }

    /**
     * Create observer for metrics counter
     */
    function createMetricsObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasCountedMetrics) {
                    hasCountedMetrics = true;
                    metrics.forEach((metric, index) => {
                        setTimeout(() => {
                            animateCounter(metric);
                        }, index * 200);
                    });
                    observer.disconnect();
                }
            });
        }, options);

        const metricsContainer = document.querySelector('.hero-metrics');
        if (metricsContainer) {
            observer.observe(metricsContainer);
        }
    }

    // ============================================
    // Form Handling
    // ============================================

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Simulate form submission
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Sent Successfully';
            submitBtn.style.backgroundColor = '#22c55e';

            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    }

    // ============================================
    // Hero Shapes Animation
    // ============================================

    /**
     * Subtle parallax effect for hero shapes
     */
    function initHeroParallax() {
        const shapes = document.querySelectorAll('.hero-shape');

        if (shapes.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let rafId = null;

        function updateShapePositions() {
            const scrollY = window.scrollY;
            const maxScroll = window.innerHeight;

            if (scrollY < maxScroll) {
                shapes.forEach((shape, index) => {
                    const speed = 0.05 + (index * 0.02);
                    const yOffset = scrollY * speed;
                    shape.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;

                    if (index === 1) {
                        shape.style.transform = `translate(0, ${yOffset}px)`;
                    }
                    if (index === 2) {
                        shape.style.transform = `translate(0, ${yOffset * 0.5}px)`;
                    }
                });
            }

            rafId = null;
        }

        function onScroll() {
            if (rafId === null) {
                rafId = requestAnimationFrame(updateShapePositions);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ============================================
    // Active Navigation Link
    // ============================================

    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

        let currentSection = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - nav.offsetHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleKeyboard(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    }

    // ============================================
    // Initialization
    // ============================================

    /**
     * Initialize all functionality
     */
    function init() {
        // Navigation scroll handling
        window.addEventListener('scroll', handleNavScroll, { passive: true });

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Mobile menu links
        mobileNavLinks.forEach((link) => {
            link.addEventListener('click', handleAnchorClick);
        });

        // All anchor links
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', handleAnchorClick);
        });

        // Form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Scroll animations
        createScrollObserver();
        createMetricsObserver();

        // Hero parallax
        initHeroParallax();

        // Active nav link update
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Initial active link check
        updateActiveNavLink();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
