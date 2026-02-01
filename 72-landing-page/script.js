/**
 * Realm Weaver - Fantasy/Mystical Landing Page
 * Magical animations and interactive effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMagicParticles();
    initNavigation();
    initScrollAnimations();
    initFormMagic();
    initParallaxEffects();
    initMagicalHovers();
});

/**
 * Magic Particles System
 * Creates floating magical particles throughout the page
 */
function initMagicParticles() {
    const particleContainer = document.getElementById('particles');
    if (!particleContainer) return;

    const particleCount = 50;
    const colors = ['#c9a227', '#e6c349', '#9d7bc4', '#00d4ff', '#ff6bef'];

    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer, colors);
    }
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;

    // Add glow effect
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    container.appendChild(particle);
}

/**
 * Navigation System
 * Handles scroll effects and mobile menu
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect for navigation
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 * Reveals elements as they enter the viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Add sparkle effect on animated elements
    animatedElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            createSparkleEffect(el);
        });
    });
}

/**
 * Sparkle Effect
 * Creates magical sparkles on hover
 */
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;

        sparkle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #c9a227;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px #c9a227, 0 0 20px #e6c349;
            animation: sparkle-fade 0.8s ease-out forwards;
        `;

        element.style.position = 'relative';
        element.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 800);
    }
}

// Add sparkle animation to stylesheet
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle-fade {
        0% {
            opacity: 1;
            transform: scale(0) translateY(0);
        }
        50% {
            opacity: 1;
            transform: scale(1) translateY(-10px);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) translateY(-20px);
        }
    }
`;
document.head.appendChild(sparkleStyle);

/**
 * Form Magic
 * Handles form submission with magical effects
 */
function initFormMagic() {
    const form = document.getElementById('summonForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');

        if (!email.value) return;

        // Add magical submission effect
        button.disabled = true;
        button.innerHTML = `
            <span class="btn-glow"></span>
            <span class="btn-text">Summoning...</span>
        `;

        // Create portal effect
        createPortalEffect(button);

        // Simulate submission
        setTimeout(() => {
            button.innerHTML = `
                <span class="btn-glow"></span>
                <span class="btn-text">Quest Accepted!</span>
            `;
            button.style.background = 'linear-gradient(135deg, #2d7a4a, #1a4d2e)';

            // Create success sparkles
            for (let i = 0; i < 20; i++) {
                setTimeout(() => createSuccessSparkle(button), i * 50);
            }

            email.value = '';

            // Reset button after delay
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = `
                    <span class="btn-glow"></span>
                    <span class="btn-text">Begin Your Legend</span>
                    <span class="btn-sparkle"></span>
                `;
                button.style.background = '';
            }, 3000);
        }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            createMagicRing(input);
        });
    });
}

