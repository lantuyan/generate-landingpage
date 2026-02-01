/* ============================================
   HolisticBridge - JavaScript Interactions
   Gentle, nurturing animations that don't startle
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initFormHandling();
    initSmoothScroll();
    initOrbitAnimations();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Scroll effect for navbar
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   Scroll Animations - Gentle Fade In
   ============================================ */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight delay for a more gentle appearance
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeInObserver.observe(el);
    });
}

/* ============================================
   Counter Animations
   ============================================ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

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
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds for gentle animation
    const start = 0;
    const startTime = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (target - start) * easedProgress);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   Form Handling
   ============================================ */
function initFormHandling() {
    const form = document.getElementById('signup-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]');
            const button = form.querySelector('button[type="submit"]');

            if (email.value) {
                // Gentle feedback animation
                button.textContent = 'Welcome!';
                button.style.background = 'linear-gradient(135deg, var(--lavender-500), var(--lavender-600))';

                setTimeout(() => {
                    // Create success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>Check your email to get started on your wellness journey!</span>
                    `;
                    successMsg.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 20px;
                        background: linear-gradient(135deg, var(--sage-100), var(--lavender-100));
                        border-radius: var(--radius-md);
                        margin-top: 20px;
                        color: var(--sage-600);
                        font-family: var(--font-primary);
                        animation: fadeIn 0.6s ease;
                    `;
                    successMsg.querySelector('svg').style.cssText = `
                        width: 24px;
                        height: 24px;
                        flex-shrink: 0;
                    `;

                    form.innerHTML = '';
                    form.appendChild(successMsg);
                }, 800);
            }
        });
    }
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Orbit Animations - Enhanced floating effect
   ============================================ */
function initOrbitAnimations() {
    const orbitItems = document.querySelectorAll('.orbit-item');

    // Add subtle mouse parallax effect to orbit items
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const moveX = (e.clientX - centerX) / 40;
            const moveY = (e.clientY - centerY) / 40;

            orbitItems.forEach((item, index) => {
                const factor = (index % 2 === 0) ? 1 : -1;
                item.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
            });
        });

        heroVisual.addEventListener('mouseleave', () => {
            orbitItems.forEach(item => {
                item.style.transform = '';
            });
        });
    }

    // Add gentle pulsing effect to center circle
    const circleCenter = document.querySelector('.circle-center');
    if (circleCenter) {
        setInterval(() => {
            circleCenter.style.transform = 'translate(-50%, -50%) scale(1.02)';
            setTimeout(() => {
                circleCenter.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 1500);
        }, 3000);
    }
}

/* ============================================
   Add subtle hover effects to cards
   ============================================ */
document.querySelectorAll('.problem-card, .feature-card, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
    });
});

/* ============================================
   Practitioner collaboration animation
   ============================================ */
function initCollaborationAnimation() {
    const nodes = document.querySelectorAll('.collab-node');
    const lines = document.querySelector('.connection-lines');

    if (nodes.length && lines) {
        // Animate connection lines
        const lineElements = lines.querySelectorAll('line');

        setInterval(() => {
            lineElements.forEach((line, index) => {
                setTimeout(() => {
                    line.style.strokeDashoffset = '0';
                    line.style.opacity = '1';

                    setTimeout(() => {
                        line.style.opacity = '0.6';
                    }, 500);
                }, index * 200);
            });
        }, 3000);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initCollaborationAnimation);

/* ============================================
   Accessibility: Reduce motion if preferred
   ============================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
    });
}

/* ============================================
   Add keyframe animation for form success
   ============================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes gentlePulse {
        0%, 100% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.03);
        }
    }
`;
document.head.appendChild(styleSheet);
