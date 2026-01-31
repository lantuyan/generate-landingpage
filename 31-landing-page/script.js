/**
 * NEXUS_UNDERGROUND - Cyberpunk Landing Page
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initRainEffect();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimations();
    initNetworkCanvas();
    initCodeRain();
    initGlitchEffects();
    initFormHandling();
    initSmoothScroll();
    initActivityFeed();
});

/**
 * Rain Effect
 */
function initRainEffect() {
    const rainContainer = document.getElementById('rain');
    if (!rainContainer) return;

    const rainDropCount = 100;

    for (let i = 0; i < rainDropCount; i++) {
        createRainDrop(rainContainer);
    }
}

function createRainDrop(container) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';

    // Random properties
    const left = Math.random() * 100;
    const height = Math.random() * 20 + 10;
    const duration = Math.random() * 1 + 0.5;
    const delay = Math.random() * 2;

    drop.style.cssText = `
        left: ${left}%;
        height: ${height}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    container.appendChild(drop);
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!navToggle || !mobileMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Handle staggered delays for service cards
                if (entry.target.classList.contains('service-card')) {
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }

                // Handle manifesto lines
                if (entry.target.classList.contains('manifesto-line')) {
                    const index = entry.target.dataset.index;
                    entry.target.style.transitionDelay = `${(parseInt(index) - 1) * 150}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Observe manifesto lines
    document.querySelectorAll('.manifesto-line').forEach(line => {
        observer.observe(line);
    });
}

/**
 * Counter Animations
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value[data-target], .counter[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Network Canvas Animation
 */
function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    const nodeCount = 50;
    const connectionDistance = 150;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createNodes() {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach((node, i) => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off walls
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            // Draw connections
            nodes.slice(i + 1).forEach(otherNode => {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.5;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 249, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.stroke();
                }
            });

            // Draw node
            ctx.beginPath();
            ctx.fillStyle = '#00fff9';
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    createNodes();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        resize();
        createNodes();
    });

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    });

    observer.observe(canvas);
}

/**
 * Code Rain Effect (Matrix-style)
 */
function initCodeRain() {
    const container = document.getElementById('codeRain');
    if (!container) return;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
        createCodeColumn(container, chars, i);
    }
}

function createCodeColumn(container, chars, index) {
    const column = document.createElement('div');
    column.style.cssText = `
        position: absolute;
        left: ${index * 20}px;
        top: 0;
        font-family: 'Share Tech Mono', monospace;
        font-size: 14px;
        color: #00fff9;
        opacity: 0.3;
        writing-mode: vertical-rl;
        animation: code-fall ${5 + Math.random() * 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
    `;

    const length = 10 + Math.floor(Math.random() * 20);
    let text = '';
    for (let i = 0; i < length; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
    }
    column.textContent = text;

    container.appendChild(column);

    // Add keyframes dynamically
    if (!document.getElementById('code-fall-keyframes')) {
        const style = document.createElement('style');
        style.id = 'code-fall-keyframes';
        style.textContent = `
            @keyframes code-fall {
                0% {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(100vh);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Glitch Effects
 */
function initGlitchEffects() {
    // Random glitch on hover elements
    const glitchElements = document.querySelectorAll('.glitch-hover');

    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            triggerGlitch(element);
        });
    });

    // Periodic random glitches on the hero title
    const heroTitle = document.querySelector('.hero-title.glitch');
    if (heroTitle) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                triggerIntenseGlitch(heroTitle);
            }
        }, 3000);
    }
}

function triggerGlitch(element) {
    element.style.animation = 'none';
    void element.offsetWidth; // Trigger reflow
    element.style.animation = 'glitch-skew 0.3s infinite linear';

    setTimeout(() => {
        element.style.animation = '';
    }, 300);
}

function triggerIntenseGlitch(element) {
    const originalText = element.dataset.text;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');

        iterations++;

        if (iterations > originalText.length) {
            clearInterval(interval);
            element.textContent = originalText;
        }
    }, 30);
}

/**
 * Form Handling
 */
function initFormHandling() {
    const form = document.getElementById('accessForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form);
    });

    // Add glitch effect to inputs on focus
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.animation = 'input-glitch 0.1s';
            setTimeout(() => {
                input.style.animation = '';
            }, 100);
        });
    });

    // Add input glitch keyframes
    if (!document.getElementById('input-glitch-keyframes')) {
        const style = document.createElement('style');
        style.id = 'input-glitch-keyframes';
        style.textContent = `
            @keyframes input-glitch {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function handleFormSubmit(form) {
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    // Show loading state
    btnText.textContent = 'CONNECTING...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate form submission
    setTimeout(() => {
        btnText.textContent = 'ACCESS_GRANTED';
        submitBtn.style.background = '#39ff14';

        // Add success message to terminal output
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            const successLine = document.createElement('p');
            successLine.className = 'output-line';
            successLine.style.color = '#39ff14';
            successLine.style.opacity = '1';
            successLine.textContent = '> Connection established. Operator will respond shortly.';
            terminalOutput.appendChild(successLine);
        }

        setTimeout(() => {
            form.reset();
            btnText.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.nav-bar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Activity Feed Animation
 */
function initActivityFeed() {
    const activityLines = document.querySelectorAll('.activity-line');

    activityLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.3}s`;
    });

    // Simulate new activity
    const activityContainer = document.querySelector('.panel-activity');
    if (!activityContainer) return;

    const activities = [
        { type: 'connect', text: '[+] New operator connected: NODE_' },
        { type: 'transaction', text: '[TX] Transaction verified: 0x' },
        { type: 'secure', text: '[!] Encryption handshake complete' },
        { type: 'connect', text: '[+] Node activated: SECTOR_' }
    ];

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const line = document.createElement('div');
        line.className = 'activity-line';
        line.dataset.type = activity.type;

        let text = activity.text;
        if (activity.type === 'connect') {
            text += Math.floor(Math.random() * 99);
        } else if (activity.type === 'transaction') {
            text += Math.random().toString(16).substr(2, 8) + '...';
        }
        line.textContent = text;

        // Add to top
        if (activityContainer.firstChild) {
            activityContainer.insertBefore(line, activityContainer.firstChild);
        } else {
            activityContainer.appendChild(line);
        }

        // Trigger animation
        setTimeout(() => {
            line.style.opacity = '1';
        }, 10);

        // Remove old lines
        const lines = activityContainer.querySelectorAll('.activity-line');
        if (lines.length > 10) {
            lines[lines.length - 1].remove();
        }
    }, 5000);
}

/**
 * Navbar Background on Scroll
 */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.nav-bar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

/**
 * Cursor Trail Effect (Optional Enhancement)
 */
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${6 - i * 0.2}px;
            height: ${6 - i * 0.2}px;
            background: rgba(0, 255, 249, ${1 - i / trailLength});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
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

// Uncomment to enable cursor trail
// initCursorTrail();

/**
 * Typing Effect for Hero Subtitle
 */
function initTypingEffect() {
    const element = document.querySelector('.hero-subtitle');
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';

    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 30);
        }
    }

    // Start after a delay
    setTimeout(type, 1000);
}

// Uncomment to enable typing effect
// initTypingEffect();

/**
 * Parallax Effect for Hero Background
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const neonGlows = document.querySelectorAll('.neon-glow');
        neonGlows.forEach((glow, index) => {
            const speed = 0.3 + index * 0.1;
            glow.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

/**
 * Random Glitch on Page Load
 */
window.addEventListener('load', () => {
    // Trigger initial glitch effect
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title.glitch');
        if (heroTitle) {
            triggerIntenseGlitch(heroTitle);
        }
    }, 500);
});
