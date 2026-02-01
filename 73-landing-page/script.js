/**
 * GenomIQ - Scientific/Laboratory Landing Page
 * Smooth, calibrated animations with scientific precision
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initParticleField();
    initDNAHelix();
    initCountUpAnimation();
    initScrollReveal();
    initProcessTimeline();
    initBiomarkerTabs();
    initDataBars();
    initFormSubmission();
    initSmoothScroll();
});

/**
 * Navigation - Scroll effects and mobile toggle
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    const links = navLinks?.querySelectorAll('a');
    links?.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });
}

/**
 * Particle Field - Floating scientific particles
 */
function initParticleField() {
    const field = document.getElementById('particleField');
    if (!field) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 4}s`;
        particle.style.opacity = `${0.1 + Math.random() * 0.3}`;
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        field.appendChild(particle);
    }
}

/**
 * DNA Helix - Animated helix visualization
 */
function initDNAHelix() {
    const container = document.getElementById('dnaHelix');
    if (!container) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 400');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const numPoints = 20;
    const amplitude = 40;
    const centerX = 100;

    // Create helix strands
    for (let strand = 0; strand < 2; strand++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = '';

        for (let i = 0; i <= numPoints; i++) {
            const y = (i / numPoints) * 400;
            const phase = strand * Math.PI;
            const x = centerX + Math.sin((i / numPoints) * 4 * Math.PI + phase) * amplitude;

            if (i === 0) {
                d += `M ${x} ${y}`;
            } else {
                d += ` L ${x} ${y}`;
            }
        }

        path.setAttribute('d', d);
        path.setAttribute('stroke', '#0066FF');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.style.animation = `helixRotate ${8 + strand * 2}s linear infinite`;
        svg.appendChild(path);
    }

    // Add connecting bars
    for (let i = 0; i < numPoints; i++) {
        const y = (i / numPoints) * 400;
        const x1 = centerX + Math.sin((i / numPoints) * 4 * Math.PI) * amplitude;
        const x2 = centerX + Math.sin((i / numPoints) * 4 * Math.PI + Math.PI) * amplitude;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#0066FF');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.3');
        svg.appendChild(line);

        // Base pair circles
        const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle1.setAttribute('cx', x1);
        circle1.setAttribute('cy', y);
        circle1.setAttribute('r', '4');
        circle1.setAttribute('fill', '#0066FF');
        svg.appendChild(circle1);

        const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle2.setAttribute('cx', x2);
        circle2.setAttribute('cy', y);
        circle2.setAttribute('r', '4');
        circle2.setAttribute('fill', '#00C853');
        svg.appendChild(circle2);
    }

    container.appendChild(svg);

    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes helixRotate {
            0% { transform: translateY(0); }
            100% { transform: translateY(-40px); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Count Up Animation - Animated statistics
 */
function initCountUpAnimation() {
    const stats = document.querySelectorAll('.stat-value[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCount(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Scroll Reveal - Elements animate on scroll
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal], .science-card, .research-card, .stat-block, .pricing-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.classList.add('revealed');

                    // Animate data bars within revealed cards
                    const dataBars = entry.target.querySelectorAll('.bar-fill');
                    dataBars.forEach(bar => {
                        const width = bar.dataset.width;
                        bar.style.setProperty('--width', width);
                    });
                }, index * 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Process Timeline - Interactive steps
 */
function initProcessTimeline() {
    const steps = document.querySelectorAll('.process-step');
    const lineProgress = document.getElementById('lineProgress');

    if (!steps.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    let activeSteps = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                activeSteps = Math.max(activeSteps, parseInt(entry.target.dataset.step));

                // Update progress line
                if (lineProgress) {
                    const progress = ((activeSteps - 1) / (steps.length - 1)) * 100;
                    lineProgress.style.width = `${progress}%`;
                }
            }
        });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));
}

/**
 * Biomarker Tabs - Tab switching functionality
 */
function initBiomarkerTabs() {
    const tabs = document.querySelectorAll('.biomarker-tab');
    const panels = document.querySelectorAll('.biomarker-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetId) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Data Bars - Animate on reveal
 */
function initDataBars() {
    const bars = document.querySelectorAll('.bar-fill');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.width = `${width}%`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    bars.forEach(bar => observer.observe(bar));
}

/**
 * Form Submission - Handle CTA form
 */
function initFormSubmission() {
    const form = document.getElementById('ctaForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('.btn-submit');
        const originalText = button.innerHTML;

        // Simulate submission
        button.innerHTML = `
            <span>Processing...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
        `;
        button.disabled = true;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            button.innerHTML = `
                <span>Analysis Started!</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            button.style.background = '#00C853';

            // Reset after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });
}

/**
 * Smooth Scroll - Smooth anchor scrolling
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * CTA DNA Strand - Background animation
 */
function initCTADNAStrand() {
    const container = document.getElementById('dnaStrand');
    if (!container) return;

    // Create animated DNA background
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0, 102, 255, 0.3)';
        ctx.lineWidth = 2;

        // Draw sine waves
        for (let wave = 0; wave < 3; wave++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 +
                    Math.sin((x / 100) + time + (wave * Math.PI / 3)) * 50 +
                    Math.sin((x / 50) + time * 0.5 + (wave * Math.PI / 3)) * 25;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        time += 0.02;
        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize CTA strand after page load
window.addEventListener('load', initCTADNAStrand);

/**
 * Gauge Animation - Animate biomarker gauges on tab switch
 */
document.querySelectorAll('.biomarker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Re-trigger gauge animations when tab changes
        setTimeout(() => {
            const activePanel = document.querySelector('.biomarker-panel.active');
            const gauges = activePanel?.querySelectorAll('.gauge-fill');

            gauges?.forEach(gauge => {
                gauge.style.transition = 'none';
                gauge.style.strokeDashoffset = '110';

                setTimeout(() => {
                    gauge.style.transition = 'stroke-dashoffset 1s ease-out';
                    gauge.style.strokeDashoffset = gauge.getAttribute('stroke-dashoffset');
                }, 50);
            });
        }, 100);
    });
});

/**
 * Resize Handler - Update canvas on window resize
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const dnaStrand = document.getElementById('dnaStrand');
        if (dnaStrand) {
            const canvas = dnaStrand.querySelector('canvas');
            if (canvas) {
                canvas.width = dnaStrand.offsetWidth;
                canvas.height = dnaStrand.offsetHeight;
            }
        }
    }, 250);
});

/**
 * Prefers Reduced Motion - Respect user preference
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}
