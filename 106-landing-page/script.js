/* ========================================
   RouteForge - JavaScript
   Dark Mode First + Analog Tech
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initMetricCounters();
    initLiveClock();
    initPackageCounter();
    initFormHandler();
    initConfetti();
});

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const nav = document.querySelector('.nav');

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }

    // Navbar scroll effect with friction
    let lastScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (lastScrollY > 50) {
                    nav.style.background = 'rgba(10, 10, 15, 0.95)';
                    nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                } else {
                    nav.style.background = 'rgba(10, 10, 15, 0.9)';
                    nav.style.boxShadow = 'none';
                }
                ticking = false;
            });

            ticking = true;
        }
    });

    // Smooth scroll for anchor links with friction effect
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;

                // Frictiony scroll animation
                smoothScrollTo(offsetTop, 800);
            }
        });
    });
}

// Custom smooth scroll with friction
function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    const startTime = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);

        window.scrollTo(0, startY + diff * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/* ========================================
   Scroll Animations (Staccato Rhythm)
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staccato timing - quick bursts with slight delays
                setTimeout(() => {
                    entry.target.classList.add('visible');

                    // Trigger confetti on key elements
                    if (entry.target.classList.contains('confetti-trigger')) {
                        triggerConfetti(entry.target);
                    }
                }, index * 50); // Staccato delay

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .section-header, .int-feature, .dash-metric'
    );

    animatedElements.forEach(el => observer.observe(el));

    // Add confetti trigger class to key metrics
    document.querySelectorAll('.metric-card, .gauge-fill').forEach(el => {
        el.classList.add('confetti-trigger');
    });
}

/* ========================================
   Metric Counters Animation
   ======================================== */
function initMetricCounters() {
    const counters = document.querySelectorAll('.metric-value[data-value]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseFloat(counter.dataset.value);
                animateCounter(counter, targetValue);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for mechanical feel
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const current = startValue + (target - startValue) * easeProgress;

        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final value with confetti burst
            if (isDecimal) {
                element.textContent = target.toFixed(1);
            } else {
                element.textContent = target;
            }

            // Small confetti burst on completion
            const rect = element.getBoundingClientRect();
            createConfettiBurst(rect.left + rect.width / 2, rect.top);
        }
    }

    requestAnimationFrame(update);
}

/* ========================================
   Live Clock (Analog Tech feel)
   ======================================== */
function initLiveClock() {
    const clockElement = document.getElementById('live-time');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ========================================
   Package Counter (Live simulation)
   ======================================== */
function initPackageCounter() {
    const counterElement = document.getElementById('package-counter');
    if (!counterElement) return;

    let baseCount = 2847293;

    function updateCounter() {
        // Simulate packages being tracked - random increment
        const increment = Math.floor(Math.random() * 5) + 1;
        baseCount += increment;

        // Format with commas
        counterElement.textContent = baseCount.toLocaleString();
    }

    // Update every 2-4 seconds for realistic feel
    function scheduleUpdate() {
        const delay = 2000 + Math.random() * 2000;
        setTimeout(() => {
            updateCounter();
            scheduleUpdate();
        }, delay);
    }

    scheduleUpdate();
}

/* ========================================
   Form Handler
   ======================================== */
function initFormHandler() {
    const form = document.getElementById('demo-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span>';
        submitBtn.style.opacity = '0.7';

        // Simulate form submission
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = '<span>Request Sent!</span> <span style="color: #00ff88;">✓</span>';
            submitBtn.style.background = 'var(--color-surface)';
            submitBtn.style.color = 'var(--color-accent)';
            submitBtn.style.border = '2px solid var(--color-accent)';

            // Trigger celebration confetti
            triggerCelebrationConfetti();

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.style.border = '';
            }, 3000);
        }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

/* ========================================
   Confetti System (Confetti Highlights)
   ======================================== */
function initConfetti() {
    // Add hover confetti to key interactive elements
    const confettiTriggers = document.querySelectorAll(
        '.btn-primary, .pricing-card.featured, .metric-card'
    );

    confettiTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 3);
        });
    });
}

function createConfettiBurst(x, y, count = 5) {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#00ff88', '#00d4ff', '#ff6b35', '#a855f7'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 8;
        const spreadX = (Math.random() - 0.5) * 100;
        const rotation = Math.random() * 360;

        confetti.style.cssText = `
            left: ${x + spreadX}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            transform: rotate(${rotation}deg);
        `;

        container.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function triggerConfetti(element) {
    const rect = element.getBoundingClientRect();
    createConfettiBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        8
    );
}

function triggerCelebrationConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#00ff88', '#00d4ff', '#ff6b35', '#a855f7', '#ffffff'];
    const screenWidth = window.innerWidth;

    // Create multiple bursts across the screen
    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';

                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = 8 + Math.random() * 12;
                const x = Math.random() * screenWidth;
                const delay = Math.random() * 500;

                confetti.style.cssText = `
                    left: ${x}px;
                    top: -20px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                    animation-delay: ${delay}ms;
                `;

                container.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3500);
            }
        }, burst * 200);
    }
}

/* ========================================
   Gauge Animation
   ======================================== */
// Animate gauge on scroll into view
const gaugeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const gauge = entry.target;
            gauge.style.strokeDashoffset = '16'; // Target value for 99.2%
            gaugeObserver.unobserve(gauge);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.gauge-fill').forEach(gauge => {
    gauge.style.strokeDashoffset = '314'; // Start hidden
    gaugeObserver.observe(gauge);
});

/* ========================================
   Bar Fill Animation
   ======================================== */
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.bar-fill');
            if (bar) {
                bar.style.width = bar.style.getPropertyValue('--fill');
            }
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-bar').forEach(metricBar => {
    const bar = metricBar.querySelector('.bar-fill');
    if (bar) {
        bar.style.width = '0';
    }
    barObserver.observe(metricBar);
});

/* ========================================
   Frictiony Hover Effects
   ======================================== */
document.querySelectorAll('.feature-card, .int-feature, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    card.addEventListener('mouseleave', function(e) {
        this.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
});

/* ========================================
   Keyboard Navigation
   ======================================== */
document.addEventListener('keydown', function(e) {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
});

/* ========================================
   Performance: Debounce Scroll Events
   ======================================== */
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

// Optimize resize events
window.addEventListener('resize', debounce(function() {
    // Recalculate any size-dependent features
}, 250));

/* ========================================
   Preloader (Optional Enhancement)
   ======================================== */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Initial confetti burst on load
    setTimeout(() => {
        const heroMetrics = document.querySelectorAll('.metric-card');
        heroMetrics.forEach((metric, index) => {
            setTimeout(() => {
                const rect = metric.getBoundingClientRect();
                createConfettiBurst(rect.left + rect.width / 2, rect.top, 4);
            }, index * 200);
        });
    }, 1000);
});
