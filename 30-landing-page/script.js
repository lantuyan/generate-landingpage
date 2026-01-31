/**
 * ＡＲＣＡＤＥ ＥＴＥＲＮＡＬ - Vaporwave Landing Page
 * レトロゲーム保存協会
 *
 * JavaScript for animations, effects, and interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initGlitchEffects();
    initVHSTracking();
    initTestimonialCarousel();
    initLoadingAnimation();
    initParallaxEffects();
    initButtonEffects();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Scroll effect for navigation
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll-triggered fade-in animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation to children if present
                const children = entry.target.querySelectorAll('.fade-in-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Add fade-in class and observe elements
    const animateElements = [
        '.section-header',
        '.about-statue',
        '.about-content',
        '.archive-card',
        '.feature',
        '.museum-visual',
        '.testimonial-carousel',
        '.tier',
        '.footer-brand',
        '.footer-column'
    ];

    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    });
}

/**
 * Random glitch effects
 */
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');

    // Random intense glitch bursts
    setInterval(() => {
        glitchElements.forEach(el => {
            if (Math.random() > 0.7) {
                el.classList.add('glitch-active');
                setTimeout(() => {
                    el.classList.remove('glitch-active');
                }, 200);
            }
        });
    }, 3000);

    // Add glitch CSS
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        .glitch-active {
            animation: glitchBurst 0.2s steps(2) !important;
        }

        @keyframes glitchBurst {
            0% { transform: translate(0); filter: hue-rotate(0deg); }
            20% { transform: translate(-5px, 3px); filter: hue-rotate(90deg); }
            40% { transform: translate(5px, -3px); filter: hue-rotate(180deg); }
            60% { transform: translate(-3px, -5px); filter: hue-rotate(270deg); }
            80% { transform: translate(3px, 5px); filter: hue-rotate(360deg); }
            100% { transform: translate(0); filter: hue-rotate(0deg); }
        }
    `;
    document.head.appendChild(glitchStyle);

    // Screen flicker effect
    const body = document.body;
    setInterval(() => {
        if (Math.random() > 0.95) {
            body.style.opacity = '0.97';
            setTimeout(() => {
                body.style.opacity = '1';
            }, 50);
        }
    }, 2000);
}

/**
 * VHS tracking effect
 */
function initVHSTracking() {
    const vhsElement = document.querySelector('.vhs-tracking');

    // Random tracking distortion
    setInterval(() => {
        if (Math.random() > 0.9) {
            const offset = Math.random() * 100;
            vhsElement.style.background = `linear-gradient(
                0deg,
                transparent 0%,
                transparent ${offset - 5}%,
                rgba(255, 106, 213, 0.15) ${offset - 4}%,
                rgba(0, 255, 249, 0.15) ${offset}%,
                transparent ${offset + 1}%,
                transparent 100%
            )`;

            setTimeout(() => {
                vhsElement.style.background = 'transparent';
            }, 150);
        }
    }, 500);

    // Horizontal distortion lines
    setInterval(() => {
        if (Math.random() > 0.85) {
            const distortionLine = document.createElement('div');
            distortionLine.style.cssText = `
                position: fixed;
                left: 0;
                width: 100%;
                height: 2px;
                background: rgba(0, 255, 249, 0.3);
                z-index: 9996;
                pointer-events: none;
                top: ${Math.random() * 100}%;
            `;
            document.body.appendChild(distortionLine);

            setTimeout(() => {
                distortionLine.remove();
            }, 100);
        }
    }, 300);
}

/**
 * Testimonial carousel
 */
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.remove('active');
            if (i === index) {
                t.classList.add('active');
            }
        });

        dots.forEach((d, i) => {
            d.classList.remove('active');
            if (i === index) {
                d.classList.add('active');
            }
        });

        currentIndex = index;
    }

    function nextTestimonial() {
        const next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetAutoplay();
        });
    });

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        startAutoplay();
    });
}

/**
 * Windows 95 loading animation
 */
function initLoadingAnimation() {
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingPercent = document.querySelector('.loading-percent');

    if (!loadingProgress || !loadingPercent) return;

    let percent = 0;
    const targetPercent = 69; // Forever stuck at 69%

    function updateLoading() {
        if (percent < targetPercent) {
            // Randomize speed to simulate real loading
            percent += Math.random() * 5;
            if (percent > targetPercent) percent = targetPercent;

            loadingProgress.style.width = `${percent}%`;
            loadingPercent.textContent = `${Math.floor(percent)}%`;

            // Random delays to simulate buffering
            const delay = Math.random() > 0.8 ? 500 + Math.random() * 1000 : 100;
            setTimeout(updateLoading, delay);
        } else {
            // Occasionally show "Loading..." text changes
            const messages = [
                'LOADING VIRTUAL MUSEUM...',
                'INITIALIZING NOSTALGIA...',
                'DEFRAGMENTING MEMORIES...',
                'PLEASE WAIT...',
                'CONNECTING TO THE PAST...',
                'LOADING ASSETS FROM 1995...'
            ];

            const loadingText = document.querySelector('.loading-text > span');
            if (loadingText) {
                setInterval(() => {
                    if (Math.random() > 0.7) {
                        loadingText.textContent = messages[Math.floor(Math.random() * messages.length)];
                    }
                }, 3000);
            }
        }
    }

    // Start loading when element is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateLoading();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(document.querySelector('.window-frame'));
}

/**
 * Parallax scrolling effects
 */
function initParallaxEffects() {
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    const sun = document.querySelector('.sun');
    const gridFloor = document.querySelector('.grid-floor');
    const palms = document.querySelectorAll('.palm');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Only apply parallax in hero section
        if (scrollY < windowHeight * 1.5) {
            const parallaxSpeed = scrollY * 0.3;

            shapes.forEach((shape, index) => {
                const speed = 0.2 + (index * 0.1);
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });

            if (sun) {
                sun.style.transform = `translateX(-50%) translateY(${parallaxSpeed * 0.5}px)`;
            }

            if (gridFloor) {
                gridFloor.style.opacity = Math.max(0, 0.5 - (scrollY / windowHeight) * 0.5);
            }

            palms.forEach(palm => {
                palm.style.transform = `translateY(${-scrollY * 0.2}px)`;
            });
        }
    });

    // Mouse parallax for floating shapes
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        shapes.forEach((shape, index) => {
            const depth = (index + 1) * 10;
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

/**
 * Button hover effects
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.cta-button, .tier-button');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('button-ripple');

            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                background: rgba(255, 106, 213, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: rippleEffect 0.6s ease-out forwards;
                pointer-events: none;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

        // Glitch effect on click
        button.addEventListener('click', () => {
            button.style.animation = 'buttonGlitch 0.3s steps(2)';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 400px; height: 400px; opacity: 0; }
        }

        @keyframes buttonGlitch {
            0% { transform: translate(0); }
            25% { transform: translate(-3px, 2px); }
            50% { transform: translate(3px, -2px); }
            75% { transform: translate(-2px, -3px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(rippleStyle);
}

/**
 * Easter egg - Konami code
 */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateSecretMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateSecretMode() {
    // Rainbow mode activation
    document.body.style.animation = 'rainbowBg 5s linear infinite';

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbowBg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    // Show secret message
    const secretMessage = document.createElement('div');
    secretMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #ff6ad5;
            padding: 40px;
            z-index: 10000;
            text-align: center;
            font-family: 'Press Start 2P', cursive;
            animation: secretPulse 0.5s ease;
        ">
            <p style="color: #00fff9; font-size: 14px; margin-bottom: 20px;">
                ★ SECRET UNLOCKED ★
            </p>
            <p style="color: #ff6ad5; font-size: 24px; margin-bottom: 20px;">
                +30 LIVES
            </p>
            <p style="color: #c4b5fd; font-size: 10px;">
                Welcome to the eternal arcade, player.
            </p>
        </div>
    `;
    document.body.appendChild(secretMessage);

    // Add pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes secretPulse {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(pulseStyle);

    setTimeout(() => {
        secretMessage.remove();
        document.body.style.animation = '';
    }, 3000);
}

