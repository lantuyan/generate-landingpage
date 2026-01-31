/**
 * KineticPro - Performance Analytics Landing Page
 * JavaScript for kinetic animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initHeroParticles();
    initCounterAnimation();
    initScrollReveal();
    initMetricRings();
    initTechAnimation();
    initFormSubmission();
    initSmoothScroll();
    initParallaxEffect();
});

/**
 * Navbar scroll behavior
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Hero section particle animation
 */
function initHeroParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;

    // Set styles
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #0EA5E9, #F97316);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: ${Math.random() * 0.5 + 0.2};
        animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
    `;

    container.appendChild(particle);
}

// Add particle animation keyframes dynamically
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(30px, -30px) scale(1.2);
            opacity: 0.6;
        }
        50% {
            transform: translate(-20px, -60px) scale(0.8);
            opacity: 0.4;
        }
        75% {
            transform: translate(40px, -20px) scale(1.1);
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(particleStyle);

/**
 * Counter animation for hero stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutExpo(frame / totalFrames);
        const currentValue = target * progress;

        element.textContent = isDecimal
            ? currentValue.toFixed(1)
            : Math.round(currentValue);

        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }, frameDuration);
}

// Easing function for smooth animation
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.feature-card, .metric-card, .section-header, .tech-info, .data-node'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Add CSS for reveal animation
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.animate {
            opacity: 1;
            transform: translateY(0);
        }
        .feature-card.reveal {
            transition-delay: calc(var(--delay, 0) * 0.1s);
        }
    `;
    document.head.appendChild(revealStyle);

    // Set stagger delays for feature cards
    document.querySelectorAll('.feature-card').forEach((card, i) => {
        card.style.setProperty('--delay', i);
    });
}

/**
 * Metric ring progress animation
 */
function initMetricRings() {
    const rings = document.querySelectorAll('.ring-progress');

    // Add SVG gradient definition
    const svgNS = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.id = 'ringGradient';
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#0EA5E9');

    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', '#F97316');

    const stop3 = document.createElementNS(svgNS, 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', '#EF4444');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);

    // Append gradient to first SVG
    const firstRing = document.querySelector('.metric-ring');
    if (firstRing) {
        firstRing.insertBefore(defs, firstRing.firstChild);
    }

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                const circumference = 2 * Math.PI * 45; // radius = 45
                const offset = circumference - (progress / 100) * circumference;

                // Animate the stroke-dashoffset
                entry.target.style.strokeDashoffset = offset;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    rings.forEach(ring => observer.observe(ring));
}

/**
 * Technology section animation
 */
function initTechAnimation() {
    const techSection = document.querySelector('.technology');
    const techInfo = document.querySelector('.tech-info');
    const dataNodes = document.querySelectorAll('.data-node');

    if (!techSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                techInfo?.classList.add('animate');

                dataNodes.forEach((node, index) => {
                    setTimeout(() => {
                        node.classList.add('animate');
                    }, index * 200);
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(techSection);
}

/**
 * Form submission handling
 */
function initFormSubmission() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('.form-input');
        const button = form.querySelector('.form-submit');
        const originalText = button.querySelector('.submit-text').textContent;

        // Simulate submission
        button.querySelector('.submit-text').textContent = 'Launching...';
        button.disabled = true;

        setTimeout(() => {
            // Success state
            button.querySelector('.submit-text').textContent = 'Success!';
            input.value = '';
            input.placeholder = 'Welcome to KineticPro!';

            // Reset after delay
            setTimeout(() => {
                button.querySelector('.submit-text').textContent = originalText;
                button.disabled = false;
                input.placeholder = 'Enter your email';
            }, 3000);
        }, 1500);
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax effect for visual elements
 */
function initParallaxEffect() {
    const heroVisual = document.querySelector('.hero-visual');
    const motionLines = document.querySelectorAll('.motion-line');

    if (!heroVisual && motionLines.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Parallax for hero visual
                if (heroVisual) {
                    heroVisual.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
                }

                // Parallax for motion lines
                motionLines.forEach((line, index) => {
                    const speed = 0.1 + (index * 0.02);
                    line.style.transform = `translateY(${scrolled * speed}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Feature card velocity effect
 * Cards move slightly based on their velocity data attribute
 */
document.querySelectorAll('.feature-card').forEach(card => {
    const velocity = parseInt(card.dataset.velocity) || 1;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / (centerY / (velocity * 2));
        const rotateY = (centerX - x) / (centerX / (velocity * 2));

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
            translateX(4px)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/**
 * Testimonials infinite scroll
 * Clone cards for seamless loop
 */
function initTestimonialsScroll() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');

    // Clone cards for infinite scroll
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
}

// Initialize testimonials scroll
initTestimonialsScroll();

/**
 * Mouse trail effect (optional enhancement)
 */
function initMouseTrail() {
    if (window.innerWidth < 768) return;

    const trail = [];
    const trailLength = 10;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.5}px;
            height: ${8 - i * 0.5}px;
            background: linear-gradient(135deg, #0EA5E9, #F97316);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i * 0.1};
            transition: transform 0.${i}s ease-out;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateTrail() {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
                dot.style.transform = 'translate(-50%, -50%)';
            }, index * 30);
        });
        requestAnimationFrame(updateTrail);
    }

    updateTrail();
}

// Uncomment to enable mouse trail
// initMouseTrail();

/**
 * Scroll progress indicator
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0EA5E9, #F97316, #EF4444);
        z-index: 10000;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

initScrollProgress();

/**
 * Intersection Observer for fade-in animations
 */
function observeElements() {
    const elements = document.querySelectorAll('.section-header, .tech-feature, .cta-content');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}

observeElements();

/**
 * Velocity-based scroll animations
 * Elements move faster or slower based on scroll velocity
 */
let lastScrollTop = 0;
let scrollVelocity = 0;

window.addEventListener('scroll', () => {
    const st = window.pageYOffset;
    scrollVelocity = Math.abs(st - lastScrollTop);
    lastScrollTop = st;

    // Apply velocity-based effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        const velocity = parseInt(card.dataset.velocity) || 1;
        const offset = scrollVelocity * velocity * 0.05;
        card.style.setProperty('--velocity-offset', `${offset}px`);
    });
});

console.log('🚀 KineticPro initialized - Ready for motion!');
