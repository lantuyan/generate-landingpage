/**
 * PawVital - Pet Health Landing Page JavaScript
 * Animations, Interactions, and Dynamic Elements
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialsSlider();
    initPetTypeSelector();
    initFormHandling();
    initSmoothScroll();
    initParallaxEffects();
});

/**
 * Navbar Scroll Effects
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll Animations with Intersection Observer
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animationMap = [
        { selector: '.step-card', class: 'fade-in', delay: 100 },
        { selector: '.product-card', class: 'scale-in', delay: 150 },
        { selector: '.science-feature', class: 'slide-in-left', delay: 100 },
        { selector: '.ingredient-card', class: 'scale-in', delay: 100 },
        { selector: '.testimonial-card', class: 'fade-in', delay: 150 },
        { selector: '.section-header', class: 'fade-in', delay: 0 }
    ];

    animationMap.forEach(({ selector, class: animClass, delay }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add(animClass);
            el.style.transitionDelay = `${index * delay}ms`;
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Testimonials Slider
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (!slider || cards.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;
    const isMobile = window.innerWidth <= 1024;

    // Only enable slider functionality on mobile
    function updateSlider() {
        if (window.innerWidth > 1024) {
            // Reset for desktop - show all cards
            cards.forEach(card => {
                card.style.display = '';
                card.style.opacity = '';
                card.style.transform = '';
            });
            return;
        }

        // Mobile slider
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            } else {
                card.style.display = 'none';
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function startAutoSlide() {
        if (window.innerWidth <= 1024) {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Touch support for swiping
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
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
            stopAutoSlide();
            startAutoSlide();
        }
    }

    // Initialize
    updateSlider();
    startAutoSlide();

    // Handle resize
    window.addEventListener('resize', () => {
        stopAutoSlide();
        updateSlider();
        startAutoSlide();
    });
}

/**
 * Pet Type Selector
 */
function initPetTypeSelector() {
    const petTypeBtns = document.querySelectorAll('.pet-type-btn');
    const petInput = document.querySelector('.quiz-start-form input[type="text"]');

    petTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            petTypeBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Update placeholder based on pet type
            const petType = btn.dataset.pet;
            if (petInput) {
                petInput.placeholder = petType === 'dog' ? "Your dog's name" : "Your cat's name";
            }

            // Add a little bounce animation
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });
}

/**
 * Form Handling
 */
function initFormHandling() {
    const quizForm = document.querySelector('.quiz-start-form');

    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const petName = quizForm.querySelector('input[type="text"]').value;
            const email = quizForm.querySelector('input[type="email"]').value;
            const petType = document.querySelector('.pet-type-btn.active')?.dataset.pet || 'dog';

            // Simulate form submission
            const submitBtn = quizForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Starting Quiz...</span> 🐾';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Quiz Ready!</span> ✓';
                submitBtn.style.background = 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))';

                // Show success message
                showNotification(`Welcome ${petName}! Your personalized ${petType} wellness quiz is ready.`);

                // Reset after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    quizForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // Input focus effects
    const inputs = document.querySelectorAll('.quiz-start-form input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/**
 * Show Notification
 */
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span class="notification-icon">🐾</span>
        <span class="notification-message">${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: white;
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(107, 91, 80, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effects
 */
function initParallaxEffects() {
    const pawPrints = document.querySelectorAll('.paw-print');
    const floatingShapes = document.querySelectorAll('.floating-shape');

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;

        pawPrints.forEach((paw, index) => {
            const speed = 0.1 + (index * 0.05);
            paw.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
        });

        floatingShapes.forEach((shape, index) => {
            const speed = 0.05 + (index * 0.03);
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/**
 * Add hover effects to product cards
 */
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.product-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.product-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

/**
 * Add paw trail effect on hero section
 */
const hero = document.querySelector('.hero');
if (hero) {
    let pawTrailTimeout;

    hero.addEventListener('mousemove', (e) => {
        if (pawTrailTimeout) return;

        pawTrailTimeout = setTimeout(() => {
            createPawTrail(e.clientX, e.clientY);
            pawTrailTimeout = null;
        }, 200);
    });

    function createPawTrail(x, y) {
        const paw = document.createElement('div');
        paw.innerHTML = '🐾';
        paw.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            transform: translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg);
            animation: pawFade 1s ease-out forwards;
        `;

        document.body.appendChild(paw);

        setTimeout(() => paw.remove(), 1000);
    }

    // Add paw fade animation
    if (!document.querySelector('#paw-animation-style')) {
        const style = document.createElement('style');
        style.id = 'paw-animation-style';
        style.textContent = `
            @keyframes pawFade {
                0% {
                    opacity: 0.6;
                    transform: translate(-50%, -50%) rotate(0deg) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) rotate(20deg) scale(0.5);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Animate numbers on scroll
 */
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/[^0-9]/g, ''));

        if (isNaN(number)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(stat, 0, number, 2000, hasPlus, hasPercent);
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(stat);
    });
}

function animateValue(element, start, end, duration, hasPlus, hasPercent) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment * Math.ceil(range / 50);

        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        let displayValue = current.toLocaleString();
        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';

        element.textContent = displayValue;
    }, stepTime);
}

// Initialize number animation
animateNumbers();

/**
 * Add ripple effect to buttons
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
if (!document.querySelector('#ripple-animation-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation-style';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
