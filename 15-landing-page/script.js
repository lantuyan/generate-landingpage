/**
 * Palate & Passage - Editorial Design
 * Interactive JavaScript for Premium Culinary Travel Landing Page
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const hero = document.getElementById('hero');
    const ctaForm = document.getElementById('cta-form');

    // ========================================
    // Navigation
    // ========================================

    // Scroll-based navigation styling
    function handleNavScroll() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu on link click
    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Initialize navigation
    function initNavigation() {
        window.addEventListener('scroll', handleNavScroll, { passive: true });

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close menu on nav link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ========================================
    // Smooth Scroll
    // ========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = nav.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Scroll Reveal Animations
    // ========================================

    function initScrollReveal() {
        // Elements to reveal on scroll
        const revealElements = [
            { selector: '.intro-heading', class: 'reveal' },
            { selector: '.intro-text', class: 'reveal', delay: 100 },
            { selector: '.intro-image', class: 'reveal-right', delay: 200 },
            { selector: '.pullquote-text', class: 'reveal' },
            { selector: '.pullquote-cite', class: 'reveal', delay: 200 },
            { selector: '.journeys-title', class: 'reveal' },
            { selector: '.journeys-intro', class: 'reveal', delay: 100 },
            { selector: '.journey-card', class: 'reveal', stagger: 150 },
            { selector: '.philosophy-title', class: 'reveal' },
            { selector: '.philosophy-item', class: 'reveal', stagger: 100 },
            { selector: '.experiences-title', class: 'reveal' },
            { selector: '.experiences-image-1', class: 'reveal-left' },
            { selector: '.experiences-image-2', class: 'reveal-right', delay: 200 },
            { selector: '.experiences-item', class: 'reveal-right', stagger: 100 },
            { selector: '.stories-title', class: 'reveal' },
            { selector: '.stories-intro', class: 'reveal', delay: 100 },
            { selector: '.story-card', class: 'reveal', stagger: 150 },
            { selector: '.cta-content', class: 'reveal-left' },
            { selector: '.cta-image', class: 'reveal-right', delay: 200 }
        ];

        // Add reveal classes to elements
        revealElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach((el, index) => {
                el.classList.add(item.class);
                if (item.delay) {
                    el.style.transitionDelay = `${item.delay}ms`;
                }
                if (item.stagger) {
                    el.style.transitionDelay = `${index * item.stagger}ms`;
                }
            });
        });

        // Intersection Observer for reveal animations
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optionally stop observing after reveal
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        });

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ========================================
    // Parallax Effects
    // ========================================

    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        function updateParallax() {
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const scrolled = rect.top / window.innerHeight;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yOffset = scrolled * 50;
                    element.style.backgroundPosition = `center ${50 + yOffset}%`;
                }
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    // ========================================
    // Hero Parallax
    // ========================================

    function initHeroParallax() {
        if (!hero) return;

        function updateHeroParallax() {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const yOffset = scrolled * 0.4;
                const opacity = 1 - (scrolled / heroHeight) * 0.5;

                hero.style.backgroundPositionY = `${yOffset}px`;

                const content = hero.querySelector('.hero-content');
                if (content) {
                    content.style.transform = `translateY(${scrolled * 0.2}px)`;
                    content.style.opacity = opacity;
                }
            }
        }

        window.addEventListener('scroll', updateHeroParallax, { passive: true });
    }

    // ========================================
    // Image Loading Enhancement
    // ========================================

    function initImageLoading() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    // ========================================
    // Form Handling
    // ========================================

    function initForm() {
        if (!ctaForm) return;

        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                journey: document.getElementById('journey').value
            };

            // Simulate form submission
            const button = ctaForm.querySelector('.cta-button');
            const originalText = button.innerHTML;

            button.innerHTML = '<span>Sending...</span>';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                button.innerHTML = '<span>Thank You!</span>';
                button.style.backgroundColor = '#4A5D4A';

                // Show success message
                showFormSuccess();

                // Reset after delay
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.style.backgroundColor = '';
                    ctaForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    function showFormSuccess() {
        const note = document.querySelector('.cta-note');
        if (note) {
            const originalText = note.textContent;
            note.textContent = 'Your request has been received. We\'ll be in touch soon.';
            note.style.color = '#4A5D4A';
            note.style.fontWeight = '500';

            setTimeout(() => {
                note.textContent = originalText;
                note.style.color = '';
                note.style.fontWeight = '';
            }, 3000);
        }
    }

    // ========================================
    // Magazine Page Turn Effect
    // ========================================

    function initPageTurnEffect() {
        const sections = document.querySelectorAll('section');

        const pageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('page-visible');
                }
            });
        }, {
            threshold: 0.2
        });

        sections.forEach(section => {
            pageObserver.observe(section);
        });
    }

    // ========================================
    // Interactive Hover Effects
    // ========================================

    function initHoverEffects() {
        // Journey cards magnetic effect
        const cards = document.querySelectorAll('.journey-card, .story-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // Text Highlight Effect (like highlighting in a book)
    // ========================================

    function initTextHighlight() {
        const highlightableText = document.querySelectorAll('.intro-text p, .philosophy-item p, .experiences-item p');

        highlightableText.forEach(text => {
            text.addEventListener('mouseenter', () => {
                text.style.backgroundColor = 'rgba(199, 146, 62, 0.1)';
                text.style.transition = 'background-color 0.3s ease';
            });

            text.addEventListener('mouseleave', () => {
                text.style.backgroundColor = 'transparent';
            });
        });
    }

    // ========================================
    // Active Section Highlighting
    // ========================================

    function initActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px'
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ========================================
    // Cursor Trail Effect (subtle)
    // ========================================

    function initCursorTrail() {
        // Only on desktop
        if (window.innerWidth < 1024) return;

        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 1px solid rgba(199, 146, 62, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease, opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(trail);

        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            trail.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            trail.style.opacity = '0';
        });

        function animateTrail() {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;

            trail.style.left = `${trailX - 10}px`;
            trail.style.top = `${trailY - 10}px`;

            requestAnimationFrame(animateTrail);
        }

        animateTrail();
    }

    // ========================================
    // Keyboard Navigation
    // ========================================

    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Escape closes mobile menu
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ========================================
    // Performance Optimization
    // ========================================

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

    // ========================================
    // Initialize Everything
    // ========================================

    function init() {
        initNavigation();
        initSmoothScroll();
        initScrollReveal();
        initParallax();
        initHeroParallax();
        initImageLoading();
        initForm();
        initPageTurnEffect();
        initHoverEffects();
        initTextHighlight();
        initActiveSection();
        initCursorTrail();
        initKeyboardNav();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));

})();
