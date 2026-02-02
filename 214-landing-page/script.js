/**
 * Chronicle - Heritage Brand Storytelling
 * Museum-slow interactions and ceremonial scroll experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initParallax();
});

/**
 * Navigation Module
 * Handles scroll-based nav styling and mobile menu toggle
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll-based navigation background
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNav() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (scrollY > 100) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-links--open');
            navToggle.classList.toggle('nav-toggle--active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('nav-toggle--active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(5px)';
                spans[1].style.transform = 'rotate(-45deg) translateY(-5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.transform = '';
            }
        });
        
        // Close mobile menu on link click
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-links--open');
                navToggle.classList.remove('nav-toggle--active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.transform = '';
            });
        });
    }
}

/**
 * Scroll Reveal Module
 * Implements museum-slow reveal animations for section elements
 */
function initScrollReveal() {
    // Elements to reveal
    const revealSelectors = [
        '.heritage-header',
        '.heritage-text',
        '.heritage-values',
        '.value-card',
        '.methodology-header',
        '.method-step',
        '.archives-header',
        '.archive-case',
        '.services-header',
        '.service-item',
        '.contact-content',
        '.footer-main',
        '.footer-bottom'
    ];
    
    // Add reveal class to all target elements
    revealSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('reveal');
            // Add staggered delays for grouped elements
            if (el.parentElement?.querySelectorAll(selector).length > 1) {
                el.classList.add(`reveal--delay-${(index % 4) + 1}`);
            }
        });
    });
    
    // Intersection Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add small delay for museum-slow effect
                setTimeout(() => {
                    entry.target.classList.add('reveal--visible');
                }, 100);
                
                // Unobserve after revealing
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Smooth Scroll Module
 * Handles anchor link navigation with easing
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed nav
                const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                
                // Museum-slow scroll
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
 * Subtle parallax effects for hero and accent elements
 */
function initParallax() {
    const heroFrame = document.querySelector('.hero-frame');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Hero parallax - subtle upward movement
        if (heroFrame && scrollY < windowHeight) {
            const translateY = scrollY * 0.15;
            const opacity = 1 - (scrollY / windowHeight) * 0.5;
            heroFrame.style.transform = `translateY(${translateY}px)`;
            heroFrame.style.opacity = Math.max(0.3, opacity);
        }
        
        // Scroll indicator fade out
        if (scrollIndicator) {
            if (scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Utility: Check for reduced motion preference
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
