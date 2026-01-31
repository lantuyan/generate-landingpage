/**
 * DISRUPT - Asymmetrical Landing Page Interactions
 * Unexpected movements and dynamic tension
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initScrollReveal();
    initParallax();
    initAsymmetricHover();
    initSmoothScroll();
    initMobileMenu();
    initMarquee();
});

/**
 * Custom Cursor with asymmetric following
 */
function initCursor() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let rotation = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with lag and rotation for asymmetric feel
    function animateCursor() {
        // Asymmetric easing - different speeds for X and Y
        const speedX = 0.15;
        const speedY = 0.12;

        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * speedX;
        cursorY += dy * speedY;

        // Rotate based on movement direction
        rotation += (Math.atan2(dy, dx) * 180 / Math.PI - rotation) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .collection-card, .pillar');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });
}

/**
 * Scroll Reveal with asymmetric delays and directions
 */
function initScrollReveal() {
    const revealElements = [
        { selector: '.section-header', class: 'reveal-rotate', delay: 0 },
        { selector: '.collection-card-1', class: 'reveal-left', delay: 100 },
        { selector: '.collection-card-2', class: 'reveal-right', delay: 200 },
        { selector: '.collection-card-3', class: 'reveal', delay: 150 },
        { selector: '.philosophy-quote', class: 'reveal-left', delay: 0 },
        { selector: '.pillar-1', class: 'reveal', delay: 0 },
        { selector: '.pillar-2', class: 'reveal', delay: 150 },
        { selector: '.pillar-3', class: 'reveal', delay: 300 },
        { selector: '.atelier-image-1', class: 'reveal-left', delay: 0 },
        { selector: '.atelier-image-2', class: 'reveal-right', delay: 100 },
        { selector: '.atelier-text', class: 'reveal', delay: 200 },
        { selector: '.contact-cta', class: 'reveal-left', delay: 0 },
        { selector: '.contact-info', class: 'reveal-right', delay: 150 }
    ];

    // Add reveal classes to elements
    revealElements.forEach(({ selector, class: className }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (!el.classList.contains('reveal') &&
                !el.classList.contains('reveal-left') &&
                !el.classList.contains('reveal-right') &&
                !el.classList.contains('reveal-rotate')) {
                el.classList.add(className);
            }
        });
    });

    // Intersection Observer for revealing
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const config = revealElements.find(r =>
                    entry.target.matches(r.selector)
                );
                const delay = config ? config.delay : 0;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-rotate').forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Parallax effects with asymmetric movement
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-shape, .philosophy-shape');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                parallaxElements.forEach((el, index) => {
                    // Different speeds for asymmetric feel
                    const speeds = [0.3, -0.2, 0.4, -0.15, 0.25];
                    const speed = speeds[index % speeds.length];

                    // Asymmetric directions
                    const xOffset = Math.sin(scrolled * 0.002 + index) * 20;
                    const yOffset = scrolled * speed;
                    const rotation = scrolled * 0.02 * (index % 2 === 0 ? 1 : -1);

                    el.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Asymmetric hover effects on cards and elements
 */
