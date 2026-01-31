/**
 * THE BASEMENT - Grunge Style Landing Page
 * Interactive JavaScript
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const subscribeForm = document.getElementById('subscribeForm');
    const animatedElements = document.querySelectorAll('[data-animate]');

    // ============================================
    // Navigation
    // ============================================
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
        const currentScrollY = window.scrollY;

        // Show nav after scrolling past hero
        if (currentScrollY > window.innerHeight * 0.5) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile navigation toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // Smooth Scroll with offset for fixed nav
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav.offsetHeight || 60;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optionally stop observing after animation
                // animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // ============================================
    // Tactile Hover Effects
    // ============================================

    // Add subtle random rotation on hover for cards
    const cards = document.querySelectorAll('.about-card, .show-card, .artist-polaroid, .pinned-note');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const randomRotate = (Math.random() - 0.5) * 4;
            const randomX = (Math.random() - 0.5) * 4;
            const randomY = (Math.random() - 0.5) * 4;

            this.style.transform = `rotate(${randomRotate}deg) translate(${randomX}px, ${randomY}px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            // Reset to original transform if defined, or clear
            const originalTransform = this.dataset.originalTransform || '';
            this.style.transform = originalTransform;
        });

        // Store original transform
        card.dataset.originalTransform = window.getComputedStyle(card).transform;
    });

    // ============================================
    // Paper/Tape Peel Effect on Elements
    // ============================================
    const tapeElements = document.querySelectorAll('.tape, .card-tape, .polaroid-tape');

    tapeElements.forEach(tape => {
        tape.addEventListener('mouseenter', function() {
            this.style.transform += ' rotate(2deg) translateY(-2px)';
            this.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
        });

        tape.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // ============================================
    // Zine Page Flip Effect
    // ============================================
    const zineCover = document.querySelector('.zine-cover');

    if (zineCover) {
        zineCover.addEventListener('mouseenter', function() {
            const pageFront = this.querySelector('.page-front');
            if (pageFront) {
                pageFront.style.transform = 'rotate(-8deg) translateX(-15px)';
                pageFront.style.boxShadow = '10px 5px 20px rgba(0,0,0,0.3)';
            }
        });

        zineCover.addEventListener('mouseleave', function() {
            const pageFront = this.querySelector('.page-front');
            if (pageFront) {
                pageFront.style.transform = '';
                pageFront.style.boxShadow = '';
            }
        });
    }

    // ============================================
    // Typewriter Effect for Hero Tagline
    // ============================================
    const typewriterElement = document.querySelector('.hero-tagline.typewriter');

    if (typewriterElement) {
        const text = typewriterElement.innerHTML;
        typewriterElement.innerHTML = '';
        typewriterElement.style.opacity = '1';

        let charIndex = 0;
        const typeSpeed = 50;

        function typeWriter() {
            if (charIndex < text.length) {
                // Handle HTML tags
                if (text.charAt(charIndex) === '<') {
                    const tagEnd = text.indexOf('>', charIndex);
                    typewriterElement.innerHTML += text.substring(charIndex, tagEnd + 1);
                    charIndex = tagEnd + 1;
                } else {
                    typewriterElement.innerHTML += text.charAt(charIndex);
                    charIndex++;
                }
                setTimeout(typeWriter, typeSpeed);
            }
        }

        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // ============================================
    // Subscribe Form Handling
    // ============================================
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value;

            if (email && isValidEmail(email)) {
                // Simulate form submission
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.textContent = 'SUBSCRIBED!';
                    submitBtn.style.background = '#4a7c59';
                    emailInput.value = '';

                    // Reset after a few seconds
                    setTimeout(() => {
                        submitBtn.textContent = 'SUBSCRIBE';
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            } else {
                // Shake animation for invalid email
                emailInput.style.animation = 'shake 0.5s ease';
                emailInput.style.borderColor = '#8b3a3a';

                setTimeout(() => {
                    emailInput.style.animation = '';
                    emailInput.style.borderColor = '';
                }, 500);
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ============================================
    // Parallax Effect for Hero Elements
    // ============================================
    const heroPosters = document.querySelectorAll('.hero-poster');

    function updateParallax() {
        const scrolled = window.scrollY;

        if (scrolled < window.innerHeight) {
            heroPosters.forEach((poster, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                const rotation = parseFloat(poster.style.transform.match(/rotate\(([^)]+)\)/)?.[1]) || 0;
                poster.style.transform = `translateY(${yPos}px) rotate(${rotation + scrolled * 0.01}deg)`;
            });
        }
    }

    if (heroPosters.length > 0) {
        window.addEventListener('scroll', function() {
            requestAnimationFrame(updateParallax);
        }, { passive: true });
    }

    // ============================================
    // Random "Worn" Effects on Load
    // ============================================
    function addWornEffects() {
        // Add random slight rotations to worn-paper elements
        document.querySelectorAll('.worn-paper').forEach(el => {
            const rotation = (Math.random() - 0.5) * 2;
            el.style.transform = `rotate(${rotation}deg)`;
        });

        // Randomize polaroid rotations slightly
        document.querySelectorAll('.artist-polaroid').forEach((el, index) => {
            const baseRotation = index % 2 === 0 ? -3 : 2;
            const randomOffset = (Math.random() - 0.5) * 4;
            el.dataset.originalTransform = `rotate(${baseRotation + randomOffset}deg)`;
            el.style.transform = el.dataset.originalTransform;
        });
    }

    // ============================================
    // Cursor Trail Effect (Subtle)
    // ============================================
    let cursorTrailEnabled = false;

    if (cursorTrailEnabled && window.innerWidth > 768) {
        const trail = [];
        const trailLength = 5;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i}px;
                height: ${8 - i}px;
                background: rgba(139, 58, 58, ${0.5 - i * 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }

        let mouseX = 0, mouseY = 0;
        const trailPositions = [];

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateTrail() {
            trailPositions.unshift({ x: mouseX, y: mouseY });

            if (trailPositions.length > trailLength) {
                trailPositions.pop();
            }

            trail.forEach((dot, index) => {
                if (trailPositions[index]) {
                    dot.style.left = trailPositions[index].x + 'px';
                    dot.style.top = trailPositions[index].y + 'px';
                }
            });

            requestAnimationFrame(updateTrail);
        }

        updateTrail();
    }

    // ============================================
    // Easter Egg: Konami Code
    // ============================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';

        const message = document.createElement('div');
        message.textContent = '🤘 UNDERGROUND MODE ACTIVATED 🤘';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #8b3a3a;
            color: #fff;
            padding: 20px 40px;
            font-family: 'Permanent Marker', cursive;
            font-size: 2rem;
            z-index: 10001;
            animation: pulse 0.5s ease infinite;
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            document.body.style.filter = '';
            message.remove();
        }, 3000);
    }

    // ============================================
    // Add Shake Animation Keyframes
    // ============================================
    const shakeStyles = document.createElement('style');
    shakeStyles.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyles);

    // ============================================
    // Initialize
    // ============================================
    function init() {
        addWornEffects();
        updateNav();

        // Add loaded class to body for entrance animations
        document.body.classList.add('loaded');

        console.log('%c🎸 THE BASEMENT', 'font-size: 24px; font-weight: bold; color: #8b3a3a;');
        console.log('%cKeeping it real since 2019', 'font-size: 12px; color: #4a4539;');
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // Performance: Debounce resize events
    // ============================================
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

    // Handle resize events
    const handleResize = debounce(() => {
        // Recalculate any size-dependent values here
    }, 250);

    window.addEventListener('resize', handleResize);

})();
