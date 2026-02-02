/**
 * VOLT & VINTAGE — Landing Page Interactions
 * Retro-futuristic + Museum Labeling Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initSpiralAnimation();
    initProcessSpiral();
    initFormHandling();
    initKineticFlicker();
});

/**
 * Navigation Module
 * Handles scroll effects and mobile menu toggle
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect for nav background
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-links--open');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            const isOpen = navLinks.classList.contains('nav-links--open');
            
            spans.forEach((span, index) => {
                if (isOpen) {
                    span.style.transform = index === 0 
                        ? 'rotate(45deg) translate(5px, 5px)' 
                        : index === 1 
                            ? 'opacity: 0' 
                            : 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-links--open');
                navToggle.querySelectorAll('span').forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed nav
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations Module
 * Intersection Observer for reveal animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('process-step--visible');
                
                // Add stagger animation for tiles
                if (entry.target.classList.contains('exhibit-tile')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe process steps
    document.querySelectorAll('.process-step').forEach(step => {
        observer.observe(step);
    });
    
    // Observe exhibit tiles
    document.querySelectorAll('.exhibit-tile').forEach(tile => {
        observer.observe(tile);
    });
    
    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

/**
 * Spiral Animation Module
 * Parallax effect for hero spiral on mouse move
 */
function initSpiralAnimation() {
    const container = document.getElementById('spiralContainer');
    if (!container) return;
    
    const rings = container.querySelectorAll('.spiral-ring');
    const center = container.querySelector('.spiral-center');
    
    // Check for touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    
    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX = (e.clientX - centerX) / 30;
        mouseY = (e.clientY - centerY) / 30;
    }, { passive: true });
    
    function animate() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        rings.forEach((ring, index) => {
            const factor = (index + 1) * 0.5;
            const rotateX = currentY * factor;
            const rotateY = currentX * factor;
            ring.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        if (center) {
            center.style.transform = `translate(${currentX * 0.5}px, ${currentY * 0.5}px)`;
        }
        
        rafId = requestAnimationFrame(animate);
    }
    
    // Only animate when visible
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                if (rafId) cancelAnimationFrame(rafId);
            }
        });
    }, { threshold: 0 });
    
    visibilityObserver.observe(container);
}

/**
 * Process Spiral Module
 * Draws the spiral path as user scrolls through process section
 */
function initProcessSpiral() {
    const spiralPath = document.querySelector('.spiral-line');
    const processSection = document.getElementById('process');
    
    if (!spiralPath || !processSection) return;
    
    const pathLength = spiralPath.getTotalLength ? spiralPath.getTotalLength() : 1000;
    
    spiralPath.style.strokeDasharray = pathLength;
    spiralPath.style.strokeDashoffset = pathLength;
    
    function updateSpiralProgress() {
        const rect = processSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate progress based on section position
        const scrolled = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + viewportHeight * 0.5)));
        
        const drawLength = pathLength * progress;
        spiralPath.style.strokeDashoffset = pathLength - drawLength;
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateSpiralProgress();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call
    updateSpiralProgress();
}

/**
 * Form Handling Module
 * Contact form submission with visual feedback
 */
function initFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.querySelector('.submit-text').textContent;
        
        // Visual feedback
        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').textContent = 'TRANSMITTING...';
        submitBtn.style.opacity = '0.8';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.querySelector('.submit-text').textContent = 'INQUIRY RECEIVED';
            submitBtn.style.background = '#4ade80';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('.submit-text').textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });
    
    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('form-group--focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('form-group--focused');
        });
    });
}

/**
 * Kinetic Flicker Module
 * Adds subtle vibration/flicker to elements
 */
function initKineticFlicker() {
    // Add subtle random flicker to neon elements
    const flickerElements = document.querySelectorAll('.tile-icon, .logo-icon, .step-number');
    
    function randomFlicker() {
        const element = flickerElements[Math.floor(Math.random() * flickerElements.length)];
        if (!element) return;
        
        element.style.transform = 'translateX(0.5px)';
        
        setTimeout(() => {
            element.style.transform = 'translateX(-0.5px)';
            setTimeout(() => {
                element.style.transform = 'translateX(0)';
            }, 50);
        }, 50);
        
        // Schedule next flicker
        const nextFlicker = Math.random() * 3000 + 2000;
        setTimeout(randomFlicker, nextFlicker);
    }
    
    // Start flicker loop
    setTimeout(randomFlicker, 2000);
    
    // Scroll velocity effect on spiral rings
    const spiralRings = document.querySelectorAll('.spiral-ring');
    let scrollTimeout;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            // Speed up rotation during scroll
            spiralRings.forEach((ring, index) => {
                const baseDuration = 20 - index * 5;
                ring.style.animationDuration = `${baseDuration * 0.3}s`;
            });
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            // Restore normal rotation speed
            spiralRings.forEach((ring, index) => {
                const baseDuration = 20 - index * 5;
                ring.style.animationDuration = `${baseDuration}s`;
            });
        }, 150);
    }, { passive: true });
}

/**
 * Utility: Debounce function
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
 * Utility: Throttle function
 */
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
