/**
 * MENTORA - Enterprise Mentorship Platform
 * Interactive behaviors and animations
 */

(function() {
    'use strict';

    // ============================================
    // DOM Element References
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const ctaForm = document.getElementById('ctaForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    // ============================================
    // Navigation Behavior
    // ============================================
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', 
                navMenu.classList.contains('active'));
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Navbar background on scroll
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        } else {
            nav.style.boxShadow = 'none';
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

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + 
                    window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Intersection Observer for Scroll Animations
    // ============================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Method cards stagger animation
                if (element.classList.contains('method-card')) {
                    const delay = element.dataset.delay || 0;
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, delay);
                }
                
                // Graphic bars animation
                if (element.classList.contains('graphic-bar')) {
                    element.classList.add('visible');
                }
                
                // Connection sculpture
                if (element.classList.contains('sculpture-bridge')) {
                    element.classList.add('visible');
                }
                if (element.classList.contains('sculpture-accent')) {
                    element.classList.add('visible');
                }
                
                // Analytics chart
                if (element.classList.contains('chart-area')) {
                    element.classList.add('visible');
                }
                
                // Animate counters
                if (element.classList.contains('stat-number')) {
                    animateCounter(element);
                }
                
                // Feature visuals
                if (element.classList.contains('fv-matching')) {
                    animateMatchingNodes(element);
                }
                if (element.classList.contains('fv-guided')) {
                    animateGuideLevels(element);
                }
                
                // Stop observing after animation
                scrollObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.method-card').forEach(card => {
        scrollObserver.observe(card);
    });
    
    document.querySelectorAll('.graphic-bar').forEach(bar => {
        scrollObserver.observe(bar);
    });
    
    document.querySelectorAll('.sculpture-bridge, .sculpture-accent').forEach(el => {
        scrollObserver.observe(el);
    });
    
    document.querySelectorAll('.chart-area').forEach(el => {
        scrollObserver.observe(el);
    });
    
    document.querySelectorAll('.stat-number').forEach(el => {
        scrollObserver.observe(el);
    });
    
    document.querySelectorAll('.fv-matching, .fv-guided').forEach(el => {
        scrollObserver.observe(el);
    });

    // ============================================
    // Counter Animation
    // ============================================
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    }

    // ============================================
    // Feature Visual Animations
    // ============================================
    
    function animateMatchingNodes(container) {
        const nodes = container.querySelectorAll('.m-node');
        const connections = container.querySelectorAll('.m-connection');
        
        // Activate nodes sequentially
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.classList.add('active');
            }, index * 200);
        });
        
        // Show connections after nodes
        setTimeout(() => {
            connections.forEach((conn, index) => {
                setTimeout(() => {
                    conn.classList.add('visible');
                }, index * 300);
            });
        }, nodes.length * 200 + 300);
    }
    
    function animateGuideLevels(container) {
        const levels = container.querySelectorAll('.guide-level');
        
        levels.forEach((level, index) => {
            setTimeout(() => {
                level.classList.add('active');
            }, index * 200);
        });
    }

    // ============================================
    // Form Handling
    // ============================================
    
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = ctaForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                ctaForm.reset();
                
                // Show success modal
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }, 1500);
        });
    }
    
    // Close modal
    if (closeModal && successModal) {
        closeModal.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on backdrop click
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successModal.classList.contains('active')) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Parallax Effect for Hero Monolith
    // ============================================
    
    const monolithStructure = document.querySelector('.monolith-structure');
    
    if (monolithStructure && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let parallaxTicking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.15;
            monolithStructure.style.transform = `translateY(${rate}px)`;
            parallaxTicking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                requestAnimationFrame(updateParallax);
                parallaxTicking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // Connection Section Animation on Scroll
    // ============================================
    
    const connectionSection = document.getElementById('connect');
    
    if (connectionSection) {
        const connectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bridge = entry.target.querySelector('.sculpture-bridge');
                    const accent = entry.target.querySelector('.sculpture-accent');
                    
                    if (bridge) bridge.classList.add('visible');
                    if (accent) {
                        setTimeout(() => {
                            accent.classList.add('visible');
                        }, 1000);
                    }
                    
                    connectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        
        connectionObserver.observe(connectionSection);
    }

    // ============================================
    // Initialize
    // ============================================
    
    document.addEventListener('DOMContentLoaded', () => {
        // Add loaded class to body for initial animations
        document.body.classList.add('loaded');
    });

})();
