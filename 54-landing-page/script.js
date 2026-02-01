/**
 * Omakase Books - Minimalist Japanese Landing Page
 * Meditative, slow animations and interactions
 */

(function() {
    'use strict';

    // --- Intersection Observer for Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                const delay = entry.target.dataset.revealDelay || index * 150;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Smooth Scroll for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Navigation Background on Scroll ---
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            nav.style.background = 'rgba(247, 245, 240, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(247, 245, 240, 1) 0%, transparent 100%)';
            nav.style.backdropFilter = 'none';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // --- Hide Scroll Indicator on Scroll ---
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }, { passive: true });
    }

    // --- Book Hover Parallax Effect ---
    const bookSilhouette = document.querySelector('.book-silhouette');

    if (bookSilhouette) {
        const heroSection = document.querySelector('.hero');

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rotateY = -15 + x * 20;
            const rotateX = y * 10;

            bookSilhouette.style.transform = `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            bookSilhouette.style.transform = 'perspective(800px) rotateY(-15deg) rotateX(0deg)';
        });
    }

    // --- Form Submission ---
    const subscribeForm = document.getElementById('subscribe-form');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // Animate button
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            submitBtn.style.opacity = '0.6';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="btn-text">Thank you</span>';
                submitBtn.style.background = '#3d3d3d';

                // Reset after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    subscribeForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // --- Parallax Effect on Scroll ---
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroText && heroVisual) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = window.innerHeight;

            if (scrollY < maxScroll) {
                const progress = scrollY / maxScroll;
                heroText.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroText.style.opacity = 1 - progress * 1.5;
                heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroVisual.style.opacity = 1 - progress * 1.2;
            }
        }, { passive: true });
    }

    // --- Staggered Reveal for Principles ---
    const principles = document.querySelectorAll('.principle');

    const principlesObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    principles.forEach(principle => principlesObserver.observe(principle));

    // --- Staggered Reveal for Journey Steps ---
    const journeySteps = document.querySelectorAll('.journey-step');

    const journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const steps = document.querySelectorAll('.journey-step');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('revealed');
                    }, index * 250);
                });
                journeyObserver.disconnect();
            }
        });
    }, {
        threshold: 0.2
    });

    if (journeySteps.length > 0) {
        journeyObserver.observe(journeySteps[0]);
    }

    // --- Testimonial Reveal ---
    const testimonial = document.querySelector('.testimonial-quote');

    if (testimonial) {
        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    testimonialObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        testimonialObserver.observe(testimonial);
    }

    // --- Cursor Trail Effect (Subtle) ---
    let cursorTrails = [];
    const maxTrails = 5;
    let trailTimer = null;

    function createTrail(x, y) {
        if (window.innerWidth < 768) return;

        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: rgba(26, 26, 26, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 1.5s ease-out;
        `;
        document.body.appendChild(trail);
        cursorTrails.push(trail);

        requestAnimationFrame(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(3)';
        });

        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
            cursorTrails = cursorTrails.filter(t => t !== trail);
        }, 1500);
    }

    document.addEventListener('mousemove', (e) => {
        if (trailTimer) return;
        trailTimer = setTimeout(() => {
            createTrail(e.clientX, e.clientY);
            trailTimer = null;
        }, 100);
    });

    // --- Page Load Animation ---
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s ease';

        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

})();
