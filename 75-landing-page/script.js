/**
 * ResolveNow - Legal/Professional Landing Page
 * JavaScript for measured, deliberate interactions
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');
    const contactForm = document.getElementById('contactForm');

    // ========================================
    // Header Scroll Effect
    // ========================================
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ========================================
    // Mobile Navigation
    // ========================================
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMobileNav);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMobileNav();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMobileNav();
        }
    });

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight delay for measured, deliberate reveal
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, 100);
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });

    // ========================================
    // Counter Animation for Statistics
    // ========================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observe stat numbers for animation trigger
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count, 10);
                // Deliberate delay before starting count
                setTimeout(() => {
                    animateCounter(entry.target, target, 2500);
                }, 300);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ========================================
    // Form Handling
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <span>Processing...</span>
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
                        <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            `;
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success state
                submitBtn.innerHTML = `
                    <span>Consultation Requested</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                `;
                submitBtn.style.backgroundColor = '#2d5a3d';
                submitBtn.style.borderColor = '#2d5a3d';

                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                }, 3000);
            }, 1500);
        });

        // Form input focus effects
        const formInputs = contactForm.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value.trim() !== '') {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });
    }

    // ========================================
    // Active Navigation Link Highlighting
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ========================================
    // Parallax Effect for Hero Background
    // ========================================
    const heroBg = document.querySelector('.hero__bg');

    function updateParallax() {
        if (window.innerWidth > 768 && heroBg) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            heroBg.style.transform = `translateY(${rate}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
    }, { passive: true });

    // ========================================
    // Keyboard Navigation Enhancement
    // ========================================
    document.addEventListener('keydown', (e) => {
        // Skip links functionality
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // ========================================
    // Service Card Hover Effects
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Subtle scale effect for neighboring cards
            serviceCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.transform = 'scale(0.98)';
                    otherCard.style.opacity = '0.85';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            serviceCards.forEach(otherCard => {
                otherCard.style.transform = '';
                otherCard.style.opacity = '';
            });
        });
    });

    // ========================================
    // Process Timeline Animation Enhancement
    // ========================================
    const processSteps = document.querySelectorAll('.process__step');

    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation with deliberate timing
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-50px'
    });

    processSteps.forEach(step => {
        processObserver.observe(step);
    });

    // ========================================
    // Testimonial Card Rotation Effect
    // ========================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ========================================
    // Credentials Counter Animation
    // ========================================
    const credentialNumbers = document.querySelectorAll('.credentials__card-number');

    const credentialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const hasPlus = text.includes('+');
                const hasDollar = text.includes('$');
                const hasB = text.includes('B');
                const hasK = text.includes('K');

                let number = parseFloat(text.replace(/[^0-9.]/g, ''));

                if (hasB || hasK) {
                    // Handle formatted numbers
                    animateFormattedNumber(entry.target, number, hasB ? 'B' : 'K', hasDollar, hasPlus);
                } else {
                    animateCredentialCounter(entry.target, number, hasPlus);
                }

                credentialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    function animateCredentialCounter(element, target, hasPlus) {
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * eased);

            element.textContent = current + (hasPlus ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target + (hasPlus ? '+' : '');
            }
        }

        requestAnimationFrame(update);
    }

    function animateFormattedNumber(element, target, suffix, hasDollar, hasPlus) {
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = (target * eased).toFixed(1);

            let text = hasDollar ? '$' : '';
            text += current + suffix;
            text += hasPlus ? '+' : '';

            element.textContent = text;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                let finalText = hasDollar ? '$' : '';
                finalText += target + suffix;
                finalText += hasPlus ? '+' : '';
                element.textContent = finalText;
            }
        }

        requestAnimationFrame(update);
    }

    credentialNumbers.forEach(num => {
        credentialObserver.observe(num);
    });

    // ========================================
    // Initialize
    // ========================================
    function init() {
        // Set initial header state
        updateHeader();

        // Trigger animations for elements already in view
        setTimeout(() => {
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.classList.add('animated');
                }
            });
        }, 100);
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
