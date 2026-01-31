/**
 * THE GILDED GLASS - Art Deco Landing Page
 * JavaScript for animations, interactions, and theatrical effects
 */

(function() {
    'use strict';

    // ========================================
    // PRELOADER
    // ========================================

    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        document.body.classList.remove('loading');
        preloader.classList.add('hidden');

        // Remove from DOM after animation
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }

    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 1500);
    });

    // Fallback: hide preloader after max wait time
    setTimeout(hidePreloader, 4000);

    // Set loading state initially
    document.body.classList.add('loading');

    // ========================================
    // NAVIGATION
    // ========================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior for navigation
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
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
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // REVEAL ANIMATIONS
    // ========================================

    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealCallback = function(entries, observer) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                // Add stagger delay for multiple elements
                const delay = entry.target.dataset.revealDelay || 0;

                setTimeout(function() {
                    entry.target.classList.add('revealed');
                }, delay * 100);

                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    // Add stagger delays to card groups
    function addStaggerDelays() {
        const cardGroups = [
            '.experience-card',
            '.membership-card',
            '.collection-item'
        ];

        cardGroups.forEach(function(selector) {
            const cards = document.querySelectorAll(selector);
            cards.forEach(function(card, index) {
                card.dataset.revealDelay = index;
            });
        });
    }

    addStaggerDelays();

    revealElements.forEach(function(element) {
        revealObserver.observe(element);
    });

    // ========================================
    // TESTIMONIAL CAROUSEL
    // ========================================

    const carousel = document.getElementById('testimonial-carousel');

    if (carousel) {
        const track = carousel.querySelector('.testimonial-track');
        const cards = carousel.querySelectorAll('.testimonial-card');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        let currentIndex = 0;
        const totalSlides = cards.length;
        let autoplayInterval;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', function() {
                goToSlide(i);
                resetAutoplay();
            });

            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            currentIndex = index;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

            // Update dots
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoplay();
        });

        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoplay();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }

        // Keyboard navigation
        carousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            }
        });

        // Start autoplay
        startAutoplay();

        // Pause on hover
        carousel.addEventListener('mouseenter', function() {
            clearInterval(autoplayInterval);
        });

        carousel.addEventListener('mouseleave', function() {
            startAutoplay();
        });
    }

    // ========================================
    // FORM HANDLING
    // ========================================

    const joinForm = document.getElementById('join-form');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = successModal.querySelector('.modal-overlay');

    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulate form submission
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Submitting...</span>';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                joinForm.reset();
                showModal();
            }, 1500);
        });
    }

    function showModal() {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideModal);
    }

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            hideModal();
        }
    });

    // ========================================
    // PARALLAX EFFECTS
    // ========================================

    const heroContent = document.querySelector('.hero-content');
    const heroPattern = document.querySelector('.hero-bg-pattern');

    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        if (scrollY < heroHeight) {
            const parallaxValue = scrollY * 0.3;
            const opacityValue = 1 - (scrollY / heroHeight);

            if (heroContent) {
                heroContent.style.transform = 'translateY(' + parallaxValue + 'px)';
                heroContent.style.opacity = Math.max(opacityValue, 0);
            }

            if (heroPattern) {
                heroPattern.style.transform = 'translateY(' + (parallaxValue * 0.5) + 'px)';
            }
        }
    }

    window.addEventListener('scroll', function() {
        window.requestAnimationFrame(updateParallax);
    });

    // ========================================
    // DECORATIVE CURSOR TRAIL (Optional)
    // ========================================

    // Subtle gold sparkle effect on mouse move (desktop only)
    if (window.matchMedia('(min-width: 1024px)').matches) {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(sparkleContainer);

        let sparkleTimeout;

        document.addEventListener('mousemove', function(e) {
            clearTimeout(sparkleTimeout);
            sparkleTimeout = setTimeout(function() {
                createSparkle(e.clientX, e.clientY);
            }, 50);
        });

        function createSparkle(x, y) {
            if (Math.random() > 0.7) return; // Only create sparkle 30% of the time

            const sparkle = document.createElement('div');
            sparkle.innerHTML = '&#9830;';
            sparkle.style.cssText =
                'position:absolute;' +
                'left:' + x + 'px;' +
                'top:' + y + 'px;' +
                'font-size:8px;' +
                'color:rgba(212,175,55,0.6);' +
                'pointer-events:none;' +
                'animation:sparkleFloat 1s ease-out forwards;' +
                'transform:translate(-50%,-50%);';

            sparkleContainer.appendChild(sparkle);

            setTimeout(function() {
                sparkle.remove();
            }, 1000);
        }

        // Add sparkle animation
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent =
            '@keyframes sparkleFloat {' +
            '0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }' +
            '100% { opacity: 0; transform: translate(-50%, -100%) scale(0); }' +
            '}';
        document.head.appendChild(sparkleStyle);
    }

    // ========================================
    // SECTION ACTIVE STATE
    // ========================================

    const sections = document.querySelectorAll('section[id]');

    function updateActiveSection() {
        const scrollY = window.scrollY;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', function() {
        window.requestAnimationFrame(updateActiveSection);
    });

    // ========================================
    // MEMBERSHIP CARD HOVER EFFECTS
    // ========================================

    const membershipCards = document.querySelectorAll('.membership-card');

    membershipCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            membershipCards.forEach(function(c) {
                if (c !== card) {
                    c.style.opacity = '0.7';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            membershipCards.forEach(function(c) {
                c.style.opacity = '1';
            });
        });
    });

    // ========================================
    // FORM INPUT ANIMATIONS
    // ========================================

    const formInputs = document.querySelectorAll('.form-input, .form-select');

    formInputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });

    // ========================================
    // LAZY LOADING ENHANCEMENT
    // ========================================

    // Add loading="lazy" to images dynamically if needed
    document.querySelectorAll('img:not([loading])').forEach(function(img) {
        img.setAttribute('loading', 'lazy');
    });

    // ========================================
    // REDUCED MOTION SUPPORT
    // ========================================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-medium', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
            document.documentElement.style.setProperty('--transition-theatrical', '0s');

            // Immediately reveal all elements
            revealElements.forEach(function(element) {
                element.classList.add('revealed');
            });
        }
    }

    handleReducedMotion();
    prefersReducedMotion.addEventListener('change', handleReducedMotion);

    // ========================================
    // PERFORMANCE OPTIMIZATION
    // ========================================

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Handle any resize-dependent calculations here
        }, 250);
    });

})();
