/**
 * Terraverde Architects - Modernist Landing Page
 * JavaScript for smooth animations and interactions
 */

(function() {
    'use strict';

    // ============================================
    // Navigation
    // ============================================
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScrollY = 0;

    // Handle navigation scroll state
    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    // Mobile navigation toggle
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });

    navToggle.addEventListener('click', toggleMobileNav);
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ============================================
    // Smooth Scroll for anchor links
    // ============================================
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

    // ============================================
    // Counter Animation for Stats
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    // Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer for stat counters
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'), 10);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Apply observers
    function initializeObservers() {
        // Add reveal class to elements that should animate
        const revealElements = document.querySelectorAll(
            '.principle, .process-step, .project'
        );
        revealElements.forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });

        // Observe stats section
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            statsObserver.observe(heroStats);
        }
    }

    // ============================================
    // Process Timeline Animation
    // ============================================
    const processSteps = document.querySelectorAll('.process-step');

    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    processSteps.forEach(step => {
        processObserver.observe(step);
    });

    // ============================================
    // Form Handling
    // ============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            if (!data.name || !data.email) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate form submission
            const submitButton = this.querySelector('.form-submit');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showFormMessage('Thank you for your message. We will be in touch soon.', 'success');
                this.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    function showFormMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            font-size: 0.875rem;
            ${type === 'success'
                ? 'background: #f0f7f0; color: #2d5a2d; border-left: 3px solid #4a8c4a;'
                : 'background: #fdf2f2; color: #9b2c2c; border-left: 3px solid #c53030;'
            }
        `;

        contactForm.appendChild(messageEl);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }

    // ============================================
    // Parallax Effect for Hero
    // ============================================
    const heroImage = document.querySelector('.hero-image');

    function handleParallax() {
        if (window.innerWidth < 768) return;

        const scrolled = window.scrollY;
        const rate = scrolled * 0.15;

        if (heroImage) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // ============================================
    // Project Hover Effects
    // ============================================
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        const image = project.querySelector('.project-image');

        project.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) {
                image.style.transform = 'scale(1.05)';
            }
        });

        project.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    });

    // ============================================
    // Principle Cards Stagger Animation
    // ============================================
    const principles = document.querySelectorAll('.principle');

    const principleObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                principleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    principles.forEach(principle => {
        principle.style.opacity = '0';
        principle.style.transform = 'translateY(30px)';
        principle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        principleObserver.observe(principle);
    });

    // ============================================
    // Cursor Effect (Desktop only)
    // ============================================
    function initCursorEffect() {
        if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--color-accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.15s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Interactive elements scale cursor
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(3)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        // Smooth cursor animation
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    // ============================================
    // Preloader (Optional enhancement)
    // ============================================
    function handlePageLoad() {
        document.body.classList.add('loaded');
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        handleNavScroll();
        initializeObservers();
        initCursorEffect();

        // Add loaded class after a short delay
        setTimeout(handlePageLoad, 100);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile nav on resize to desktop
            if (window.innerWidth >= 768 && navLinks.classList.contains('active')) {
                toggleMobileNav();
            }
        }, 250);
    });

})();
