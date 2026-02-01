/**
 * DeepBlue Expeditions - Underwater/Oceanic Landing Page
 * Interactive JavaScript for animations and functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initBubbles();
    initParticles();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initTestimonialCarousel();
    initForm();
});

/**
 * Create rising bubble effects
 */
function initBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    if (!bubblesContainer) return;

    const bubbleCount = 20;

    for (let i = 0; i < bubbleCount; i++) {
        createBubble(bubblesContainer);
    }

    // Continuously create new bubbles
    setInterval(() => {
        if (bubblesContainer.children.length < 30) {
            createBubble(bubblesContainer);
        }
    }, 2000);
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = Math.random() * 15 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const drift = (Math.random() - 0.5) * 100;

    bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
    `;

    container.appendChild(bubble);

    // Remove bubble after animation completes
    setTimeout(() => {
        bubble.remove();
    }, (duration + delay) * 1000);
}

/**
 * Create floating particle effects
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const driftX = (Math.random() - 0.5) * 200;
    const driftY = (Math.random() - 0.5) * 200;
    const size = Math.random() * 3 + 1;

    particle.style.cssText = `
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
    `;

    container.appendChild(particle);

    // Recreate particle after animation completes
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, (duration + delay) * 1000);
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    // Scroll effect for navbar
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .expedition-card,
        .feature,
        .metric-card,
        .testimonial-card,
        .research-content,
        .research-visual,
        .join-content
    `);

    // Add animation classes
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index % 4 * 0.1}s`;
    });

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for metric cards
                if (entry.target.classList.contains('metric-card')) {
                    entry.target.classList.add('animated');
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Animated number counters
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    };

    requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString();
    }
    return num.toString();
}

/**
 * Testimonial carousel
 */
function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.carousel-dots .dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;
    let isAnimating = false;

    // Calculate card width including gap
    function getCardWidth() {
        const card = cards[0];
        const style = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 24;
        return cardWidth + gap;
    }

    function updateCarousel(index, animate = true) {
        if (isAnimating) return;

        // Handle wrapping
        const totalCards = cards.length;
        if (index < 0) index = totalCards - 1;
        if (index >= totalCards) index = 0;

        currentIndex = index;
        const cardWidth = getCardWidth();

        if (animate) {
            isAnimating = true;
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        } else {
            track.style.transition = 'none';
        }

        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
            resetAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
            resetAutoPlay();
        });
    });

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

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

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateCarousel(currentIndex + 1);
            } else {
                updateCarousel(currentIndex - 1);
            }
            resetAutoPlay();
        }
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel(currentIndex, false);
        }, 250);
    });

    // Start autoplay
    startAutoPlay();

    // Pause autoplay when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoPlayInterval);
        } else {
            startAutoPlay();
        }
    });
}

/**
 * Form handling
 */
function initForm() {
    const form = document.getElementById('joinForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
        `;
        submitBtn.disabled = true;

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = `
            <span>Request Sent!</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #2dd4bf 0%, #00d4aa 100%)';

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    });

    // Add floating label effect
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const lightRays = document.querySelector('.light-rays');

    if (!hero || !lightRays) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        if (scrolled < window.innerHeight) {
            lightRays.style.transform = `translateY(${rate * 0.3}px)`;
        }
    });
}

// Initialize parallax
initParallax();

/**
 * Cursor glow effect (optional enhancement)
 */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(0, 245, 212, 0.1) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// Initialize cursor glow on non-touch devices
if (!('ontouchstart' in window)) {
    initCursorGlow();
}

/**
 * Depth zone indicator animation
 */
function initDepthIndicator() {
    const depthZones = document.querySelectorAll('.depth-zones span');

    depthZones.forEach((zone, index) => {
        zone.style.animationDelay = `${index * 0.5}s`;
    });
}

initDepthIndicator();

/**
 * Video modal (placeholder for actual implementation)
 */
function initVideoModal() {
    const playBtn = document.querySelector('.play-btn');

    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
        // In a real implementation, this would open a video modal
        console.log('Video playback would start here');

        // Create a simple modal placeholder
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(10, 22, 40, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;
        modal.innerHTML = `
            <div style="text-align: center; color: #f0f7ff;">
                <p style="font-size: 1.5rem; margin-bottom: 1rem;">Video Player Placeholder</p>
                <p style="opacity: 0.6;">Click anywhere to close</p>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });
    });
}

initVideoModal();

/**
 * Preloader animation (optional)
 */
function initPreloader() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

initPreloader();
