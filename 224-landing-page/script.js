/**
 * UrbanQuest - Interactive Scripts
 * Metropolitan + Playful Precision Design
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initMapNodes();
    initStepAnimations();
    initConfettiEffects();
    initFormInteractions();
    initParallax();
});

/**
 * Navigation Scroll Effect
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add background blur on scroll
        if (currentScroll > 50) {
            nav.style.background = 'rgba(250, 250, 248, 0.95)';
            nav.style.boxShadow = '0 1px 0 rgba(26, 26, 26, 0.06)';
        } else {
            nav.style.background = 'rgba(250, 250, 248, 0.85)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.game-card, .testimonial-card, .city-card, .step, .section-header'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element index within parent
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.children).filter(
                    child => child.classList.contains(entry.target.classList[0])
                );
                const elementIndex = siblings.indexOf(entry.target);
                const delay = elementIndex * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Map Node Interactions
 */
function initMapNodes() {
    const nodes = document.querySelectorAll('.map-node');
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            // Remove active from all nodes
            nodes.forEach(n => n.classList.remove('active'));
            // Add active to hovered node
            node.classList.add('active');
            
            // Create subtle pulse effect
            createNodePulse(node);
        });
        
        node.addEventListener('click', () => {
            // Bounce animation on click
            node.style.transform = 'scale(1.3)';
            setTimeout(() => {
                node.style.transform = '';
            }, 200);
            
            // Show city tooltip
            showCityTooltip(node);
        });
    });
    
    // Auto-rotate active node
    let activeIndex = 0;
    setInterval(() => {
        nodes.forEach(n => n.classList.remove('active'));
        activeIndex = (activeIndex + 1) % nodes.length;
        nodes[activeIndex].classList.add('active');
    }, 3000);
}

function createNodePulse(node) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
        position: absolute;
        inset: -12px;
        border: 2px solid #FF6B5B;
        border-radius: 50%;
        animation: nodePulseRing 0.8s ease-out forwards;
        pointer-events: none;
    `;
    
    node.appendChild(pulse);
    
    setTimeout(() => pulse.remove(), 800);
}

function showCityTooltip(node) {
    const city = node.dataset.city;
    const cityNames = {
        'NYC': 'New York City',
        'LDN': 'London',
        'TYO': 'Tokyo',
        'BER': 'Berlin',
        'PAR': 'Paris'
    };
    
    // Remove existing tooltips
    document.querySelectorAll('.city-tooltip').forEach(t => t.remove());
    
    const tooltip = document.createElement('div');
    tooltip.className = 'city-tooltip';
    tooltip.textContent = cityNames[city] || city;
    tooltip.style.cssText = `
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        padding: 6px 12px;
        background: #1A1A1A;
        color: white;
        font-size: 12px;
        font-weight: 600;
        border-radius: 6px;
        white-space: nowrap;
        animation: tooltipPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 10;
    `;
    
    node.appendChild(tooltip);
    
    setTimeout(() => tooltip.remove(), 2000);
}

// Add keyframes for tooltip
const tooltipStyles = document.createElement('style');
tooltipStyles.textContent = `
    @keyframes nodePulseRing {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes tooltipPop {
        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        100% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(tooltipStyles);

/**
 * Step Animations
 */
function initStepAnimations() {
    const steps = document.querySelectorAll('.step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    steps.forEach(step => observer.observe(step));
}

/**
 * Confetti Effects
 */
function initConfettiEffects() {
    // Add confetti on game card hover
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (Math.random() > 0.5) {
                createMiniConfetti(card);
            }
        });
    });
    
    // Add confetti on pricing card hover
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createMiniConfetti(card, ['✨', '💎', '🎯']);
        });
    });
    
    // Celebration on CTA button click
    const ctaButton = document.querySelector('.cta-form .btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            createCelebrationConfetti(ctaButton);
        });
    }
}

function createMiniConfetti(element, emojis = ['✨', '🎉', '🌟']) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('span');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${centerX + (Math.random() - 0.5) * 100}px;
            top: ${centerY + (Math.random() - 0.5) * 50}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 9999;
            animation: miniConfetti 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 800);
    }
}

