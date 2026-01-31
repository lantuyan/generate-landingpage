/**
 * Origin Stories Coffee - Hand-Drawn/Illustrated Landing Page
 * Interactive animations and scroll-based effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initJourneyPath();
    initFormInteractions();
    initSVGAnimations();
    initParallax();

    // Mark page as loaded
    document.body.classList.add('loaded');
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    // Scroll detection for nav styling
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

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking links
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation delay for grid items
                if (entry.target.classList.contains('farmer-card') ||
                    entry.target.classList.contains('bean-card')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.15}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.journey-step, .farmer-card, .bean-card, .draw-in'
    );

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Journey path drawing animation
 */
function initJourneyPath() {
    const pathLine = document.querySelector('.path-line');

    if (!pathLine) return;

    // Reset path for animation
    const pathLength = pathLine.getTotalLength();
    pathLine.style.strokeDasharray = pathLength;
    pathLine.style.strokeDashoffset = pathLength;

    // Animate on scroll
    const journeySection = document.querySelector('.journey-section');

    const pathObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate path drawing
                pathLine.style.transition = 'stroke-dashoffset 2s ease-out';
                pathLine.style.strokeDashoffset = '0';
            }
        });
    }, { threshold: 0.3 });

    if (journeySection) {
        pathObserver.observe(journeySection);
    }
}

/**
 * Form interactions with hand-drawn feel
 */
function initFormInteractions() {
    const form = document.querySelector('.subscribe-form');
    const inputs = document.querySelectorAll('.form-input');

    // Add sketch effect on focus
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            addSketchEffect(input);
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });

        // Add slight "wobble" on input
        input.addEventListener('input', () => {
            input.style.transform = `rotate(${(Math.random() - 0.5) * 0.5}deg)`;
        });
    });

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('.btn-subscribe');
            const originalText = btn.innerHTML;

            // Animate button
            btn.innerHTML = '<span>Sending...</span>';
            btn.disabled = true;

            // Simulate submission
            setTimeout(() => {
                btn.innerHTML = '<span>Thank you!</span>';
                btn.classList.add('success');

                // Add celebration effect
                createConfetti(btn);

                // Reset after delay
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.classList.remove('success');
                    form.reset();
                }, 3000);
            }, 1500);
        });
    }
}

/**
 * Add sketch effect to element
 */
function addSketchEffect(element) {
    const rect = element.getBoundingClientRect();

    // Create temporary sketch line
    const sketch = document.createElement('div');
    sketch.className = 'temp-sketch';
    sketch.style.cssText = `
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C4A77D, transparent);
        transition: width 0.3s ease;
        pointer-events: none;
    `;

    element.parentElement.style.position = 'relative';
    element.parentElement.appendChild(sketch);

    requestAnimationFrame(() => {
        sketch.style.width = '100%';
    });

    // Remove after animation
    element.addEventListener('blur', () => {
        sketch.style.width = '0';
        setTimeout(() => sketch.remove(), 300);
    }, { once: true });
}

/**
 * Create confetti celebration effect
 */
function createConfetti(element) {
    const colors = ['#C4A77D', '#8B7355', '#6F4E37', '#3A6B1E', '#F4A460'];
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 1000;
        `;

        document.body.appendChild(confetti);

        // Animate
        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = Math.random() * 100 + 50;
        const spin = (Math.random() - 0.5) * 720;

        confetti.animate([
            {
                transform: 'translate(0, 0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity - 100}px) rotate(${spin}deg)`,
                opacity: 0
            }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
        }).onfinish = () => confetti.remove();
    }
}

/**
 * SVG-based animations
 */
function initSVGAnimations() {
    // Animate coffee steam
    animateSteam();

    // Animate coffee plants
    animatePlants();

    // Add hover interactions to illustrations
    addIllustrationInteractions();
}

/**
 * Animate steam effects
 */
