/**
 * FROSTBITE - Nordic Noir Landing Page
 * JavaScript for atmospheric animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollAnimations.init();
    CounterAnimation.init();
    CaseFilter.init();
    AudioPlayer.init();
    FormHandler.init();
});

/**
 * Navigation Module
 * Handles sticky nav and mobile menu
 */
const Navigation = {
    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.links = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Scroll event for sticky nav
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.navItems.forEach(item => {
            item.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && this.links.classList.contains('active')) {
                this.closeMenu();
            }
        });
    },

    handleScroll() {
        if (window.scrollY > 100) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    },

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('active');
        document.body.style.overflow = this.links.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu() {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Scroll Animations Module
 * Reveals elements as they enter viewport
 */
const ScrollAnimations = {
    init() {
        this.elements = document.querySelectorAll('.section-header, .case-card, .evidence-card, .feature, .cta-content, .footer-brand, .footer-links');

        // Add reveal class to elements
        this.elements.forEach((el, index) => {
            el.classList.add('reveal');
            if (index % 4 === 1) el.classList.add('reveal-delay-1');
            if (index % 4 === 2) el.classList.add('reveal-delay-2');
            if (index % 4 === 3) el.classList.add('reveal-delay-3');
        });

        this.observeElements();
    },

    observeElements() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));
    }
};

/**
 * Counter Animation Module
 * Animates statistics numbers on scroll
 */
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.animated = false;

        this.observeStats();
    },

    observeStats() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateCounters();
                    observer.disconnect();
                }
            });
        }, options);

        if (this.counters.length > 0) {
            observer.observe(this.counters[0].closest('.hero-stats'));
        }
    },

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();
            const isFloat = target % 1 !== 0;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out-cubic)
                const easeOut = 1 - Math.pow(1 - progress, 3);

                const current = target * easeOut;

                if (isFloat) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = isFloat ? target.toFixed(1) : target;
                }
            };

            requestAnimationFrame(animate);
        });
    }
};

/**
 * Case Filter Module
 * Filters case cards by category
 */
const CaseFilter = {
    init() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.cards = document.querySelectorAll('.case-card');

        if (this.filterBtns.length === 0) return;

        this.bindEvents();
    },

    bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    },

    handleFilter(e) {
        const filter = e.target.dataset.filter;

        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter cards with animation
        this.cards.forEach((card, index) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;

            // Reset animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                if (shouldShow) {
                    card.style.display = 'block';
                    // Staggered reveal
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.display = 'none';
                }
            }, 300);
        });
    }
};

/**
 * Audio Player Module
 * Simulates podcast player interactions
 */
const AudioPlayer = {
    init() {
        this.playBtn = document.querySelector('.control-play');
        this.progressFill = document.querySelector('.progress-fill');
        this.waveformBars = document.querySelectorAll('.waveform-bar');
        this.isPlaying = false;

        if (!this.playBtn) return;

        this.bindEvents();
    },

    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
    },

    togglePlay() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            this.playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
            this.startWaveform();
        } else {
            this.playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
            this.stopWaveform();
        }
    },

    startWaveform() {
        this.waveformBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    },

    stopWaveform() {
        this.waveformBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }
};

/**
 * Form Handler Module
 * Handles newsletter form submission
 */
const FormHandler = {
    init() {
        this.form = document.querySelector('.cta-form');

        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();

        const input = this.form.querySelector('.form-input');
        const btn = this.form.querySelector('.btn');
        const originalText = btn.querySelector('.btn-text').textContent;

        // Validate email
        if (!this.validateEmail(input.value)) {
            this.showError(input);
            return;
        }

        // Simulate submission
        btn.querySelector('.btn-text').textContent = 'Requesting...';
        btn.disabled = true;

        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Access Granted';
            btn.style.background = '#374151';
            input.value = '';

            // Reset after delay
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showError(input) {
        input.style.borderColor = '#b91c1c';
        input.classList.add('shake');

        setTimeout(() => {
            input.style.borderColor = '';
            input.classList.remove('shake');
        }, 500);
    }
};

/**
 * Parallax Effect for Hero Section
 * Subtle movement on mouse move
 */
const ParallaxHero = {
    init() {
        this.hero = document.querySelector('.hero');
        this.content = document.querySelector('.hero-content');

        if (!this.hero || !this.content) return;

        this.bindEvents();
    },

    bindEvents() {
        this.hero.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    },

    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 20;
        const yPos = (clientY / innerHeight - 0.5) * 20;

        this.content.style.transform = `translate(${xPos * 0.3}px, ${yPos * 0.3}px)`;
    }
};

// Initialize parallax
ParallaxHero.init();

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Typewriter Effect for Hero Title
 * Creates noir-style reveal
 */
const TypewriterEffect = {
    init() {
        // Optionally add typewriter effect to specific elements
        // Currently handled by CSS animations for better performance
    }
};

/**
 * Add shake animation keyframes via JS
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

/**
 * Console Easter Egg
 * For curious investigators
 */
console.log(`
%c◈ FROSTBITE INVESTIGATIONS ◈
%c────────────────────────────────
Some cases never freeze.
The truth is waiting to be found.

Interested in the investigation?
Submit your tips: frostbite.fm/tips
────────────────────────────────
`,
'font-family: monospace; font-size: 16px; color: #b91c1c; font-weight: bold;',
'font-family: monospace; font-size: 12px; color: #6b7280;'
);
