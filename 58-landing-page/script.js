/**
 * STILLPOINT - Desert Minimalist Landing Page
 * JavaScript for slow, deliberate animations and interactions
 */

(function() {
    'use strict';

    // =====================================================
    // CONFIGURATION
    // =====================================================

    const config = {
        scrollRevealThreshold: 0.15,
        navScrollThreshold: 50,
        animationDelay: 150 // ms between staggered animations
    };

    // =====================================================
    // DOM ELEMENTS
    // =====================================================

    const elements = {
        nav: document.querySelector('.nav'),
        navToggle: document.querySelector('.nav-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        mobileMenuLinks: document.querySelectorAll('.mobile-menu-links a'),
        revealElements: document.querySelectorAll('.philosophy, .philosophy-stats, .sanctuary-card, .experience-item, .quote, .details-content, .price-card'),
        sanctuaryCards: document.querySelectorAll('.sanctuary-card'),
        experienceItems: document.querySelectorAll('.experience-item'),
        form: document.getElementById('reserve-form'),
        heroContent: document.querySelector('.hero-content')
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    /**
     * Handle navigation scroll state
     */
    function handleNavScroll() {
        if (window.scrollY > config.navScrollThreshold) {
            elements.nav.classList.add('scrolled');
        } else {
            elements.nav.classList.remove('scrolled');
        }
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        elements.navToggle.classList.toggle('active');
        elements.mobileMenu.classList.toggle('active');
        document.body.style.overflow = elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        elements.navToggle.classList.remove('active');
        elements.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // =====================================================
    // SMOOTH SCROLLING
    // =====================================================

    /**
     * Smooth scroll to target section
     */
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Handle anchor link clicks
     */
    function handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            smoothScrollTo(href);
            closeMobileMenu();
        }
    }

    // =====================================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================================

    /**
     * Create Intersection Observer for scroll reveal
     */
    function createScrollRevealObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: config.scrollRevealThreshold
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        return observer;
    }

    /**
     * Initialize scroll reveal for elements
     */
    function initScrollReveal() {
        const observer = createScrollRevealObserver();

        // Add reveal class and set stagger delays for sanctuary cards
        elements.sanctuaryCards.forEach((card, index) => {
            card.classList.add('reveal');
            card.style.setProperty('--reveal-delay', index);
            observer.observe(card);
        });

        // Add reveal class and set stagger delays for experience items
        elements.experienceItems.forEach((item, index) => {
            item.classList.add('reveal');
            item.style.setProperty('--reveal-delay', index);
            observer.observe(item);
        });

        // Add reveal class for other elements
        const otherRevealElements = [
            '.philosophy',
            '.section-header',
            '.quote',
            '.details-content',
            '.price-card',
            '.cta-content'
        ];

        otherRevealElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('reveal');
                observer.observe(element);
            }
        });
    }

    // =====================================================
    // PARALLAX EFFECTS
    // =====================================================

    /**
     * Subtle parallax for hero decoration
     */
    function handleParallax() {
        const heroDecoration = document.querySelector('.hero-decoration');
        if (heroDecoration && window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroDecoration.style.transform = `translateY(${rate}px)`;
        }
    }

    // =====================================================
    // FORM HANDLING
    // =====================================================

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const button = form.querySelector('.form-button');
        const originalText = button.innerHTML;

        // Simulate form submission
        button.innerHTML = '<span>Sending...</span>';
        button.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            button.innerHTML = '<span>Your stillness awaits</span>';
            button.style.backgroundColor = '#6B8E6B';

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 3000);
        }, 1500);
    }

    // =====================================================
    // HEAT SHIMMER EFFECT
    // =====================================================

    /**
     * Create subtle heat shimmer effect on hover for sanctuary cards
     */
    function initHeatShimmer() {
        elements.sanctuaryCards.forEach(card => {
            const imageContainer = card.querySelector('.sanctuary-image');

            card.addEventListener('mouseenter', () => {
                imageContainer.style.filter = 'blur(0.5px)';
                setTimeout(() => {
                    imageContainer.style.filter = 'none';
                }, 100);
            });
        });
    }

    // =====================================================
    // CURSOR EFFECTS
    // =====================================================

    /**
     * Subtle cursor trail effect (desktop only)
     */
    function initCursorEffect() {
        if (window.innerWidth <= 768) return;

        let cursorTrail = null;
        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;

        // Create cursor trail element
        cursorTrail = document.createElement('div');
        cursorTrail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: rgba(198, 125, 78, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(cursorTrail);

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorTrail.style.opacity = '1';
        });

        // Hide when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursorTrail.style.opacity = '0';
        });

        // Animate cursor trail with lag (desert slowness)
        function animateCursor() {
            const speed = 0.08; // Slow, deliberate movement

            trailX += (mouseX - trailX) * speed;
            trailY += (mouseY - trailY) * speed;

            cursorTrail.style.left = `${trailX - 4}px`;
            cursorTrail.style.top = `${trailY - 4}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    // =====================================================
    // TEXT REVEAL ANIMATION
    // =====================================================

    /**
     * Split text for character-by-character animation
     */
    function initTextReveal() {
        const titleLines = document.querySelectorAll('.title-line');

        titleLines.forEach((line, lineIndex) => {
            const text = line.textContent;
            line.innerHTML = '';
            line.style.opacity = '1';

            [...text].forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: charReveal 0.8s ease forwards;
                    animation-delay: ${0.8 + (lineIndex * 0.2) + (charIndex * 0.03)}s;
                `;
                line.appendChild(span);
            });
        });

        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes charReveal {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================

    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Navigation scroll
        window.addEventListener('scroll', handleNavScroll, { passive: true });

        // Parallax effect
        window.addEventListener('scroll', handleParallax, { passive: true });

        // Mobile menu toggle
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Mobile menu links
        elements.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });

        // All anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        // Form submission
        if (elements.form) {
            elements.form.addEventListener('submit', handleFormSubmit);
        }

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            }, 250);
        });
    }

    /**
     * Main initialization function
     */
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }
    }

    /**
     * Called when DOM is ready
     */
    function onReady() {
        // Initialize components
        initEventListeners();
        initScrollReveal();
        initHeatShimmer();

        // Optional enhancements (can be disabled for performance)
        if (window.innerWidth > 768) {
            initCursorEffect();
        }

        // Text reveal animation (optional - uncomment if desired)
        // initTextReveal();

        // Initial scroll state check
        handleNavScroll();

        // Log initialization
        console.log('Stillpoint: Desert clarity awaits.');
    }

    // Start initialization
    init();

})();
