/**
 * LinguaBridge - Split-Screen Landing Page
 * Interactive JavaScript for animations and interactions
 */

(function() {
    'use strict';

    // =========================================
    // DOM Elements
    // =========================================
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const processSteps = document.querySelectorAll('.process-step');
    const languagePairs = document.querySelectorAll('.language-pair');
    const testimonialDots = document.querySelectorAll('.nav-dot');
    const testimonialPairs = document.querySelectorAll('.testimonial-pair');
    const statNumbers = document.querySelectorAll('.stat-number');
    const signupForm = document.getElementById('signup-form');

    // =========================================
    // Navigation
    // =========================================

    // Scroll effect on nav
    let lastScrollY = 0;

    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = navToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.transform = 'rotate(-45deg) translate(0, 0)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.transform = '';
        }
    }

    // Close mobile menu on link click
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    }

    // =========================================
    // Intersection Observer for Animations
    // =========================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    // Process steps animation
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, observerOptions);

    processSteps.forEach(step => {
        processObserver.observe(step);
    });

    // Language pairs animation
    const languageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.aosDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, observerOptions);

    languagePairs.forEach(pair => {
        languageObserver.observe(pair);
    });

    // =========================================
    // Stats Counter Animation
    // =========================================

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    function animateCounter(element, target, duration = 2000) {
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-cubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.count, 10);
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // =========================================
    // Testimonials Carousel
    // =========================================

    let currentTestimonial = 1;
    let testimonialInterval;

    function showTestimonial(pairNumber) {
        testimonialPairs.forEach(pair => {
            pair.classList.remove('active');
            if (parseInt(pair.dataset.pair) === pairNumber) {
                pair.classList.add('active');
            }
        });

        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.dataset.pair) === pairNumber) {
                dot.classList.add('active');
            }
        });

        currentTestimonial = pairNumber;
    }

    function nextTestimonial() {
        const next = currentTestimonial >= testimonialPairs.length ? 1 : currentTestimonial + 1;
        showTestimonial(next);
    }

    function startTestimonialAutoplay() {
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    function stopTestimonialAutoplay() {
        clearInterval(testimonialInterval);
    }

    // Click handlers for testimonial dots
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopTestimonialAutoplay();
            showTestimonial(parseInt(dot.dataset.pair));
            startTestimonialAutoplay();
        });
    });

    // =========================================
    // Form Handling
    // =========================================

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nativeLang = document.getElementById('native-lang').value;
            const learnLang = document.getElementById('learn-lang').value;
            const email = document.getElementById('email').value;

            // Validate that native and learning languages are different
            if (nativeLang === learnLang && nativeLang !== '') {
                showFormMessage('Please select different languages for speaking and learning.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = signupForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Finding partners...</span>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Success!</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #4ECDC4, #44A08D)';

                showFormMessage('Welcome to LinguaBridge! Check your email to get started.', 'success');

                // Reset form after delay
                setTimeout(() => {
                    signupForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    function showFormMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            text-align: center;
            animation: fadeInUp 0.3s ease forwards;
            ${type === 'success'
                ? 'background: #E5FAF8; color: #3DB8B0;'
                : 'background: #FFE5E5; color: #E85555;'}
        `;

        signupForm.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-10px)';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            closeMobileMenu();

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

    // =========================================
    // Split Screen Hover Effects
    // =========================================

    const heroDivider = document.querySelector('.hero-divider');
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');

    if (heroLeft && heroRight) {
        heroLeft.addEventListener('mouseenter', () => {
            heroLeft.style.flex = '1.1';
            heroRight.style.flex = '0.9';
        });

        heroRight.addEventListener('mouseenter', () => {
            heroRight.style.flex = '1.1';
            heroLeft.style.flex = '0.9';
        });

        [heroLeft, heroRight].forEach(side => {
            side.addEventListener('mouseleave', () => {
                heroLeft.style.flex = '1';
                heroRight.style.flex = '1';
            });
        });
    }

    // =========================================
    // Language Pair Hover Effects
    // =========================================

    languagePairs.forEach(pair => {
        const bridge = pair.querySelector('.lang-bridge');
        if (bridge) {
            pair.addEventListener('mouseenter', () => {
                bridge.style.transform = 'scale(1.2)';
            });

            pair.addEventListener('mouseleave', () => {
                bridge.style.transform = '';
            });
        }
    });

    // =========================================
    // Parallax Effect on Hero
    // =========================================

    function handleParallax() {
        const scrollY = window.scrollY;
        const heroSection = document.querySelector('.hero');

        if (heroSection && scrollY < window.innerHeight) {
            const floatingWords = document.querySelectorAll('.floating-words span');
            floatingWords.forEach((word, index) => {
                const speed = 0.1 + (index * 0.05);
                word.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }

    // =========================================
    // Bridge Connection Animation
    // =========================================

    function animateBridgeConnections() {
        const bridges = document.querySelectorAll('.bridge-connection');
        bridges.forEach(bridge => {
            bridge.style.animation = 'bridgePulse 2s ease-in-out infinite';
        });
    }

    // =========================================
    // Typing Effect for Hero Lang
    // =========================================

    const heroLangs = document.querySelectorAll('.hero-lang');
    const greetings = {
        left: ['你好', 'Bonjour', 'Hola', 'Ciao', 'Guten Tag'],
        right: ['Hello', 'こんにちは', 'Olá', 'Привет', 'مرحبا']
    };

    let greetingIndex = 0;

    function rotateGreetings() {
        if (heroLangs.length >= 2) {
            heroLangs[0].style.opacity = '0';
            heroLangs[1].style.opacity = '0';

            setTimeout(() => {
                greetingIndex = (greetingIndex + 1) % greetings.left.length;
                heroLangs[0].textContent = greetings.left[greetingIndex];
                heroLangs[1].textContent = greetings.right[greetingIndex];

                heroLangs[0].style.opacity = '0.3';
                heroLangs[1].style.opacity = '0.3';
            }, 500);
        }
    }

    // =========================================
    // Initialize
    // =========================================

    function init() {
        // Event listeners
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        window.addEventListener('scroll', handleParallax, { passive: true });

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Start testimonial autoplay
        if (testimonialPairs.length > 0) {
            startTestimonialAutoplay();
        }

        // Animate bridge connections
        animateBridgeConnections();

        // Start greeting rotation
        setInterval(rotateGreetings, 4000);

        // Add smooth transition for hero splits
        if (heroLeft) heroLeft.style.transition = 'flex 0.5s ease';
        if (heroRight) heroRight.style.transition = 'flex 0.5s ease';

        // Initial scroll check
        handleNavScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // =========================================
    // Keyboard Navigation
    // =========================================

    document.addEventListener('keydown', (e) => {
        // Escape closes mobile menu
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }

        // Arrow keys for testimonials
        if (e.key === 'ArrowLeft') {
            stopTestimonialAutoplay();
            const prev = currentTestimonial <= 1 ? testimonialPairs.length : currentTestimonial - 1;
            showTestimonial(prev);
            startTestimonialAutoplay();
        }

        if (e.key === 'ArrowRight') {
            stopTestimonialAutoplay();
            nextTestimonial();
            startTestimonialAutoplay();
        }
    });

    // =========================================
    // Touch/Swipe Support for Testimonials
    // =========================================

    let touchStartX = 0;
    let touchEndX = 0;

    const testimonialsContainer = document.querySelector('.testimonials-container');

    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            stopTestimonialAutoplay();

            if (diff > 0) {
                // Swipe left - next
                nextTestimonial();
            } else {
                // Swipe right - previous
                const prev = currentTestimonial <= 1 ? testimonialPairs.length : currentTestimonial - 1;
                showTestimonial(prev);
            }

            startTestimonialAutoplay();
        }
    }

})();
