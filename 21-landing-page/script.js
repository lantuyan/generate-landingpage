/**
 * LUMIÈRE NOIR - Interactive JavaScript
 * Premium Black & White Photography Workshop
 *
 * Subtle, refined interactions that feel like watching
 * shadows move with the sun.
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const testimonialSlider = document.getElementById('testimonialSlider');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    const enrollForm = document.getElementById('enrollForm');

    // ============================================
    // Navigation
    // ============================================

    // Scroll-based navigation styling
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Reveal Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = [
        '.section-header',
        '.philosophy-text',
        '.philosophy-visual',
        '.principle',
        '.workshop-card',
        '.master-card',
        '.gallery-item',
        '.enroll-content'
    ];

    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in');
            fadeInObserver.observe(el);
        });
    });

    // ============================================
    // Testimonial Slider
    // ============================================
    let currentTestimonial = 0;
    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    let testimonialInterval;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
        testimonialBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(next);
    }

    function startTestimonialAutoplay() {
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    function stopTestimonialAutoplay() {
        clearInterval(testimonialInterval);
    }

    // Initialize testimonials
    testimonialBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            stopTestimonialAutoplay();
            showTestimonial(index);
            startTestimonialAutoplay();
        });
    });

    // Set first button as active
    testimonialBtns[0].classList.add('active');
    startTestimonialAutoplay();

    // Pause autoplay on hover
    testimonialSlider.addEventListener('mouseenter', stopTestimonialAutoplay);
    testimonialSlider.addEventListener('mouseleave', startTestimonialAutoplay);

    // ============================================
    // Tonal Bars Interactive Effect
    // ============================================
    const tonalBars = document.querySelectorAll('.tonal-bar');

    tonalBars.forEach((bar, index) => {
        bar.addEventListener('mouseenter', function() {
            // Create wave effect on neighboring bars
            tonalBars.forEach((otherBar, otherIndex) => {
                const distance = Math.abs(index - otherIndex);
                const scale = Math.max(1 - distance * 0.1, 0.9);
                const delay = distance * 30;

                setTimeout(() => {
                    otherBar.style.transform = `scaleY(${scale + 0.1})`;
                }, delay);
            });
        });

        bar.addEventListener('mouseleave', function() {
            tonalBars.forEach(otherBar => {
                otherBar.style.transform = 'scaleY(1)';
            });
        });
    });

    // ============================================
    // Form Handling
    // ============================================
    enrollForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Add loading state to button
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Reset form
            enrollForm.reset();

            // Show success state
            submitBtn.textContent = 'Request Received';
            submitBtn.style.backgroundColor = 'var(--gray-600)';

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);

            console.log('Form submitted:', data);
        }, 1500);
    });

    // ============================================
    // Gallery Hover Effects
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Dim other gallery items
            galleryItems.forEach(other => {
                if (other !== item) {
                    other.style.opacity = '0.5';
                    other.style.filter = 'brightness(0.7)';
                }
            });
        });

        item.addEventListener('mouseleave', function() {
            galleryItems.forEach(other => {
                other.style.opacity = '1';
                other.style.filter = 'brightness(1)';
            });
        });
    });

    // ============================================
    // Parallax Effect for Hero
    // ============================================
    const heroGradient = document.querySelector('.hero-gradient');

    if (heroGradient && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrolled < heroHeight) {
                const translateY = scrolled * 0.3;
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                heroGradient.style.transform = `translateY(${translateY}px)`;
                heroGradient.style.opacity = opacity;
            }
        });
    }

    // ============================================
    // Workshop Cards Stagger Animation
    // ============================================
    const workshopCards = document.querySelectorAll('.workshop-card');

    const workshopObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                workshopObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    workshopCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        workshopObserver.observe(card);
    });

    // ============================================
    // Master Cards Stagger Animation
    // ============================================
    const masterCards = document.querySelectorAll('.master-card');

    const masterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                masterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    masterCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        masterObserver.observe(card);
    });

    // ============================================
    // Cursor Shadow Effect (Desktop Only)
    // ============================================
    if (window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        const hero = document.querySelector('.hero');

        hero.addEventListener('mousemove', function(e) {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            heroGradient.style.background = `
                radial-gradient(ellipse at ${x}% ${y}%, rgba(64, 64, 64, 0.5) 0%, transparent 50%),
                radial-gradient(ellipse at ${100 - x}% ${100 - y}%, rgba(38, 38, 38, 0.6) 0%, transparent 50%),
                linear-gradient(180deg, var(--gray-900) 0%, var(--black) 50%, var(--gray-900) 100%)
            `;
        });

        hero.addEventListener('mouseleave', function() {
            heroGradient.style.background = `
                radial-gradient(ellipse at 30% 20%, rgba(64, 64, 64, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(38, 38, 38, 0.6) 0%, transparent 50%),
                linear-gradient(180deg, var(--gray-900) 0%, var(--black) 50%, var(--gray-900) 100%)
            `;
        });
    }

    // ============================================
    // Section Number Counter Animation
    // ============================================
    const sectionNumbers = document.querySelectorAll('.section-number');

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sectionNumbers.forEach(num => {
        num.style.opacity = '0';
        num.style.transform = 'translateX(-20px)';
        num.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        numberObserver.observe(num);
    });

    // ============================================
    // Principle Cards Hover Effect
    // ============================================
    const principles = document.querySelectorAll('.principle');

    principles.forEach(principle => {
        const icon = principle.querySelector('.principle-icon svg');

        principle.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        principle.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });

    // ============================================
    // Active Navigation Highlight
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function updateActiveNav() {
        const scrollY = window.scrollY + nav.offsetHeight + 100;

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

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // Initial Load Animations
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('loaded');
    });

    // ============================================
    // Keyboard Navigation Enhancement
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Tab focus styling
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

})();
