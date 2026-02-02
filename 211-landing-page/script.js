/**
 * CertiFlow - Landing Page Interactions
 * Neo-Geo + Parametric Calm Design System
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initScrollAnimations();
    initCounters();
    initNavigation();
    initSmoothScroll();
    initCertificateHover();
});

/**
 * Scroll Animations using Intersection Observer
 * Implements "razor-clean fades" as specified in design
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .cert-card, .feature-item, .impact-card, .step-card, .chain-step'
    );
    
    // Add animate-on-scroll class to elements
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special handling for chain steps - animate sequentially
                if (entry.target.classList.contains('chain-step')) {
                    animateChainSteps(entry.target);
                }
                
                // Special handling for chart bars
                if (entry.target.classList.contains('impact-card')) {
                    animateChartBars(entry.target);
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Animate chain steps sequentially for verification section
 */
function animateChainSteps(activeStep) {
    const allSteps = document.querySelectorAll('.chain-step');
    const activeIndex = Array.from(allSteps).indexOf(activeStep);
    
    allSteps.forEach((step, index) => {
        if (index <= activeIndex) {
            setTimeout(() => {
                step.classList.add('active');
            }, index * 200);
        }
    });
}

/**
 * Animate chart bars when impact cards come into view
 */
function animateChartBars(card) {
    const bars = card.querySelectorAll('.chart-bar, .mix-bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('animate');
        }, index * 100);
    });
}

/**
 * Counter Animation for Statistics
 * Implements clinical precision in number counting
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
    
    let frame = 0;
    
    const updateCounter = () => {
        frame++;
        const progress = easeOutQuart(frame / totalFrames);
        const current = Math.round(progress * target);
        
        // Format number with commas
        element.textContent = current.toLocaleString();
        
        if (frame < totalFrames) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    requestAnimationFrame(updateCounter);
}

/**
 * Navigation scroll behavior
 * Adds scrolled class for style changes on scroll
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    let ticking = false;
    
    const updateNav = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 12, 0.9)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'rgba(10, 10, 12, 0.7)';
        }
        
        // Hide/show nav on scroll direction (optional)
        if (currentScroll > lastScroll && currentScroll > 500) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Smooth scroll for anchor links
 * Implements parametric calm in scrolling behavior
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Certificate card hover effects
 * Adds parametric interaction patterns
 */
function initCertificateHover() {
    const cards = document.querySelectorAll('.cert-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            const glass = card.querySelector('.cert-glass');
            if (glass) {
                glass.style.boxShadow = '0 20px 60px rgba(20, 184, 166, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const glass = card.querySelector('.cert-glass');
            if (glass) {
                glass.style.boxShadow = '';
            }
        });
    });
}

/**
 * Parallax effect for hero visual elements
 * Creates depth through subtle movement
 */
function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;
    
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        heroVisual.style.transform = `translateY(calc(-50% + ${rate}px))`;
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// Initialize parallax on non-touch devices
if (!window.matchMedia('(pointer: coarse)').matches) {
    initParallax();
}

/**
 * Utility: Debounce function for performance
 */
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

/**
 * Utility: Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Easter egg: Konami code for parametric visualization mode
 */
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateParametricMode();
    }
});

function activateParametricMode() {
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
}
