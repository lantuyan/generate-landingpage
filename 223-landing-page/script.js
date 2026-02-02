/**
 * NourishFlow — Landing Page Scripts
 * Modernist + Zen Kinetics interactions
 */

(function() {
    'use strict';

    // ============================================
    // Utility Functions
    // ============================================
    
    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // ============================================
    // Navigation
    // ============================================
    
    const initNavigation = () => {
        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Scroll-based navbar background
        let lastScroll = 0;
        
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
            
            lastScroll = currentScroll;
        };
        
        window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
        
        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('nav-toggle--active');
                navMenu.classList.toggle('nav-menu--open');
                document.body.style.overflow = navMenu.classList.contains('nav-menu--open') ? 'hidden' : '';
            });
            
            // Close menu on link click
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('nav-toggle--active');
                    navMenu.classList.remove('nav-menu--open');
                    document.body.style.overflow = '';
                });
            });
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                    });
                }
            });
        });
    };

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    
    const initScrollReveal = () => {
        if (prefersReducedMotion()) {
            // Show all elements immediately if reduced motion preferred
            document.querySelectorAll('.principle-card, .method-step, .feature-tile, .testimonial-card, .research-content, .research-visual, .download-content, .philosophy-header').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        
        const revealElements = document.querySelectorAll(
            '.principle-card, .method-step, .feature-tile, .testimonial-card, .research-content, .research-visual, .download-content, .philosophy-header'
        );
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    };

    // ============================================
    // Chart Animation
    // ============================================
    
    const initChartAnimation = () => {
        const chart = document.getElementById('outcomesChart');
        if (!chart) return;
        
        const bars = chart.querySelectorAll('.bar');
        
        const animateBars = () => {
            bars.forEach(bar => {
                const targetHeight = bar.style.getPropertyValue('--height');
                bar.style.height = '0%';
                
                setTimeout(() => {
                    bar.style.height = targetHeight;
                }, 100);
            });
        };
        
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateBars();
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        chartObserver.observe(chart);
    };

    // ============================================
    // Parallax Effects (subtle)
    // ============================================
    
    const initParallax = () => {
        if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
            return; // Skip on touch devices or reduced motion
        }
        
        const heroGradient = document.querySelector('.hero-gradient');
        const methodologySunset = document.querySelector('.methodology-sunset');
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            if (heroGradient) {
                const heroOffset = scrollY * 0.15;
                heroGradient.style.transform = `translateY(${heroOffset}px)`;
            }
            
            if (methodologySunset) {
                const methodSection = methodologySunset.closest('.methodology');
                if (methodSection) {
                    const rect = methodSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const offset = (window.innerHeight - rect.top) * 0.05;
                        methodologySunset.style.transform = `translateY(${offset}px)`;
                    }
                }
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    };

    // ============================================
    // Gentle Breathing Animation for Icons
    // ============================================
    
    const initBreathingIcons = () => {
        if (prefersReducedMotion()) return;
        
        const breathingIcons = document.querySelectorAll('.principle-icon, .logo-icon');
        
        // Offset animation delays for natural feel
        breathingIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.5}s`;
        });
    };

    // ============================================
    // Feature Tile Hover Effects
    // ============================================
    
    const initTileInteractions = () => {
        const tiles = document.querySelectorAll('.feature-tile, .principle-card');
        
        tiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => {
                // Add subtle scale to child icons
                const icon = tile.querySelector('.tile-icon, .principle-icon');
                if (icon && !prefersReducedMotion()) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            tile.addEventListener('mouseleave', () => {
                const icon = tile.querySelector('.tile-icon, .principle-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    };

    // ============================================
    // Focus Management
    // ============================================
    
    const initFocusManagement = () => {
        // Skip links for accessibility
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-primary);
            color: var(--color-inverse);
            padding: 8px 16px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main id to hero for skip link
        const hero = document.getElementById('hero');
        if (hero) {
            hero.setAttribute('id', 'main');
            hero.setAttribute('tabindex', '-1');
        }
    };

    // ============================================
    // Initialize Everything
    // ============================================
    
    const init = () => {
        initNavigation();
        initScrollReveal();
        initChartAnimation();
        initParallax();
        initBreathingIcons();
        initTileInteractions();
        initFocusManagement();
        
        // Log initialization
        console.log('🌅 NourishFlow initialized — Mindful eating, intuitive living');
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