function initAsymmetricHover() {
    const cards = document.querySelectorAll('.collection-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate asymmetric rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Offset center for asymmetric feel
            const offsetCenterX = centerX * 1.2;
            const offsetCenterY = centerY * 0.8;

            const rotateX = (y - offsetCenterY) / 30;
            const rotateY = (offsetCenterX - x) / 30;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Pillar hover effect
    const pillars = document.querySelectorAll('.pillar');
    pillars.forEach((pillar, index) => {
        pillar.addEventListener('mouseenter', () => {
            // Move other pillars asymmetrically
            pillars.forEach((p, i) => {
                if (i !== index) {
                    const offset = (i - index) * 10;
                    p.style.transform = `translateX(${offset}px)`;
                }
            });
        });

        pillar.addEventListener('mouseleave', () => {
            pillars.forEach((p, i) => {
                const baseOffsets = [-20, 40, 0];
                p.style.transform = `translateX(${baseOffsets[i]}px)`;
            });
        });
    });
}

/**
 * Smooth scrolling with asymmetric easing
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1200;
            let startTime = null;

            // Custom asymmetric easing function
            function asymmetricEase(t) {
                // Faster start, slower end for unexpected feel
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = asymmetricEase(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        });
    });
}

/**
 * Mobile menu with asymmetric animation
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.nav-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navLinks) return;

    let isOpen = false;

    menuBtn.addEventListener('click', () => {
        isOpen = !isOpen;

        if (isOpen) {
            // Create mobile menu
            navLinks.style.display = 'flex';
            navLinks.style.position = 'fixed';
            navLinks.style.top = '0';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.bottom = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.justifyContent = 'center';
            navLinks.style.alignItems = 'center';
            navLinks.style.background = 'var(--color-bg)';
            navLinks.style.zIndex = '99';
            navLinks.style.gap = '2rem';

            // Animate links with asymmetric delays
            const links = navLinks.querySelectorAll('.nav-link');
            links.forEach((link, i) => {
                link.style.opacity = '0';
                link.style.transform = `translateX(${i % 2 === 0 ? -50 : 50}px)`;

                setTimeout(() => {
                    link.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                    link.style.fontSize = '2rem';
                }, 100 + i * 100);
            });

            // Animate menu button to X
            menuBtn.querySelector('span:first-child').style.transform = 'rotate(45deg) translateY(5px)';
            menuBtn.querySelector('span:last-child').style.transform = 'rotate(-45deg) translateY(-5px)';
        } else {
            // Close menu
            const links = navLinks.querySelectorAll('.nav-link');
            links.forEach((link, i) => {
                link.style.transform = `translateX(${i % 2 === 0 ? 50 : -50}px)`;
                link.style.opacity = '0';
            });

            setTimeout(() => {
                navLinks.style.display = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.left = '';
                navLinks.style.right = '';
                navLinks.style.bottom = '';
                navLinks.style.flexDirection = '';
                navLinks.style.justifyContent = '';
                navLinks.style.alignItems = '';
                navLinks.style.background = '';
                navLinks.style.zIndex = '';
                navLinks.style.gap = '';

                links.forEach(link => {
                    link.style.opacity = '';
                    link.style.transform = '';
                    link.style.transition = '';
                    link.style.fontSize = '';
                });
            }, 400);

            // Reset menu button
            menuBtn.querySelector('span:first-child').style.transform = '';
            menuBtn.querySelector('span:last-child').style.transform = '';
        }
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen) {
                menuBtn.click();
            }
        });
    });
}

/**
 * Marquee animation with variable speed
 */
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (!marqueeContent) return;

    // Clone for seamless loop
    const clone = marqueeContent.cloneNode(true);
    marqueeContent.parentElement.appendChild(clone);

    // Variable speed on hover
    const featured = document.querySelector('.featured');
    if (featured) {
        featured.addEventListener('mouseenter', () => {
            document.querySelectorAll('.marquee-content').forEach(el => {
                el.style.animationDuration = '40s';
            });
        });

        featured.addEventListener('mouseleave', () => {
            document.querySelectorAll('.marquee-content').forEach(el => {
                el.style.animationDuration = '20s';
            });
        });
    }
}

/**
 * Hero title scramble effect on load
 */
function initTitleScramble() {
    const titleLines = document.querySelectorAll('.title-line');

    titleLines.forEach((line, index) => {
        const text = line.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let iterations = 0;
        const maxIterations = text.length * 3;

        const scrambleInterval = setInterval(() => {
            line.textContent = text.split('')
                .map((char, i) => {
                    if (i < iterations / 3) {
                        return text[i];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            iterations++;

            if (iterations >= maxIterations) {
                clearInterval(scrambleInterval);
                line.textContent = text;
            }
        }, 30);
    });
}

// Initialize scramble after page load
window.addEventListener('load', () => {
    setTimeout(initTitleScramble, 800);
});

/**
 * Scroll-triggered nav style change
 */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(10, 10, 15, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.mixBlendMode = 'normal';
    } else {
        nav.style.background = '';
        nav.style.backdropFilter = '';
        nav.style.mixBlendMode = 'difference';
    }
});
