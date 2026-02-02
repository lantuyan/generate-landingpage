/**
 * CreatorPulse - Glassmorphism with Soft Industrial
 * Liquid Drift Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initLiquidDrift();
    initPulseRhythm();
    initFormHandling();
    initParallax();
});

/**
 * Navigation Handling
 */
function initNavigation() {
    const nav = document.querySelector('.glass-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    // Scroll effect on navigation
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
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
                mobileMenuBtn.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered Animations (Pulse Rhythm)
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on data-pulse attribute
                const pulseIndex = entry.target.dataset.pulse;
                if (pulseIndex) {
                    entry.target.style.transitionDelay = `${(pulseIndex - 1) * 0.1}s`;
                }
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-pulse attribute
    document.querySelectorAll('[data-pulse]').forEach(el => {
        observer.observe(el);
    });

    // Also observe section elements for stagger effect
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');

                // Animate children with stagger
                const children = entry.target.querySelectorAll('.glass-panel, .glass-card');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.08}s`;
                    child.classList.add('visible');
                });
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Liquid Drift Effect - Smooth parallax on glass elements
 */
function initLiquidDrift() {
    const floatingElements = document.querySelectorAll('.floating-island, .floating-card');
    const orbs = document.querySelectorAll('.gradient-orb');

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Smooth animation loop
    function animate() {
        // Ease towards target
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Apply subtle drift to floating elements
        floatingElements.forEach((el, index) => {
            const depth = (index % 3 + 1) * 0.5;
            const offsetX = currentX * 10 * depth;
            const offsetY = currentY * 10 * depth;

            el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        // Apply drift to gradient orbs
        orbs.forEach((orb, index) => {
            const depth = (index + 1) * 2;
            const offsetX = currentX * 20 * depth;
            const offsetY = currentY * 20 * depth;

            orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        requestAnimationFrame(animate);
    }

    // Only run on desktop
    if (window.matchMedia('(min-width: 1024px)').matches) {
        animate();
    }
}

/**
 * Pulse Rhythm - Heartbeat scroll effect
 */
function initPulseRhythm() {
    const sections = document.querySelectorAll('section');

    const pulseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add pulse effect to visible sections
                entry.target.classList.add('pulse-active');

                // Trigger pulse animation on cards
                const cards = entry.target.querySelectorAll('.glass-panel');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('pulse-beat');
                        setTimeout(() => card.classList.remove('pulse-beat'), 600);
                    }, i * 100);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => pulseObserver.observe(section));

    // Add pulse beat CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .pulse-beat {
            animation: pulseBeat 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes pulseBeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Form Handling
 */
function initFormHandling() {
    const form = document.getElementById('signup-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button[type="submit"]');
            const originalContent = button.innerHTML;

            // Animate button
            button.innerHTML = '<span>Sending...</span>';
            button.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                button.innerHTML = '<span>Welcome aboard!</span>';
                button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                // Show success message
                const note = form.querySelector('.form-note');
                note.innerHTML = 'Check your email for next steps!';
                note.style.color = '#10b981';

                // Reset after delay
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.style.background = '';
                    button.disabled = false;
                    form.reset();
                    note.innerHTML = 'Free 14-day trial • No credit card required';
                    note.style.color = '';
                }, 3000);
            }, 1500);
        });

        // Input focus effects
        const input = form.querySelector('input');
        const inputGroup = form.querySelector('.input-group');

        input.addEventListener('focus', () => {
            inputGroup.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            inputGroup.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.2)';
        });

        input.addEventListener('blur', () => {
            inputGroup.style.borderColor = '';
            inputGroup.style.boxShadow = '';
        });
    }
}

/**
 * Parallax Effects
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    const dashboardPreview = document.querySelector('.dashboard-preview');

    if (!hero || !heroVisual) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroRect = hero.getBoundingClientRect();

        if (heroRect.bottom > 0) {
            const parallaxOffset = scrolled * 0.3;

            if (dashboardPreview) {
                dashboardPreview.style.transform = `translateY(${parallaxOffset * 0.1}px)`;
            }
        }
    }, { passive: true });

    // Gradient orb parallax
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            orb.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

/**
 * Chart Animation for Dashboard Preview
 */
function initChartAnimation() {
    const chartBars = document.querySelectorAll('.chart-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chartBars.forEach((bar, index) => {
                    bar.style.transitionDelay = `${index * 0.1}s`;
                    bar.style.transform = 'scaleY(1)';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const miniChart = document.querySelector('.mini-chart');
    if (miniChart) {
        // Set initial state
        chartBars.forEach(bar => {
            bar.style.transform = 'scaleY(0)';
            bar.style.transformOrigin = 'bottom';
            bar.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        observer.observe(miniChart);
    }
}

// Initialize chart animation after page load
window.addEventListener('load', initChartAnimation);

/**
 * Typing Effect for Hero (Optional Enhancement)
 */
function initTypingEffect() {
    const gradientText = document.querySelector('.hero-title .gradient-text');
    if (!gradientText) return;

    const text = gradientText.textContent;
    gradientText.textContent = '';
    gradientText.style.borderRight = '2px solid var(--gradient-start)';

    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            gradientText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 50);
        } else {
            gradientText.style.borderRight = 'none';
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

/**
 * Counter Animation for Stats
 */
function initCounterAnimation() {
    const statValues = document.querySelectorAll('.stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;

                // Check if it's a number we can animate
                const match = text.match(/^([\d,]+)/);
                if (match) {
                    const target = parseInt(match[1].replace(/,/g, ''));
                    const suffix = text.replace(match[1], '');

                    animateCounter(el, 0, target, suffix);
                }

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));
}

function animateCounter(element, start, end, suffix) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeProgress);

        element.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Initialize counter animation after page load
window.addEventListener('load', initCounterAnimation);

/**
 * Glow Effect on Hover (Cards)
 */
function initGlowEffect() {
    const cards = document.querySelectorAll('.feature-card, .platform-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add glow effect CSS
    const style = document.createElement('style');
    style.textContent = `
        .feature-card::after,
        .platform-card::after,
        .pricing-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: inherit;
            background: radial-gradient(
                400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(99, 102, 241, 0.15),
                transparent 40%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .feature-card:hover::after,
        .platform-card:hover::after,
        .pricing-card:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Initialize glow effect
window.addEventListener('load', initGlowEffect);

/**
 * Keyboard Navigation Enhancements
 */
function initKeyboardNav() {
    // Focus visible styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-nav *:focus {
            outline: 2px solid var(--gradient-start);
            outline-offset: 2px;
        }

        .keyboard-nav *:focus:not(:focus-visible) {
            outline: none;
        }
    `;
    document.head.appendChild(style);
}

// Initialize keyboard navigation
initKeyboardNav();
