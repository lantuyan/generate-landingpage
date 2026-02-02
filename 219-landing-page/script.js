/**
 * ECHOLOGRAPH — Smooth Interactions & Animations
 * Museum-slow motion, glide scrolling, frosted glass depth
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const fadeElements = document.querySelectorAll('.fade-in, .island');
    const ctaForm = document.getElementById('ctaForm');

    // ============================================
    // Navigation Scroll Effect
    // ============================================
    let lastScroll = 0;
    let ticking = false;

    function updateNav() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for glass effect
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
                spans[1].style.transform = 'rotate(-45deg) translate(0, 0)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
            }
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
            });
        });
    }

    // ============================================
    // Intersection Observer for Fade-in Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element's delay class
                const delayClass = Array.from(entry.target.classList).find(c => c.startsWith('delay-'));
                let delay = 0;
                
                if (delayClass) {
                    const delayNum = parseInt(delayClass.replace('delay-', ''));
                    delay = delayNum * 100;
                }
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // ============================================
    // Smooth Scroll with Glide Rhythm
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Parallax Effect for Haze Elements
    // ============================================
    const hazeElements = document.querySelectorAll('.haze');
    let parallaxTicking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        hazeElements.forEach((haze, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            haze.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        parallaxTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });

    // ============================================
    // CTA Form Handling
    // ============================================
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = ctaForm.querySelector('input[type="email"]').value;
            const btn = ctaForm.querySelector('button');
            const originalText = btn.textContent;
            
            // Simulate submission
            btn.textContent = 'Welcome...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Redirecting...';
                
                setTimeout(() => {
                    // Show success message
                    const formNote = ctaForm.querySelector('.form-note');
                    formNote.textContent = `Thank you. We've sent a secure link to ${email}`;
                    formNote.style.color = 'var(--color-accent)';
                    
                    btn.textContent = originalText;
                    btn.disabled = false;
                    ctaForm.reset();
                }, 800);
            }, 800);
        });
    }

    // ============================================
    // Magnetic Button Effect (Desktop)
    // ============================================
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        const magneticButtons = document.querySelectorAll('.btn-primary, .moment-card, .pricing-card');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ============================================
    // Timeline Animation in Trust Section
    // ============================================
    const timelinePoints = document.querySelectorAll('.timeline-point');
    
    if (timelinePoints.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelinePoints.forEach((point, index) => {
                        setTimeout(() => {
                            point.style.transform = 'scale(1.2)';
                            setTimeout(() => {
                                point.style.transform = 'scale(1)';
                            }, 200);
                        }, index * 300);
                    });
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const timelinePreview = document.querySelector('.timeline-preview');
        if (timelinePreview) {
            timelineObserver.observe(timelinePreview);
        }
    }

    // ============================================
    // Integrity Check Animation
    // ============================================
    const integrityChecks = document.querySelectorAll('.check-item');
    
    if (integrityChecks.length > 0) {
        const integrityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    integrityChecks.forEach((check, index) => {
                        setTimeout(() => {
                            check.style.opacity = '0.5';
                            setTimeout(() => {
                                check.style.opacity = '1';
                            }, 150);
                        }, index * 200);
                    });
                    integrityObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const integrityContainer = document.querySelector('.integrity-check');
        if (integrityContainer) {
            integrityObserver.observe(integrityContainer);
        }
    }

    // ============================================
    // Museum-Slow Hover for Cards
    // ============================================
    const cards = document.querySelectorAll('.moment-card, .pricing-card, .process-step');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ============================================
    // Initialize - Trigger Hero Animations
    // ============================================
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });
    }, 100);

    // ============================================
    // Glass Panel Shimmer Effect
    // ============================================
    const glassPanels = document.querySelectorAll('.glass-panel');
    
    glassPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            panel.style.background = `
                radial-gradient(
                    circle at ${x}% ${y}%,
                    rgba(212, 165, 116, 0.08) 0%,
                    var(--glass-bg) 50%
                )
            `;
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.background = '';
        });
    });

    console.log('Echolograph — Messages Across Time');
});
