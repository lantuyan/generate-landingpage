/**
 * Pathfinder - Travel/Adventure Landing Page
 * Interactive JavaScript with smooth animations and journey-like transitions
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        scrollThreshold: 50,
        animationDelay: 100,
        counterDuration: 2000,
        storyAutoplayInterval: 6000
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {
        navbar: document.getElementById('navbar'),
        navLinks: document.getElementById('navLinks'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        experienceTabs: document.querySelectorAll('.exp-tab'),
        experiencePanels: document.querySelectorAll('.experience-panel'),
        storyCards: document.querySelectorAll('.story-card'),
        storyDots: document.querySelectorAll('.story-dot'),
        storyNavBtns: document.querySelectorAll('.story-nav-btn'),
        bookForm: document.getElementById('bookForm'),
        statNumbers: document.querySelectorAll('.stat-number'),
        revealElements: document.querySelectorAll('.step-card, .destination-card, .experience-card, .local-card, .section-header')
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const debounce = (func, wait = 10) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const lerp = (start, end, factor) => start + (end - start) * factor;

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const initNavbar = () => {
        const handleScroll = () => {
            const scrolled = window.scrollY > CONFIG.scrollThreshold;
            elements.navbar.classList.toggle('scrolled', scrolled);
        };

        window.addEventListener('scroll', debounce(handleScroll), { passive: true });
        handleScroll();
    };

    // ============================================
    // MOBILE MENU
    // ============================================
    const initMobileMenu = () => {
        if (!elements.mobileMenuBtn || !elements.navLinks) return;

        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.mobileMenuBtn.classList.toggle('active');
            elements.navLinks.classList.toggle('active');
            document.body.style.overflow = elements.navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        elements.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                elements.mobileMenuBtn.classList.remove('active');
                elements.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    };

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const navHeight = elements.navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const animateCounter = (element, target) => {
        const duration = CONFIG.counterDuration;
        const startTime = performance.now();
        const startValue = 0;

        const formatNumber = (num) => {
            if (num >= 1000) {
                return num.toLocaleString();
            }
            return num.toString();
        };

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(lerp(startValue, target, easeOutQuart));

            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(update);
    };

    const initCounterAnimation = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count, 10);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        elements.statNumbers.forEach(stat => observer.observe(stat));
    };

    // ============================================
    // EXPERIENCE TABS
    // ============================================
    const initExperienceTabs = () => {
        if (!elements.experienceTabs.length) return;

        elements.experienceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;

                // Update tabs
                elements.experienceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update panels with fade effect
                elements.experiencePanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    };

    // ============================================
    // STORIES CAROUSEL
    // ============================================
    let storyIndex = 0;
    let storyInterval;

    const showStory = (index) => {
        const totalStories = elements.storyCards.length;
        storyIndex = ((index % totalStories) + totalStories) % totalStories;

        elements.storyCards.forEach((card, i) => {
            card.classList.toggle('active', i === storyIndex);
        });

        elements.storyDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === storyIndex);
        });
    };

    const nextStory = () => showStory(storyIndex + 1);
    const prevStory = () => showStory(storyIndex - 1);

    const startStoryAutoplay = () => {
        storyInterval = setInterval(nextStory, CONFIG.storyAutoplayInterval);
    };

    const stopStoryAutoplay = () => {
        clearInterval(storyInterval);
    };

    const initStoriesCarousel = () => {
        if (!elements.storyCards.length) return;

        // Navigation buttons
        elements.storyNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                stopStoryAutoplay();
                if (btn.classList.contains('next')) {
                    nextStory();
                } else {
                    prevStory();
                }
                startStoryAutoplay();
            });
        });

        // Dots navigation
        elements.storyDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                stopStoryAutoplay();
                showStory(i);
                startStoryAutoplay();
            });
        });

        // Start autoplay
        startStoryAutoplay();

        // Pause on hover
        const carousel = document.querySelector('.stories-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopStoryAutoplay);
            carousel.addEventListener('mouseleave', startStoryAutoplay);
        }
    };

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for grid items
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * CONFIG.animationDelay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(element);
        });
    };

    // ============================================
    // FORM HANDLING
    // ============================================
    const initFormHandling = () => {
        if (!elements.bookForm) return;

        elements.bookForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(elements.bookForm);
            const destination = document.getElementById('destination').value;
            const experience = document.getElementById('experience').value;
            const email = document.getElementById('email').value;

            // Simulate form submission
            const submitBtn = elements.bookForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Starting your journey...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                const formContainer = elements.bookForm.parentElement;
                elements.bookForm.style.opacity = '0';
                elements.bookForm.style.transform = 'translateY(-20px)';

                setTimeout(() => {
                    elements.bookForm.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🎒</div>
                            <h3 style="color: white; margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">Adventure Awaits!</h3>
                            <p style="color: rgba(255,255,255,0.9);">We'll match you with local guides for your ${destination || 'dream destination'} adventure. Check your email at <strong>${email}</strong> for next steps.</p>
                        </div>
                    `;
                    elements.bookForm.style.opacity = '1';
                    elements.bookForm.style.transform = 'translateY(0)';
                }, 300);
            }, 1500);
        });
    };

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    const initParallax = () => {
        const heroContent = document.querySelector('.hero-content');

        if (!heroContent) return;

        const handleParallax = () => {
            const scrolled = window.scrollY;
            const windowHeight = window.innerHeight;

            if (scrolled < windowHeight) {
                const parallaxFactor = scrolled * 0.3;
                heroContent.style.transform = `translateY(${parallaxFactor}px)`;
                heroContent.style.opacity = 1 - (scrolled / windowHeight) * 0.5;
            }
        };

        window.addEventListener('scroll', debounce(handleParallax, 5), { passive: true });
    };

    // ============================================
    // DESTINATION CARDS HOVER EFFECT
    // ============================================
    const initCardHoverEffects = () => {
        const cards = document.querySelectorAll('.destination-card, .local-card, .experience-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };

    // ============================================
    // ACTIVE NAVIGATION HIGHLIGHT
    // ============================================
    const initActiveNavigation = () => {
        const sections = document.querySelectorAll('section[id]');

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

                if (navLink) {
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                }
            });
        };

        window.addEventListener('scroll', debounce(handleScroll), { passive: true });
    };

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    const initKeyboardNavigation = () => {
        document.addEventListener('keydown', (e) => {
            // Escape closes mobile menu
            if (e.key === 'Escape' && elements.navLinks.classList.contains('active')) {
                elements.mobileMenuBtn.classList.remove('active');
                elements.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Arrow keys for story navigation
            const storiesSection = document.querySelector('.stories');
            if (storiesSection) {
                const rect = storiesSection.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;

                if (isInView) {
                    if (e.key === 'ArrowRight') {
                        stopStoryAutoplay();
                        nextStory();
                        startStoryAutoplay();
                    } else if (e.key === 'ArrowLeft') {
                        stopStoryAutoplay();
                        prevStory();
                        startStoryAutoplay();
                    }
                }
            }
        });
    };

    // ============================================
    // TOUCH SWIPE FOR STORIES
    // ============================================
    const initTouchSwipe = () => {
        const carousel = document.querySelector('.stories-carousel');
        if (!carousel) return;

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopStoryAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    prevStory();
                } else {
                    nextStory();
                }
            }
            startStoryAutoplay();
        }, { passive: true });
    };

    // ============================================
    // LOADING ANIMATION
    // ============================================
    const initLoadingAnimation = () => {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');

            // Trigger hero animations
            const heroElements = document.querySelectorAll('.hero-content > *');
            heroElements.forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 150);
            });
        });
    };

    // ============================================
    // INITIALIZE ALL MODULES
    // ============================================
    const init = () => {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initCounterAnimation();
        initExperienceTabs();
        initStoriesCarousel();
        initScrollReveal();
        initFormHandling();
        initParallax();
        initCardHoverEffects();
        initActiveNavigation();
        initKeyboardNavigation();
        initTouchSwipe();
        initLoadingAnimation();

        console.log('🧭 Pathfinder initialized - Ready for adventure!');
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
