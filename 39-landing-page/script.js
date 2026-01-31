/* =====================================================
   STORYPAPER PRESS - Interactive JavaScript
   Paper Cut Design Landing Page
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initParallax();
    initScrollAnimations();
    initCardTilt();
    initCarousel();
    initFormHandling();
    initSmoothScroll();
});

/* =====================================================
   Navigation
   ===================================================== */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* =====================================================
   Parallax Scrolling Effect
   ===================================================== */
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.paper-layer');
    const heroContent = document.querySelector('.hero-content');

    if (parallaxLayers.length === 0) return;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        // Only apply parallax when in hero section
        if (scrolled > heroHeight) return;

        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.1;
            const yPos = scrolled * speed;
            layer.style.transform = `translateY(${yPos}px)`;
        });

        // Parallax for hero content
        if (heroContent) {
            const contentSpeed = parseFloat(heroContent.dataset.speed) || 0.5;
            const yPos = scrolled * contentSpeed;
            heroContent.style.transform = `translateY(${yPos}px)`;
            heroContent.style.opacity = 1 - (scrolled / heroHeight) * 1.5;
        }
    }

    // Use requestAnimationFrame for smooth parallax
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* =====================================================
   Scroll Animations (Intersection Observer)
   ===================================================== */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = [
        { selector: '.feature-card', class: 'fade-in' },
        { selector: '.step', class: 'fade-in' },
        { selector: '.story-card', class: 'fade-in' },
        { selector: '.testimonial-card', class: 'fade-in' },
        { selector: '.section-header', class: 'fade-in' },
        { selector: '.cta-content', class: 'fade-in' }
    ];

    animatedElements.forEach(item => {
        document.querySelectorAll(item.selector).forEach(el => {
            el.classList.add(item.class);
        });
    });

    // Create observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

/* =====================================================
   Card Tilt Effect
   ===================================================== */
function initCardTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* =====================================================
   Stories Carousel
   ===================================================== */
function initCarousel() {
    const carousel = document.querySelector('.stories-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const cards = document.querySelectorAll('.story-card');

    if (!carousel || cards.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;

    // Check if we need carousel functionality (mobile)
    function shouldUseCarousel() {
        return window.innerWidth < 768;
    }

    function updateCarousel() {
        if (!shouldUseCarousel()) {
            carousel.style.transform = 'translateX(0)';
            cards.forEach(card => card.style.display = '');
            return;
        }

        const cardWidth = cards[0].offsetWidth + 24; // Including gap
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        updateCarousel();

        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    function nextSlide() {
        if (currentIndex < cards.length - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(cards.length - 1);
        }
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
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
        }
    }

    // Handle resize
    window.addEventListener('resize', debounce(updateCarousel, 100));
}

/* =====================================================
   Form Handling
   ===================================================== */
function initFormHandling() {
    const form = document.getElementById('subscribe-form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]');
        const button = this.querySelector('button[type="submit"]');

        if (!email.value) return;

        // Simulate form submission
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Sending...</span>';
        button.disabled = true;

        setTimeout(() => {
            // Success state
            button.innerHTML = '<span>Welcome aboard! ✨</span>';
            button.style.background = '#4ECDC4';
            email.value = '';

            // Reset after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Input animation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

/* =====================================================
   Smooth Scroll
   ===================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   Paper Cut Animation Effects
   ===================================================== */
// Floating elements animation
function initFloatingElements() {
    const floatElements = document.querySelectorAll('.cloud, .tree, .mountain');

    floatElements.forEach(el => {
        el.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        el.style.animationDelay = `${Math.random() * 2}s`;
    });
}

// Paper lift effect on scroll
function initPaperLift() {
    const paperCards = document.querySelectorAll('.paper-card, .feature-card, .story-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.boxShadow = 'var(--shadow-paper-hover)';
                setTimeout(() => {
                    entry.target.style.boxShadow = '';
                }, 500);
            }
        });
    }, { threshold: 0.5 });

    paperCards.forEach(card => observer.observe(card));
}

/* =====================================================
   Utility Functions
   ===================================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* =====================================================
   Page Visibility Optimization
   ===================================================== */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.setProperty('--animation-play-state', 'paused');
    } else {
        document.body.style.setProperty('--animation-play-state', 'running');
    }
});

/* =====================================================
   Scroll Progress Indicator (Optional Enhancement)
   ===================================================== */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }, 10));
}

// Initialize scroll progress
initScrollProgress();

/* =====================================================
   Keyboard Navigation Support
   ===================================================== */
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});

/* =====================================================
   Lazy Loading Images (if needed)
   ===================================================== */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Initialize lazy loading
initLazyLoading();

/* =====================================================
   Console Easter Egg
   ===================================================== */
console.log('%c📚 StoryPaper Press', 'font-size: 24px; font-weight: bold; color: #FF6B6B;');
console.log('%cWhere every page sparks wonder!', 'font-size: 14px; color: #4ECDC4;');
console.log('%cBuilt with love and paper cuts ✂️', 'font-size: 12px; color: #636E72;');
