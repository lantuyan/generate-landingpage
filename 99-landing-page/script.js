/**
 * Handcraft Guild - Craft/Maker Landing Page
 * Interactive JavaScript for tactile experiences
 */

(function() {
    'use strict';

    // =========================================
    // Navigation
    // =========================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll-based navigation styling
    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll);

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================

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

    // =========================================
    // Animated Counter
    // =========================================

    function animateCounter(element, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for more natural feel
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observe stats for counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count, 10);
                animateCounter(entry.target, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(stat) {
        statsObserver.observe(stat);
    });

    // =========================================
    // Parallax Effect for Hero Stack Items
    // =========================================

    const stackItems = document.querySelectorAll('.stack-item');

    function handleParallax() {
        const scrollY = window.scrollY;

        stackItems.forEach(function(item) {
            const parallaxSpeed = parseFloat(item.dataset.parallax) || 0.1;
            const yOffset = scrollY * parallaxSpeed;
            const currentTransform = window.getComputedStyle(item).transform;

            // Only apply parallax if item is visible
            if (scrollY < window.innerHeight) {
                item.style.transform = `translateY(${yOffset}px) ${item.classList.contains('stack-wood') ? 'rotate(-6deg)' :
                    item.classList.contains('stack-ceramic') ? 'rotate(4deg)' :
                    item.classList.contains('stack-metal') ? 'rotate(-3deg)' : 'rotate(5deg)'}`;
            }
        });
    }

    window.addEventListener('scroll', handleParallax);

    // =========================================
    // Workshop Filter
    // =========================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const workshopCards = document.querySelectorAll('.workshop-card');

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update active state
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Filter cards with animation
            workshopCards.forEach(function(card) {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(function() {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-10px)';

                    setTimeout(function() {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // =========================================
    // Artisan Carousel
    // =========================================

    const artisanTrack = document.getElementById('artisanTrack');
    const prevBtn = document.getElementById('prevArtisan');
    const nextBtn = document.getElementById('nextArtisan');
    const dotsContainer = document.getElementById('carouselDots');

    if (artisanTrack && prevBtn && nextBtn && dotsContainer) {
        const artisanCards = artisanTrack.querySelectorAll('.artisan-card');
        let currentSlide = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }

        const totalSlides = Math.ceil(artisanCards.length / cardsPerView);

        // Create dots
        function createDots() {
            dotsContainer.innerHTML = '';
            const newTotalSlides = Math.ceil(artisanCards.length / getCardsPerView());

            for (let i = 0; i < newTotalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', function() {
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            }
        }

        createDots();

        function updateCarousel() {
            const cardWidth = artisanCards[0].offsetWidth;
            const gap = 24; // var(--space-xl)
            const offset = currentSlide * (cardWidth + gap) * cardsPerView;
            artisanTrack.style.transform = `translateX(-${offset}px)`;

            // Update dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            const maxSlide = Math.ceil(artisanCards.length / cardsPerView) - 1;
            currentSlide = Math.max(0, Math.min(index, maxSlide));
            updateCarousel();
        }

        prevBtn.addEventListener('click', function() {
            goToSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', function() {
            goToSlide(currentSlide + 1);
        });

        // Handle resize
        window.addEventListener('resize', function() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentSlide = 0;
                createDots();
                updateCarousel();
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        artisanTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        artisanTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
        }
    }

    // =========================================
    // Scroll Reveal Animations
    // =========================================

    function setupRevealAnimations() {
        const revealElements = document.querySelectorAll(
            '.section-header, .workshop-card, .craft-path, .artisan-card, .process-step, .testimonial, .kit-preview'
        );

        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function(element, index) {
            element.classList.add('reveal');
            element.style.transitionDelay = `${index % 4 * 0.1}s`;
            revealObserver.observe(element);
        });
    }

    setupRevealAnimations();

    // =========================================
    // Form Handling
    // =========================================

    const ctaForm = document.getElementById('ctaForm');

    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value;

            if (!email) return;

            // Simulate submission
            submitBtn.innerHTML = '<span>Joining...</span>';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.innerHTML = '<span>Welcome to the Guild!</span>';
                emailInput.value = '';

                setTimeout(function() {
                    submitBtn.innerHTML = '<span>Start Making</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // =========================================
    // Tactile Hover Effects
    // =========================================

    // Add subtle movement on mouse move for craft paths
    const craftPaths = document.querySelectorAll('.craft-path');

    craftPaths.forEach(function(path) {
        path.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        path.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Add tactile effect to workshop cards
    const workshopCardsHover = document.querySelectorAll('.workshop-card');

    workshopCardsHover.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create subtle gradient spotlight effect
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(166, 124, 82, 0.03), transparent 50%), var(--bg-primary)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.background = 'var(--bg-primary)';
        });
    });

    // =========================================
    // Kit Box Animation
    // =========================================

    const kitBox = document.querySelector('.kit-box');

    if (kitBox) {
        const kitObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        kitObserver.observe(kitBox);
    }

    // =========================================
    // Process Steps Animation
    // =========================================

    const processSteps = document.querySelectorAll('.process-step');

    const stepsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const step = entry.target;
                const stepNumber = step.dataset.step;

                // Stagger animation based on step number
                setTimeout(function() {
                    step.classList.add('active');
                }, (parseInt(stepNumber, 10) - 1) * 200);

                stepsObserver.unobserve(step);
            }
        });
    }, { threshold: 0.3 });

    processSteps.forEach(function(step) {
        stepsObserver.observe(step);
    });

    // =========================================
    // Cursor Trail Effect for Hero (Optional)
    // =========================================

    const hero = document.getElementById('hero');

    if (hero && window.innerWidth > 1024) {
        let lastX = 0;
        let lastY = 0;

        hero.addEventListener('mousemove', function(e) {
            const x = e.clientX;
            const y = e.clientY;

            // Only create trail if moved significantly
            if (Math.abs(x - lastX) > 50 || Math.abs(y - lastY) > 50) {
                createTrailDot(x, y);
                lastX = x;
                lastY = y;
            }
        });

        function createTrailDot(x, y) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.3;
                transform: translate(-50%, -50%);
                transition: all 1s ease;
            `;

            document.body.appendChild(dot);

            setTimeout(function() {
                dot.style.opacity = '0';
                dot.style.transform = 'translate(-50%, -50%) scale(2)';
            }, 50);

            setTimeout(function() {
                dot.remove();
            }, 1000);
        }
    }

    // =========================================
    // Lazy Load Images (for future use with real images)
    // =========================================

    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(function(img) {
                img.src = img.dataset.src;
            });
        }
    }

    setupLazyLoading();

    // =========================================
    // Keyboard Navigation
    // =========================================

    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // =========================================
    // Initialize
    // =========================================

    // Run scroll handler on load to set initial state
    handleNavScroll();

    console.log('Handcraft Guild - Craft/Maker Landing Page Initialized');

})();
