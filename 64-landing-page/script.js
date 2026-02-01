/* ===================================
   Bohemian Design Landing Page
   JavaScript Interactions
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initParallax();
    initTestimonials();
    initNewsletterForm();
    initSmoothScroll();
});

/* Navigation */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect for navigation
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when past hero
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* Scroll Reveal Animation */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on data attribute or index
                const delay = entry.target.style.animationDelay || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));
}

/* Parallax Effect */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    if (parallaxElements.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.1;
            const rect = el.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView) {
                const yPos = (scrolled - el.offsetTop) * speed;
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

/* Testimonials Carousel */
function initTestimonials() {
    const carousel = document.getElementById('testimonialCarousel');
    const testimonials = carousel.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval;

    function showTestimonial(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Handle wrapping
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;

        const currentTestimonial = testimonials[currentIndex];
        const nextTestimonial = testimonials[index];
        const direction = index > currentIndex ? 1 : -1;

        // Animate out current
        currentTestimonial.style.transform = `translateX(${-50 * direction}px)`;
        currentTestimonial.style.opacity = '0';

        // Prepare next
        nextTestimonial.style.transform = `translateX(${50 * direction}px)`;
        nextTestimonial.style.opacity = '0';

        setTimeout(() => {
            currentTestimonial.classList.remove('active');

            // Animate in next
            nextTestimonial.classList.add('active');
            nextTestimonial.style.transform = 'translateX(0)';
            nextTestimonial.style.opacity = '1';

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentIndex = index;
            isAnimating = false;
        }, 300);
    }

    function nextTestimonial() {
        showTestimonial(currentIndex + 1);
    }

    function prevTestimonialFn() {
        showTestimonial(currentIndex - 1);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 6000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevTestimonialFn();
        stopAutoplay();
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        stopAutoplay();
        startAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Touch support for mobile
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
                nextTestimonial();
            } else {
                prevTestimonialFn();
            }
            stopAutoplay();
            startAutoplay();
        }
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

/* Newsletter Form */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('.btn-submit');
        const originalText = button.querySelector('span:first-child').textContent;

        // Validate email
        if (!isValidEmail(input.value)) {
            shakeElement(input);
            return;
        }

        // Show loading state
        button.disabled = true;
        button.querySelector('span:first-child').textContent = 'Sending...';

        // Simulate API call
        await delay(1500);

        // Show success
        button.querySelector('span:first-child').textContent = 'Subscribed!';
        button.style.backgroundColor = '#9CAF88';
        input.value = '';

        // Reset after delay
        setTimeout(() => {
            button.querySelector('span:first-child').textContent = originalText;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 3000);
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeElement(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (!target) return;

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* Utility Functions */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Add shake animation to stylesheet */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

/* Treasure Cards Hover Effect */
document.querySelectorAll('.treasure-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '';
    });
});

/* Subscription Tier Interaction */
document.querySelectorAll('.tier').forEach(tier => {
    const btn = tier.querySelector('.btn-tier, .btn-primary');

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Visual feedback
            tier.style.transform = 'scale(0.98)';
            setTimeout(() => {
                tier.style.transform = '';
            }, 150);

            // Could integrate with payment flow here
            console.log('Selected tier:', tier.querySelector('.tier-badge').textContent);
        });
    }
});

/* Floating Elements Random Movement */
function initFloatingElements() {
    const floatItems = document.querySelectorAll('.float-item');

    floatItems.forEach(item => {
        // Add random rotation on load
        const randomRotation = Math.random() * 360;
        item.style.transform = `rotate(${randomRotation}deg)`;
    });
}

initFloatingElements();

/* Performance: Debounce scroll events */
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

/* Lazy load sections for better performance */
function initLazyLoadSections() {
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));
}

initLazyLoadSections();

/* Add visual polish: cursor follower for desktop */
function initCursorEffect() {
    // Only on devices with fine pointer (mouse)
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<span class="cursor-dot"></span>';
        document.body.appendChild(cursor);

        const cursorStyle = document.createElement('style');
        cursorStyle.textContent = `
            .custom-cursor {
                position: fixed;
                width: 40px;
                height: 40px;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            body:hover .custom-cursor {
                opacity: 1;
            }

            .cursor-dot {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                background-color: #B8924A;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease;
            }

            .custom-cursor.hovering .cursor-dot {
                transform: translate(-50%, -50%) scale(2);
            }
        `;
        document.head.appendChild(cursorStyle);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX - 20 + 'px';
            cursor.style.top = cursorY - 20 + 'px';
            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .treasure-card, .tier');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }
}

initCursorEffect();

/* Console Easter Egg */
console.log(
    '%c✦ Wanderlust Treasures ✦',
    'font-family: Georgia, serif; font-size: 24px; color: #B8924A; text-shadow: 2px 2px 0 #C75D3A;'
);
console.log(
    '%cCurating stories, one treasure at a time.',
    'font-family: sans-serif; font-size: 12px; color: #6B5344;'
);
