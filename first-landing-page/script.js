/**
 * VECTOR — Precision Strategy Design
 * Neo-Geo Inspired Interactions
 *
 * Taut, precise animations with snappy micro-responses
 * and scroll-driven reveals that feel calibrated and intentional.
 */

(function() {
    'use strict';

    // === Configuration ===
    const CONFIG = {
        scrollThreshold: 50,
        revealThreshold: 0.15,
        revealRootMargin: '0px 0px -50px 0px',
        parallaxStrength: 0.1,
        cursorTrailLength: 8
    };

    // === DOM Ready ===
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initScrollReveal();
        initSmoothScroll();
        initFormInteractions();
        initGeometricParallax();
        initButtonRipples();
        initCursorEffects();
        initProgressIndicator();
    }

    // === Navigation ===
    function initNavigation() {
        const nav = document.querySelector('.nav');
        let lastScroll = 0;
        let ticking = false;

        function updateNav() {
            const currentScroll = window.scrollY;

            if (currentScroll > CONFIG.scrollThreshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
    }

    // === Scroll Reveal ===
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-scale');

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add slight stagger based on data attribute or natural delay
                    const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                    entry.target.style.transitionDelay = delay;
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.revealThreshold,
            rootMargin: CONFIG.revealRootMargin
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // === Smooth Scroll ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                // Custom smooth scroll with easing
                smoothScrollTo(targetPosition, 800);
            });
        });
    }

    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);

            window.scrollTo(0, startPosition + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // === Form Interactions ===
    function initFormInteractions() {
        const form = document.querySelector('.cta-form');
        const input = document.querySelector('.form-input');

        if (!form || !input) return;

        // Input focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const button = form.querySelector('.btn');
            const originalContent = button.innerHTML;

            // Animate button
            button.innerHTML = '<span>Processing...</span>';
            button.style.pointerEvents = 'none';

            // Simulate submission
            setTimeout(() => {
                button.innerHTML = '<span>Session Requested</span><svg class="btn-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2"/></svg>';
                button.classList.add('success');

                // Add success state styling
                button.style.background = 'var(--accent-cyan)';

                // Reset after delay
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.style.pointerEvents = '';
                    button.style.background = '';
                    button.classList.remove('success');
                    input.value = '';
                }, 3000);
            }, 1500);
        });
    }

    // === Geometric Parallax ===
    function initGeometricParallax() {
        const accents = document.querySelectorAll('.accent');
        const heroGeometry = document.querySelector('.hero-geometry');
        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Subtle parallax on accent blurs
            accents.forEach((accent, index) => {
                const speed = (index + 1) * 0.02;
                const yOffset = scrollY * speed;
                accent.style.transform = `translateY(${yOffset}px)`;
            });

            // Hero geometry fade on scroll
            if (heroGeometry) {
                const opacity = Math.max(0, 1 - (scrollY / viewportHeight));
                heroGeometry.style.opacity = opacity;
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

    // === Button Ripples ===
    function initButtonRipples() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Create ripple element
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: ripple 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                `;

                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation to stylesheet
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // === Cursor Effects ===
    function initCursorEffects() {
        // Only on desktop
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 6px;
                height: 6px;
                background: #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            .cursor-ring {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, border-color 0.2s;
            }
            .cursor-hover .cursor-ring {
                width: 60px;
                height: 60px;
                border-color: var(--accent-cyan);
            }
            body { cursor: none; }
            a, button, input { cursor: none; }
        `;
        document.head.appendChild(style);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover state
        document.querySelectorAll('a, button, input, .phase, .metric, .testimonial').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });

        // Hide on leave
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }

    // === Progress Indicator ===
    function initProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const bar = progressBar.querySelector('.scroll-progress-bar');

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--border-subtle);
                z-index: 101;
            }
            .scroll-progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(to right, var(--accent-cyan), var(--accent-coral));
                transition: width 0.1s linear;
            }
        `;
        document.head.appendChild(style);

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            bar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // === Phase Progress Animation ===
    function initPhaseProgress() {
        const phases = document.querySelectorAll('.phase');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.querySelector('.phase-progress');
                    if (progress) {
                        // Animate to full circle
                        progress.style.strokeDasharray = '314 0';
                    }
                }
            });
        }, { threshold: 0.5 });

        phases.forEach(phase => observer.observe(phase));
    }

    // === Keyboard Navigation ===
    document.addEventListener('keydown', (e) => {
        // Press 'Escape' to scroll to top
        if (e.key === 'Escape') {
            smoothScrollTo(0, 600);
        }

        // Press 'Enter' on focused nav link
        if (e.key === 'Enter' && document.activeElement.classList.contains('nav-link')) {
            document.activeElement.click();
        }
    });

    // === Intersection Observer for Stats Counter ===
    function initStatsCounter() {
        const stats = document.querySelectorAll('.stat-value');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    function animateValue(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasX = text.includes('×');
        const hasDollar = text.includes('$');
        const hasM = text.includes('M');

        // Extract numeric value
        let endValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        let startValue = 0;
        let duration = 1500;
        let prefix = hasDollar ? '$' : '';
        let suffix = hasPercent ? '%' : (hasX ? '×' : (hasM ? 'M' : ''));

        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out expo
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = startValue + (endValue - startValue) * eased;

            // Format based on original
            let formatted;
            if (hasM) {
                formatted = prefix + current.toFixed(1) + suffix;
            } else if (endValue >= 10) {
                formatted = prefix + Math.round(current) + suffix;
            } else {
                formatted = prefix + current.toFixed(1) + suffix;
            }

            element.textContent = formatted;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = text; // Restore original
            }
        }

        requestAnimationFrame(update);
    }

    // Initialize stats counter after DOM ready
    document.addEventListener('DOMContentLoaded', initStatsCounter);
    document.addEventListener('DOMContentLoaded', initPhaseProgress);

    // === Preloader (optional enhancement) ===
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            document.querySelectorAll('.hero .reveal-text, .hero .reveal-up').forEach(el => {
                el.classList.add('revealed');
            });
        }, 100);
    });

})();
