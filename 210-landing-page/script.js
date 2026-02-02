/**
 * ATELIER VELO - Interactive Scripts
 * Luxury Minimal + Soft Industrial Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // INITIALIZATION
    // ========================================
    
    initNavigation();
    initScrollAnimations();
    initMagneticTiles();
    initFormHandling();
    initSmoothScroll();
    initParallax();
    initProcessTimeline();
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.magnetic-snap').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 100);
        });
    }, 300);

    // ========================================
    // NAVIGATION
    // ========================================
    
    function initNavigation() {
        const nav = document.getElementById('nav');
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        
        // Scroll behavior for nav
        let lastScroll = 0;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScroll = window.scrollY;
                    
                    // Add/remove scrolled class
                    if (currentScroll > 100) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                    
                    lastScroll = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            
            // Animate links
            if (mobileMenu.classList.contains('active')) {
                mobileLinks.forEach((link, i) => {
                    link.style.transitionDelay = `${0.1 + i * 0.05}s`;
                });
            } else {
                mobileLinks.forEach(link => {
                    link.style.transitionDelay = '0s';
                });
            }
        });
        
        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    
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
                    
                    // Handle staggered children
                    const staggerChildren = entry.target.querySelectorAll('.magnetic-tile, .magnetic-card, .process-step');
                    staggerChildren.forEach((child, i) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, i * 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe section headers
        document.querySelectorAll('.section-header').forEach(header => {
            observer.observe(header);
        });
        
        // Observe config tiles
        document.querySelectorAll('.magnetic-tile').forEach(tile => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(30px)';
            tile.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(tile);
        });
        
        // Observe builder cards
        document.querySelectorAll('.magnetic-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(card);
        });
        
        // Observe process steps
        document.querySelectorAll('.process-step').forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            step.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(step);
        });
    }

    // ========================================
    // MAGNETIC TILE EFFECTS
    // ========================================
    
    function initMagneticTiles() {
        // Only apply on non-touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        const tiles = document.querySelectorAll('.magnetic-tile, .magnetic-card');
        
        tiles.forEach(tile => {
            let rafId = null;
            let isHovering = false;
            
            tile.addEventListener('mouseenter', () => {
                isHovering = true;
            });
            
            tile.addEventListener('mouseleave', () => {
                isHovering = false;
                if (rafId) cancelAnimationFrame(rafId);
                tile.style.transform = '';
            });
            
            tile.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                
                if (rafId) cancelAnimationFrame(rafId);
                
                rafId = requestAnimationFrame(() => {
                    const rect = tile.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    // Subtle magnetic pull
                    const rotateX = (y / rect.height) * -3;
                    const rotateY = (x / rect.width) * 3;
                    
                    tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                });
            });
        });
        
        // Magnetic button effect
        const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ========================================
    // FORM HANDLING
    // ========================================
    
    function initFormHandling() {
        const form = document.getElementById('atelierForm');
        const modal = document.getElementById('successModal');
        const modalClose = document.getElementById('modalClose');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            
            setTimeout(() => {
                // Show success modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset form
                form.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = originalText;
            }, 1500);
        });
        
        // Close modal
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Input focus effects
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    
                    const navHeight = document.getElementById('nav').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // PARALLAX EFFECTS
    // ========================================
    
    function initParallax() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        const heroAccent = document.querySelector('.hero-accent');
        const atelierGrid = document.querySelector('.atelier-grid');
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    
                    // Hero accent parallax
                    if (heroAccent && scrollY < window.innerHeight) {
                        heroAccent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    }
                    
                    // Atelier grid subtle movement
                    if (atelierGrid) {
                        const atelierSection = document.getElementById('atelier');
                        const rect = atelierSection.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const offset = (window.innerHeight - rect.top) * 0.05;
                            atelierGrid.style.transform = `translateY(${offset}px)`;
                        }
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // PROCESS TIMELINE ANIMATION
    // ========================================
    
    function initProcessTimeline() {
        const timeline = document.querySelector('.process-timeline');
        if (!timeline) return;
        
        const line = timeline.querySelector('.timeline-line');
        const steps = timeline.querySelectorAll('.process-step');
        
        // Animate timeline line on scroll
        const observerOptions = {
            root: null,
            threshold: 0.2
        };
        
        const lineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    line.style.height = '0%';
                    line.style.transition = 'height 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    
                    setTimeout(() => {
                        line.style.height = '100%';
                    }, 100);
                    
                    lineObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        lineObserver.observe(timeline);
        
        // Individual step highlighting
        steps.forEach((step, index) => {
            const stepObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            step.classList.add('active');
                        }, index * 200);
                        stepObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            stepObserver.observe(step);
        });
    }

    // ========================================
    // SCROLL VELOCITY DETECTION
    // ========================================
    
    let scrollVelocity = 0;
    let lastScrollTop = 0;
    let velocityTimeout;
    
    window.addEventListener('scroll', () => {
        const st = window.scrollY;
        scrollVelocity = Math.abs(st - lastScrollTop);
        lastScrollTop = st;
        
        // Apply tilt effect based on scroll velocity
        if (scrollVelocity > 50) {
            document.body.style.setProperty('--scroll-tilt', `${Math.min(scrollVelocity * 0.02, 2)}deg`);
        }
        
        clearTimeout(velocityTimeout);
        velocityTimeout = setTimeout(() => {
            document.body.style.setProperty('--scroll-tilt', '0deg');
        }, 150);
    }, { passive: true });

    // ========================================
    // SPARK EFFECT ON BUTTONS
    // ========================================
    
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            // Create spark particles
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const spark = document.createElement('span');
                    spark.className = 'particle-spark';
                    spark.style.cssText = `
                        position: absolute;
                        width: 3px;
                        height: 3px;
                        background: var(--color-spark);
                        border-radius: 50%;
                        pointer-events: none;
                        left: ${Math.random() * 100}%;
                        top: 50%;
                        animation: sparkParticle 0.6s ease-out forwards;
                    `;
                    this.appendChild(spark);
                    
                    setTimeout(() => spark.remove(), 600);
                }, i * 50);
            }
        });
    });
    
    // Add spark particle keyframes
    const sparkStyle = document.createElement('style');
    sparkStyle.textContent = `
        @keyframes sparkParticle {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(${(Math.random() - 0.5) * 40}px, -30px) scale(0);
            }
        }
    `;
    document.head.appendChild(sparkStyle);

    // ========================================
    // CONFIG TILE SELECTION
    // ========================================
    
    document.querySelectorAll('.config-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            // Remove active from siblings
            const siblings = this.parentElement.querySelectorAll('.config-tile');
            siblings.forEach(s => s.classList.remove('tile-active'));
            
            // Toggle active state
            this.classList.toggle('tile-active');
            
            // Play selection sound effect (visual feedback)
            const spark = this.querySelector('.tile-spark');
            if (spark) {
                spark.style.animation = 'none';
                spark.offsetHeight; // Trigger reflow
                spark.style.animation = 'sparkSweep 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });
    });

    // Add tile active styles
    const tileStyle = document.createElement('style');
    tileStyle.textContent = `
        .config-tile.tile-active {
            border-color: var(--color-spark);
            box-shadow: 0 0 30px rgba(201, 169, 98, 0.1);
        }
        
        .config-tile.tile-active .tile-corner {
            border-color: var(--color-spark);
            width: 12px;
            height: 12px;
        }
    `;
    document.head.appendChild(tileStyle);
});

// ========================================
// PREFERS REDUCED MOTION
// ========================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--ease-snap', 'ease');
    document.documentElement.style.setProperty('--ease-smooth', 'ease');
    document.documentElement.style.setProperty('--ease-expo-out', 'ease');
    
    // Disable complex animations
    document.querySelectorAll('.hero-accent, .scroll-line').forEach(el => {
        el.style.animation = 'none';
    });
}
