/**
 * AERO VELOCITY - Futurist Landing Page
 * Dynamic Motion Effects & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initCounterAnimation();
    initParallax();
    initFleetSelector();
    initFormEffects();
    initSpeedLines();
    initIntersectionAnimations();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll state
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Scroll state for navigation
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Scroll Effects Module
 * Smooth scrolling for anchor links
 */
function initScrollEffects() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
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
}

/**
 * Counter Animation Module
 * Animates stat numbers on scroll
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        animated = true;
    };

    // Trigger animation when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 500);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
}

/**
 * Parallax Effects Module
 * Creates depth through scroll-based movement
 */
function initParallax() {
    const parallaxElements = [
        { selector: '.hero-diagonal', speed: 0.3 },
        { selector: '.fleet-diagonal', speed: 0.2 },
        { selector: '.cta-diagonal', speed: 0.25 },
        { selector: '.trajectory-lines', speed: 0.4 }
    ];

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        parallaxElements.forEach(({ selector, speed }) => {
            const element = document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.style.transform = `translateY(${scrollY * speed}px)`;
                }
            }
        });
    });
}

/**
 * Fleet Selector Module
 * Handles fleet model switching
 */
function initFleetSelector() {
    const selectorBtns = document.querySelectorAll('.selector-btn');
    const fleetData = {
        swift: {
            tag: 'FLAGSHIP',
            name: 'SWIFT X-1',
            desc: 'Our premier urban cruiser. Designed for executive travel with whisper-quiet operation and luxurious cabin appointments.',
            specs: { range: '150 MI', capacity: '4 PAX', speed: '220 MPH' }
        },
        dash: {
            tag: 'COMMUTER',
            name: 'DASH E-2',
            desc: 'Built for the daily commute. Rapid boarding, efficient routing, and the fastest way across town.',
            specs: { range: '100 MI', capacity: '2 PAX', speed: '180 MPH' }
        },
        apex: {
            tag: 'CARGO',
            name: 'APEX V-3',
            desc: 'Heavy-lift capability for urgent deliveries. When ground transport simply will not do.',
            specs: { range: '200 MI', capacity: '500 LBS', speed: '160 MPH' }
        }
    };

    selectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const model = btn.getAttribute('data-model');
            const data = fleetData[model];

            // Update active state
            selectorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content with animation
            const fleetInfo = document.querySelector('.fleet-info');
            const specsOverlay = document.querySelector('.specs-overlay');

            // Fade out
            fleetInfo.style.opacity = '0';
            fleetInfo.style.transform = 'translateX(20px)';

            setTimeout(() => {
                // Update content
                fleetInfo.querySelector('.fleet-tag').textContent = data.tag;
                fleetInfo.querySelector('.fleet-name').textContent = data.name;
                fleetInfo.querySelector('.fleet-desc').textContent = data.desc;

                // Update specs
                const specValues = specsOverlay.querySelectorAll('.spec-value');
                specValues[0].textContent = data.specs.range;
                specValues[1].textContent = data.specs.capacity;
                specValues[2].textContent = data.specs.speed;

                // Fade in
                fleetInfo.style.opacity = '1';
                fleetInfo.style.transform = 'translateX(0)';
            }, 300);
        });
    });

    // Add transition styles
    const fleetInfo = document.querySelector('.fleet-info');
    if (fleetInfo) {
        fleetInfo.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
}

/**
 * Form Effects Module
 * Handles form submission and input effects
 */
