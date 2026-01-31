/**
 * Meridian Partners - Corporate Professional Landing Page
 * Smooth, measured interactions befitting a professional institution
 */

(function() {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================
    const CONFIG = {
        scrollOffset: 80,
        revealThreshold: 0.15,
        headerScrollThreshold: 50
    };

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const elements = {
        header: document.querySelector('.header'),
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-menu a'),
        contactForm: document.getElementById('contact-form'),
        revealElements: null
    };

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function initHeaderScroll() {
        let lastScroll = 0;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > CONFIG.headerScrollThreshold) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }

            lastScroll = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateHeader();
    }

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    function initMobileNav() {
        if (!elements.navToggle || !elements.navMenu) return;

        elements.navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            elements.navMenu.classList.toggle('active');
            document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        elements.navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                elements.navToggle.classList.remove('active');
                elements.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (elements.navMenu.classList.contains('active') &&
                !elements.navMenu.contains(e.target) &&
                !elements.navToggle.contains(e.target)) {
                elements.navToggle.classList.remove('active');
                elements.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================================================
    // Smooth Scroll
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const targetPosition = target.getBoundingClientRect().top + window.scrollY - CONFIG.scrollOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================
    function initScrollReveal() {
        // Add reveal class to elements
        const revealSelectors = [
            '.section-header',
            '.expertise-card',
            '.approach-step',
            '.approach-visual',
            '.case-card',
            '.award',
            '.leader-card',
            '.contact-info',
            '.contact-form'
        ];

        revealSelectors.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(el, index) {
                el.classList.add('reveal');
                // Add staggered delay for grid items
                if (index < 4) {
                    el.classList.add('reveal-delay-' + (index + 1));
                }
            });
        });

        elements.revealElements = document.querySelectorAll('.reveal');

        // Intersection Observer for reveal
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: CONFIG.revealThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    }

    // ==========================================================================
    // Active Navigation State
    // ==========================================================================
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');

        function updateActiveNav() {
            const scrollPosition = window.scrollY + CONFIG.scrollOffset + 100;

            sections.forEach(function(section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');

                if (navLink) {
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                }
            });
        }

        window.addEventListener('scroll', function() {
            requestAnimationFrame(updateActiveNav);
        }, { passive: true });

        updateActiveNav();
    }

    // ==========================================================================
    // Contact Form
    // ==========================================================================
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Simulate form submission
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(function() {
                submitButton.textContent = 'Thank You';
                submitButton.style.backgroundColor = '#2d4263';

                // Reset form
                setTimeout(function() {
                    elements.contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.style.backgroundColor = '';
                    submitButton.disabled = false;
                }, 3000);
            }, 1500);
        });

        // Form field animations
        const inputs = elements.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // ==========================================================================
    // Counter Animation for Stats
    // ==========================================================================
    function initCounterAnimation() {
        const stats = document.querySelectorAll('.stat-number');

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(function(stat) {
            counterObserver.observe(stat);
        });
    }

    function animateCounter(element) {
        const text = element.textContent;
        const hasPrefix = text.match(/^[^\d]+/);
        const hasSuffix = text.match(/[^\d]+$/);
        const prefix = hasPrefix ? hasPrefix[0] : '';
        const suffix = hasSuffix ? hasSuffix[0] : '';
        const numberMatch = text.match(/[\d.]+/);

        if (!numberMatch) return;

        const targetNumber = parseFloat(numberMatch[0]);
        const isDecimal = numberMatch[0].includes('.');
        const decimalPlaces = isDecimal ? numberMatch[0].split('.')[1].length : 0;

        let currentNumber = 0;
        const duration = 2000;
        const steps = 60;
        const increment = targetNumber / steps;
        const stepDuration = duration / steps;

        function updateNumber() {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                element.textContent = prefix + (isDecimal ? currentNumber.toFixed(decimalPlaces) : Math.round(currentNumber)) + suffix;
                return;
            }

            element.textContent = prefix + (isDecimal ? currentNumber.toFixed(decimalPlaces) : Math.round(currentNumber)) + suffix;
            requestAnimationFrame(function() {
                setTimeout(updateNumber, stepDuration);
            });
        }

        updateNumber();
    }

    // ==========================================================================
    // Parallax Effect (subtle, professional)
    // ==========================================================================
    function initParallax() {
        const heroContent = document.querySelector('.hero-content');

        if (!heroContent) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;

            if (scrolled < window.innerHeight) {
                heroContent.style.transform = 'translateY(' + rate + 'px)';
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight * 0.5);
            }
        }, { passive: true });
    }

    // ==========================================================================
    // Case Study Card Hover Effect
    // ==========================================================================
    function initCardHover() {
        const cards = document.querySelectorAll('.case-card, .expertise-card');

        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform';
            });

            card.addEventListener('mouseleave', function() {
                this.style.willChange = 'auto';
            });
        });
    }

    // ==========================================================================
    // Testimonial Quote Animation
    // ==========================================================================
    function initTestimonialAnimation() {
        const testimonial = document.querySelector('.testimonial-content');

        if (!testimonial) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.3 });

        testimonial.classList.add('reveal');
        observer.observe(testimonial);
    }

    // ==========================================================================
    // Preloader / Page Load Animation
    // ==========================================================================
    function initPageLoad() {
        document.body.classList.add('loaded');
    }

    // ==========================================================================
    // Keyboard Navigation Enhancements
    // ==========================================================================
    function initKeyboardNav() {
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#expertise';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = 'position:absolute;top:-100px;left:0;padding:1rem;background:var(--navy-800);color:var(--white);z-index:10000;transition:top 0.3s;';

        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });

        skipLink.addEventListener('blur', function() {
            this.style.top = '-100px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Escape key closes mobile nav
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
                elements.navToggle.classList.remove('active');
                elements.navMenu.classList.remove('active');
                document.body.style.overflow = '';
                elements.navToggle.focus();
            }
        });
    }

    // ==========================================================================
    // Reduced Motion Support
    // ==========================================================================
    function checkReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
            document.documentElement.style.setProperty('--transition-smooth', '0ms');

            // Disable parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = 'none';
                heroContent.style.opacity = '1';
            }
        }
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================
    function init() {
        checkReducedMotion();
        initHeaderScroll();
        initMobileNav();
        initSmoothScroll();
        initScrollReveal();
        initActiveNavigation();
        initContactForm();
        initCounterAnimation();
        initParallax();
        initCardHover();
        initTestimonialAnimation();
        initKeyboardNav();

        // Delay page load animation slightly for smoother experience
        requestAnimationFrame(function() {
            setTimeout(initPageLoad, 100);
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
