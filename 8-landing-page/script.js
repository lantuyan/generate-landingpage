/**
 * NexusShield - Dark Mode First Landing Page
 * Premium Cybersecurity Intelligence Platform
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initParticles();
    initTerminal();
    initScrollAnimations();
    initCounters();
    initTestimonials();
    initContactForm();
    initSmoothScroll();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Particle field animation
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const x = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 3 + Math.random() * 2;
    const size = 1 + Math.random() * 2;

    particle.style.cssText = `
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
}

/**
 * Terminal animation
 */
function initTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;

    const logs = [
        { type: 'success', text: '[SHIELD] System initialized successfully' },
        { type: 'info', text: '[SCAN] Deep network analysis in progress...' },
        { type: 'warning', text: '[ALERT] Suspicious activity detected: 192.168.1.45' },
        { type: 'success', text: '[BLOCK] Threat neutralized automatically' },
        { type: 'info', text: '[INTEL] Updating threat signatures...' },
        { type: 'success', text: '[SCAN] Network perimeter secure' },
        { type: 'info', text: '[MONITOR] Real-time protection active' },
        { type: 'warning', text: '[ALERT] Brute force attempt blocked: 10.0.0.123' },
        { type: 'success', text: '[BLOCK] IP address quarantined' },
        { type: 'info', text: '[SYNC] Synchronizing with global threat network...' },
    ];

    let currentIndex = 5;

    function addLogEntry() {
        const log = logs[currentIndex % logs.length];
        const entry = document.createElement('div');
        entry.className = `log-entry ${log.type}`;
        entry.textContent = log.text;
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-10px)';

        terminalOutput.appendChild(entry);

        // Animate in
        requestAnimationFrame(() => {
            entry.style.transition = 'all 0.3s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        });

        // Remove old entries
        const entries = terminalOutput.querySelectorAll('.log-entry');
        if (entries.length > 6) {
            const oldEntry = entries[0];
            oldEntry.style.opacity = '0';
            oldEntry.style.transform = 'translateX(-10px)';
            setTimeout(() => oldEntry.remove(), 300);
        }

        currentIndex++;
    }

    setInterval(addLogEntry, 3000);
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Also animate sections as they come into view
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));
}

/**
 * Animated counters
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    if (!counters.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = target * easeOutQuart;

        if (isDecimal) {
            element.textContent = current.toFixed(2);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isDecimal) {
                element.textContent = target.toFixed(2);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
    }

    requestAnimationFrame(update);
}

/**
 * Testimonials slider
 */
function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');

    if (!cards.length || !dots.length) return;

    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    }

    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % cards.length;
        showTestimonial(nextIndex);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            showTestimonial(index);
            startAutoplay();
        });
    });

    // Touch/swipe support
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextTestimonial();
                } else {
                    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
                    showTestimonial(prevIndex);
                }
            }
        }
    }

    startAutoplay();
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            <span>Processing...</span>
        `;

        // Add spinner animation
        const spinner = submitBtn.querySelector('.spinner');
        if (spinner) {
            spinner.style.cssText = 'width: 18px; height: 18px; animation: spin 1s linear infinite;';
        }

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span>Request Sent!</span>
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });

    // Add focus effects
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Add CSS for spinner animation
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: var(--accent-cyan);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
    }
`;
document.head.appendChild(style);

/**
 * Threat point animations on the hero section
 */
function initThreatAnimations() {
    const threatPoints = document.querySelectorAll('.threat-point');

    threatPoints.forEach((point, index) => {
        // Random position changes
        setInterval(() => {
            if (Math.random() > 0.7) {
                point.classList.toggle('blocked');
            }
        }, 3000 + index * 1000);
    });
}

// Initialize threat animations after DOM load
document.addEventListener('DOMContentLoaded', initThreatAnimations);

/**
 * Dashboard widget animations
 */
function initDashboardAnimations() {
    const dashboard = document.querySelector('.dashboard-preview');
    if (!dashboard) return;

    // Animate network graph periodically
    const graphLine = dashboard.querySelector('.graph-line');
    if (graphLine) {
        setInterval(() => {
            graphLine.style.strokeDashoffset = '300';
            requestAnimationFrame(() => {
                graphLine.style.transition = 'none';
                graphLine.style.strokeDashoffset = '300';
                requestAnimationFrame(() => {
                    graphLine.style.transition = 'stroke-dashoffset 2s ease';
                    graphLine.style.strokeDashoffset = '0';
                });
            });
        }, 5000);
    }

    // Update threat items periodically
    const threatList = dashboard.querySelector('.threat-list');
    if (threatList) {
        const threats = [
            { name: 'DDoS Attempt', status: 'blocked', time: 'Just now' },
            { name: 'SQL Injection', status: 'blocked', time: '2m ago' },
            { name: 'XSS Attack', status: 'blocked', time: '5m ago' },
            { name: 'Brute Force', status: 'blocked', time: '10m ago' },
            { name: 'Port Scan', status: 'monitoring', time: '15m ago' },
            { name: 'Phishing Link', status: 'blocked', time: '20m ago' },
        ];

        let threatIndex = 0;

        setInterval(() => {
            const items = threatList.querySelectorAll('.threat-item');
            if (items.length > 0) {
                const firstItem = items[0];
                firstItem.style.opacity = '0';
                firstItem.style.transform = 'translateX(-10px)';

                setTimeout(() => {
                    const threat = threats[threatIndex % threats.length];
                    const newItem = document.createElement('div');
                    newItem.className = 'threat-item';
                    newItem.style.opacity = '0';
                    newItem.style.transform = 'translateX(10px)';
                    newItem.innerHTML = `
                        <span class="threat-status ${threat.status}"></span>
                        <span class="threat-name">${threat.name}</span>
                        <span class="threat-time">${threat.time}</span>
                    `;

                    firstItem.remove();
                    threatList.appendChild(newItem);

                    requestAnimationFrame(() => {
                        newItem.style.transition = 'all 0.3s ease';
                        newItem.style.opacity = '1';
                        newItem.style.transform = 'translateX(0)';
                    });

                    threatIndex++;
                }, 300);
            }
        }, 4000);
    }
}

// Initialize dashboard animations
document.addEventListener('DOMContentLoaded', initDashboardAnimations);

/**
 * Intersection Observer for fade-in effects
 */
function initFadeInAnimations() {
    const elements = document.querySelectorAll('.feature-card, .stat-card, .pricing-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initFadeInAnimations);

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu?.classList.contains('active')) {
            toggle?.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Prefers reduced motion check
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}
