/**
 * GATHERLY - Landing Page Interactive Script
 * Gradient Modern + Playful Precision Design System
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// ========================================
// NAVIGATION
// ========================================

class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 50), { passive: true });
        
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.mobileMenu?.classList.contains('active') && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for nav background
        if (currentScroll > 50) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
    
    toggleMobileMenu() {
        this.mobileMenuBtn?.classList.toggle('active');
        this.mobileMenu?.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu?.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.mobileMenuBtn?.classList.remove('active');
        this.mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
            
            this.animatedElements.forEach(el => {
                // Get delay from data attribute
                const delay = el.dataset.delay || 0;
                el.style.animationDelay = `${delay}ms`;
                this.observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.animatedElements.forEach(el => this.animateElement(el));
        }
    }
    
    animateElement(element) {
        // Add animate class with a micro-delay for stagger effect
        requestAnimationFrame(() => {
            element.classList.add('animate');
        });
        
        // Trigger confetti for special elements
        if (element.classList.contains('cta-content') || element.classList.contains('hero-content')) {
            setTimeout(() => {
                window.confetti?.burst({
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    count: 30
                });
            }, 500);
        }
    }
}

// ========================================
// CONFETTI SYSTEM
// ========================================

class ConfettiSystem {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = true;
        this.colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#fa709a', '#fee140',
            '#4ade80', '#fbbf24'
        ];
        
        this.resize();
        this.init();
    }
    
    init() {
        window.addEventListener('resize', debounce(() => this.resize(), 250));
        
        // Only run on non-touch devices for performance
        if (!window.matchMedia('(pointer: coarse)').matches) {
            this.animate();
            this.setupScrollTriggers();
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle(x, y, options = {}) {
        const size = options.size || Math.random() * 8 + 4;
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -20,
            size: size,
            speedY: options.speedY || Math.random() * 2 + 1,
            speedX: options.speedX || (Math.random() - 0.5) * 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4,
            color: options.color || this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: 1,
            decay: options.decay || 0.005 + Math.random() * 0.005,
            shape: options.shape || ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)]
        };
    }
    
    burst(options = {}) {
        const count = options.count || 20;
        const x = options.x || this.canvas.width / 2;
        const y = options.y || this.canvas.height / 2;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
            const velocity = Math.random() * 8 + 4;
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 10 + 6,
                speedY: Math.sin(angle) * velocity,
                speedX: Math.cos(angle) * velocity,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: 1,
                decay: 0.01 + Math.random() * 0.01,
                shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)],
                gravity: 0.2
            });
        }
    }
    
    addAmbientParticle() {
        if (this.particles.length < 15 && Math.random() < 0.02) {
            this.particles.push(this.createParticle());
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate((particle.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        
        switch (particle.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -particle.size / 2);
                this.ctx.lineTo(-particle.size / 2, particle.size / 2);
                this.ctx.lineTo(particle.size / 2, particle.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
                
            case 'square':
            default:
                this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        }
        
        this.ctx.restore();
    }
    
    update() {
        this.particles = this.particles.filter(particle => {
            // Apply gravity if exists
            if (particle.gravity) {
                particle.speedY += particle.gravity;
            }
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;
            particle.opacity -= particle.decay;
            
            // Return true to keep particle
            return particle.opacity > 0 && particle.y < this.canvas.height + 50;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => this.drawParticle(particle));
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.addAmbientParticle();
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupScrollTriggers() {
        // Burst confetti at specific scroll positions
        const triggerPoints = [
            { selector: '.hero', offset: 0.5 },
            { selector: '.features', offset: 0.3 },
            { selector: '.cta', offset: 0.5 }
        ];
        
        const triggered = new Set();
        
        window.addEventListener('scroll', throttle(() => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            triggerPoints.forEach(point => {
                if (triggered.has(point.selector)) return;
                
                const element = document.querySelector(point.selector);
                if (!element) return;
                
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const triggerPoint = elementTop + (rect.height * point.offset);
                
                if (scrollY + windowHeight > triggerPoint && scrollY < elementTop + rect.height) {
                    triggered.add(point.selector);
                    this.burst({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        count: 25
                    });
                }
            });
        }, 100), { passive: true });
    }
    
    destroy() {
        this.isActive = false;
    }
}

// ========================================
// PULSE SCROLLING RHYTHM
// ========================================

class PulseScrolling {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }
    
    init() {
        // Add scroll-linked parallax effects
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 16), { passive: true });
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const progress = 1 - (rect.top / windowHeight);
            
            if (progress > 0 && progress < 1.5) {
                // Subtle parallax on backgrounds
                const bg = section.querySelector('.hero-bg, .cta-bg, .hiw-bg');
                if (bg) {
                    bg.style.transform = `translateY(${scrollY * 0.1}px)`;
                }
                
                // Pulse effect on cards when in view
                const cards = section.querySelectorAll('.feature-card, .step, .story-card');
                cards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    const cardProgress = 1 - (cardRect.top / windowHeight);
                    
                    if (cardProgress > 0.3 && cardProgress < 0.8) {
                        card.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 2}px)`;
                    }
                });
            }
        });
    }
}

// ========================================
// ELASTIC INTERACTIONS
// ========================================

class ElasticInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        // Add elastic hover effect to cards
        const cards = document.querySelectorAll('.feature-card, .story-card, .pricing-card, .step');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.onMouseEnter(e, card));
            card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
            card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
        });
        
        // Elastic button press
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.95)';
            });
            btn.addEventListener('mouseup', () => {
                btn.style.transform = '';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    
    onMouseEnter(e, card) {
        card.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
    
    onMouseLeave(e, card) {
        card.style.transform = '';
        card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
    
    onMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (y / rect.height) * -5;
        const rotateY = (x / rect.width) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
}

// ========================================
// FORM HANDLING
// ========================================

class FormHandler {
    constructor() {
        this.form = document.querySelector('.cta-form');
        this.input = document.querySelector('.cta-input');
        this.button = document.querySelector('.cta-btn');
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.input?.value.trim();
        
        if (!email || !this.isValidEmail(email)) {
            this.showFeedback('Please enter a valid email address', 'error');
            this.input?.focus();
            return;
        }
        
        // Simulate submission
        this.button.disabled = true;
        this.button.innerHTML = '<span class="btn-loader">◌</span>';
        
        setTimeout(() => {
            this.showFeedback('Thanks! You\'re on the list ✨', 'success');
            this.input.value = '';
            this.button.disabled = false;
            this.button.innerHTML = 'Get Early Access <span class="btn-arrow">→</span>';
            
            // Confetti celebration
            window.confetti?.burst({
                x: this.button.getBoundingClientRect().left + this.button.offsetWidth / 2,
                y: this.button.getBoundingClientRect().top,
                count: 50
            });
        }, 1500);
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showFeedback(message, type) {
        // Remove existing feedback
        const existing = document.querySelector('.form-feedback');
        existing?.remove();
        
        const feedback = document.createElement('div');
        feedback.className = `form-feedback form-feedback--${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#4ade80' : '#f5576c'};
            color: white;
            border-radius: 9999px;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    }
    
    handleClick(e, anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// POLLING INTERACTION (Hero Demo)
// ========================================

class PollInteraction {
    constructor() {
        this.pollOptions = document.querySelectorAll('.poll-option');
        this.init();
    }
    
    init() {
        this.pollOptions.forEach(option => {
            option.addEventListener('click', () => this.selectOption(option));
        });
    }
    
    selectOption(selected) {
        this.pollOptions.forEach(option => {
            option.classList.remove('selected');
        });
        selected.classList.add('selected');
        
        // Animate the bar
        const bar = selected.querySelector('.poll-bar');
        if (bar) {
            const originalWidth = bar.style.getPropertyValue('--percent');
            bar.style.setProperty('--percent', '0%');
            setTimeout(() => {
                bar.style.transition = 'width 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                bar.style.setProperty('--percent', originalWidth);
            }, 50);
        }
        
        // Small confetti burst
        const rect = selected.getBoundingClientRect();
        window.confetti?.burst({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            count: 10,
            color: '#667eea'
        });
    }
}

// ========================================
// PAGE LOADER
// ========================================

class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        // Add loaded class after page loads
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Trigger hero animations
            setTimeout(() => {
                document.querySelectorAll('.hero [data-animate]').forEach(el => {
                    el.classList.add('animate');
                });
                
                // Initial confetti burst
                window.confetti?.burst({
                    count: 30
                });
            }, 300);
        });
    }
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    window.navigation = new Navigation();
    window.confetti = new ConfettiSystem();
    window.scrollAnimations = new ScrollAnimations();
    window.pulseScrolling = new PulseScrolling();
    window.elasticInteractions = new ElasticInteractions();
    window.formHandler = new FormHandler();
    window.smoothScroll = new SmoothScroll();
    window.pollInteraction = new PollInteraction();
    window.pageLoader = new PageLoader();
    
    // Add CSS animation keyframes for feedback
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(100%); opacity: 0; }
        }
        .btn-loader {
            display: inline-block;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.confetti?.destroy();
});
