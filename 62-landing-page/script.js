/**
 * Zen Harmony Spa - Asian Fusion Landing Page
 * JavaScript for animations and interactions
 */

(function() {
    'use strict';

    // ===================================
    // NAVIGATION
    // ===================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    let lastScrollY = 0;

    // Navigation scroll effect
    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    // Mobile navigation toggle
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile nav on link click
    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Initialize navigation
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    navToggle.addEventListener('click', toggleMobileNav);

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // ===================================
    // HERO REVEAL ANIMATIONS
    // ===================================

    function revealHeroElements() {
        const heroElements = document.querySelectorAll('[data-reveal]');

        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('revealed');
            }, 300 + (index * 150));
        });
    }

    // Run hero animations on load
    window.addEventListener('load', revealHeroElements);

    // ===================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ===================================

    function createScrollObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple elements
                    const delay = entry.target.dataset.delay || 0;

                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('[data-animate]').forEach((element, index) => {
            // Add stagger delay based on index within parent
            const siblings = element.parentElement.querySelectorAll('[data-animate]');
            const siblingIndex = Array.from(siblings).indexOf(element);
            element.dataset.delay = siblingIndex * 100;

            observer.observe(element);
        });
    }

    // Initialize scroll observer
    createScrollObserver();

    // ===================================
    // TESTIMONIAL SLIDER
    // ===================================

    const testimonialSlider = document.getElementById('testimonialSlider');

    if (testimonialSlider) {
        const cards = testimonialSlider.querySelectorAll('.testimonial-card');
        const dots = testimonialSlider.querySelectorAll('.nav-dot');
        let currentSlide = 0;
        let autoPlayInterval;

        function showSlide(index) {
            // Wrap around
            if (index >= cards.length) index = 0;
            if (index < 0) index = cards.length - 1;

            // Update cards
            cards.forEach((card, i) => {
                card.classList.remove('active');
                if (i === index) {
                    card.classList.add('active');
                }
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentSlide = index;
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoPlay();
                startAutoPlay();
            });
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        testimonialSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next
                    showSlide(currentSlide + 1);
                } else {
                    // Swipe right - previous
                    showSlide(currentSlide - 1);
                }
            }
        }

        // Start autoplay
        startAutoPlay();

        // Pause on hover
        testimonialSlider.addEventListener('mouseenter', stopAutoPlay);
        testimonialSlider.addEventListener('mouseleave', startAutoPlay);
    }

    // ===================================
    // SMOOTH SCROLL
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
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
    // FORM HANDLING
    // ===================================

    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            const requiredFields = ['name', 'email', 'date'];
            let isValid = true;

            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--blossom-deep)';
                } else {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });

            if (!isValid) {
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Request Received</span>';
                submitBtn.style.background = 'var(--jade-medium)';

                // Reset form after delay
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });

        // Input focus effects
        bookingForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }

    // ===================================
    // PARALLAX EFFECTS (subtle)
    // ===================================

    function handleParallax() {
        const scrollY = window.scrollY;

        // Hero parallax
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg && scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }

        // Floating petals parallax
        const petals = document.querySelectorAll('.float-petal');
        petals.forEach((petal, index) => {
            const speed = 0.1 + (index * 0.05);
            petal.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    // Throttled parallax for performance
    let parallaxTicking = false;

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                handleParallax();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });

    // ===================================
    // TREATMENT CARDS HOVER EFFECT
    // ===================================

    const treatmentCards = document.querySelectorAll('.treatment-card');

    treatmentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Scale down siblings slightly
            treatmentCards.forEach(sibling => {
                if (sibling !== this) {
                    sibling.style.opacity = '0.7';
                    sibling.style.transform = 'scale(0.98)';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            treatmentCards.forEach(sibling => {
                sibling.style.opacity = '';
                sibling.style.transform = '';
            });
        });
    });

    // ===================================
    // KANJI REVEAL ANIMATION
    // ===================================

    function animateKanji() {
        const kanjiElements = document.querySelectorAll('.hero-kanji, .principle-kanji, .card-kanji');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'kanjiReveal 1.5s ease-out forwards';
                }
            });
        }, { threshold: 0.5 });

        kanjiElements.forEach(el => observer.observe(el));
    }

    // Add kanji reveal animation to stylesheet
    const style = document.createElement('style');
    style.textContent = `
        @keyframes kanjiReveal {
            0% {
                opacity: 0;
                transform: scale(0.8) rotate(-5deg);
            }
            50% {
                opacity: 0.2;
            }
            100% {
                opacity: 0.15;
                transform: scale(1) rotate(0deg);
            }
        }
    `;
    document.head.appendChild(style);

    animateKanji();

    // ===================================
    // CURSOR EFFECT (optional enhancement)
    // ===================================

    // Only on non-touch devices
    if (!('ontouchstart' in window)) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const cursorStyle = document.createElement('style');
        cursorStyle.textContent = `
            .custom-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: var(--jade-light);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            .cursor-ring {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid var(--jade-light);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.3s ease, opacity 0.3s ease;
                opacity: 0.5;
            }
            .custom-cursor.hovering .cursor-ring {
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 0.8;
            }
            .custom-cursor.clicking .cursor-dot {
                transform: translate(-50%, -50%) scale(0.5);
            }
            @media (max-width: 768px) {
                .custom-cursor { display: none; }
            }
        `;
        document.head.appendChild(cursorStyle);

        let cursorX = 0, cursorY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function animateCursor() {
            const ease = 0.15;
            currentX += (cursorX - currentX) * ease;
            currentY += (cursorY - currentY) * ease;

            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .treatment-card, .nav-dot');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        // Click effect
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    }

    // ===================================
    // REDUCED MOTION CHECK
    // ===================================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Remove all animations for users who prefer reduced motion
        document.querySelectorAll('[data-reveal], [data-animate]').forEach(el => {
            el.classList.add('revealed', 'animated');
        });
    }

    // ===================================
    // SCROLL PROGRESS INDICATOR (optional)
    // ===================================

    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--jade-deep), var(--jade-light));
                z-index: 9999;
                transform-origin: left;
                transform: scaleX(0);
                transition: transform 0.1s ease-out;
            }
        `;
        document.head.appendChild(progressStyle);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / docHeight;
            progressBar.style.transform = `scaleX(${progress})`;
        }, { passive: true });
    }

    createScrollProgress();

})();
