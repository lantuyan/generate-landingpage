/* =====================================================
   CHRONOS HEALTH - Interactive JavaScript
   Editorial with Dusty Futurism Design
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initRevealAnimations();
    initTimelineAnimation();
    initFormHandling();
    initBreathingSync();
});

/* =====================================================
   NAVIGATION
   ===================================================== */

function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll-based navigation styling
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   SCROLL EFFECTS - Cinematic Dissolve
   ===================================================== */

function initScrollEffects() {
    const sections = document.querySelectorAll('section');

    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Parallax on hero elements
        if (heroContent && scrolled < window.innerHeight) {
            const opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            const translateY = scrolled * 0.3;

            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;

            if (heroVisual) {
                heroVisual.style.opacity = Math.max(0, opacity);
                heroVisual.style.transform = `translateY(${translateY * 0.5}px)`;
            }
        }

        // Hide scroll indicator
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = scrolled > 100 ? 0 : 1;
        }
    });

    // Section fade-in on scroll (cinematic dissolve effect)
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.filter = 'blur(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (!section.classList.contains('hero')) {
            section.style.opacity = '0';
            section.style.filter = 'blur(4px)';
            section.style.transition = 'opacity 1s ease-out, filter 1s ease-out';
            sectionObserver.observe(section);
        }
    });
}

/* =====================================================
   REVEAL ANIMATIONS
   ===================================================== */

function initRevealAnimations() {
    // Elements to reveal on scroll
    const revealElements = [
        '.section-title',
        '.section-subtitle',
        '.story-lead',
        '.story-text',
        '.story-quote',
        '.pattern-card',
        '.process-step',
        '.privacy-features li',
        '.cta-title',
        '.cta-description'
    ].join(', ');

    const elements = document.querySelectorAll(revealElements);

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation based on position
                const delay = index % 4 * 100;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

/* =====================================================
   TIMELINE ANIMATION
   ===================================================== */

function initTimelineAnimation() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const timelineLine = document.querySelector('.timeline-line');

    if (!timelineNodes.length) return;

    // Animate nodes sequentially on page load
    timelineNodes.forEach((node, index) => {
        node.style.opacity = '0';
        node.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            node.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            node.style.opacity = '1';
            node.style.transform = 'translateX(0)';
        }, 800 + (index * 300));
    });

    // Animate timeline line
    if (timelineLine) {
        timelineLine.style.transform = 'scaleY(0)';
        timelineLine.style.transformOrigin = 'top';

        setTimeout(() => {
            timelineLine.style.transition = 'transform 1.2s ease-out';
            timelineLine.style.transform = 'scaleY(1)';
        }, 600);
    }

    // Document stack hover effect
    const documents = document.querySelectorAll('.document');
    const documentStack = document.querySelector('.document-stack');

    if (documentStack && documents.length) {
        documentStack.addEventListener('mouseenter', () => {
            documents.forEach((doc, index) => {
                if (index === 0) doc.style.transform = 'rotate(-15deg) translateX(-40px)';
                if (index === 1) doc.style.transform = 'rotate(0) translateY(-10px)';
                if (index === 2) doc.style.transform = 'rotate(12deg) translateX(40px)';
            });
        });

        documentStack.addEventListener('mouseleave', () => {
            documents.forEach((doc, index) => {
                if (index === 0) doc.style.transform = 'rotate(-8deg) translateX(-20px)';
                if (index === 1) doc.style.transform = 'rotate(2deg)';
                if (index === 2) doc.style.transform = 'rotate(6deg) translateX(20px)';
            });
        });
    }
}

/* =====================================================
   FORM HANDLING
   ===================================================== */

function initFormHandling() {
    const form = document.getElementById('signup-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value;

        // Validate email
        if (!isValidEmail(email)) {
            shakeElement(emailInput);
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Joining...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success state
            submitBtn.textContent = 'Welcome to Chronos';
            submitBtn.style.background = 'linear-gradient(135deg, #7D6B7D, #9B7E94)';

            // Create success message
            const successMsg = document.createElement('p');
            successMsg.className = 'form-success';
            successMsg.textContent = 'Check your email for next steps.';
            successMsg.style.cssText = `
                color: #7D6B7D;
                margin-top: 1rem;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.4s, transform 0.4s;
            `;
            form.appendChild(successMsg);

            // Animate success message
            setTimeout(() => {
                successMsg.style.opacity = '1';
                successMsg.style.transform = 'translateY(0)';
            }, 100);

            // Reset form after delay
            setTimeout(() => {
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                successMsg.remove();
            }, 5000);

        }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    element.style.borderColor = '#C38D94';

    setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
    }, 500);
}

// Add shake keyframes dynamically
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyles);

/* =====================================================
   BREATHING SYNC
   ===================================================== */

function initBreathingSync() {
    // Synchronize breathing animations for cohesive effect
    const breathingElements = document.querySelectorAll('.breathing');

    breathingElements.forEach((el, index) => {
        // Slight offset for organic feel
        const delay = (index * 0.5) % 4;
        el.style.animationDelay = `${delay}s`;
    });

    // Shield rings pulsing animation
    const rings = document.querySelectorAll('.ring');
    rings.forEach((ring, index) => {
        ring.style.animation = `pulse ${3 + index * 0.5}s ease-in-out infinite`;
        ring.style.animationDelay = `${index * 0.3}s`;
    });
}

// Add pulse animation for rings
const pulseStyles = document.createElement('style');
pulseStyles.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.4;
        }
    }
`;
document.head.appendChild(pulseStyles);

/* =====================================================
   PATTERN CARDS INTERACTION
   ===================================================== */

document.querySelectorAll('.pattern-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.pattern-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.4s ease-out';
        }
    });

    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.pattern-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0)';
        }
    });
});

/* =====================================================
   SUNSET HAZE CURSOR EFFECT (Subtle)
   ===================================================== */

(function initCursorGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let glowElement = document.createElement('div');
    glowElement.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        pointer-events: none;
        background: radial-gradient(circle, rgba(244, 192, 149, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(glowElement);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Only show glow in hero section
        const heroRect = hero.getBoundingClientRect();
        if (e.clientY < heroRect.bottom) {
            glowElement.style.opacity = '1';
        } else {
            glowElement.style.opacity = '0';
        }
    });

    // Smooth follow animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        glowElement.style.left = `${glowX}px`;
        glowElement.style.top = `${glowY}px`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
})();

/* =====================================================
   PERFORMANCE OPTIMIZATIONS
   ===================================================== */

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll handlers
const optimizedScroll = debounce(() => {
    // Additional scroll-based animations can be added here
}, 10);

window.addEventListener('scroll', optimizedScroll, { passive: true });

// Reduce animations for users who prefer reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.breathing').forEach(el => {
        el.style.animation = 'none';
    });
}
