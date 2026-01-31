/**
 * URBEX - Metropolitan Landing Page
 * Urban Cultural Experiences Platform
 * Interactive JavaScript Module
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    DistrictTabs.init();
    CounterAnimation.init();
    FormHandler.init();
    SmoothScroll.init();
});

/**
 * Navigation Module
 * Handles navbar scroll state and mobile menu
 */
const Navigation = {
    nav: null,
    toggle: null,
    mobileMenu: null,
    scrollThreshold: 50,

    init() {
        this.nav = document.getElementById('nav');
        this.toggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');

        if (!this.nav) return;

        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll();

        // Mobile menu toggle
        if (this.toggle && this.mobileMenu) {
            this.toggle.addEventListener('click', () => this.toggleMobileMenu());

            // Close menu when clicking links
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }
    },

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    },

    toggleMobileMenu() {
        this.toggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.toggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Scroll Animations Module
 * Reveals elements on scroll using Intersection Observer
 */
const ScrollAnimations = {
    observer: null,

    init() {
        // Add reveal classes to elements
        this.addRevealClasses();

        // Create intersection observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            }
        );

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            this.observer.observe(el);
        });
    },

    addRevealClasses() {
        // Section headers
        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('reveal');
        });

        // Experience cards with stagger
        document.querySelectorAll('.experience-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // City cards with stagger
        document.querySelectorAll('.city-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // Story cards
        document.querySelectorAll('.story-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.15}s`;
        });

        // District showcase
        document.querySelectorAll('.district-showcase').forEach(el => {
            el.classList.add('reveal');
        });

        // Join section
        document.querySelectorAll('.join-content').forEach(el => {
            el.classList.add('reveal');
        });
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after animation
                // this.observer.unobserve(entry.target);
            }
        });
    }
};

/**
 * District Tabs Module
 * Handles tabbed content switching with animations
 */
const DistrictTabs = {
    tabs: null,
    panels: null,
    activeTab: 'art',

    init() {
        this.tabs = document.querySelectorAll('.district-tab');
        this.panels = document.querySelectorAll('.district-panel');

        if (this.tabs.length === 0) return;

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    },

    switchTab(clickedTab) {
        const district = clickedTab.dataset.district;
        if (district === this.activeTab) return;

        // Update tabs
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.district === district);
        });

        // Update panels with fade animation
        this.panels.forEach(panel => {
            const isActive = panel.dataset.district === district;

            if (isActive) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        this.activeTab = district;
    }
};

/**
 * Counter Animation Module
 * Animates numbers counting up on scroll
 */
const CounterAnimation = {
    counters: null,
    observed: false,

    init() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        if (this.counters.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observed) {
                        this.observed = true;
                        this.animateCounters();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(document.querySelector('.hero-stats'));
    },

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }
};

/**
 * Form Handler Module
 * Handles form validation and submission
 */
const FormHandler = {
    form: null,

    init() {
        this.form = document.getElementById('joinForm');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add floating label effect
        this.form.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('focus', () => this.handleFocus(field));
            field.addEventListener('blur', () => this.handleBlur(field));
        });
    },

    handleFocus(field) {
        field.parentElement.classList.add('focused');
    },

    handleBlur(field) {
        if (!field.value) {
            field.parentElement.classList.remove('focused');
        }
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Validate
        if (!this.validate(data)) return;

        // Show success state
        this.showSuccess();

        // In a real app, you'd send data to server here
        console.log('Form submitted:', data);
    },

    validate(data) {
        let isValid = true;

        // Simple validation
        if (!data.name || data.name.trim().length < 2) {
            this.showError('name', 'Please enter your name');
            isValid = false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            this.showError('email', 'Please enter a valid email');
            isValid = false;
        }

        if (!data.city) {
            this.showError('city', 'Please select your city');
            isValid = false;
        }

        if (!data.interest) {
            this.showError('interest', 'Please select your interest');
            isValid = false;
        }

        return isValid;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#e94560';
            // Could add error message display here
        }
    },

    showSuccess() {
        const btn = this.form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = `
            <span>Welcome to URBEX!</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        `;
        btn.style.background = '#10b981';
        btn.disabled = true;

        // Reset form
        this.form.reset();

        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
};

/**
 * Smooth Scroll Module
 * Handles anchor link smooth scrolling
 */
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

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

/**
 * Parallax Effect (Optional Enhancement)
 * Adds subtle parallax to hero visual elements
 */
const ParallaxEffect = {
    elements: null,

    init() {
        this.elements = document.querySelectorAll('.visual-block');
        if (this.elements.length === 0 || this.isReducedMotion()) return;

        window.addEventListener('scroll', () => this.handleScroll());
    },

    isReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

        if (scrollY > heroHeight) return;

        this.elements.forEach((el, i) => {
            const speed = 0.1 + (i * 0.02);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
};

/**
 * Cursor Effect (Optional Enhancement)
 * Custom cursor that follows mouse with lag
 */
const CursorEffect = {
    cursor: null,
    isEnabled: false,

    init() {
        // Only enable on non-touch devices with larger screens
        if (this.isTouchDevice() || window.innerWidth < 1024) return;

        this.createCursor();
        this.bindEvents();
        this.isEnabled = true;
    },

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(233, 69, 96, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(this.cursor);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        // Expand cursor on interactive elements
        document.querySelectorAll('a, button, .experience-card, .city-card, .story-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.borderColor = 'rgba(233, 69, 96, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderColor = 'rgba(233, 69, 96, 0.5)';
            });
        });
    }
};

// Initialize optional enhancements
document.addEventListener('DOMContentLoaded', () => {
    ParallaxEffect.init();
    // CursorEffect.init(); // Uncomment to enable custom cursor
});

/**
 * Lazy Load Images (Future Enhancement)
 * Placeholder for image lazy loading when real images are added
 */
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};
