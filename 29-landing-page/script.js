// Memphis Design Landing Page - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initPlayfulHovers();
    initFloatingShapes();
    initFormInteractions();
    initNavbarScroll();
});

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
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

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .workshop-card, .event-card, .testimonial-card, .pricing-card, .section-header'
    );

    // Add animation classes
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.classList.add(`stagger-${(index % 4) + 1}`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// ===== Counter Animation =====
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounter = (el) => {
        const target = el.dataset.target;

        // Handle infinity symbol
        if (target === '∞') {
            el.textContent = '∞';
            return;
        }

        const targetNum = parseInt(target);
        const duration = 2000;
        const increment = targetNum / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < targetNum) {
                el.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = targetNum.toLocaleString();
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            stats.forEach(stat => animateCounter(stat));
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ===== Playful Hover Effects =====
function initPlayfulHovers() {
    // Feature cards wiggle
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'cardWiggle 0.5s ease-in-out';
            }, 10);
        });
    });

    // Buttons bounce on hover
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.animation = 'buttonBounce 0.4s ease-in-out';
        });
        btn.addEventListener('animationend', () => {
            btn.style.animation = '';
        });
    });

    // Workshop cards tilt
    const workshopCards = document.querySelectorAll('.workshop-card');
    workshopCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Testimonial cards random rotation
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const rotation = Math.random() * 6 - 3;
            card.style.transform = `rotate(${rotation}deg) translate(-3px, -3px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Pricing cards scale effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.7';
                    c.style.transform = 'scale(0.95)';
                }
            });
        });
        card.addEventListener('mouseleave', () => {
            pricingCards.forEach(c => {
                c.style.opacity = '';
                c.style.transform = '';
            });
        });
    });

    // Add wiggle animation keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes cardWiggle {
            0%, 100% { transform: translate(-5px, -5px) rotate(0deg); }
            25% { transform: translate(-5px, -5px) rotate(-2deg); }
            75% { transform: translate(-5px, -5px) rotate(2deg); }
        }
        @keyframes buttonBounce {
            0%, 100% { transform: translate(-3px, -3px) scale(1); }
            50% { transform: translate(-3px, -3px) scale(1.05); }
        }
    `;
    document.head.appendChild(styleSheet);
}

// ===== Floating Shapes Parallax =====
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shapes .shape');

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateShapes() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 10;
            const x = currentX * speed;
            const y = currentY * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(animateShapes);
    }

    animateShapes();

    // Random color changes on shapes
    setInterval(() => {
        const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF4136', '#2ECC40', '#B10DC9', '#FF851B'];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (randomShape.style.backgroundColor) {
            randomShape.style.transition = 'background-color 1s ease';
            randomShape.style.backgroundColor = randomColor;
        }
    }, 3000);
}

// ===== Form Interactions =====
function initFormInteractions() {
    const form = document.querySelector('.cta-form');
    const input = form?.querySelector('input');
    const button = form?.querySelector('button');

    if (!form || !input || !button) return;

    // Input focus animation
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = '';
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!input.value.trim()) return;

        // Success animation
        button.innerHTML = '<span>🎉 Booked!</span>';
        button.style.background = '#2ECC40';
        button.disabled = true;

        // Confetti burst
        createConfetti();

        // Reset after delay
        setTimeout(() => {
            button.innerHTML = '<span>Book A Tour</span><span class="btn-confetti" aria-hidden="true">🎉</span>';
            button.style.background = '';
            button.disabled = false;
            input.value = '';
        }, 3000);
    });
}

// ===== Confetti Effect =====
function createConfetti() {
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF4136', '#2ECC40', '#B10DC9'];
    const confettiCount = 50;
    const container = document.querySelector('.cta');

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: 50%;
            pointer-events: none;
            z-index: 1000;
            transform: rotate(${Math.random() * 360}deg);
        `;

        container.appendChild(confetti);

        // Animate confetti
        const animation = confetti.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${(Math.random() - 0.5) * 200}px, ${-Math.random() * 300 - 100}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 1000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            nav.style.transform = 'translateY(0)';
            nav.style.boxShadow = 'none';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activatePartyMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activatePartyMode() {
    document.body.style.animation = 'partyMode 0.5s ease-in-out infinite';

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes partyMode {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(180deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Spawn random shapes
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const shape = document.createElement('div');
            const size = Math.random() * 50 + 20;
            const isCircle = Math.random() > 0.5;
            const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF4136', '#2ECC40'];

            shape.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${isCircle ? '50%' : '0'};
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                pointer-events: none;
                z-index: 9999;
                transform: rotate(${Math.random() * 45}deg);
            `;

            document.body.appendChild(shape);

            shape.animate([
                { opacity: 1, transform: `scale(0) rotate(0deg)` },
                { opacity: 1, transform: `scale(1) rotate(180deg)` },
                { opacity: 0, transform: `scale(0) rotate(360deg)` }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => shape.remove();
        }, i * 100);
    }

    // End party mode after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// ===== Cursor Trail Effect (Desktop Only) =====
if (window.matchMedia('(pointer: fine)').matches) {
    const trail = [];
    const trailLength = 8;
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF4136', '#2ECC40'];

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: ${12 - i}px;
            height: ${12 - i}px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - (i / trailLength)};
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push({ el: dot, x: 0, y: 0 });
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
            const nextX = x;
            const nextY = y;

            dot.el.style.transform = `translate(${x - 6}px, ${y - 6}px)`;

            x += (dot.x - x) * 0.3;
            y += (dot.y - y) * 0.3;

            dot.x = nextX;
            dot.y = nextY;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// ===== Scroll Progress Indicator =====
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #FFD700, #FF69B4, #00BFFF, #2ECC40);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
});

// ===== Random Shape Click Effect =====
document.addEventListener('click', (e) => {
    // Skip if clicking on interactive elements
    if (e.target.closest('a, button, input, .btn')) return;

    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF4136', '#2ECC40'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 30 + 20;

    const el = document.createElement('div');

    if (shape === 'circle') {
        el.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${e.clientX - size/2}px;
            top: ${e.clientY - size/2}px;
        `;
    } else if (shape === 'square') {
        el.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            pointer-events: none;
            z-index: 9998;
            left: ${e.clientX - size/2}px;
            top: ${e.clientY - size/2}px;
            transform: rotate(${Math.random() * 45}deg);
        `;
    } else {
        el.style.cssText = `
            position: fixed;
            width: 0;
            height: 0;
            border-left: ${size/2}px solid transparent;
            border-right: ${size/2}px solid transparent;
            border-bottom: ${size}px solid ${color};
            pointer-events: none;
            z-index: 9998;
            left: ${e.clientX - size/2}px;
            top: ${e.clientY - size/2}px;
        `;
    }

    document.body.appendChild(el);

    el.animate([
        { opacity: 1, transform: 'scale(0) rotate(0deg)' },
        { opacity: 1, transform: 'scale(1.5) rotate(180deg)' },
        { opacity: 0, transform: 'scale(0) rotate(360deg)' }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => el.remove();
});
