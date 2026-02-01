/* ============================================
   SANKOFA COLLECTIVE - JavaScript
   Pan-African Artisan Marketplace
   Rhythmic Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initCraftFilter();
    initFormHandler();
    initRevealAnimations();
    initPatternAnimations();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scroll effect for nav
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
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
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
    // Parallax effect for hero patterns
    const heroPatterns = document.querySelectorAll('.hero-pattern');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        heroPatterns.forEach(pattern => {
            const speed = 0.3;
            pattern.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ============================================
   CRAFT FILTER
   ============================================ */
function initCraftFilter() {
    const tabs = document.querySelectorAll('.craft-tab');
    const cards = document.querySelectorAll('.craft-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            // Animate cards with drum-beat timing
            cards.forEach((card, index) => {
                const cardCategory = card.dataset.category;

                if (category === 'all' || cardCategory === category) {
                    // Stagger the reveal animation
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.95)';

                        // Trigger reflow
                        card.offsetHeight;

                        card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 80); // Drum-beat timing
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';

                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/* ============================================
   FORM HANDLER
   ============================================ */
function initFormHandler() {
    const form = document.getElementById('joinForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const email = input.value;

            if (email) {
                // Animate button
                button.innerHTML = '<span>Joining...</span>';
                button.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    button.innerHTML = `
                        <span>Welcome!</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    `;
                    button.style.background = 'var(--leaf-green)';
                    input.value = '';

                    // Reset after delay
                    setTimeout(() => {
                        button.innerHTML = `
                            <span>Get Started</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        `;
                        button.style.background = '';
                        button.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }
}

/* ============================================
   REVEAL ANIMATIONS
   ============================================ */
function initRevealAnimations() {
    // Add reveal class to elements
    const revealElements = [
        '.artisan-card',
        '.craft-card',
        '.story-card',
        '.impact-card',
        '.section-header',
        '.impact-testimonial',
        '.join-content'
    ];

    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            // Add staggered delay for cards
            if (selector.includes('card')) {
                el.classList.add(`reveal-delay-${(index % 4) + 1}`);
            }
        });
    });

    // Intersection Observer for reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add drum-beat animation delay
                const delay = entry.target.classList.contains('reveal-delay-1') ? 100 :
                             entry.target.classList.contains('reveal-delay-2') ? 200 :
                             entry.target.classList.contains('reveal-delay-3') ? 300 :
                             entry.target.classList.contains('reveal-delay-4') ? 400 : 0;

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

/* ============================================
   PATTERN ANIMATIONS
   ============================================ */
function initPatternAnimations() {
    // Subtle pattern movement on hover for craft cards
    const craftCards = document.querySelectorAll('.craft-card');

    craftCards.forEach(card => {
        const pattern = card.querySelector('.craft-placeholder');

        card.addEventListener('mouseenter', () => {
            if (pattern) {
                pattern.style.animation = 'patternShift 3s linear infinite';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (pattern) {
                pattern.style.animation = 'none';
            }
        });
    });

    // Animate hero patterns on load
    const heroPatterns = document.querySelectorAll('.hero-pattern');
    heroPatterns.forEach(pattern => {
        pattern.style.animation = 'patternShift 20s linear infinite';
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format the number
        if (target >= 1000000) {
            element.textContent = '$' + (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');

            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let target;

                if (text.includes('$')) {
                    target = 4200000;
                } else if (text.includes('+')) {
                    target = 2400;
                } else {
                    target = parseInt(text);
                }

                animateCounter(stat, target);
            });

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

/* ============================================
   RIPPLE EFFECT ON BUTTONS
   ============================================ */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
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
            animation: ripple 0.6s ease-out;
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

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================================
   ARTISAN CARD HOVER EFFECT
   ============================================ */
document.querySelectorAll('.artisan-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Create subtle pulse effect
        this.style.animation = 'none';
        this.offsetHeight; // Trigger reflow
        this.style.animation = 'cardPulse 0.5s ease';
    });
});

// Add card pulse animation
const cardPulseStyle = document.createElement('style');
cardPulseStyle.textContent = `
    @keyframes cardPulse {
        0% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        50% { box-shadow: 0 8px 30px rgba(196, 132, 45, 0.2); }
        100% { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); }
    }
`;
document.head.appendChild(cardPulseStyle);
