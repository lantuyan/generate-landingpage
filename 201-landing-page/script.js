/**
 * Monolith Legal — Interactive Behaviors
 * Swiss precision with razor-clean animations
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
 * Handles navbar scroll effects and mobile menu
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Navbar scroll effect
    let lastScroll = 0;
    const scrollThreshold = 50;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Mobile menu toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset hamburger
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
}

/**
 * Scroll Reveal Module
 * Reveals elements as they enter the viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after reveal
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
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

/**
 * Parallax Module
 * Subtle parallax effects for visual elements
 */
function initParallax() {
    // Document stack parallax in hero
    const docStack = document.querySelector('.document-stack');
    
    if (!docStack || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const cards = docStack.querySelectorAll('.document-card');
    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        // Only apply effect when hero is visible
        if (scrollY < heroHeight) {
            const parallaxFactor = scrollY * 0.05;
            
            cards.forEach((card, index) => {
                const speed = (index + 1) * 0.5;
                const rotation = (index - 1) * 3;
                const translateY = parallaxFactor * speed;
                
                card.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
            });
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Utility: Throttle function
 * Limits the rate at which a function can fire
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

/**
 * Utility: Debounce function
 * Delays function execution until after wait period
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
