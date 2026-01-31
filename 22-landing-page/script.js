/**
 * QuantumCore - Tech Forward Landing Page
 * Interactive JavaScript for animations and functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initQuantumCanvas();
    initCapabilityTabs();
    initScrollAnimations();
    initFormSubmission();
    initMobileMenu();
    initSmoothScroll();
});

/**
 * Navbar scroll behavior
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Quantum Canvas Background Animation
 */
function initQuantumCanvas() {
    const canvas = document.getElementById('quantum-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    // Set canvas size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;

            // Color variations
            const colors = [
                'rgba(0, 212, 255,',   // cyan
                'rgba(59, 130, 246,',  // blue
                'rgba(139, 92, 246,'   // violet
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= dx * force * 0.01;
                this.y -= dy * force * 0.01;
            }

            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    // Create particles
    const createParticles = () => {
        const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 10000));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    createParticles();
    window.addEventListener('resize', createParticles);

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Draw connections between nearby particles
    const drawConnections = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    };

    // Animation loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    };

    // Start animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    });

    observer.observe(canvas);
}

/**
 * Capability Tabs
 */
function initCapabilityTabs() {
    const tabs = document.querySelectorAll('.cap-tab');
    const panels = document.querySelectorAll('.cap-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${targetId}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step-card, .pricing-card, .section-header, .hero-content, .hero-visual, .cap-panel, .cta-content'
    );

    // Add animation classes
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Add stagger delay to grouped elements
        if (el.classList.contains('feature-card') || el.classList.contains('step-card') || el.classList.contains('pricing-card')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Form submission handling
 */
function initFormSubmission() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validate email
        const email = emailInput.value.trim();
        if (!isValidEmail(email)) {
            showFormError(emailInput, 'Please enter a valid email address');
            return;
        }

        // Simulate submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Processing...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="40" stroke-dashoffset="10">
                    <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Success! Check your email</span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            emailInput.value = '';

            // Reset after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showFormError(input, message) {
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';

    // Create error message
    let errorEl = input.parentNode.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'form-error';
        errorEl.style.cssText = 'color: #ef4444; font-size: 13px; margin-top: 8px; text-align: left;';
        input.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;

    // Clear error on input
    input.addEventListener('input', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        if (errorEl) errorEl.remove();
    }, { once: true });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (!toggle) return;

    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            ${navLinks ? navLinks.outerHTML : ''}
            ${navActions ? navActions.outerHTML : ''}
        </div>
    `;

    // Add styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 11, 15, 0.98);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .mobile-menu.active {
            opacity: 1;
            visibility: visible;
        }
        .mobile-menu .mobile-menu-content {
            text-align: center;
        }
        .mobile-menu .nav-links {
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-bottom: 40px;
        }
        .mobile-menu .nav-links a {
            font-size: 24px;
            color: var(--text-primary);
        }
        .mobile-menu .nav-actions {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .mobile-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(mobileMenu);

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Typing animation for hero title (optional enhancement)
 */
function initTypingAnimation() {
    const text = document.querySelector('.hero-title .gradient-text');
    if (!text) return;

    const originalText = text.textContent;
    text.textContent = '';

    let index = 0;
    const typeText = () => {
        if (index < originalText.length) {
            text.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeText, 50);
        }
    };

    // Start after page load
    setTimeout(typeText, 500);
}

/**
 * Counter animation for stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-value');

    const observerOptions = {
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
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasMs = text.includes('ms');
    const hasLessThan = text.includes('<');

    let target = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(target)) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let display = Math.floor(current);
        if (target < 100 && target % 1 !== 0) {
            display = current.toFixed(1);
        }

        let suffix = '';
        if (hasPlus) suffix = '+';
        if (hasPercent) suffix = '%';
        if (hasMs) suffix = 'ms';

        let prefix = hasLessThan ? '<' : '';

        element.textContent = prefix + display + suffix;
    }, duration / steps);
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', initCounterAnimation);

/**
 * Parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');

    if (!hero || !heroVisual) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
            const parallaxValue = scrollY * 0.3;
            heroVisual.style.transform = `translateY(${parallaxValue}px)`;
        }
    }, { passive: true });
}

// Initialize parallax
document.addEventListener('DOMContentLoaded', initParallax);

/**
 * Add hover effect to feature cards
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add dynamic spotlight effect via CSS
    const style = document.createElement('style');
    style.textContent = `
        .feature-card::after,
        .pricing-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(
                400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(0, 212, 255, 0.06),
                transparent 40%
            );
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .feature-card:hover::after,
        .pricing-card:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Initialize card effects
document.addEventListener('DOMContentLoaded', initCardHoverEffects);