/**
 * Archive cards hover effect - screen static
 */
document.querySelectorAll('.archive-card').forEach(card => {
    const screen = card.querySelector('.screen-glitch');

    card.addEventListener('mouseenter', () => {
        if (screen) {
            screen.style.animation = 'staticNoise 0.1s steps(5) infinite';
            screen.style.opacity = '0.5';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (screen) {
            screen.style.animation = 'staticNoise 0.5s steps(10) infinite';
            screen.style.opacity = '1';
        }
    });
});

/**
 * Cursor trail effect (subtle)
 */
let cursorTrailEnabled = true;

document.addEventListener('mousemove', (e) => {
    if (!cursorTrailEnabled) return;

    // Throttle trail creation
    if (Math.random() > 0.85) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 8px;
            height: 8px;
            background: rgba(255, 106, 213, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9995;
            animation: trailFade 0.8s ease-out forwards;
        `;
        document.body.appendChild(trail);

        setTimeout(() => trail.remove(), 800);
    }
});

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(0); opacity: 0; }
    }
`;
document.head.appendChild(trailStyle);

/**
 * Random glitch on images/screens
 */
setInterval(() => {
    const screens = document.querySelectorAll('.card-screen, .statue-frame, .window-content');

    screens.forEach(screen => {
        if (Math.random() > 0.9) {
            screen.style.transform = `skewX(${(Math.random() - 0.5) * 5}deg)`;
            setTimeout(() => {
                screen.style.transform = '';
            }, 100);
        }
    });
}, 2000);

/**
 * Typewriter effect for loading text
 */
function typewriterEffect(element, text, speed = 100) {
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

// Console easter egg
console.log('%c ░▒▓█ ＡＲＣＡＤＥ ＥＴＥＲＮＡＬ █▓▒░ ',
    'background: linear-gradient(90deg, #ff6ad5, #00fff9); color: #0f0a1e; font-size: 20px; padding: 10px;');
console.log('%c Welcome to the digital afterlife, developer.',
    'color: #c4b5fd; font-size: 12px;');
console.log('%c Try the Konami code for a surprise... ↑↑↓↓←→←→BA',
    'color: #8b5cf6; font-size: 10px;');