function createPortalEffect(element) {
    const portal = document.createElement('div');
    portal.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(107, 63, 160, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        animation: portal-expand 0.8s ease-out forwards;
    `;

    element.style.position = 'relative';
    element.appendChild(portal);

    setTimeout(() => portal.remove(), 800);
}

function createSuccessSparkle(element) {
    const sparkle = document.createElement('div');
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const size = Math.random() * 6 + 2;

    sparkle.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${size}px;
        height: ${size}px;
        background: #c9a227;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 0 10px #c9a227;
        animation: success-sparkle 1s ease-out forwards;
        --tx: ${Math.cos(angle) * distance}px;
        --ty: ${Math.sin(angle) * distance}px;
    `;

    element.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

function createMagicRing(element) {
    const ring = document.createElement('div');
    const rect = element.getBoundingClientRect();

    ring.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border: 2px solid rgba(201, 162, 39, 0.5);
        border-radius: 4px;
        pointer-events: none;
        animation: magic-ring-pulse 0.6s ease-out forwards;
    `;

    const wrapper = element.parentElement;
    wrapper.style.position = 'relative';
    wrapper.appendChild(ring);

    setTimeout(() => ring.remove(), 600);
}

// Add additional animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes portal-expand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }

    @keyframes success-sparkle {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
            opacity: 0;
        }
    }

    @keyframes magic-ring-pulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

/**
 * Parallax Effects
 * Subtle depth effects on scroll
 */
function initParallaxEffects() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
            const heroContent = hero.querySelector('.hero-content');
            const fogOverlay = document.querySelector('.fog-overlay');

            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / heroHeight) * 0.5;
            }

            if (fogOverlay) {
                fogOverlay.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/**
 * Magical Hover Effects
 * Enhanced interactions for cards and buttons
 */
function initMagicalHovers() {
    // Card hover glow effect
    const cards = document.querySelectorAll('.discovery-card, .realm-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Button magical trail
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            createButtonAura(button);
        });
    });

    // Treasure orb pulse on hover
    const orbs = document.querySelectorAll('.treasure-orb');

    orbs.forEach(orb => {
        orb.addEventListener('mouseenter', () => {
            orb.style.animation = 'orb-pulse 0.5s ease-out';
            setTimeout(() => {
                orb.style.animation = '';
            }, 500);
        });
    });

    // Navigation link magical underline
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            createMagicUnderline(link);
        });
    });
}

function createButtonAura(button) {
    const aura = document.createElement('div');
    aura.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: -1;
        background: radial-gradient(circle at center, rgba(201, 162, 39, 0.3) 0%, transparent 70%);
        animation: aura-pulse 0.6s ease-out forwards;
    `;

    button.style.position = 'relative';
    button.appendChild(aura);

    setTimeout(() => aura.remove(), 600);
}

function createMagicUnderline(link) {
    const underline = document.createElement('span');
    underline.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #c9a227, transparent);
        animation: underline-grow 0.3s ease-out forwards;
    `;

    link.style.position = 'relative';
    link.appendChild(underline);

    link.addEventListener('mouseleave', () => {
        underline.remove();
    }, { once: true });
}

// Add orb and underline animations
const hoverStyles = document.createElement('style');
hoverStyles.textContent = `
    @keyframes orb-pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 40px rgba(107, 63, 160, 0.4);
        }
        50% {
            transform: scale(1.15);
            box-shadow: 0 0 60px rgba(201, 162, 39, 0.6);
        }
        100% {
            transform: scale(1.1);
            box-shadow: 0 0 60px rgba(201, 162, 39, 0.5);
        }
    }

    @keyframes aura-pulse {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: scale(1.2);
        }
    }

    @keyframes underline-grow {
        0% {
            width: 0;
            left: 50%;
        }
        100% {
            width: 100%;
            left: 0;
        }
    }

    /* Card glow following cursor */
    .discovery-card .card-frame::after,
    .realm-card::after,
    .testimonial-card::after {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .discovery-card:hover .card-frame::after,
    .realm-card:hover::after,
    .testimonial-card:hover::after {
        opacity: 1;
    }
`;
document.head.appendChild(hoverStyles);

/**
 * Typing Effect for Hero Title
 * Optional enhancement
 */
function initTypingEffect() {
    const titleMain = document.querySelector('.title-main');
    if (!titleMain) return;

    const text = titleMain.textContent;
    titleMain.textContent = '';
    titleMain.style.opacity = '1';

    let i = 0;
    function type() {
        if (i < text.length) {
            titleMain.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    // Start typing after a delay
    setTimeout(type, 500);
}

/**
 * Mouse Trail Effect
 * Creates magical cursor trail (optional, can be resource intensive)
 */
function initMouseTrail() {
    const trail = [];
    const trailLength = 10;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.5}px;
            height: ${8 - i * 0.5}px;
            background: rgba(201, 162, 39, ${1 - i * 0.1});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push({ el: dot, x: 0, y: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.forEach(dot => dot.el.style.opacity = '1');
    });

    document.addEventListener('mouseleave', () => {
        trail.forEach(dot => dot.el.style.opacity = '0');
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            const nextX = x;
            const nextY = y;

            dot.el.style.left = `${nextX - 4}px`;
            dot.el.style.top = `${nextY - 4}px`;

            x += (dot.x - x) * 0.3;
            y += (dot.y - y) * 0.3;

            dot.x = nextX;
            dot.y = nextY;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// Uncomment to enable optional features
// initTypingEffect();
// initMouseTrail();
