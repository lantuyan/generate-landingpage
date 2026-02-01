/* ========================================
   NightBite - Neon Landing Page Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initTestimonialSlider();
    initNeonFlicker();
});

/* ========================================
   Navigation
   ======================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const mobileBtn = document.querySelector('.mobile-menu-btn');
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');

                // Scroll to target
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    // Elements to animate
    const animateElements = [
        '.section-header',
        '.step-card',
        '.featured-card',
        '.testimonial-card',
        '.download-content',
        '.download-visual'
    ];

    // Add animate-on-scroll class to elements
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Add staggered delay for cards
                if (entry.target.classList.contains('step-card') ||
                    entry.target.classList.contains('featured-card')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animate elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Create observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/* ========================================
   Testimonial Slider
   ======================================== */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let autoplayInterval;

    const updateSlider = (index) => {
        // For mobile, show one card at a time
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            track.style.transform = `translateX(-${index * 100}%)`;
        } else {
            // For desktop, we show all cards but can still navigate
            const cardWidth = cards[0].offsetWidth + 30; // Including gap
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        }

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    };

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            resetAutoplay();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < cards.length - 1) {
                updateSlider(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                updateSlider(currentIndex - 1);
            }
            resetAutoplay();
        }
    };

    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % cards.length;
            updateSlider(nextIndex);
        }, 5000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };

    // Handle resize
    window.addEventListener('resize', () => {
        updateSlider(currentIndex);
    });

    startAutoplay();
}

/* ========================================
   Neon Flicker Effects
   ======================================== */
function initNeonFlicker() {
    // Random subtle flicker for neon elements
    const neonElements = document.querySelectorAll('.sign-open, .sign-late');

    neonElements.forEach(el => {
        // Add random flicker intensity
        setInterval(() => {
            const shouldFlicker = Math.random() > 0.95;
            if (shouldFlicker) {
                el.style.opacity = '0.8';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 50);
            }
        }, 100);
    });

    // Hover glow enhancement for cards
    const cards = document.querySelectorAll('.featured-card, .step-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease, box-shadow 0.1s ease';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Typing effect for hero badge (optional enhancement)
    const badge = document.querySelector('.hero-badge span:last-child');
    if (badge) {
        const text = badge.textContent;
        badge.textContent = '';
        let i = 0;

        const typeText = () => {
            if (i < text.length) {
                badge.textContent += text.charAt(i);
                i++;
                setTimeout(typeText, 50);
            }
        };

        // Start typing after a short delay
        setTimeout(typeText, 1000);
    }
}

/* ========================================
   Parallax Effects
   ======================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Parallax for background elements
    const circles = document.querySelectorAll('.neon-circle');
    circles.forEach((circle, index) => {
        const speed = 0.1 * (index + 1);
        circle.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Parallax for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

/* ========================================
   Button Ripple Effect
   ======================================== */
document.querySelectorAll('.btn, .store-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ========================================
   Preloader (Optional)
   ======================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
        el.classList.add('animated');
    });
});
