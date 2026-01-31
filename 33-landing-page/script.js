/* ========================================
   PSYCHEDELIC LANDING PAGE - JAVASCRIPT
   Soulwave Sanctuary
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initFlowField();
    initScrollAnimations();
    initTestimonialCarousel();
    initFormHandling();
    initParallaxEffects();
});

/* ========================================
   NAVIGATION
   ======================================== */

function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Scroll-based navigation styling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   FLOW FIELD CANVAS ANIMATION
   ======================================== */

function initFlowField() {
    const canvas = document.getElementById('flowfield-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let time = 0;

    // Configuration
    const config = {
        particleCount: 150,
        particleSize: 2,
        connectionDistance: 120,
        speed: 0.5,
        noiseScale: 0.003,
        colors: [
            'rgba(157, 78, 221, 0.6)',
            'rgba(236, 72, 153, 0.6)',
            'rgba(255, 107, 53, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(34, 211, 238, 0.6)'
        ]
    };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    // Simple noise function
    function noise(x, y, t) {
        return Math.sin(x * config.noiseScale + t) *
               Math.cos(y * config.noiseScale + t) *
               Math.sin((x + y) * config.noiseScale * 0.5 + t * 0.5);
    }

    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = 0;
            this.vy = 0;
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }

        update() {
            const angle = noise(this.x, this.y, time) * Math.PI * 4;
            this.vx += Math.cos(angle) * config.speed * 0.1;
            this.vy += Math.sin(angle) * config.speed * 0.1;

            // Damping
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            this.life--;

            // Reset if out of bounds or dead
            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height ||
                this.life <= 0) {
                this.reset();
            }
        }

        draw() {
            const alpha = (this.life / this.maxLife) * 0.8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('0.6', alpha.toString());
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    const alpha = (1 - distance / config.connectionDistance) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(157, 78, 221, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        time += 0.005;

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Pause animation when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */

function initScrollAnimations() {
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.experience-card, .journey-step, .sanctuary-features li, .section-header'
    );

    // Add initial class
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Special handling for journey steps with staggered delay
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.15}s`;
    });

    // Experience cards hover effect enhancement
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ========================================
   TESTIMONIAL CAROUSEL
   ======================================== */

function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (!track || testimonials.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= testimonials.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = testimonials.length - 1;
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            stopAutoPlay();
            startAutoPlay();
        }
    }

    // Start autoplay
    startAutoPlay();

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
}

/* ========================================
   FORM HANDLING
   ======================================== */

function initFormHandling() {
    const form = document.getElementById('portal-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select');

    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;

        // Add loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Entering Portal...';
        submitBtn.classList.add('loading');

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success state
        submitBtn.querySelector('.btn-text').textContent = 'Journey Initiated ✨';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <p>Welcome to the journey. We'll be in touch soon to begin your transformation.</p>
        `;
        successMessage.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 0.5rem;
            color: #34d399;
            text-align: center;
            animation: fadeIn 0.5s ease forwards;
        `;

        form.appendChild(successMessage);

        // Reset after delay
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.classList.remove('success');
            successMessage.remove();
        }, 5000);
    });
}

/* ========================================
   PARALLAX EFFECTS
   ======================================== */

function initParallaxEffects() {
    // Parallax for gradient orbs
    const orbs = document.querySelectorAll('.gradient-orb');

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Mouse parallax effect
    const handleMouseMove = throttle((e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const x = mouseX * speed;
            const y = mouseY * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    }, 16);

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll-based parallax for mandala
    const mandalaContainer = document.querySelector('.mandala-container');
    if (mandalaContainer) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.1;
            mandalaContainer.style.transform = `rotate(${rate}deg)`;
        }, 16));
    }

    // Portal rings animation enhancement
    const portalRings = document.querySelector('.portal-rings');
    if (portalRings) {
        const portalSection = document.getElementById('portal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    portalRings.classList.add('active');
                }
            });
        }, { threshold: 0.5 });

        observer.observe(portalSection);
    }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function
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

// Check for reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize reduced motion handling
if (prefersReducedMotion()) {
    document.documentElement.classList.add('reduce-motion');
}

/* ========================================
   ADDITIONAL VISUAL EFFECTS
   ======================================== */

// Ripple effect on buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .form-success {
        animation: fadeIn 0.5s ease forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .btn.loading .btn-waves .wave {
        animation: waveRipple 1s ease-out infinite;
    }

    .btn.success {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
    }
`;
document.head.appendChild(style);

// Color cycling for certain elements
function initColorCycling() {
    const cyclableElements = document.querySelectorAll('.logo-symbol, .center-symbol, .core-symbol');

    cyclableElements.forEach(el => {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            el.style.filter = `hue-rotate(${hue}deg)`;
        }, 50);
    });
}

// Initialize color cycling if motion is allowed
if (!prefersReducedMotion()) {
    initColorCycling();
}
