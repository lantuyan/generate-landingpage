/**
 * Retrograde Atelier - Mid-Century Modern Landing Page
 * Smooth, analog-feeling interactions
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        scrollThreshold: 100,
        animationOffset: 0.15,
        counterDuration: 2000,
        testimonialInterval: 6000,
        drawerEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };

    // ============================================
    // Navigation
    // ============================================
    const Navigation = {
        nav: document.querySelector('.nav'),
        toggle: document.querySelector('.nav-toggle'),
        links: document.querySelector('.nav-links'),
        lastScrollY: 0,
        ticking: false,

        init() {
            if (!this.nav) return;

            this.bindEvents();
            this.updateOnScroll();
        },

        bindEvents() {
            // Mobile toggle
            if (this.toggle) {
                this.toggle.addEventListener('click', () => this.toggleMobile());
            }

            // Close mobile menu on link click
            if (this.links) {
                this.links.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => this.closeMobile());
                });
            }

            // Scroll handling
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });

            // Close mobile menu on resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobile();
                }
            });
        },

        toggleMobile() {
            this.toggle.classList.toggle('active');
            this.links.classList.toggle('active');
            document.body.style.overflow = this.links.classList.contains('active') ? 'hidden' : '';
        },

        closeMobile() {
            this.toggle.classList.remove('active');
            this.links.classList.remove('active');
            document.body.style.overflow = '';
        },

        onScroll() {
            this.lastScrollY = window.scrollY;

            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateOnScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        },

        updateOnScroll() {
            // Add shadow when scrolled
            if (this.lastScrollY > CONFIG.scrollThreshold) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        }
    };

    // ============================================
    // Smooth Scroll
    // ============================================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
            });
        },

        handleClick(e, anchor) {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    // ============================================
    // Scroll Reveal Animations
    // ============================================
    const ScrollReveal = {
        elements: [],
        observer: null,

        init() {
            this.elements = document.querySelectorAll('[data-animate]');
            if (this.elements.length === 0) return;

            this.createObserver();
            this.observe();
        },

        createObserver() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: CONFIG.animationOffset
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);
        },

        observe() {
            this.elements.forEach(el => {
                this.observer.observe(el);
            });
        },

        animateElement(el) {
            // Add delay based on position in grid (for staggered effects)
            const siblings = el.parentElement.querySelectorAll('[data-animate]');
            const index = Array.from(siblings).indexOf(el);
            const delay = index * 100;

            setTimeout(() => {
                el.classList.add('animate-in');
            }, delay);
        }
    };

    // ============================================
    // Counter Animation
    // ============================================
    const CounterAnimation = {
        counters: [],
        observer: null,

        init() {
            this.counters = document.querySelectorAll('[data-count]');
            if (this.counters.length === 0) return;

            this.createObserver();
            this.observe();
        },

        createObserver() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);
        },

        observe() {
            this.counters.forEach(counter => {
                this.observer.observe(counter);
            });
        },

        animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = CONFIG.counterDuration;
            const startTime = performance.now();

            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.round(easedProgress * target);

                el.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Add plus sign for numbers that might be "and more"
                    if (target >= 100) {
                        el.textContent = target.toLocaleString() + '+';
                    }
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    // ============================================
    // Testimonials Carousel
    // ============================================
    const Testimonials = {
        testimonials: [
            {
                quote: "Retrograde Atelier didn't just restore my grandfather's Wegner chairs—they researched their history and discovered they were from an early production run. The documentation alone was worth the investment.",
                name: "Margaret Chen",
                title: "Private Collector, San Francisco"
            },
            {
                quote: "When our Eames lounge chair needed restoration, we trusted Retrograde with a piece that's been in our family for sixty years. The result exceeded our expectations—it looks exactly as it did in 1962.",
                name: "Robert Thornton",
                title: "Design Enthusiast, Palm Springs"
            },
            {
                quote: "Their authentication service helped us acquire a genuine Nakashima piece with complete confidence. Their expertise in provenance research is unmatched in the industry.",
                name: "Sarah & Michael Brooks",
                title: "Collectors, New York"
            }
        ],
        currentIndex: 0,
        container: null,
        dots: null,
        interval: null,

        init() {
            this.container = document.querySelector('.testimonial-card');
            this.dots = document.querySelectorAll('.testimonial-dots .dot');

            if (!this.container) return;

            this.bindEvents();
            this.startAutoPlay();
        },

        bindEvents() {
            const prevBtn = document.querySelector('.testimonial-prev');
            const nextBtn = document.querySelector('.testimonial-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prev();
                    this.resetAutoPlay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.next();
                    this.resetAutoPlay();
                });
            }

            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goTo(index);
                    this.resetAutoPlay();
                });
            });
        },

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
            this.update();
        },

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
            this.update();
        },

        goTo(index) {
            this.currentIndex = index;
            this.update();
        },

        update() {
            const testimonial = this.testimonials[this.currentIndex];

            // Animate out
            this.container.style.opacity = '0';
            this.container.style.transform = 'translateY(20px)';

            setTimeout(() => {
                // Update content
                const quote = this.container.querySelector('.testimonial-quote');
                const name = this.container.querySelector('.author-name');
                const title = this.container.querySelector('.author-title');

                if (quote) quote.textContent = testimonial.quote;
                if (name) name.textContent = testimonial.name;
                if (title) title.textContent = testimonial.title;

                // Animate in
                this.container.style.opacity = '1';
                this.container.style.transform = 'translateY(0)';
            }, 300);

            // Update dots
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        },

        startAutoPlay() {
            this.interval = setInterval(() => this.next(), CONFIG.testimonialInterval);
        },

        resetAutoPlay() {
            clearInterval(this.interval);
            this.startAutoPlay();
        }
    };

    // ============================================
    // Form Handling
    // ============================================
    const FormHandler = {
        form: null,

        init() {
            this.form = document.getElementById('contact-form');
            if (!this.form) return;

            this.bindEvents();
        },

        bindEvents() {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Add focus effects
            this.form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('focus', () => this.onFieldFocus(field));
                field.addEventListener('blur', () => this.onFieldBlur(field));
            });
        },

        onFieldFocus(field) {
            field.parentElement.classList.add('focused');
        },

        onFieldBlur(field) {
            field.parentElement.classList.remove('focused');
        },

        handleSubmit(e) {
            e.preventDefault();

            const button = this.form.querySelector('button[type="submit"]');
            const originalContent = button.innerHTML;

            // Animate button
            button.innerHTML = '<span>Sending...</span>';
            button.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                button.innerHTML = '<span>Message Sent!</span>';
                button.style.background = '#6B7B3F'; // Olive success color

                // Reset form
                setTimeout(() => {
                    this.form.reset();
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    button.style.background = '';
                }, 2000);
            }, 1500);
        }
    };

    // ============================================
    // Gallery Hover Effects
    // ============================================
    const GalleryEffects = {
        items: [],

        init() {
            this.items = document.querySelectorAll('.gallery-item');
            if (this.items.length === 0) return;

            this.bindEvents();
        },

        bindEvents() {
            this.items.forEach(item => {
                item.addEventListener('mouseenter', () => this.onHover(item));
                item.addEventListener('mouseleave', () => this.onLeave(item));
            });
        },

        onHover(item) {
            // Dim other items
            this.items.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.6';
                }
            });
        },

        onLeave(item) {
            // Reset all items
            this.items.forEach(otherItem => {
                otherItem.style.opacity = '';
            });
        }
    };

    // ============================================
    // Parallax Effects (subtle)
    // ============================================
    const ParallaxEffects = {
        elements: [],
        ticking: false,

        init() {
            // Only enable on desktop
            if (window.innerWidth < 1024) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.elements = [
                { el: document.querySelector('.hero-decoration-1'), speed: 0.05 },
                { el: document.querySelector('.hero-decoration-2'), speed: 0.03 },
                { el: document.querySelector('.hero-starburst'), speed: 0.02 }
            ].filter(item => item.el);

            if (this.elements.length === 0) return;

            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        },

        onScroll() {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        },

        update() {
            const scrollY = window.scrollY;

            this.elements.forEach(({ el, speed }) => {
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }
    };

    // ============================================
    // Cursor Effects (optional enhancement)
    // ============================================
    const CursorEffects = {
        cursor: null,
        isEnabled: false,

        init() {
            // Only on desktop with fine pointer
            if (window.matchMedia('(pointer: coarse)').matches) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.isEnabled = true;
            // Could add custom cursor here if desired
        }
    };

    // ============================================
    // Initialize Everything
    // ============================================
    const App = {
        init() {
            // Wait for DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.onReady());
            } else {
                this.onReady();
            }
        },

        onReady() {
            // Initialize all modules
            Navigation.init();
            SmoothScroll.init();
            ScrollReveal.init();
            CounterAnimation.init();
            Testimonials.init();
            FormHandler.init();
            GalleryEffects.init();
            ParallaxEffects.init();
            CursorEffects.init();

            // Add loaded class for initial animations
            document.body.classList.add('loaded');
        }
    };

    // Start the application
    App.init();

})();
