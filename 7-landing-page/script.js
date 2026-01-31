/**
 * Komorebi - Japandi Landing Page
 * Subtle, intentional interactions
 */

(function() {
    'use strict';

    // =============================================
    // Scroll-triggered Animations
    // =============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-up elements
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-up');
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // =============================================
    // Navigation
    // =============================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    let lastScrollY = 0;

    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        // Add scrolled class when not at top
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close menu on nav link click
    function initMobileNav() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', toggleMobileMenu);

            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
    }

    // =============================================
    // Smooth Scroll for Anchor Links
    // =============================================

    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const targetPosition = target.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // =============================================
    // Testimonials Slider
    // =============================================

    function initTestimonialsSlider() {
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.testimonial-dot');
        let currentIndex = 0;
        let autoplayInterval;

        function showTestimonial(index) {
            // Hide all testimonials
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.remove('active');
                dots[i]?.classList.remove('active');
            });

            // Show selected testimonial
            testimonials[index]?.classList.add('active');
            dots[index]?.classList.add('active');
            currentIndex = index;
        }

        function nextTestimonial() {
            const next = (currentIndex + 1) % testimonials.length;
            showTestimonial(next);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextTestimonial, 6000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                showTestimonial(index);
                startAutoplay();
            });
        });

        // Start autoplay
        if (testimonials.length > 1) {
            startAutoplay();
        }

        // Pause on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
        }
    }

    // =============================================
    // Form Handling
    // =============================================

    function initForms() {
        const contactForm = document.getElementById('contactForm');
        const newsletterForm = document.getElementById('newsletterForm');

        function handleFormSubmit(e, formType) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Simple loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                submitBtn.textContent = 'Thank you!';
                form.reset();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        }

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
        }

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => handleFormSubmit(e, 'newsletter'));
        }
    }

    // =============================================
    // Subtle Hover Effects for Collection Items
    // =============================================

    function initCollectionHover() {
        const collectionItems = document.querySelectorAll('.collection-item');

        collectionItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // =============================================
    // Parallax Effect for Hero (subtle)
    // =============================================

    function initParallax() {
        const hero = document.getElementById('hero');
        const heroContent = document.querySelector('.hero-content');

        if (!hero || !heroContent || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight) {
                const parallaxAmount = scrollY * 0.3;
                const opacityAmount = 1 - (scrollY / heroHeight) * 0.5;

                heroContent.style.transform = `translateY(${parallaxAmount}px)`;
                heroContent.style.opacity = opacityAmount;
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

    // =============================================
    // Cursor Effect for Natural Wood Touch Feel
    // =============================================

    function initCursorEffect() {
        // Only on desktop
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const interactiveElements = document.querySelectorAll('a, button, .collection-item, .material-item');

        interactiveElements.forEach(el => {
            el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }

    // =============================================
    // Page Load Animation
    // =============================================

    function initPageLoad() {
        document.body.style.opacity = '0';

        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        });
    }

    // =============================================
    // Initialize All
    // =============================================

    function init() {
        initPageLoad();
        initScrollAnimations();
        initMobileNav();
        initSmoothScroll();
        initTestimonialsSlider();
        initForms();
        initCollectionHover();
        initParallax();
        initCursorEffect();

        // Scroll handler with throttle
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    handleNavScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        // Initial call
        handleNavScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
