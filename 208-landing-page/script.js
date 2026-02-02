/**
 * AETHER - Luxury Concierge Travel Technology
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandling();
    initParallaxEffects();
    initIslandAnimations();
});

/**
 * Navigation - Scroll behavior and mobile menu
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Scroll behavior
    function updateNav() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Scroll Animations - Intersection Observer for reveal animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children if they have animation classes
                const children = entry.target.querySelectorAll('[class*="visible"]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll([
        '.philosophy-content',
        '.philosophy-visual',
        '.intelligence-header',
        '.capability-island',
        '.privacy-visual',
        '.privacy-content',
        '.experiences-header',
        '.experience-card',
        '.tiers-header',
        '.tier-card',
        '.contact-content',
        '.contact-form-container'
    ].join(', '));

    animateElements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll - Navigation links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Handling - Contact form submission
 */
function initFormHandling() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success modal
                modal.classList.add('active');
                
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

/**
 * Parallax Effects - Subtle movement on scroll
 */
function initParallaxEffects() {
    const heroGradient = document.querySelector('.hero-gradient');
    const heroCeramic = document.querySelector('.hero-ceramic');
    const privacyGradient = document.querySelector('.privacy-gradient');
    const contactGradient = document.querySelector('.contact-gradient');
    
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Hero parallax
        if (heroGradient && scrollY < windowHeight) {
            heroGradient.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        if (heroCeramic && scrollY < windowHeight) {
            heroCeramic.style.transform = `translateY(${scrollY * 0.2}px)`;
        }

        // Privacy section parallax
        if (privacyGradient) {
            const privacySection = document.querySelector('.privacy');
            const privacyRect = privacySection.getBoundingClientRect();
            if (privacyRect.top < windowHeight && privacyRect.bottom > 0) {
                const offset = (windowHeight - privacyRect.top) * 0.1;
                privacyGradient.style.transform = `translateY(${offset}px)`;
            }
        }

        // Contact section parallax
        if (contactGradient) {
            const contactSection = document.querySelector('.contact');
            const contactRect = contactSection.getBoundingClientRect();
            if (contactRect.top < windowHeight && contactRect.bottom > 0) {
                const offset = (windowHeight - contactRect.top) * 0.05;
                contactGradient.style.transform = `translateY(${offset}px)`;
            }
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
 * Island Animations - Floating islands subtle movement
 */
function initIslandAnimations() {
    const islands = document.querySelectorAll('.island');
    
    islands.forEach((island, index) => {
        let startTime = Date.now() + (index * 1000);
        const amplitude = 8 + (index * 3);
        const frequency = 0.0008 + (index * 0.0002);
        
        function float() {
            const elapsed = Date.now() - startTime;
            const offset = Math.sin(elapsed * frequency) * amplitude;
            
            // Apply transform while preserving existing transforms
            const currentTransform = island.style.transform || '';
            const baseTransform = currentTransform.replace(/translateY\([^)]+\)/, '').trim();
            
            island.style.transform = `${baseTransform} translateY(${offset}px)`;
            
            requestAnimationFrame(float);
        }
        
        // Start floating animation
        float();
    });

    // Mouse parallax for islands in philosophy section
    const philosophyVisual = document.querySelector('.philosophy-visual');
    
    if (philosophyVisual && !window.matchMedia('(pointer: coarse)').matches) {
        philosophyVisual.addEventListener('mousemove', (e) => {
            const rect = philosophyVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            islands.forEach((island, index) => {
                const factor = (index + 1) * 10;
                const currentTransform = island.style.transform || '';
                const baseTransform = currentTransform.replace(/translate\([^)]+\)/, '').trim();
                
                island.style.transform = `${baseTransform} translate(${-x * factor}px, ${-y * factor}px)`;
            });
        });
        
        philosophyVisual.addEventListener('mouseleave', () => {
            islands.forEach(island => {
                const currentTransform = island.style.transform || '';
                island.style.transform = currentTransform.replace(/translate\([^)]+\)/, '').trim();
            });
        });
    }
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

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Experience cards staggered animation delay
 */
document.querySelectorAll('.experience-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

/**
 * Capability islands staggered animation delay
 */
document.querySelectorAll('.capability-island').forEach((island, index) => {
    island.style.animationDelay = `${index * 0.15}s`;
});

/**
 * Tier cards staggered animation delay
 */
document.querySelectorAll('.tier-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;
});

/**
 * Scroll velocity detection for performance optimization
 */
let scrollVelocity = 0;
let lastScrollTime = Date.now();
let lastScrollPosition = window.scrollY;

function updateScrollVelocity() {
    const currentTime = Date.now();
    const currentPosition = window.scrollY;
    const timeDelta = currentTime - lastScrollTime;
    
    if (timeDelta > 0) {
        scrollVelocity = Math.abs(currentPosition - lastScrollPosition) / timeDelta;
    }
    
    lastScrollTime = currentTime;
    lastScrollPosition = currentPosition;
}

window.addEventListener('scroll', throttle(updateScrollVelocity, 100), { passive: true });

/**
 * Intersection Observer for reduced motion on fast scroll
 */
const fastScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && scrollVelocity < 2) {
            entry.target.classList.add('visible');
            fastScrollObserver.unobserve(entry.target);
        } else if (entry.isIntersecting) {
            // Delay animation if scrolling fast
            setTimeout(() => {
                entry.target.classList.add('visible');
                fastScrollObserver.unobserve(entry.target);
            }, 300);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

/**
 * Prefers reduced motion check
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Immediately show all animated elements
    document.querySelectorAll('[class*="visible"]').forEach(el => {
        el.classList.add('visible');
    });
}
