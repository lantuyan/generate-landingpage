/* =====================================================
   NeuroPATH - Retro-futuristic with Parametric Calm
   JavaScript Interactions & Animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimations();
    initKineticFlicker();
    initNeonThread();
    initFormHandling();
});

/* =====================================================
   NAVIGATION
   ===================================================== */

function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const navToggle = document.querySelector('.nav-toggle');
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =====================================================
   MOBILE MENU
   ===================================================== */

function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

/* =====================================================
   SCROLL ANIMATIONS - REVEAL ON SCROLL
   ===================================================== */

function initScrollAnimations() {
    // Elements to animate
    const animatedElements = [
        '.section-header',
        '.timeline-item',
        '.feature-card',
        '.stat-card',
        '.science-quote',
        '.pricing-card',
        '.cta-content'
    ];

    // Add reveal class to elements
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            // Stagger delay for grid items
            if (selector === '.feature-card' || selector === '.stat-card' || selector === '.pricing-card') {
                el.classList.add(`reveal-delay-${(index % 3) + 1}`);
            }
        });
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Timeline items get special treatment
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
}

/* =====================================================
   COUNTER ANIMATIONS
   ===================================================== */

function initCounterAnimations() {
    const metrics = document.querySelectorAll('.metric-value[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(metric => {
        counterObserver.observe(metric);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function - easeOutExpo
        const easeProgress = 1 - Math.pow(2, -10 * progress);

        const current = target * easeProgress;

        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }

    requestAnimationFrame(update);
}

/* =====================================================
   KINETIC FLICKER - SUBTLE VIBRATION ENERGY
   ===================================================== */

function initKineticFlicker() {
    // Apply kinetic flicker to specific elements
    const flickerElements = [
        '.node-core',
        '.orbit-node',
        '.readout-value',
        '.stat-value'
    ];

    flickerElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('kinetic-flicker');
        });
    });

    // Synapse firing animation
    const synapses = document.querySelectorAll('.synapse');

    function fireSynapse() {
        const randomSynapse = synapses[Math.floor(Math.random() * synapses.length)];
        randomSynapse.style.transform = 'scale(2)';
        randomSynapse.style.opacity = '1';

        setTimeout(() => {
            randomSynapse.style.transform = '';
            randomSynapse.style.opacity = '';
        }, 300);
    }

    // Fire synapses at random intervals
    setInterval(fireSynapse, 1500);
}

/* =====================================================
   NEON THREAD - DYNAMIC PATH ANIMATION
   ===================================================== */

function initNeonThread() {
    const neonThread = document.querySelector('.neon-thread');
    if (!neonThread) return;

    // Update neon thread visibility based on scroll
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;

        // Adjust neon thread opacity based on scroll position
        const opacity = 0.2 + (scrollPercent * 0.3);
        neonThread.style.opacity = Math.min(opacity, 0.5);

        lastScrollTop = scrollTop;
    });
}

/* =====================================================
   PATHWAY VISUALIZATION - INTERACTIVE ORBITS
   ===================================================== */

function initPathwayVisualization() {
    const visualization = document.querySelector('.pathway-visualization');
    if (!visualization) return;

    // Add interactive hover effects
    const orbits = visualization.querySelectorAll('.pathway-orbit');

    orbits.forEach(orbit => {
        orbit.addEventListener('mouseenter', () => {
            orbit.style.animationPlayState = 'paused';
        });

        orbit.addEventListener('mouseleave', () => {
            orbit.style.animationPlayState = 'running';
        });
    });
}

/* =====================================================
   FORM HANDLING
   ===================================================== */

function initFormHandling() {
    const ctaForm = document.querySelector('.cta-form');

    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = ctaForm.querySelector('input[type="email"]');
            const button = ctaForm.querySelector('button');
            const originalText = button.querySelector('.btn-text').textContent;

            // Validate email
            if (!emailInput.value || !isValidEmail(emailInput.value)) {
                shakeElement(emailInput);
                return;
            }

            // Simulate form submission
            button.querySelector('.btn-text').textContent = 'Processing...';
            button.disabled = true;

            setTimeout(() => {
                button.querySelector('.btn-text').textContent = 'Welcome Aboard!';
                emailInput.value = '';

                // Add success animation
                button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                setTimeout(() => {
                    button.querySelector('.btn-text').textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 3000);
            }, 1500);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.style.borderColor = '#ef4444';

    setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
    }, 500);
}

// Add shake keyframes dynamically
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
    }
`;
document.head.appendChild(shakeStyles);

/* =====================================================
   PARALLAX EFFECTS
   ===================================================== */

function initParallax() {
    const rings = document.querySelectorAll('.ring');
    const ctaRings = document.querySelectorAll('.cta-ring');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        rings.forEach((ring, index) => {
            const speed = 0.05 * (index + 1);
            ring.style.transform = `translate(-50%, -50%) translateY(${scrollY * speed}px)`;
        });

        ctaRings.forEach((ring, index) => {
            const speed = 0.03 * (index + 1);
            ring.style.transform = `translate(-50%, -50%) scale(${1 + scrollY * speed * 0.0005})`;
        });
    });
}

/* =====================================================
   CURSOR GLOW EFFECT (Optional Enhancement)
   ===================================================== */

function initCursorGlow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const style = document.createElement('style');
    style.textContent = `
        .cursor-glow {
            position: fixed;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        body:hover .cursor-glow {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.1;
        cursorY += dy * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

/* =====================================================
   STAT RING ANIMATION
   ===================================================== */

function initStatRings() {
    const statRings = document.querySelectorAll('.stat-progress');

    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the stroke-dashoffset
                const ring = entry.target;
                const originalOffset = ring.style.strokeDashoffset ||
                    getComputedStyle(ring).strokeDashoffset;

                ring.style.strokeDashoffset = '283';

                requestAnimationFrame(() => {
                    ring.style.transition = 'stroke-dashoffset 1.5s ease-out';
                    ring.style.strokeDashoffset = originalOffset;
                });

                ringObserver.unobserve(ring);
            }
        });
    }, { threshold: 0.5 });

    statRings.forEach(ring => {
        ringObserver.observe(ring);
    });
}

// Initialize additional effects after page load
window.addEventListener('load', () => {
    initPathwayVisualization();
    initParallax();
    initStatRings();

    // Uncomment to enable cursor glow effect
    // initCursorGlow();
});

/* =====================================================
   PERFORMANCE OPTIMIZATION
   ===================================================== */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
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

// Optimize scroll performance
const optimizedScroll = throttle(() => {
    // Any heavy scroll operations go here
}, 16);

window.addEventListener('scroll', optimizedScroll, { passive: true });
