/**
 * FORMWERK - Bauhaus Landing Page
 * JavaScript Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileMenu();
    initParallaxShapes();
    initScrollAnimations();
    initSmoothScroll();
    initNetworkNodes();
    initCounterAnimation();
    initNavbarScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-cta');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Parallax effect for hero shapes
 */
function initParallaxShapes() {
    const shapes = document.querySelectorAll('.hero-shapes .shape');

    if (shapes.length === 0) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    });

    function animateShapes() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        shapes.forEach(shape => {
            const speed = parseFloat(shape.dataset.speed) || 0.05;
            const x = currentX * 100 * speed;
            const y = currentY * 100 * speed;

            // Preserve existing transform (rotation, etc.) and add translation
            const existingTransform = getComputedStyle(shape).transform;
            if (existingTransform !== 'none') {
                shape.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        requestAnimationFrame(animateShapes);
    }

    animateShapes();
}

/**
 * Scroll-based animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animationConfig = [
        { selector: '.manifesto-content', animation: 'fade-in' },
        { selector: '.manifesto-shape', animation: 'scale-in' },
        { selector: '.section-header', animation: 'fade-in' },
        { selector: '.space-card', animation: 'fade-in', stagger: true },
        { selector: '.principle', animation: 'fade-in', stagger: true },
        { selector: '.network-content', animation: 'slide-in-right' },
        { selector: '.network-visual', animation: 'slide-in-left' },
        { selector: '.feature', animation: 'fade-in', stagger: true },
        { selector: '.membership-card', animation: 'fade-in', stagger: true },
        { selector: '.cta-content', animation: 'scale-in' },
    ];

    animationConfig.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el, index) => {
            el.classList.add(config.animation);
            if (config.stagger) {
                el.classList.add(`stagger-${(index % 6) + 1}`);
            }
        });
    });

    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
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
 * Network nodes interactive animation
 */
function initNetworkNodes() {
    const nodes = document.querySelectorAll('.node');
    const lines = document.querySelectorAll('.network-line');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            // Pulse effect on hover
            const dot = node.querySelector('.node-dot');
            dot.style.animation = 'nodePulse 0.5s ease';

            // Highlight connected lines
            lines.forEach(line => {
                line.style.opacity = '0.6';
                line.style.strokeWidth = '3';
            });
        });

        node.addEventListener('mouseleave', () => {
            const dot = node.querySelector('.node-dot');
            dot.style.animation = '';

            lines.forEach(line => {
                line.style.opacity = '0.3';
                line.style.strokeWidth = '2';
            });
        });
    });

    // Add pulse animation to stylesheet
    const style = document.createElement('style');
    style.textContent = `
        @keyframes nodePulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(0, 0, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Animated counter for statistics
 */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasComma = text.includes(',');
    const cleanNumber = parseInt(text.replace(/[^0-9]/g, ''));

    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuart(frame / totalFrames);
        let currentNumber = Math.round(cleanNumber * progress);

        // Format number
        let formattedNumber = currentNumber.toString();
        if (hasComma && currentNumber >= 1000) {
            formattedNumber = currentNumber.toLocaleString();
        }
        if (hasPlus) {
            formattedNumber += '+';
        }

        element.textContent = formattedNumber;

        if (frame === totalFrames) {
            clearInterval(counter);
            // Restore original text
            element.textContent = text;
        }
    }, frameDuration);
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

/**
 * Navbar background change on scroll
 */
function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Add transition for smooth hide/show
    nav.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
}

/**
 * Button ripple effect
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();

        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleEffect 0.6s ease-out;
        `;

        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/**
 * Magnetic effect for CTA buttons
 */
document.querySelectorAll('.btn-primary, .btn-large').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

/**
 * Geometric cursor trail effect (optional - subtle)
 */
function initCursorTrail() {
    const trail = [];
    const trailLength = 5;
    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#E63946', '#FFB703', '#219EBC'];

    for (let i = 0; i < trailLength; i++) {
        const element = document.createElement('div');
        element.className = 'cursor-trail';
        element.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            width: ${10 - i * 1.5}px;
            height: ${10 - i * 1.5}px;
            background: ${colors[i % 3]};
            opacity: ${0.6 - i * 0.1};
            transition: transform 0.1s ease;
            ${shapes[i % 3] === 'circle' ? 'border-radius: 50%;' : ''}
            ${shapes[i % 3] === 'triangle' ? 'clip-path: polygon(50% 0%, 100% 100%, 0% 100%);' : ''}
        `;
        document.body.appendChild(element);
        trail.push({ element, x: 0, y: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            dot.x += (x - dot.x) * (0.3 - index * 0.04);
            dot.y += (y - dot.y) * (0.3 - index * 0.04);

            dot.element.style.left = dot.x + 'px';
            dot.element.style.top = dot.y + 'px';

            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(animateTrail);
    }

    // Only enable on non-touch devices
    if (!('ontouchstart' in window)) {
        animateTrail();
    }
}

// Uncomment to enable cursor trail
// initCursorTrail();

/**
 * Space cards - shape rotation on hover
 */
document.querySelectorAll('.space-card').forEach(card => {
    const shape = card.querySelector('.card-shape svg');
    if (!shape) return;

    card.addEventListener('mouseenter', () => {
        shape.style.transform = 'rotate(360deg) scale(1.1)';
        shape.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    card.addEventListener('mouseleave', () => {
        shape.style.transform = 'rotate(0deg) scale(1)';
    });
});

/**
 * Membership card tilt effect
 */
document.querySelectorAll('.membership-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        // Restore featured card scale
        if (this.classList.contains('featured')) {
            this.style.transform = 'scale(1.05)';
        }
    });
});

/**
 * Loading animation
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animations
    document.querySelectorAll('.hero .title-line').forEach((line, index) => {
        line.style.animationDelay = `${0.2 + index * 0.2}s`;
    });
});

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenu && mobileMenu.classList.contains('active')) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Prefers reduced motion support
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    document.documentElement.style.setProperty('--transition-mechanical', '0ms');

    // Remove animation classes
    document.querySelectorAll('[class*="animate"]').forEach(el => {
        el.style.animation = 'none';
    });
}