function animateSteam() {
    // Add floating steam particles to coffee illustrations
    const steamContainers = document.querySelectorAll('.footer-illustration svg, .step-icon svg');

    steamContainers.forEach(container => {
        // Already has steam in SVG, just ensure animation runs
        const steamPaths = container.querySelectorAll('[opacity="0.6"], [opacity="0.7"]');
        steamPaths.forEach((path, i) => {
            path.style.animation = `steamFloat ${3 + i * 0.5}s ease-in-out infinite`;
            path.style.animationDelay = `${i * 0.2}s`;
        });
    });

    // Add keyframes if not present
    if (!document.querySelector('#steam-keyframes')) {
        const style = document.createElement('style');
        style.id = 'steam-keyframes';
        style.textContent = `
            @keyframes steamFloat {
                0%, 100% {
                    transform: translateY(0) scaleX(1);
                    opacity: 0.6;
                }
                50% {
                    transform: translateY(-5px) scaleX(1.1);
                    opacity: 0.3;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Animate coffee plants
 */
function animatePlants() {
    const plants = document.querySelectorAll('.coffee-plants path, .coffee-plants ellipse');

    plants.forEach((plant, i) => {
        plant.style.animation = `plantSway ${4 + Math.random() * 2}s ease-in-out infinite`;
        plant.style.animationDelay = `${i * 0.1}s`;
        plant.style.transformOrigin = 'bottom center';
    });

    if (!document.querySelector('#plant-keyframes')) {
        const style = document.createElement('style');
        style.id = 'plant-keyframes';
        style.textContent = `
            @keyframes plantSway {
                0%, 100% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Add hover interactions to illustrations
 */
function addIllustrationInteractions() {
    // Bean bags wiggle on hover
    const beanCards = document.querySelectorAll('.bean-card');

    beanCards.forEach(card => {
        const illustration = card.querySelector('.bean-illustration svg');

        card.addEventListener('mouseenter', () => {
            if (illustration) {
                illustration.style.animation = 'bagWiggle 0.5s ease';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (illustration) {
                illustration.style.animation = '';
            }
        });
    });

    // Farmer portraits react to hover
    const farmerCards = document.querySelectorAll('.farmer-card');

    farmerCards.forEach(card => {
        const portrait = card.querySelector('.portrait-frame');

        card.addEventListener('mouseenter', () => {
            if (portrait) {
                // Make eyes "look" at cursor (simplified)
                const eyes = portrait.querySelectorAll('circle[r="3"], circle[r="2.5"]');
                eyes.forEach(eye => {
                    eye.style.transform = 'translateX(1px)';
                    eye.style.transition = 'transform 0.2s ease';
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (portrait) {
                const eyes = portrait.querySelectorAll('circle[r="3"], circle[r="2.5"]');
                eyes.forEach(eye => {
                    eye.style.transform = 'translateX(0)';
                });
            }
        });
    });

    // Add wiggle keyframes
    if (!document.querySelector('#wiggle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'wiggle-keyframes';
        style.textContent = `
            @keyframes bagWiggle {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-3deg); }
                75% { transform: rotate(3deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Parallax effects
 */
function initParallax() {
    const parallaxElements = [
        { selector: '.hero-landscape', speed: 0.3 },
        { selector: '.deco-leaf.left', speed: 0.2 },
        { selector: '.deco-leaf.right', speed: 0.15 },
        { selector: '.deco-coffee-ring', speed: 0.1 }
    ];

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                parallaxElements.forEach(({ selector, speed }) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        const inView = rect.top < window.innerHeight && rect.bottom > 0;

                        if (inView) {
                            element.style.transform = `translateY(${scrollY * speed}px)`;
                        }
                    }
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Hand-drawn line animation utility
 * Creates the effect of a line being drawn
 */
function drawLine(svgPath, duration = 1000) {
    const length = svgPath.getTotalLength();

    svgPath.style.strokeDasharray = length;
    svgPath.style.strokeDashoffset = length;

    svgPath.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
    ], {
        duration: duration,
        easing: 'ease-out',
        fill: 'forwards'
    });
}

/**
 * Create hand-drawn underline effect
 */
function createHandDrawnUnderline(element) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    const width = element.offsetWidth;
    const height = 10;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.cssText = `
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: ${height}px;
        pointer-events: none;
        overflow: visible;
    `;

    // Create wavy line path
    const waviness = 2;
    let d = `M 0 ${height / 2}`;

    for (let x = 0; x <= width; x += 10) {
        const y = height / 2 + Math.sin(x / 15) * waviness + (Math.random() - 0.5) * waviness;
        d += ` L ${x} ${y}`;
    }

    path.setAttribute('d', d);
    path.setAttribute('stroke', '#C4A77D');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');

    svg.appendChild(path);
    element.style.position = 'relative';
    element.appendChild(svg);

    return path;
}

/**
 * Button ripple effect with organic shape
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/**
 * Cursor trail effect (subtle, organic)
 */
function initCursorTrail() {
    const trail = [];
    const trailLength = 5;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i}px;
            height: ${8 - i}px;
            background: #C4A77D;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${0.3 - i * 0.05};
            transition: transform 0.1s ease;
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

    function animate() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, i) => {
            const nextDot = trail[i + 1] || trail[0];

            dot.style.left = x + 'px';
            dot.style.top = y + 'px';

            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });

        requestAnimationFrame(animate);
    }

    // Only enable on desktop
    if (window.matchMedia('(min-width: 1024px)').matches) {
        animate();
    }
}

// Optional: Uncomment to enable cursor trail
// initCursorTrail();

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
        background: linear-gradient(90deg, #6F4E37, #C4A77D);
        z-index: 1001;
        transition: width 0.1s ease;
        border-radius: 0 2px 2px 0;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

initScrollProgress();

/**
 * Lazy load images with fade-in effect
 */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

initLazyLoad();

/**
 * Add "Add to bag" button functionality
 */
document.querySelectorAll('.btn-bean').forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.textContent;
        const card = this.closest('.bean-card');
        const beanName = card.querySelector('.bean-name').textContent;

        // Visual feedback
        this.textContent = 'Added!';
        this.style.background = '#3A6B1E';
        this.style.borderColor = '#3A6B1E';
        this.style.color = '#FFF8F0';

        // Create floating notification
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.textContent = `${beanName} added to your bag`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #5D4E37;
            color: #FFF8F0;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-family: 'Indie Flower', cursive;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });

        // Reset button and remove notification
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
            this.style.borderColor = '';
            this.style.color = '';

            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';

            setTimeout(() => notification.remove(), 300);
        }, 2000);
    });
});

/**
 * Accessibility: Reduce motion for users who prefer it
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-medium', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');

    // Disable animations
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
