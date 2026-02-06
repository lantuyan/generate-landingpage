/**
 * Hearth — Community Coordination Platform
 * Scandinavian + Quiet Opulence Design
 *
 * JavaScript for animations and interactions
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const modelItems = document.querySelectorAll('.model-item');
    const modelScenes = document.querySelectorAll('.model-scene');
    const joinForm = document.getElementById('joinForm');
    const joinSuccess = document.getElementById('joinSuccess');
    const revealElements = document.querySelectorAll('[data-reveal]');

    // ========================================
    // Navigation
    // ========================================

    // Scroll behavior for navigation
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
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
    // Community Models Accordion
    // ========================================

    function setActiveModel(modelName) {
        // Update accordion items
        modelItems.forEach(function(item) {
            if (item.dataset.model === modelName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update visual scenes
        modelScenes.forEach(function(scene) {
            if (scene.classList.contains(modelName)) {
                scene.classList.add('active');
            } else {
                scene.classList.remove('active');
            }
        });
    }

    modelItems.forEach(function(item) {
        item.querySelector('.model-header').addEventListener('click', function() {
            const modelName = item.dataset.model;
            setActiveModel(modelName);
        });
    });

    // ========================================
    // Scroll Reveal Animation
    // ========================================

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }

    // Initial check
    checkReveal();

    // Check on scroll with throttle
    let revealTicking = false;
    window.addEventListener('scroll', function() {
        if (!revealTicking) {
            window.requestAnimationFrame(function() {
                checkReveal();
                revealTicking = false;
            });
            revealTicking = true;
        }
    });

    // ========================================
    // Tide Scroll Effect
    // ========================================

    // Create intersection observer for tide effect
    const tideObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('tide-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections for tide effect
    document.querySelectorAll('section').forEach(function(section) {
        tideObserver.observe(section);
    });

    // ========================================
    // Form Handling
    // ========================================

    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulate form submission
            const submitBtn = joinForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Joining...</span>';

            // Simulate API call
            setTimeout(function() {
                joinForm.classList.add('hidden');
                joinSuccess.classList.add('active');

                // Reset button state (in case form is shown again)
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    // ========================================
    // Gentle Breathing Animation Enhancement
    // ========================================

    // Add subtle parallax to floating islands on mouse move
    const heroVisual = document.querySelector('.hero-visual');
    const floatingIslands = document.querySelectorAll('.floating-island');

    if (heroVisual && floatingIslands.length > 0) {
        heroVisual.addEventListener('mousemove', function(e) {
            const rect = heroVisual.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const offsetX = (mouseX - centerX) / centerX;
            const offsetY = (mouseY - centerY) / centerY;

            floatingIslands.forEach(function(island, index) {
                const depth = (index + 1) * 0.5;
                const translateX = offsetX * 10 * depth;
                const translateY = offsetY * 10 * depth;

                island.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        });

        heroVisual.addEventListener('mouseleave', function() {
            floatingIslands.forEach(function(island) {
                island.style.transform = '';
            });
        });
    }

    // ========================================
    // Center Rings Pulse Enhancement
    // ========================================

    const centerRings = document.querySelectorAll('.center-ring');

    centerRings.forEach(function(ring, index) {
        ring.style.animationDelay = `${index * 0.5}s`;
    });

    // ========================================
    // Stats Counter Animation
    // ========================================

    const statsSection = document.querySelector('.hero-stats');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(function(stat) {
            const finalText = stat.textContent;
            const hasPrefix = finalText.startsWith('$');
            const hasSuffix = finalText.includes('+') || finalText.includes('%') || finalText.includes('M');

            let prefix = '';
            let suffix = '';
            let numericPart = finalText;

            if (hasPrefix) {
                prefix = '$';
                numericPart = numericPart.substring(1);
            }

            if (numericPart.includes('+')) {
                suffix = '+';
                numericPart = numericPart.replace('+', '');
            } else if (numericPart.includes('%')) {
                suffix = '%';
                numericPart = numericPart.replace('%', '');
            } else if (numericPart.includes('M')) {
                suffix = 'M';
                numericPart = numericPart.replace('M', '');
            }

            // Handle decimal numbers like "3.2"
            const isDecimal = numericPart.includes('.');
            const finalValue = parseFloat(numericPart.replace(/,/g, ''));

            if (isNaN(finalValue)) return;

            const duration = 2000;
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);

                let currentValue = finalValue * easeOutQuart;

                if (isDecimal) {
                    currentValue = currentValue.toFixed(1);
                } else if (finalValue >= 1000) {
                    currentValue = Math.round(currentValue).toLocaleString();
                } else {
                    currentValue = Math.round(currentValue);
                }

                stat.textContent = prefix + currentValue + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }

            requestAnimationFrame(updateNumber);
        });

        statsAnimated = true;
    }

    // Trigger stats animation when visible
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ========================================
    // Keyboard Navigation
    // ========================================

    // ESC key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ========================================
    // Preload Critical Animations
    // ========================================

    // Ensure animations are ready on page load
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        // Trigger initial reveal check after a brief delay
        setTimeout(checkReveal, 100);
    });

    // ========================================
    // Reduced Motion Support
    // ========================================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable parallax effects
            if (heroVisual) {
                heroVisual.removeEventListener('mousemove', function() {});
            }

            // Reveal all elements immediately
            revealElements.forEach(function(element) {
                element.classList.add('revealed');
            });
        }
    }

    handleReducedMotion();
    prefersReducedMotion.addEventListener('change', handleReducedMotion);

})();
