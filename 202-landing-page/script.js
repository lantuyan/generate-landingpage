/**
 * PawPal Landing Page - Interactive Script
 * Glassmorphism + Playful Precision Design
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initConfetti();
    initScrollAnimations();
    initCounters();
    initTestimonialSlider();
    initSmoothScroll();
    initButtonEffects();
});

/**
 * Navigation - Glass effect on scroll
 */
function initNavigation() {
    const nav = document.querySelector('.nav-glass');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Add scroll class on scroll
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
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });
    }
}

/**
 * Confetti - Floating particle effects
 */
function initConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    
    const colors = [
        '#FF6B6B', // coral
        '#FFD166', // yellow
        '#06D6A0', // mint
        '#118AB2', // sky
        '#9B5DE5', // lavender
        '#FF6B9D', // pink
    ];
    
    const particleCount = window.matchMedia('(pointer: coarse)').matches ? 15 : 25;
    
    for (let i = 0; i < particleCount; i++) {
        createConfettiParticle(container, colors);
    }
}

function createConfettiParticle(container, colors) {
    const particle = document.createElement('div');
    particle.className = 'confetti';
    
    // Random properties
    const size = Math.random() * 12 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 8 + 8;
    const shape = Math.random() > 0.5 ? '50%' : '2px';
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        border-radius: ${shape};
    `;
    
    container.appendChild(particle);
    
    // Recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            createConfettiParticle(container, colors);
        }
    }, (delay + duration) * 1000);
}

/**
 * Scroll Animations - Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.step-card, .feature-card, .friendship-card, .testimonial-card, .safety-list li'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay based on element index
                const delay = index % 3 * 100;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}

/**
 * Counter Animation - Stats counting up
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
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
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Elastic easing
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (target - startValue) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
            
            // Celebrate with confetti burst
            createConfettiBurst(element);
        }
    }
    
    requestAnimationFrame(update);
}

function createConfettiBurst(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#FF6B6B', '#FFD166', '#06D6A0', '#FF6B9D'];
    
    for (let i = 0; i < 8; i++) {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
        `;
        
        document.body.appendChild(burst);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        burst.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }).addEventListener('finish', () => burst.remove());
    }
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let interval;
    
    if (cards.length === 0 || dots.length === 0) return;
    
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
        const next = (currentIndex + 1) % cards.length;
        showTestimonial(next);
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetInterval();
        });
    });
    
    // Auto-advance
    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextTestimonial, 5000);
    }
    
    resetInterval();
    
    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', resetInterval);
    }
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            const navHeight = document.querySelector('.nav-glass').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Button Effects - Click animations
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-nav, .feature-card, .step-card');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Form handling
 */
document.querySelector('.signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = this.querySelector('input[type="email"]');
    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    
    // Show success state
    input.disabled = true;
    button.innerHTML = '<span>Welcome! 🎉</span>';
    button.style.background = 'linear-gradient(135deg, #06D6A0, #05b086)';
    
    // Confetti celebration
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const colors = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#9B5DE5'];
            const burst = document.createElement('div');
            burst.style.cssText = `
                position: fixed;
                width: 12px;
                height: 12px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 9999;
                left: 50%;
                top: 50%;
            `;
            document.body.appendChild(burst);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const rotation = Math.random() * 720;
            
            burst.animate([
                { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }).addEventListener('finish', () => burst.remove());
        }, i * 30);
    }
    
    // Reset after delay
    setTimeout(() => {
        input.disabled = false;
        input.value = '';
        button.innerHTML = originalText;
        button.style.background = '';
    }, 3000);
});

/**
 * Parallax effect for floating cards
 */
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

function updateParallax() {
    const scrolled = window.pageYOffset;
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = scrolled * speed;
        card.style.transform = `translateY(${yPos}px)`;
    });
}

/**
 * Mouse move effect for hero visual (desktop only)
 */
if (!window.matchMedia('(pointer: coarse)').matches) {
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const cards = heroVisual.querySelectorAll('.floating-card');
            cards.forEach((card, index) => {
                const factor = (index + 1) * 10;
                card.style.transform += ` translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }
}

/**
 * Connection line animation
 */
function animateConnectionLines() {
    const lines = document.querySelectorAll('.connection-line');
    
    lines.forEach((line, index) => {
        line.style.opacity = '0.3';
        
        setInterval(() => {
            line.animate([
                { opacity: 0.3 },
                { opacity: 0.8 },
                { opacity: 0.3 }
            ], {
                duration: 2000,
                easing: 'ease-in-out'
            });
        }, 3000 + index * 1000);
    });
}

animateConnectionLines();

/**
 * Calendar day animation
 */
function animateCalendarDays() {
    const days = document.querySelectorAll('.cal-day');
    
    days.forEach((day, index) => {
        day.addEventListener('mouseenter', () => {
            day.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.15)' },
                { transform: 'scale(1.1)' }
            ], {
                duration: 400,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                fill: 'forwards'
            });
        });
        
        day.addEventListener('mouseleave', () => {
            day.animate([
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
            ], {
                duration: 200,
                easing: 'ease-out',
                fill: 'forwards'
            });
        });
    });
}

animateCalendarDays();

/**
 * Friendship card heart animation trigger
 */
document.querySelectorAll('.friendship-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const heart = card.querySelector('.connection-heart');
        if (heart) {
            heart.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.4)' },
                { transform: 'scale(1.2)' },
                { transform: 'scale(1.3)' },
                { transform: 'scale(1)' }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
        }
    });
});

/**
 * Step card emoji bounce on hover
 */
document.querySelectorAll('.step-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const emoji = card.querySelector('.step-emoji');
        if (emoji) {
            emoji.animate([
                { transform: 'translateY(0) rotate(0deg)' },
                { transform: 'translateY(-15px) rotate(-10deg)' },
                { transform: 'translateY(0) rotate(0deg)' },
                { transform: 'translateY(-8px) rotate(5deg)' },
                { transform: 'translateY(0) rotate(0deg)' }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
        }
    });
});

/**
 * Easter egg - Konami code for confetti explosion
 */
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // MEGA CONFETTI EXPLOSION!
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const colors = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#9B5DE5', '#FF6B9D', '#FF4781'];
                const burst = document.createElement('div');
                burst.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 15 + 5}px;
                    height: ${Math.random() * 15 + 5}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: ${Math.random() > 0.3 ? '50%' : Math.random() * 10 + 'px'};
                    pointer-events: none;
                    z-index: 9999;
                    left: 50%;
                    top: 50%;
                `;
                document.body.appendChild(burst);
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 200 + Math.random() * 400;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const rotation = Math.random() * 1080;
                
                burst.animate([
                    { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0) rotate(${rotation}deg)`, opacity: 0 }
                ], {
                    duration: 1500 + Math.random() * 1000,
                    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                }).addEventListener('finish', () => burst.remove());
            }, i * 10);
        }
        
        // Show fun message
        const message = document.createElement('div');
        message.textContent = '🐾 You found the secret! 🐾';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: 800;
            color: #FF4781;
            text-shadow: 0 4px 20px rgba(255, 71, 129, 0.3);
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(message);
        
        message.animate([
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -80%) scale(0.9)' }
        ], {
            duration: 2500,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }).addEventListener('finish', () => message.remove());
    }
});

// Log friendly message
console.log('%c🐾 PawPal', 'font-size: 24px; font-weight: bold; color: #FF4781;');
console.log('%cWelcome to the pack! Try the Konami code for a surprise...', 'font-size: 14px; color: #666;');
