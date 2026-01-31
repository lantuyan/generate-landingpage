/* ============================================
   NEON GRID ARCADE - JavaScript
   Retro-Futuristic Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileNav();
    initScrollAnimations();
    initCounterAnimation();
    initWorldSelector();
    initFormEffects();
    initParallaxEffects();
    initGlitchEffect();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                document.querySelector('.nav-links').classList.remove('active');
                document.querySelector('.nav-toggle').classList.remove('active');
            }
        });
    });
}

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = [
        ...document.querySelectorAll('.experience-card'),
        ...document.querySelectorAll('.feature-item'),
        ...document.querySelectorAll('.pricing-card'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.location-info'),
        ...document.querySelectorAll('.location-map'),
        ...document.querySelectorAll('.cta-content')
    ];

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
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
    };

    // Observer for stats section
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
}

/* ============================================
   WORLD SELECTOR
   ============================================ */
function initWorldSelector() {
    const worldBtns = document.querySelectorAll('.world-btn');
    const worldItems = document.querySelectorAll('.world-item');

    worldBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetWorld = btn.dataset.target;

            // Update buttons
            worldBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update world items with animation
            worldItems.forEach(item => {
                if (item.dataset.world === targetWorld) {
                    item.style.display = 'grid';
                    // Trigger reflow for animation
                    item.offsetHeight;
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                    setTimeout(() => {
                        if (!item.classList.contains('active')) {
                            item.style.display = 'none';
                        }
                    }, 600);
                }
            });
        });
    });
}

/* ============================================
   FORM EFFECTS
   ============================================ */
function initFormEffects() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'PROCESSING...';
        submitBtn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'BOOKING CONFIRMED!';
            submitBtn.style.background = 'linear-gradient(90deg, #00ff00, #00ffff)';

            // Reset after delay
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        }, 2000);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    const sun = document.querySelector('.sun');
    const mountains = document.querySelector('.mountains');
    const gridFloor = document.querySelector('.grid-floor');

    if (!hero || !sun) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxValue = scrolled * 0.3;
            const opacityValue = 1 - (scrolled / heroHeight);

            if (sun) {
                sun.style.transform = `translateX(-50%) translateY(${parallaxValue * 0.5}px)`;
            }

            if (mountains) {
                mountains.style.transform = `translateY(${parallaxValue * 0.2}px)`;
            }

            if (gridFloor) {
                gridFloor.style.opacity = Math.max(0.3, opacityValue);
            }
        }
    });

    // Mouse parallax for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const moveX = (clientX - innerWidth / 2) / innerWidth * 20;
            const moveY = (clientY - innerHeight / 2) / innerHeight * 20;

            heroContent.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        });
    }
}

/* ============================================
   GLITCH EFFECT
   ============================================ */
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(el => {
        // Random glitch trigger
        setInterval(() => {
            if (Math.random() > 0.95) {
                el.classList.add('glitching');
                setTimeout(() => {
                    el.classList.remove('glitching');
                }, 200);
            }
        }, 100);
    });
}

/* ============================================
   TYPING EFFECT (Optional)
   ============================================ */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ============================================
   NEON CURSOR TRAIL (Optional Enhancement)
   ============================================ */
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.3}px;
            height: ${8 - i * 0.3}px;
            background: linear-gradient(90deg, #ff00ff, #00ffff);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: ${1 - i * 0.05};
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];

            dot.style.left = x + 'px';
            dot.style.top = y + 'px';

            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

/* ============================================
   VHS EFFECT (Optional Enhancement)
   ============================================ */
function initVHSEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9997;
        opacity: 0.03;
        mix-blend-mode: overlay;
    `;

    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function noise() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(noise);
    }

    window.addEventListener('resize', resize);
    resize();
    noise();
}

/* ============================================
   AUDIO VISUALIZER (Optional Enhancement)
   ============================================ */
class SynthwaveVisualizer {
    constructor() {
        this.bars = [];
        this.container = null;
    }

    create(containerId, barCount = 32) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar';
            bar.style.cssText = `
                width: ${100 / barCount}%;
                height: ${Math.random() * 50 + 10}%;
                background: linear-gradient(180deg, #ff00ff, #00ffff);
                transition: height 0.1s ease;
            `;
            this.container.appendChild(bar);
            this.bars.push(bar);
        }

        this.animate();
    }

    animate() {
        this.bars.forEach(bar => {
            bar.style.height = `${Math.random() * 80 + 20}%`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

/* ============================================
   LOADING SCREEN (Optional Enhancement)
   ============================================ */
function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">NEON<span>GRID</span></div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
            <div class="loader-text">INITIALIZING VIRTUAL REALITY...</div>
        </div>
    `;

    loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: #0a0a0f;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;

    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1500);
    });
}

/* ============================================
   EASTER EGG - Konami Code
   ============================================ */
function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    // Rainbow mode!
    document.body.style.animation = 'rainbow 2s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 10000);
}

// Initialize Konami Code
initKonamiCode();

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Debounce function for scroll events
function debounce(func, wait = 10) {
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
function throttle(func, limit = 16) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll handlers
window.addEventListener('scroll', throttle(() => {
    // Heavy scroll calculations here
}, 16));

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */
// Skip to main content
function initAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#experiences';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-magenta);
        color: white;
        padding: 10px 20px;
        z-index: 10001;
        transition: top 0.3s ease;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '20px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });

    document.body.prepend(skipLink);

    // Reduce motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-medium', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }
}

initAccessibility();
