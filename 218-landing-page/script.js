/**
 * CONSTRUCT - Construction Management Platform
 * Interactive behaviors and animations
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

const throttle = (fn, wait) => {
    let time = Date.now();
    return function() {
        if ((time + wait - Date.now()) < 0) {
            fn.apply(this, arguments);
            time = Date.now();
        }
    };
};

const debounce = (fn, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

// ============================================
// NAVIGATION
// ============================================

class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 50));
        this.initSmoothScroll();
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// ANIMATION OBSERVER
// ============================================

class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Handle staggered children
                    const staggerChildren = entry.target.querySelectorAll('[data-stagger]');
                    staggerChildren.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                    
                    // Trigger confetti burst for completed elements
                    if (entry.target.classList.contains('stair-step')) {
                        this.triggerConfetti(entry.target);
                    }
                }
            });
        }, this.observerOptions);
        
        this.init();
    }

    init() {
        // Observe stair steps
        document.querySelectorAll('.stair-step').forEach(el => {
            this.observer.observe(el);
        });
        
        // Observe feature tiles
        document.querySelectorAll('.feature-tile').forEach(el => {
            this.observer.observe(el);
        });
        
        // Observe case cards
        document.querySelectorAll('.case-card').forEach(el => {
            this.observer.observe(el);
        });
    }

    triggerConfetti(element) {
        const confetti = element.querySelector('.step-confetti');
        if (confetti) {
            confetti.style.transform = 'scale(1.5)';
            confetti.style.opacity = '1';
            
            setTimeout(() => {
                confetti.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================

class CounterAnimator {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.init();
    }

    init() {
        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ============================================
// PARALLAX EFFECTS
// ============================================

class ParallaxEffects {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Register parallax elements
        this.elements = [
            { selector: '.construction-stack', speed: 0.1 },
            { selector: '.floating-confetti', speed: -0.05 },
            { selector: '.hub-orbit', speed: 0.03 }
        ];
        
        window.addEventListener('scroll', throttle(() => this.update(), 20));
    }

    update() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(({ selector, speed }) => {
            const el = document.querySelector(selector);
            if (el) {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const yPos = scrollY * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    }
}

// ============================================
// MAGNETIC SNAP INTERACTIONS
// ============================================

class MagneticSnap {
    constructor() {
        this.elements = document.querySelectorAll('.feature-tile, .case-card, .step-content');
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;
        
        if (!this.isTouch) {
            this.init();
        }
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mouseenter', (e) => this.onEnter(e, el));
            el.addEventListener('mouseleave', (e) => this.onLeave(e, el));
            el.addEventListener('mousemove', throttle((e) => this.onMove(e, el), 16));
        });
    }

    onEnter(e, el) {
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    onLeave(e, el) {
        el.style.transform = '';
        el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    onMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Subtle magnetic pull
        const strength = 0.05;
        const moveX = x * strength;
        const moveY = y * strength;
        
        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}

// ============================================
// PROGRESS BARS ANIMATION
// ============================================

class ProgressAnimator {
    constructor() {
        this.bars = document.querySelectorAll('.mini-bar');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBar(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.init();
    }

    init() {
        this.bars.forEach(bar => {
            this.observer.observe(bar);
        });
    }

    animateBar(bar) {
        const progress = bar.style.getPropertyValue('--progress');
        bar.style.setProperty('--progress', '0%');
        
        setTimeout(() => {
            bar.style.setProperty('--progress', progress);
        }, 100);
    }
}

// ============================================
// ORBIT ANIMATION
// ============================================

class OrbitAnimation {
    constructor() {
        this.nodes = document.querySelectorAll('.orbit-node');
        this.angle = 0;
        this.isVisible = false;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        
        this.init();
    }

    init() {
        const container = document.querySelector('.integration-visual');
        if (container) {
            this.observer.observe(container);
            this.animate();
        }
    }

    animate() {
        if (this.isVisible) {
            this.angle += 0.2;
            
            this.nodes.forEach((node, index) => {
                const baseAngle = (index * 60) + this.angle;
                const radius = 140;
                const radians = (baseAngle * Math.PI) / 180;
                
                const x = Math.cos(radians) * radius;
                const y = Math.sin(radians) * radius;
                
                // Center the node
                const centerX = 200 - 30; // container width/2 - node width/2
                const centerY = 200 - 30; // container height/2 - node height/2
                
                // Only apply subtle orbital movement, not full rotation
                const offsetX = Math.cos(radians) * 10;
                const offsetY = Math.sin(radians) * 10;
                
                node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e, btn));
        });
    }

    createRipple(e, btn) {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Add ripple keyframes to document
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

// ============================================
// STACK LAYER INTERACTIONS
// ============================================

class StackInteraction {
    constructor() {
        this.layers = document.querySelectorAll('.stack-layer');
        this.init();
    }

    init() {
        this.layers.forEach((layer, index) => {
            layer.style.animationDelay = `${0.4 + (index * 0.1)}s`;
            
            layer.addEventListener('mouseenter', () => {
                this.layers.forEach((l, i) => {
                    if (i !== index) {
                        l.style.opacity = '0.6';
                        l.style.transform = 'translateX(-60px) scale(0.98)';
                    }
                });
            });
            
            layer.addEventListener('mouseleave', () => {
                this.layers.forEach(l => {
                    l.style.opacity = '';
                    l.style.transform = '';
                });
            });
        });
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Press '?' to show keyboard shortcuts
            if (e.key === '?' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.showShortcuts();
            }
            
            // Escape to close any modals
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            // Home key to go to top
            if (e.key === 'Home' && e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    showShortcuts() {
        // Simple console log for now - could be expanded to a modal
        console.log('Keyboard Shortcuts:');
        console.log('  ? - Show shortcuts');
        console.log('  Esc - Close modals');
        console.log('  Ctrl+Home - Go to top');
    }

    closeModals() {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('open');
        });
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Load Time:', Math.round(perfData.loadEventEnd), 'ms');
                }
            }, 0);
        });
        
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry.duration, 'ms');
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // PerformanceObserver not supported
            }
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new ScrollAnimator();
    new CounterAnimator();
    new ParallaxEffects();
    new MagneticSnap();
    new ProgressAnimator();
    new OrbitAnimation();
    new RippleEffect();
    new StackInteraction();
    new KeyboardNavigation();
    new PerformanceMonitor();
    
    // Add loaded class for initial animations
    document.body.classList.add('loaded');
});

// ============================================
// SERVICE WORKER REGISTRATION (for PWA capability)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
