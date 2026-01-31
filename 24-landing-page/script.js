/**
 * Clarity — Digital Decluttering Landing Page
 * Subtle, refined interactions for a minimal experience
 */

(function() {
    'use strict';

    // ===================================
    // Navigation
    // ===================================

    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Handle scroll for nav visibility and styling
    function updateNav() {
        const currentScrollY = window.scrollY;

        // Add scrolled state
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll (only after scrolling past hero)
        if (currentScrollY > window.innerHeight * 0.5) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
        } else {
            nav.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===================================
    // Scroll Reveal Animations
    // ===================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add stagger delay for grid items
                const parent = entry.target.parentElement;
                if (parent && (parent.classList.contains('services-grid') ||
                    parent.classList.contains('stats-grid') ||
                    parent.classList.contains('process-steps'))) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (index * 100) + 'ms';
                }

                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll(
        '.service-item, .stat-item, .process-step, .testimonial-quote, .cta-content'
    );

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // ===================================
    // Counter Animation for Stats
    // ===================================

    function animateCounter(element, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * easeProgress);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
                statNumbers.forEach(function(num) {
                    const target = parseInt(num.dataset.target, 10);
                    animateCounter(num, target, 1500);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
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

    // ===================================
    // Form Handling
    // ===================================

    const form = document.getElementById('cta-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const originalText = button.textContent;

            // Simple validation visual feedback
            if (email.value && email.validity.valid) {
                button.textContent = 'Sent';
                button.style.background = 'var(--color-accent)';
                email.value = '';

                setTimeout(function() {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            }
        });
    }

    // ===================================
    // Scroll Indicator Fade
    // ===================================

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const opacity = 1 - (window.scrollY / 300);
            scrollIndicator.style.opacity = Math.max(0, opacity);
        }, { passive: true });
    }

})();
