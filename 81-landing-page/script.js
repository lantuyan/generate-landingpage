/**
 * ATELIER - Luxury Fashion Rental
 * Refined interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    TestimonialSlider.init();
    SmoothScroll.init();
});

/**
 * Navigation Module
 * Handles nav scroll state and mobile menu
 */
const Navigation = {
    nav: null,
    toggle: null,
    mobileMenu: null,
    isOpen: false,

    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');

        if (!this.nav) return;

        // Scroll state
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Mobile menu toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    },

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.nav.classList.toggle('scrolled', scrolled);
    },

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.mobileMenu.classList.toggle('active', this.isOpen);
        this.toggle.classList.toggle('active', this.isOpen);
        document.body.style.overflow = this.isOpen ? 'hidden' : '';

        // Animate hamburger
        const spans = this.toggle.querySelectorAll('span');
        if (this.isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.transform = 'rotate(-45deg) translate(0, 0)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.transform = '';
        }
    },

    closeMenu() {
        if (this.isOpen) {
            this.toggleMenu();
        }
    }
};

/**
 * Scroll Animations Module
 * Reveals elements as they enter viewport
 */
const ScrollAnimations = {
    observerOptions: {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    },

    init() {
        this.animateStatementText();
        this.animateExperienceSteps();
        this.animateCollectionItems();
    },

    createObserver(callback) {
        return new IntersectionObserver(callback, this.observerOptions);
    },

    animateStatementText() {
        const revealTexts = document.querySelectorAll('.reveal-text');
        if (!revealTexts.length) return;

        const observer = this.createObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the reveal
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        });

        revealTexts.forEach(text => observer.observe(text));
    },

    animateExperienceSteps() {
        const steps = document.querySelectorAll('.experience-step');
        if (!steps.length) return;

        const observer = this.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });

        steps.forEach((step, index) => {
            step.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(step);
        });
    },

    animateCollectionItems() {
        const items = document.querySelectorAll('.collection-item');
        if (!items.length) return;

        const observer = this.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        });

        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
            observer.observe(item);
        });
    }
};

/**
 * Testimonial Slider Module
 * Elegant testimonial carousel
 */
const TestimonialSlider = {
    testimonials: [],
    dots: [],
    currentIndex: 0,
    autoPlayInterval: null,
    autoPlayDelay: 6000,

    init() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');

        if (!this.testimonials.length) return;

        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        const container = document.querySelector('.testimonial-slider');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    },

    goTo(index) {
        // Remove active class from current
        this.testimonials[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active class to new
        this.testimonials[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    },

    next() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goTo(nextIndex);
    },

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.goTo(prevIndex);
    },

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
};

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
};

/**
 * Form Handling
 * Elegant form submission with feedback
 */
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = ctaForm.querySelector('input');
        const button = ctaForm.querySelector('button');
        const email = input.value;

        if (!email) return;

        // Simulate submission
        button.textContent = 'Submitting...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Request Received';
            input.value = '';
            input.placeholder = 'Thank you for your interest';

            setTimeout(() => {
                button.textContent = 'Request Access';
                button.disabled = false;
                input.placeholder = 'Enter your email';
            }, 3000);
        }, 1500);
    });
}

/**
 * Parallax Effect for Hero
 * Subtle parallax on scroll
 */
const heroImage = document.querySelector('.hero-image-wrapper img');
if (heroImage) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;

                if (scrolled < window.innerHeight) {
                    heroImage.style.transform = `scale(1) translateY(${rate}px)`;
                }

                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });
}

/**
 * Cursor Enhancement
 * Subtle cursor effects on interactive elements
 */
const interactiveElements = document.querySelectorAll('a, button, .collection-item');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
    });

    el.addEventListener('mouseleave', () => {
        document.body.style.cursor = '';
    });
});

/**
 * Image Lazy Loading Enhancement
 * Fade in images as they load
 */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

lazyImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.8s ease';

    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }
});
