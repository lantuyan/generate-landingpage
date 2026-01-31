/**
 * ZEITGEIST - Cultural Intelligence Agency
 * Interactive JavaScript for Collage Design Landing Page
 */

(function() {
    'use strict';

    // ============================================
    // Navigation
    // ============================================
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior for navigation
    let lastScrollY = window.scrollY;

    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // Parallax Effect for Hero Collage Items
    // ============================================
    const collageItems = document.querySelectorAll('.collage-item');
    const hero = document.querySelector('.hero');

    function handleParallax(e) {
        if (window.innerWidth < 768) return;

        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        collageItems.forEach(item => {
            const depth = parseFloat(item.dataset.depth) || 0.2;
            const moveX = (mouseX - centerX) * depth * 0.1;
            const moveY = (mouseY - centerY) * depth * 0.1;
            const rotation = item.style.transform.match(/rotate\([^)]+\)/)?.[0] || 'rotate(0deg)';

            item.style.transform = `translate(${moveX}px, ${moveY}px) ${rotation}`;
        });
    }

    hero.addEventListener('mousemove', handleParallax);

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        collageItems.forEach(item => {
            const rotation = item.style.transform.match(/rotate\([^)]+\)/)?.[0] || 'rotate(0deg)';
            item.style.transform = rotation;
        });
    });

    // ============================================
    // Scroll Reveal Animations
    // ============================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    const processSteps = document.querySelectorAll('.process-step');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Process steps reveal with stagger
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    processSteps.forEach(step => stepObserver.observe(step));

    // ============================================
    // Insight Cards - Layer Reveal on Hover
    // ============================================
    const insightCards = document.querySelectorAll('.insight-card');

    insightCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle random rotation on hover
            const randomRotation = (Math.random() - 0.5) * 4;
            card.style.setProperty('--hover-rotation', `${randomRotation}deg`);
        });
    });

    // ============================================
    // Service Panels - Reveal Details
    // ============================================
    const servicePanels = document.querySelectorAll('.service-panel');

    servicePanels.forEach(panel => {
        const details = panel.querySelector('.panel-details');

        panel.addEventListener('mouseenter', () => {
            if (details) {
                details.style.transitionDelay = '0.1s';
            }
        });

        panel.addEventListener('mouseleave', () => {
            if (details) {
                details.style.transitionDelay = '0s';
            }
        });
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Add visual feedback
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('.btn-text').textContent;

            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.querySelector('.btn-text').textContent = 'Message Sent';
                submitBtn.style.background = 'var(--color-accent)';

                // Reset after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);

            console.log('Form submitted:', data);
        });

        // Form field animations
        const formFields = contactForm.querySelectorAll('input, select, textarea');

        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });

            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Collage Text Fragments Animation
    // ============================================
    const textFragments = document.querySelectorAll('.collage-text-fragment');

    function animateFragments() {
        textFragments.forEach((fragment, index) => {
            const delay = index * 0.3;
            fragment.style.animation = `fragmentFloat 6s ease-in-out ${delay}s infinite alternate`;
        });
    }

    // Add floating keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fragmentFloat {
            0% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
            100% { transform: translateY(-10px) rotate(var(--rotation, 0deg)); }
        }
    `;
    document.head.appendChild(styleSheet);

    animateFragments();

    // ============================================
    // Cursor Trail Effect (Subtle)
    // ============================================
    let cursorTrail = [];
    const maxTrailLength = 5;

    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: var(--color-accent-light);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.5;
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        document.body.appendChild(dot);

        setTimeout(() => {
            dot.style.opacity = '0';
            dot.style.transform = 'scale(0)';
        }, 50);

        setTimeout(() => {
            dot.remove();
        }, 500);
    }

    // Only enable on larger screens
    if (window.innerWidth > 1024) {
        let lastTrailTime = 0;

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTrailTime > 50) {
                createTrailDot(e.clientX, e.clientY);
                lastTrailTime = now;
            }
        });
    }

    // ============================================
    // Clients Marquee Pause on Hover
    // ============================================
    const marqueeTrack = document.querySelector('.marquee-track');

    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });

        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }

    // ============================================
    // Random Background Fragments Movement
    // ============================================
    const fragmentPieces = document.querySelectorAll('.fragment-piece, .approach-fragment, .contact-fragment');

    function randomizeFragments() {
        fragmentPieces.forEach(fragment => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            const currentTransform = fragment.style.transform || '';
            const baseRotation = currentTransform.match(/rotate\([^)]+\)/)?.[0] || '';

            fragment.style.transition = 'transform 8s ease-in-out';
            fragment.style.transform = `translate(${randomX}px, ${randomY}px) ${baseRotation}`;
        });
    }

    // Initial randomization
    setTimeout(randomizeFragments, 1000);

    // Periodic movement
    setInterval(randomizeFragments, 8000);

    // ============================================
    // Page Load Animation
    // ============================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Stagger reveal of hero collage items
        collageItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = `${item.style.transform || ''} scale(0.8)`;

            setTimeout(() => {
                item.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                const baseTransform = item.style.transform.replace('scale(0.8)', '').trim();
                item.style.transform = baseTransform || 'scale(1)';
            }, 300 + (index * 150));
        });

        // Reveal text fragments
        textFragments.forEach((fragment, index) => {
            fragment.style.opacity = '0';
            fragment.style.transform = 'translateY(20px)';

            setTimeout(() => {
                fragment.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                fragment.style.opacity = '1';
                fragment.style.transform = 'translateY(0)';
            }, 800 + (index * 200));
        });
    });

    // ============================================
    // Keyboard Navigation Accessibility
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    trapFocus(navMenu);

    // ============================================
    // Performance: Reduce Motion for Users
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable parallax
            hero.removeEventListener('mousemove', handleParallax);

            // Disable marquee animation
            if (marqueeTrack) {
                marqueeTrack.style.animation = 'none';
            }

            // Disable cursor trail
            document.removeEventListener('mousemove', createTrailDot);

            // Disable fragment movement
            fragmentPieces.forEach(fragment => {
                fragment.style.transition = 'none';
            });
        }
    }

    prefersReducedMotion.addListener(handleReducedMotion);
    handleReducedMotion();

})();
