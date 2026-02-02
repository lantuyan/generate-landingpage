/**
 * ClimateAxis — Swiss/International Design
 * Museum-Slow Animations & Interactions
 */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const CONFIG = {
        observerThreshold: 0.15,
        animationDuration: 800,
        counterDuration: 2000,
        scrollThrottle: 100
    };

    // ========================================
    // DOM Elements
    // ========================================
    const DOM = {
        nav: document.getElementById('nav'),
        navToggle: document.getElementById('navToggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        mobileLinks: document.querySelectorAll('.mobile-nav-links a'),
        statNumbers: document.querySelectorAll('.stat-number'),
        revealElements: document.querySelectorAll('.reveal-up'),
        contactForm: document.getElementById('contactForm'),
        dataBars: document.querySelectorAll('.data-bar')
    };

    // ========================================
    // Utility Functions
    // ========================================

    /**
     * Throttle function calls
     */
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

    /**
     * Debounce function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Easing function for smooth animations
     */
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    // ========================================
    // Navigation
    // ========================================

    /**
     * Handle scroll state for navigation
     */
    function handleNavScroll() {
        const scrolled = window.scrollY > 50;
        DOM.nav.classList.toggle('scrolled', scrolled);
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        DOM.navToggle.classList.toggle('active');
        DOM.mobileMenu.classList.toggle('active');
        document.body.style.overflow = DOM.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    /**
     * Close mobile menu when clicking a link
     */
    function closeMobileMenu() {
        DOM.navToggle.classList.remove('active');
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Smooth scroll to section
     */
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const navHeight = DOM.nav.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ========================================
    // Reveal Animations
    // ========================================

    /**
     * Initialize Intersection Observer for reveal animations
     */
    function initRevealObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: CONFIG.observerThreshold
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a small delay based on data attribute or default
                    const delay = parseFloat(entry.target.style.getPropertyValue('--delay')) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        DOM.revealElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Counter Animation
    // ========================================

    /**
     * Animate number counter
     */
    function animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const isDecimal = target % 1 !== 0;
        const duration = CONFIG.counterDuration;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = target * easedProgress;

            if (isDecimal) {
                element.textContent = currentValue.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    /**
     * Initialize counter animations with Intersection Observer
     */
    function initCounterObserver() {
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

        DOM.statNumbers.forEach(el => observer.observe(el));
    }

    // ========================================
    // Data Bar Animation
    // ========================================

    /**
     * Initialize data bar animations
     */
    function initDataBarObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Bars animate via CSS transition when scrolled into view
                    entry.target.style.transform = 'scaleY(1)';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);

        DOM.dataBars.forEach(el => {
            el.style.transform = 'scaleY(0)';
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // ========================================
    // Form Handling
    // ========================================

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Simulate form submission
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Show success state
            submitBtn.textContent = 'Request Received';
            submitBtn.style.backgroundColor = '#22C55E';

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    }

    // ========================================
    // Typographic Sculpture Parallax
    // ========================================

    /**
     * Apply subtle parallax effect to sculpture layers
     */
    function initSculptureParallax() {
        const sculptureElements = document.querySelectorAll('.sculpture-layer');

        if (sculptureElements.length === 0) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrollY < heroHeight) {
                sculptureElements.forEach((el, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = scrollY * speed;
                    const rotation = scrollY * 0.01 * (index % 2 === 0 ? 1 : -1);

                    el.style.transform = `translate(0, ${yPos}px) rotate(${rotation}deg)`;
                });
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // Cursor Effects
    // ========================================

    /**
     * Add hover effect for platform cards
     */
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.platform-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transitionDuration = '500ms';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transitionDuration = '800ms';
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // Smooth Anchor Links
    // ========================================

    /**
     * Handle all anchor link clicks for smooth scrolling
     */
    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    smoothScrollTo(href);

                    // Close mobile menu if open
                    if (DOM.mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    // ========================================
    // Loading State
    // ========================================

    /**
     * Handle page load animations
     */
    function handlePageLoad() {
        // Small delay to ensure smooth initial animations
        setTimeout(() => {
            document.body.classList.add('loaded');

            // Trigger initial hero animations
            const heroReveals = document.querySelectorAll('.hero .reveal-up');
            heroReveals.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 100);
            });
        }, 100);
    }

    // ========================================
    // Solution Items Hover
    // ========================================

    /**
     * Add staggered reveal effect on solution items
     */
    function initSolutionHover() {
        const solutionItems = document.querySelectorAll('.solution-item');

        solutionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                solutionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.opacity = '0.5';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                solutionItems.forEach(otherItem => {
                    otherItem.style.opacity = '';
                });
            });
        });
    }

    // ========================================
    // Initialize
    // ========================================

    function init() {
        // Navigation
        window.addEventListener('scroll', throttle(handleNavScroll, CONFIG.scrollThrottle), { passive: true });

        if (DOM.navToggle) {
            DOM.navToggle.addEventListener('click', toggleMobileMenu);
        }

        DOM.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 100);
            });
        });

        // Reveal animations
        initRevealObserver();

        // Counter animations
        initCounterObserver();

        // Data bar animations
        initDataBarObserver();

        // Form handling
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Parallax effects
        initSculptureParallax();

        // Card hover effects (only on non-touch devices)
        if (window.matchMedia('(hover: hover)').matches) {
            initCardHoverEffects();
        }

        // Smooth anchor scrolling
        initSmoothAnchors();

        // Solution hover effects
        initSolutionHover();

        // Page load
        handlePageLoad();

        // Initial nav state
        handleNavScroll();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
