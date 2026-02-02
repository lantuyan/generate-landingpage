/**
 * HERBARIUM ATELIER — Botanical Illustration
 * JavaScript for interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initParallax();
    initButtonInteractions();
});

/**
 * Navigation Module
 * Handles sticky nav, mobile menu toggle, and scroll behavior
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Sticky navigation on scroll
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for styling
        if (currentScroll > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * Scroll Reveal Module
 * Animates elements as they enter the viewport
 */
function initScrollReveal() {
    // Elements to animate
    const revealSelectors = [
        '.section-header',
        '.course-card',
        '.technique-item',
        '.instructor-card',
        '.gallery-item',
        '.enroll-card',
        '.statement-inner',
        '.hero-content > *',
        '.hero-visual'
    ];
    
    const revealElements = document.querySelectorAll(revealSelectors.join(', '));
    
    // Add reveal class to elements
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(index % 5) * 100}ms`;
    });
    
    // Intersection Observer for scroll triggers
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after revealing
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Staggered reveal for grids
    const staggerContainers = document.querySelectorAll('.curriculum-grid, .instructors-grid, .enroll-options');
    staggerContainers.forEach(container => {
        container.classList.add('reveal-stagger');
        
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        staggerObserver.observe(container);
    });
}

/**
 * Smooth Scroll Module
 * Handles anchor link scrolling with offset for fixed nav
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Module
 * Subtle parallax effects for hero blobs and decorative elements
 */
function initParallax() {
    // Check for touch device - disable parallax on mobile
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    const blobs = document.querySelectorAll('.hero-blob, .section-blob, .instructors-blob, .enroll-blob');
    const heroVisual = document.querySelector('.hero-visual');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for blobs
                blobs.forEach((blob, index) => {
                    const speed = 0.1 + (index * 0.02);
                    const yPos = scrolled * speed;
                    const currentTransform = blob.style.transform || '';
                    blob.style.transform = `translateY(${yPos}px)`;
                });
                
                // Parallax for hero visual
                if (heroVisual && scrolled < window.innerHeight) {
                    const heroSpeed = 0.15;
                    const heroY = scrolled * heroSpeed;
                    heroVisual.style.transform = `translateY(calc(-50% + ${heroY}px))`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Button Interactions Module
 * Handles button hover effects and click feedback
 */
function initButtonInteractions() {
    // Enrollment button interactions
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Show coming soon message
            showNotification('Application opening soon. Join our newsletter for updates.');
        });
    });
    
    // Add ripple keyframes
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Notification System
 * Shows temporary notification messages
 */
function showNotification(message, duration = 3000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">×</button>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--color-ink, #2C2420);
        color: var(--color-cream, #FAF8F5);
        padding: 1rem 1.5rem;
        border-radius: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: var(--font-body, system-ui);
        font-size: 0.875rem;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: opacity 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.6');
    closeBtn.addEventListener('click', () => hideNotification(notification));
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Auto hide
    const timeout = setTimeout(() => hideNotification(notification), duration);
    
    // Store timeout on element for cleanup
    notification.dataset.timeout = timeout;
}

function hideNotification(notification) {
    if (!notification) return;
    
    clearTimeout(notification.dataset.timeout);
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(20px)';
    
    setTimeout(() => notification.remove(), 400);
}

/**
 * Plant Drawing Animation
 * Subtle SVG path drawing animation for botanical illustrations
 */
function initPlantAnimations() {
    const plantPaths = document.querySelectorAll('.plant-stem, .plant-leaf, .plant-flower, .leaf-vein');
    
    plantPaths.forEach(path => {
        const length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.animation = 'draw-path 2s ease forwards';
    });
    
    // Add keyframes if not present
    if (!document.getElementById('draw-path-styles')) {
        const style = document.createElement('style');
        style.id = 'draw-path-styles';
        style.textContent = `
            @keyframes draw-path {
                to {
                    stroke-dashoffset: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Run plant animations after page load
window.addEventListener('load', initPlantAnimations);

/**
 * Cursor follower for desktop
 * Subtle cursor enhancement for interactive elements
 */
function initCursorEnhancement() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 1px solid var(--color-terracotta, #C4A484);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease, opacity 0.15s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Smooth cursor follow
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Enhance cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .course-card, .gallery-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(196, 164, 132, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'transparent';
        });
    });
}

// Initialize cursor enhancement
document.addEventListener('DOMContentLoaded', initCursorEnhancement);

/**
 * Specimen Card Tilt Effect
 * Subtle 3D tilt on specimen cards
 */
function initTiltEffect() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const tiltElements = document.querySelectorAll('.specimen-frame, .course-card, .gallery-frame');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// Initialize tilt effect
document.addEventListener('DOMContentLoaded', initTiltEffect);

/**
 * Reading Progress Indicator
 * Shows scroll progress for the page
 */
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--color-terracotta, #C4A484), var(--color-amber, #D4A574));
        z-index: 1001;
        transition: width 0.1s linear;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// Initialize reading progress
document.addEventListener('DOMContentLoaded', initReadingProgress);

/**
 * Keyboard Navigation Enhancement
 * Improves keyboard accessibility
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.focus();
        }
    }
});

/**
 * Prefers Reduced Motion
 * Respects user's motion preferences
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable all animations
    document.documentElement.style.setProperty('--duration-fast', '0.01ms');
    document.documentElement.style.setProperty('--duration-normal', '0.01ms');
    document.documentElement.style.setProperty('--duration-slow', '0.01ms');
}
