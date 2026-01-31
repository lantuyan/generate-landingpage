/* ========================================
   RAWCASH - Neobrutalist Fintech Landing Page
   JavaScript Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileMenu();
    initScrollReveal();
    initButtonEffects();
    initMarqueeHover();
    initCardTilt();
    initFormInteractions();
    initSmoothScroll();
    initCounterAnimation();
});

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');

        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (menuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/* ========================================
   Scroll Reveal Animation
   ======================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .comparison-table, .manifesto-card, .section-header'
    );

    const revealOnScroll = () => {
        revealElements.forEach((el, index) => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                // Stagger the animation
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 50);
            }
        });
    };

    // Add initial styles
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    // Add revealed state styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Check on scroll and load
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();
}

/* ========================================
   Button Click Effects
   ======================================== */
function initButtonEffects() {
    const buttons = document.querySelectorAll('button, .cta-primary, .cta-secondary, .plan-cta, .submit-btn, .nav-cta');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 0;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.4s ease-out;
                pointer-events: none;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 400);
        });

        // Add shake effect on hover
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'shake 0.3s ease';
        });

        button.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px) rotate(-1deg); }
            75% { transform: translateX(3px) rotate(1deg); }
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   Marquee Hover Effect
   ======================================== */
function initMarqueeHover() {
    const marquee = document.querySelector('.marquee');
    const track = document.querySelector('.marquee-track');

    if (!marquee || !track) return;

    marquee.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
}

/* ========================================
   Card Tilt Effect
   ======================================== */
function initCardTilt() {
    const cards = document.querySelectorAll('.feature-card, .pricing-card, .manifesto-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
        });
    });
}

/* ========================================
   Form Interactions
   ======================================== */
function initFormInteractions() {
    const emailInput = document.querySelector('.email-input');
    const submitBtn = document.querySelector('.submit-btn');

    if (!emailInput || !submitBtn) return;

    // Input focus effect
    emailInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });

    emailInput.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
    });

    // Form submission
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            // Shake effect for empty input
            emailInput.style.animation = 'shakeInput 0.4s ease';
            emailInput.style.background = '#ffcccc';

            setTimeout(() => {
                emailInput.style.animation = '';
                emailInput.style.background = '';
            }, 400);
            return;
        }

        if (!isValidEmail(email)) {
            emailInput.style.animation = 'shakeInput 0.4s ease';
            emailInput.style.background = '#ffcccc';

            setTimeout(() => {
                emailInput.style.animation = '';
                emailInput.style.background = '';
            }, 400);
            return;
        }

        // Success state
        const originalText = this.textContent;
        this.textContent = 'WELCOME REBEL! ★';
        this.style.background = '#00cc00';
        emailInput.value = '';
        emailInput.style.background = '#ccffcc';

        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
            emailInput.style.background = '';
        }, 3000);
    });

    // Add shake animation for input
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shakeInput {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
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

/* ========================================
   Counter Animation
   ======================================== */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        const heroSection = document.querySelector('.hero');
        const rect = heroSection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animated = true;

            statNumbers.forEach(stat => {
                const text = stat.textContent;

                // Handle different formats
                if (text.includes('K')) {
                    animateNumber(stat, 0, parseInt(text), 'K+');
                } else if (text.includes('%')) {
                    animateNumber(stat, 0, parseInt(text), '%');
                } else if (text === '$0') {
                    // Already at $0, just add a pop effect
                    stat.style.animation = 'pop 0.5s ease';
                }
            });
        }
    };

    function animateNumber(element, start, end, suffix) {
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Add pop animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // Check immediately
}

/* ========================================
   Floating Elements Random Movement
   ======================================== */
document.querySelectorAll('.floating-element').forEach((el, index) => {
    el.style.animationDuration = `${3 + index * 0.5}s`;
    el.style.animationDelay = `${index * 0.3}s`;
});

/* ========================================
   Visual Box Entrance Animation
   ======================================== */
document.querySelectorAll('.visual-box').forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = `translateY(50px) rotate(${box.classList.contains('box-1') ? '-3deg' : box.classList.contains('box-2') ? '2deg' : '-1deg'})`;

    setTimeout(() => {
        box.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        box.style.opacity = '1';
        box.style.transform = `translateY(0) rotate(${box.classList.contains('box-1') ? '-3deg' : box.classList.contains('box-2') ? '2deg' : '-1deg'})`;
    }, 500 + index * 200);
});

/* ========================================
   Comparison Row Hover Effect
   ======================================== */
document.querySelectorAll('.comparison-row:not(.header-row)').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.2s ease';
        this.style.position = 'relative';
        this.style.zIndex = '1';
    });

    row.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.zIndex = '';
    });
});

/* ========================================
   Nav Scroll Effect
   ======================================== */
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 4px 0 #000';
    } else {
        nav.style.boxShadow = '';
    }

    lastScroll = currentScroll;
}, { passive: true });