function initFormEffects() {
    const form = document.getElementById('launch-form');
    const launchBtn = document.querySelector('.btn-launch');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Add launch animation
            launchBtn.classList.add('launching');
            launchBtn.innerHTML = `
                <span class="btn-text">LAUNCHING...</span>
                <span class="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                </span>
                <span class="btn-glow"></span>
            `;

            // Simulate submission
            setTimeout(() => {
                launchBtn.innerHTML = `
                    <span class="btn-text">CONFIRMED ✓</span>
                    <span class="btn-glow"></span>
                `;
                launchBtn.style.background = '#00d4ff';

                // Reset after delay
                setTimeout(() => {
                    form.reset();
                    launchBtn.innerHTML = `
                        <span class="btn-text">IGNITE</span>
                        <span class="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 19V5M5 12l7-7 7 7"/>
                            </svg>
                        </span>
                        <span class="btn-glow"></span>
                    `;
                    launchBtn.style.background = '';
                    launchBtn.classList.remove('launching');
                }, 2000);
            }, 1500);
        });
    }

    // Input focus effects
    const inputs = document.querySelectorAll('.form-group input, .form-group select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/**
 * Speed Lines Module
 * Creates dynamic speed line effects
 */
function initSpeedLines() {
    const speedLines = document.querySelector('.speed-lines');

    if (!speedLines) return;

    // Add random speed variation to existing lines
    const lines = speedLines.querySelectorAll('.speed-line');
    lines.forEach((line, index) => {
        const randomDelay = Math.random() * -8;
        const randomOpacity = 0.05 + Math.random() * 0.1;
        line.style.animationDelay = `${randomDelay}s`;
        line.style.opacity = randomOpacity;
    });

    // Create additional dynamic lines on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollSpeed = Math.abs(window.pageYOffset - (window.lastScrollY || 0));

                // Increase opacity based on scroll speed
                lines.forEach(line => {
                    const baseOpacity = 0.05;
                    const speedBonus = Math.min(scrollSpeed / 100, 0.2);
                    line.style.opacity = baseOpacity + speedBonus;
                });

                window.lastScrollY = window.pageYOffset;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Intersection Animations Module
 * Triggers animations when elements enter viewport
 */
function initIntersectionAnimations() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const animatedElements = [
        { selector: '.feature-card', animation: 'slideUp', stagger: 100 },
        { selector: '.route-card', animation: 'slideLeft', stagger: 150 },
        { selector: '.section-header', animation: 'fadeIn', stagger: 0 }
    ];

    const animations = {
        slideUp: {
            initial: { opacity: 0, transform: 'translateY(50px)' },
            animate: { opacity: 1, transform: 'translateY(0)' }
        },
        slideLeft: {
            initial: { opacity: 0, transform: 'translateX(50px)' },
            animate: { opacity: 1, transform: 'translateX(0)' }
        },
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        }
    };

    animatedElements.forEach(({ selector, animation, stagger }) => {
        const elements = document.querySelectorAll(selector);

        // Set initial state
        elements.forEach(el => {
            Object.assign(el.style, {
                ...animations[animation].initial,
                transition: 'opacity 0.6s ease, transform 0.6s ease'
            });
        });

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        Object.assign(entry.target.style, animations[animation].animate);
                    }, index * stagger);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    });
}

/**
 * Route Map Interaction
 * Handles route node interactions
 */
document.querySelectorAll('.node').forEach(node => {
    node.addEventListener('mouseenter', () => {
        // Highlight connected routes
        const nodeLabel = node.querySelector('.node-label');
        if (nodeLabel) {
            nodeLabel.style.opacity = '1';
        }
    });

    node.addEventListener('mouseleave', () => {
        const nodeLabel = node.querySelector('.node-label');
        if (nodeLabel) {
            nodeLabel.style.opacity = '';
        }
    });
});

/**
 * Tilt Effect for Feature Cards
 * Creates 3D tilt effect on hover
 */
document.querySelectorAll('[data-tilt]').forEach(card => {
    // Skip on mobile or reduced motion
    if (window.matchMedia('(max-width: 768px)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/**
 * Keyboard Navigation Enhancement
 */
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Performance: Throttle scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll-heavy operations
window.addEventListener('scroll', throttle(() => {
    // Any additional scroll-based logic here
}, 16)); // ~60fps
