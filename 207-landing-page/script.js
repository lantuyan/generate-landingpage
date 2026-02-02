/**
 * FORMA — Landing Page Interactions
 * Smooth scrolling, scroll animations, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // NAVIGATION
    // ========================================
    
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Nav scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNav() {
        const currentScrollY = window.scrollY;
        
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
    
    // Mobile nav toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile nav on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // ========================================
    // SMOOTH SCROLL
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    
    const revealElements = document.querySelectorAll(
        '.section-header, .island, .feature, .benefit-card, .step, .testimonial-card'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
        revealObserver.observe(el);
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
    
    // ========================================
    // PROCESS TIMELINE ANIMATION
    // ========================================
    
    const timelineSection = document.querySelector('.section-process');
    const timelineProgress = document.querySelector('.timeline-progress');
    const steps = document.querySelectorAll('.step');
    
    if (timelineSection && timelineProgress) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate progress line
                    timelineProgress.style.height = '100%';
                    
                    // Activate steps sequentially
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('active');
                        }, 300 + (index * 300));
                    });
                    
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        timelineObserver.observe(timelineSection);
    }
    
    // ========================================
    // INSTRUMENT PANEL GRID ANIMATION
    // ========================================
    
    const gridCells = document.querySelectorAll('.grid-cell');
    
    function animateGrid() {
        gridCells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.toggle('active');
            }, index * 100);
        });
    }
    
    // Initial animation
    setTimeout(animateGrid, 1000);
    
    // Periodic animation
    setInterval(animateGrid, 5000);
    
    // ========================================
    // FORM HANDLING
    // ========================================
    
    const ctaForm = document.getElementById('ctaForm');
    
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = ctaForm.querySelector('input[type="email"]').value;
            const submitBtn = ctaForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Starting...</span>';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Assessment Started!</span>';
                submitBtn.style.backgroundColor = '#7a8b7a';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    ctaForm.reset();
                }, 2000);
            }, 1500);
        });
    }
    
    // ========================================
    // PARALLAX EFFECTS (Desktop only)
    // ========================================
    
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        const heroVisual = document.querySelector('.hero-visual');
        const sculptureRings = document.querySelectorAll('.sculpture-ring');
        
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        }, { passive: true });
        
        function animateParallax() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            if (heroVisual) {
                heroVisual.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
            
            sculptureRings.forEach((ring, index) => {
                const factor = (index + 1) * 0.5;
                ring.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px) scale(${1 + (index === 2 ? 0.05 : 0)})`;
            });
            
            requestAnimationFrame(animateParallax);
        }
        
        animateParallax();
    }
    
    // ========================================
    // SCULPTURE RINGS INTERACTION
    // ========================================
    
    const sculptureContainer = document.querySelector('.sculpture-container');
    
    if (sculptureContainer && !isTouchDevice) {
        sculptureContainer.addEventListener('mouseenter', () => {
            document.querySelectorAll('.sculpture-ring').forEach((ring, index) => {
                ring.style.animationDuration = '3s';
                ring.style.transform = `scale(${1 + (index * 0.05)})`;
            });
        });
        
        sculptureContainer.addEventListener('mouseleave', () => {
            document.querySelectorAll('.sculpture-ring').forEach(ring => {
                ring.style.animationDuration = '';
                ring.style.transform = '';
            });
        });
    }
    
    // ========================================
    // BENEFIT CARDS HOVER EFFECT
    // ========================================
    
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            benefitCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.6';
                    otherCard.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            benefitCards.forEach(otherCard => {
                otherCard.style.opacity = '';
                otherCard.style.transform = '';
            });
        });
    });
    
    // ========================================
    // NAV LINK ACTIVE STATE
    // ========================================
    
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // ========================================
    // ZEN GARDEN RIPPLE EFFECT
    // ========================================
    
    const zenGarden = document.querySelector('.zen-garden');
    
    if (zenGarden && !isTouchDevice) {
        zenGarden.addEventListener('mousemove', (e) => {
            const rect = zenGarden.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            document.querySelectorAll('.garden-rake').forEach((rake, index) => {
                const factor = (index + 1) * 0.3;
                rake.style.transform = `rotate(-15deg) translate(${x * factor * 0.1}px, ${y * factor * 0.1}px)`;
            });
        });
        
        zenGarden.addEventListener('mouseleave', () => {
            document.querySelectorAll('.garden-rake').forEach(rake => {
                rake.style.transform = '';
            });
        });
    }
    
    // ========================================
    // SCROLL VELOCITY DETECTION
    // ========================================
    
    let scrollTimeout;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            document.body.classList.add('is-scrolling');
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
            isScrolling = false;
        }, 150);
    }, { passive: true });
    
    // Add CSS for scroll state
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        body.is-scrolling .sculpture-ring,
        body.is-scrolling .island,
        body.is-scrolling .floating-card {
            animation-play-state: paused;
        }
    `;
    document.head.appendChild(scrollStyle);
    
    // ========================================
    // PREFERS REDUCED MOTION
    // ========================================
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable all animations
        document.querySelectorAll('.sculpture-ring, .island, .floating-card, .breath-ring').forEach(el => {
            el.style.animation = 'none';
        });
        
        // Make all elements visible immediately
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    // ========================================
    // PERFORMANCE: Intersection Observer for pausing off-screen animations
    // ========================================
    
    const animatedElements = document.querySelectorAll('.sculpture-ring, .breath-ring, .island');
    
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            } else {
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, {
        threshold: 0,
        rootMargin: '100px'
    });
    
    animatedElements.forEach(el => {
        visibilityObserver.observe(el);
    });
    
    console.log('🌿 Forma loaded — Your ergonomic journey begins');
});
