/**
 * LUMINA NOCTIS - Night Photography Tours
 * JavaScript for interactive features and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initCinematicDissolve();
    initGuideCards();
    initFormHandling();
    initSmoothScroll();
    initParallax();
});

/**
 * Navigation Module
 * Handles nav visibility on scroll and mobile menu toggle
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Show/hide nav background on scroll
    function updateNav() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * Scroll Reveal Module
 * Reveals elements as they enter the viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .island, .destination-card, .guides-text, .philosophy-text, .philosophy-visual, .booking-content'
    );
    
    // Add reveal class to elements
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-delay-${(index % 4) + 1}`);
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Cinematic Dissolve Module
 * Creates cross-fade scrolling effect between sections
 */
function initCinematicDissolve() {
    const sections = document.querySelectorAll('section');
    
    const dissolveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const ratio = entry.intersectionRatio;
            
            // Apply dissolve effect based on visibility
            if (entry.isIntersecting) {
                section.style.opacity = 1;
                section.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px'
    });
    
    sections.forEach(section => {
        // Initial state for dissolve effect
        section.style.opacity = 0.9;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        dissolveObserver.observe(section);
    });
    
    // Trigger initial visible sections
    setTimeout(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.style.opacity = 1;
                section.style.transform = 'translateY(0)';
            }
        });
    }, 100);
}

/**
 * Guide Cards Module
 * Auto-rotates guide cards with museum-slow transitions
 */
function initGuideCards() {
    const guideCards = document.querySelectorAll('.guide-card');
    if (guideCards.length === 0) return;
    
    let currentIndex = 0;
    const interval = 5000; // 5 seconds - museum slow
    
    function activateGuide(index) {
        guideCards.forEach((card, i) => {
            card.classList.remove('guide-active');
            
            // Stagger the cards visually
            if (i === index) {
                card.style.transform = 'scale(1) translateX(0)';
                card.style.opacity = '1';
                card.style.zIndex = '10';
            } else if (i === (index + 1) % guideCards.length) {
                card.style.transform = 'scale(0.95) translateX(40px)';
                card.style.opacity = '0.6';
                card.style.zIndex = '5';
            } else {
                card.style.transform = 'scale(0.9) translateX(80px)';
                card.style.opacity = '0.3';
                card.style.zIndex = '1';
            }
        });
        
        guideCards[index].classList.add('guide-active');
    }
    
    // Initialize positions
    activateGuide(0);
    
    // Auto-rotate
    setInterval(() => {
        currentIndex = (currentIndex + 1) % guideCards.length;
        activateGuide(currentIndex);
    }, interval);
    
    // Pause on hover
    const showcase = document.querySelector('.guides-showcase');
    if (showcase) {
        let isPaused = false;
        
        showcase.addEventListener('mouseenter', () => { isPaused = true; });
        showcase.addEventListener('mouseleave', () => { isPaused = false; });
    }
}

/**
 * Form Handling Module
 * Handles form submission with visual feedback
 */
function initFormHandling() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60">
                    <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        
        // Simulate submission
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = `
                <span>Request Sent</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

/**
 * Smooth Scroll Module
 * Enhanced smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Parallax Module
 * Subtle parallax effects on scroll
 */
function initParallax() {
    const heroStars = document.querySelector('.hero-stars');
    const heroGradient = document.querySelector('.hero-gradient');
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Hero parallax - only when hero is visible
        if (scrollY < windowHeight && heroStars && heroGradient) {
            const parallaxValue = scrollY * 0.3;
            heroStars.style.transform = `translateY(${parallaxValue}px)`;
            heroGradient.style.transform = `translateY(${parallaxValue * 0.5}px)`;
            heroGradient.style.opacity = 1 - (scrollY / windowHeight) * 0.8;
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
 * Liquid Chrome Effect
 * Adds reflective shine effect on interactive elements
 */
document.querySelectorAll('.island, .btn-primary, .destination-card').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        if (el.classList.contains('island')) {
            el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px)`;
        }
    });
    
    el.addEventListener('mouseleave', () => {
        if (el.classList.contains('island')) {
            el.style.transform = '';
        }
    });
});

/**
 * Island Glow Effect
 * Dynamic glow following cursor on floating islands
 */
document.querySelectorAll('.island').forEach(island => {
    const glow = island.querySelector('.island-glow');
    if (!glow) return;
    
    island.addEventListener('mousemove', (e) => {
        const rect = island.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        glow.style.left = `${x - rect.width}px`;
        glow.style.top = `${y - rect.height}px`;
    });
});

/**
 * Star Field Animation
 * Subtle twinkling effect for hero stars
 */
function initStarField() {
    const stars = document.querySelector('.hero-stars');
    if (!stars) return;
    
    // Add twinkling animation via CSS class
    stars.style.animation = 'twinkle 4s ease-in-out infinite';
}

// Add twinkle keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.8; }
    }
`;
document.head.appendChild(style);

// Initialize star field
initStarField();

/**
 * Performance: Pause animations when tab is hidden
 */
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.guide-card, .hero-stars, .scroll-line');
    
    if (document.hidden) {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

/**
 * Preload critical resources
 */
function preloadResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap'
    ];
    
    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

preloadResources();

/**
 * Console Easter Egg
 */
console.log('%c◉ Lumina Noctis', 'font-size: 24px; font-weight: bold; color: #f4a261;');
console.log('%cWhere Darkness Becomes Visible', 'font-size: 14px; font-style: italic; color: #a0a0a8;');
console.log('%cNight photography tours for the curious and the brave.', 'font-size: 12px; color: #6a6a74;');
