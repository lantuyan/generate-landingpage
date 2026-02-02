/**
 * StillPoint — Breathing Demo & Interactive Features
 * Bauhaus with Zen Kinetics
 */

// ========================================
// BREATHING DEMO CONTROLLER
// ========================================

const breathingPatterns = {
    '478': {
        name: '4-7-8 Breathing',
        steps: [
            { text: 'Inhale', duration: 4000 },
            { text: 'Hold', duration: 7000 },
            { text: 'Exhale', duration: 8000 }
        ],
        totalCycle: 19000
    },
    'box': {
        name: 'Box Breathing',
        steps: [
            { text: 'Inhale', duration: 4000 },
            { text: 'Hold', duration: 4000 },
            { text: 'Exhale', duration: 4000 },
            { text: 'Hold', duration: 4000 }
        ],
        totalCycle: 16000
    },
    'coherent': {
        name: 'Coherent Breathing',
        steps: [
            { text: 'Inhale', duration: 5500 },
            { text: 'Exhale', duration: 5500 }
        ],
        totalCycle: 11000
    }
};

let currentPattern = '478';
let isBreathing = false;
let breathingInterval = null;
let stepTimeout = null;

function startBreathingDemo() {
    const demoCircle = document.getElementById('demoCircle');
    const demoText = document.getElementById('demoText');
    const startBtn = document.getElementById('startDemo');
    const timelineProgress = document.getElementById('timelineProgress');
    
    if (isBreathing) {
        stopBreathingDemo();
        return;
    }
    
    isBreathing = true;
    demoCircle.classList.add('active');
    startBtn.classList.add('active');
    startBtn.querySelector('.btn-text').textContent = 'Stop Exercise';
    
    const pattern = breathingPatterns[currentPattern];
    let currentStep = 0;
    let cycleStartTime = Date.now();
    
    function runStep() {
        if (!isBreathing) return;
        
        const step = pattern.steps[currentStep];
        demoText.textContent = step.text;
        
        // Update circle animation based on step
        updateCircleAnimation(step.text, step.duration);
        
        // Update timeline progress
        updateTimelineProgress(pattern.totalCycle);
        
        stepTimeout = setTimeout(() => {
            currentStep = (currentStep + 1) % pattern.steps.length;
            if (currentStep === 0) {
                cycleStartTime = Date.now();
            }
            runStep();
        }, step.duration);
    }
    
    runStep();
}

function stopBreathingDemo() {
    isBreathing = false;
    clearTimeout(stepTimeout);
    clearInterval(breathingInterval);
    
    const demoCircle = document.getElementById('demoCircle');
    const demoText = document.getElementById('demoText');
    const startBtn = document.getElementById('startDemo');
    const timelineProgress = document.getElementById('timelineProgress');
    
    demoCircle.classList.remove('active');
    startBtn.classList.remove('active');
    startBtn.querySelector('.btn-text').textContent = 'Start Exercise';
    demoText.textContent = 'Prepare';
    timelineProgress.style.width = '0';
    
    // Reset circle pulse
    const circlePulse = demoCircle.querySelector('.circle-pulse');
    circlePulse.style.animation = 'none';
    circlePulse.style.transform = 'scale(0.6)';
    setTimeout(() => {
        circlePulse.style.animation = '';
    }, 10);
}

function updateCircleAnimation(stepType, duration) {
    const circlePulse = document.querySelector('.circle-pulse');
    const durationSec = duration / 1000;
    
    if (stepType === 'Inhale') {
        circlePulse.style.transition = `transform ${durationSec}s cubic-bezier(0.45, 0, 0.55, 1)`;
        circlePulse.style.transform = 'scale(1)';
    } else if (stepType === 'Exhale') {
        circlePulse.style.transition = `transform ${durationSec}s cubic-bezier(0.45, 0, 0.55, 1)`;
        circlePulse.style.transform = 'scale(0.6)';
    } else {
        // Hold - maintain current scale
        circlePulse.style.transition = 'none';
    }
}

function updateTimelineProgress(totalCycle) {
    const timelineProgress = document.getElementById('timelineProgress');
    const startTime = Date.now();
    
    clearInterval(breathingInterval);
    breathingInterval = setInterval(() => {
        if (!isBreathing) {
            clearInterval(breathingInterval);
            return;
        }
        
        const elapsed = Date.now() - startTime;
        const progress = (elapsed / totalCycle) * 100;
        timelineProgress.style.width = Math.min(progress, 100) + '%';
        
        if (progress >= 100) {
            timelineProgress.style.width = '0';
        }
    }, 50);
}

// Pattern selector
function initPatternSelector() {
    const selectorBtns = document.querySelectorAll('.selector-btn');
    
    selectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            selectorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update pattern
            currentPattern = btn.dataset.pattern;
            
            // Restart if currently breathing
            if (isBreathing) {
                stopBreathingDemo();
                setTimeout(startBreathingDemo, 100);
            }
        });
    });
}

// ========================================
// NAVIGATION SCROLL EFFECT
// ========================================

function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe technique cards
    document.querySelectorAll('.technique-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe library categories
    document.querySelectorAll('.library-category').forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(category);
    });
    
    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// FORM HANDLING
// ========================================

function initFormHandling() {
    const form = document.querySelector('.cta-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Show success message
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spark-indicator"></span>Welcome';
            btn.style.background = '#22c55e';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }
}

// ========================================
// PARALLAX EFFECT FOR HERO TILES
// ========================================

function initParallax() {
    const tiles = document.querySelectorAll('.geo-tile');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.05;
        
        tiles.forEach((tile, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            tile.style.transform = `translateY(${rate * direction * (index + 1) * 0.3}px)`;
        });
    }, { passive: true });
}

// ========================================
// TIDAL SCROLL RHYTHM
// ========================================

function initTidalScroll() {
    // Create subtle wave effect on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTidalElements();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function updateTidalElements() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Update breath rings in hero based on scroll
    const rings = document.querySelectorAll('.breath-ring');
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
        
        rings.forEach((ring, index) => {
            const offset = index * 0.2;
            const scale = 1 + (heroProgress * 0.2 * (index + 1));
            const opacity = 1 - (heroProgress * 0.5);
            ring.style.transform = `scale(${Math.min(scale, 1.3)})`;
            ring.style.opacity = Math.max(opacity, 0.3);
        });
    }
}

// ========================================
// EXERCISE ITEM INTERACTION
// ========================================

function initExerciseItems() {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
        item.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(232, 93, 78, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = item.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = '0';
            ripple.style.top = (rect.height - size) / 2 + 'px';
            
            item.style.position = 'relative';
            item.style.overflow = 'hidden';
            item.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollReveal();
    initFormHandling();
    initParallax();
    initTidalScroll();
    initPatternSelector();
    initExerciseItems();
    
    // Log initialization
    console.log('🫁 StillPoint initialized — breathe deeply');
});

// Handle visibility change to pause breathing demo
 document.addEventListener('visibilitychange', () => {
    if (document.hidden && isBreathing) {
        stopBreathingDemo();
    }
});