function createCelebrationConfetti(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#FF6B5B', '#4ECDC4', '#FFE66D', '#95E1D3'];
    const shapes = ['🎉', '✨', '🌟', '💫', '🎊', '🎯', '🏆'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('span');
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 150 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 100;
        
        confetti.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: ${1 + Math.random()}rem;
            pointer-events: none;
            z-index: 9999;
            animation: celebrationConfetti 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            --tx: ${tx}px;
            --ty: ${ty}px;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
    }
    
    // Button feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Add keyframes for confetti
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    @keyframes miniConfetti {
        0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1) rotate(0deg);
        }
        100% { 
            opacity: 0; 
            transform: translate(${(Math.random() - 0.5) * 100}px, -100px) scale(0) rotate(180deg);
        }
    }
    @keyframes celebrationConfetti {
        0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.5), calc(var(--ty) * 0.5)) scale(1.2) rotate(180deg);
        }
        100% { 
            opacity: 0; 
            transform: translate(var(--tx), var(--ty)) scale(0.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(confettiStyles);

/**
 * Form Interactions
 */
function initFormInteractions() {
    const formInput = document.querySelector('.form-input');
    const formButton = document.querySelector('.cta-form .btn');
    
    if (formInput && formButton) {
        formInput.addEventListener('focus', () => {
            formButton.style.transform = 'scale(1.05)';
            formButton.style.background = '#FF6B5B';
        });
        
        formInput.addEventListener('blur', () => {
            formButton.style.transform = '';
            formButton.style.background = '';
        });
        
        formInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length > 5) {
                formButton.style.background = '#4ECDC4';
            } else {
                formButton.style.background = '';
            }
        });
    }
    
    // Add typing effect to placeholder
    const placeholders = [
        'Enter your email',
        'your@email.com',
        'Ready to explore?'
    ];
    let placeholderIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        if (!formInput) return;
        
        const current = placeholders[placeholderIndex];
        
        if (isDeleting) {
            formInput.placeholder = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            formInput.placeholder = current.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after delay
    setTimeout(typeEffect, 2000);
}

/**
 * Parallax Effects
 */
function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    const floatingCards = document.querySelectorAll('.floating-card');
    const inkBleeds = document.querySelectorAll('.ink-bleed');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                // Hero visual parallax
                if (heroVisual && scrollY < window.innerHeight) {
                    heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
                }
                
                // Floating cards parallax
                floatingCards.forEach((card, index) => {
                    const speed = 0.05 + (index * 0.02);
                    card.style.transform = `translateY(${scrollY * speed}px)`;
                });
                
                // Ink bleed subtle movement
                inkBleeds.forEach((ink, index) => {
                    const speed = 0.02 + (index * 0.01);
                    ink.style.transform = `translateY(${scrollY * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Counter Animation
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const num = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                let current = 0;
                const increment = num / 50;
                const duration = 1500;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    target.textContent = Math.floor(current) + suffix;
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize counters when DOM is loaded
document.addEventListener('DOMContentLoaded', animateCounters);

/**
 * Mobile Menu Toggle (for smaller screens)
 */
function initMobileMenu() {
    const nav = document.querySelector('.nav-container');
    
    // Create mobile menu button
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    nav.appendChild(menuBtn);
    
    // Show button on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleMobileMenu(e) {
        if (e.matches) {
            menuBtn.style.display = 'block';
        } else {
            menuBtn.style.display = 'none';
        }
    }
    
    mediaQuery.addListener(handleMobileMenu);
    handleMobileMenu(mediaQuery);
}

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', initMobileMenu);

/**
 * Easter Egg - Konami Code
 */
function initEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                        'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    // Create massive confetti celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight + 50;
            
            const confetti = document.createElement('div');
            confetti.textContent = ['🎉', '✨', '🌟', '💫', '🎊', '🎯', '🏆', '🗺️'][Math.floor(Math.random() * 8)];
            confetti.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: 2rem;
                pointer-events: none;
                z-index: 9999;
                animation: fallConfetti 3s ease-out forwards;
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
    
    // Add falling animation
    const fallStyle = document.createElement('style');
    fallStyle.textContent = `
        @keyframes fallConfetti {
            0% { 
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% { 
                transform: translateY(-${window.innerHeight + 200}px) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(fallStyle);
    
    // Show message
    const message = document.createElement('div');
    message.textContent = '🎉 Secret Explorer Unlocked! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2rem 3rem;
        background: linear-gradient(135deg, #FF6B5B, #4ECDC4);
        color: white;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: messagePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    document.body.appendChild(message);
    
    const messageStyle = document.createElement('style');
    messageStyle.textContent = `
        @keyframes messagePop {
            0% { transform: translate(-50%, -50%) scale(0); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(messageStyle);
    
    setTimeout(() => message.remove(), 3000);
}

// Initialize easter egg
document.addEventListener('DOMContentLoaded', initEasterEgg);
