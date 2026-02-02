/**
 * Reminisce — Landing Page Interactions
 * Cinematic dissolve scrolling, gentle breathing animations, floating islands
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initParallax();
    initSmoothScroll();
    initMemoryIslands();
    initBreathingElements();
});

/**
 * Navigation — Scroll behavior and highlight
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add scrolled class on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Highlight active section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Scroll Reveal — Cinematic dissolve effect
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .feature-island, .ai-content, .ai-visual, ' +
        '.privacy-content, .privacy-visual, .timeline-step, .cta-content, ' +
        '.promise, .footer-brand, .footer-column'
    );
    
    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay based on element's position for stagger effect
                const delay = Array.from(revealElements).indexOf(entry.target) * 50;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Unobserve after revealing
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Special handling for stagger children
    const staggerContainers = document.querySelectorAll('.features-grid, .privacy-promises, .footer-links');
    staggerContainers.forEach(container => {
        container.classList.add('stagger-children');
        
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    containerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        containerObserver.observe(container);
    });
}

/**
 * Parallax — Subtle depth on scroll
 */
function initParallax() {
    const orbs = document.querySelectorAll('.floating-orb');
    const islands = document.querySelectorAll('.memory-island');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Orbs move slower for depth
                orbs.forEach((orb, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const yPos = scrolled * speed;
                    orb.style.transform = `translateY(${yPos}px)`;
                });
                
                // Islands have varied parallax
                islands.forEach((island, index) => {
                    const speed = 0.15 + (index * 0.05);
                    const yPos = scrolled * speed;
                    const rotation = parseFloat(getComputedStyle(island).getPropertyValue('--rotation')) || 0;
                    island.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Smooth Scroll — Navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Memory Islands — Interactive floating elements
 */
function initMemoryIslands() {
    const islands = document.querySelectorAll('.memory-island');
    
    islands.forEach(island => {
        // Add magnetic hover effect
        island.addEventListener('mousemove', (e) => {
            const rect = island.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle tilt effect
            const rotateX = (y / rect.height) * -5;
            const rotateY = (x / rect.width) * 5;
            
            island.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
                scale(1.02)
            `;
        });
        
        // Reset on mouse leave
        island.addEventListener('mouseleave', () => {
            const rotation = parseFloat(getComputedStyle(island).getPropertyValue('--rotation')) || 0;
            island.style.transform = `rotate(${rotation}deg)`;
            island.style.transition = 'transform 0.4s ease';
            
            setTimeout(() => {
                island.style.transition = '';
            }, 400);
        });
        
        // Add click ripple effect
        island.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(201, 166, 137, 0.3);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
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

/**
 * Breathing Elements — Subtle life animation
 */
function initBreathingElements() {
    const breathingElements = document.querySelectorAll(
        '.neumorphic-btn, .neumorphic-card, .feature-island'
    );
    
    // Add random breathing animation delay
    breathingElements.forEach((el, index) => {
        const delay = Math.random() * 4;
        el.style.animationDelay = `${delay}s`;
    });
    
    // Vault rings pulsing
    const rings = document.querySelectorAll('.vault-ring');
    rings.forEach((ring, index) => {
        ring.style.animationDelay = `${index * 0.5}s`;
    });
}

/**
 * Button Interactions — Enhanced click feedback
 */
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create click burst effect
        const burst = document.createElement('span');
        burst.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            pointer-events: none;
            animation: clickBurst 0.4s ease-out forwards;
        `;
        
        const rect = this.getBoundingClientRect();
        const size = 20;
        burst.style.width = burst.style.height = `${size}px`;
        burst.style.left = `${e.clientX - rect.left - size / 2}px`;
        burst.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(burst);
        
        setTimeout(() => burst.remove(), 400);
    });
});

// Add click burst keyframes
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes clickBurst {
        0% {
            transform: scale(0);
            opacity: 0.8;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(burstStyle);

/**
 * Photo Stack Animation — Subtle shuffle
 */
const photoCards = document.querySelectorAll('.photo-card');
photoCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = `rotate(${(index - 1) * 5}deg) translateY(-10px)`;
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        const rotations = [-8, -3, 4];
        card.style.transform = `rotate(${rotations[index]}deg)`;
    });
});

/**
 * Promise Cards — Hover reveal
 */
const promises = document.querySelectorAll('.promise');
promises.forEach(promise => {
    promise.addEventListener('mouseenter', () => {
        promise.style.background = 'var(--bg-primary)';
        const icon = promise.querySelector('.promise-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    promise.addEventListener('mouseleave', () => {
        promise.style.background = '';
        const icon = promise.querySelector('.promise-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

/**
 * Timeline Steps — Sequential activation
 */
const timelineSteps = document.querySelectorAll('.timeline-step');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate the step number
                const number = entry.target.querySelector('.step-number');
                if (number) {
                    number.style.boxShadow = `
                        12px 12px 24px var(--shadow-dark),
                        -12px -12px 24px var(--shadow-light),
                        inset 0 0 20px rgba(201, 166, 137, 0.2)
                    `;
                    setTimeout(() => {
                        number.style.boxShadow = '';
                    }, 600);
                }
            }, index * 150);
            
            stepObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

timelineSteps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    stepObserver.observe(step);
});

/**
 * Reduced Motion Support
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable parallax and complex animations
    document.querySelectorAll('.floating-orb, .memory-island, .vault-ring').forEach(el => {
        el.style.animation = 'none';
    });
    
    // Make all content visible immediately
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
    });
}
