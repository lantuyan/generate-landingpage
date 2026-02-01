// ========================================
// Echosphere Studios - Landing Page Scripts
// Premium Audio Drama Production Studio
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initStatCounters();
    initTestimonialCarousel();
    initShowCards();
    initAudioPlayer();
    initScrollAnimations();
});

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
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

// ========================================
// Scroll Effects
// ========================================
function initScrollEffects() {
    // Parallax effect for hero waveform
    const heroWaveform = document.querySelector('.hero-waveform');
    const heroOverlay = document.querySelector('.hero-overlay');

    if (heroWaveform) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight);
                heroWaveform.style.opacity = Math.max(0.1, opacity * 0.3);
                heroWaveform.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Hide scroll indicator on scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ========================================
// Animated Stat Counters
// ========================================
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number[data-count]');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// ========================================
// Testimonial Carousel
// ========================================
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-nav .dot');
    let currentIndex = 0;
    let intervalId;

    const showTestimonial = (index) => {
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
        currentIndex = index;
    };

    const nextTestimonial = () => {
        const next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
    };

    // Auto-rotate testimonials
    const startAutoRotate = () => {
        intervalId = setInterval(nextTestimonial, 5000);
    };

    const stopAutoRotate = () => {
        clearInterval(intervalId);
    };

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoRotate();
            showTestimonial(index);
            startAutoRotate();
        });
    });

    // Start auto-rotation
    if (testimonials.length > 0) {
        startAutoRotate();
    }

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);
    }
}

// ========================================
// Show Cards Interactions
// ========================================
function initShowCards() {
    const showCards = document.querySelectorAll('.show-card');

    showCards.forEach(card => {
        const playOverlay = card.querySelector('.play-overlay');

        if (playOverlay) {
            playOverlay.addEventListener('click', (e) => {
                e.preventDefault();

                // Add play animation
                const icon = playOverlay.querySelector('svg');
                icon.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1.1)';
                }, 100);
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);

                // Simulate audio starting - pulse the waveform
                const waveform = card.querySelector('.show-waveform');
                if (waveform) {
                    waveform.classList.add('playing');
                    setTimeout(() => waveform.classList.remove('playing'), 3000);
                }
            });
        }

        // Add hover sound effect visual feedback
        card.addEventListener('mouseenter', () => {
            const waveform = card.querySelector('.show-waveform');
            if (waveform) {
                waveform.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            const waveform = card.querySelector('.show-waveform');
            if (waveform) {
                waveform.style.opacity = '0.7';
            }
        });
    });
}

// ========================================
// Audio Player Demo
// ========================================
function initAudioPlayer() {
    const mainPlayBtn = document.querySelector('.main-play');
    const vinylRecord = document.querySelector('.vinyl-record');
    const progressFill = document.querySelector('.progress-fill');
    const progressBar = document.querySelector('.progress-bar');
    let isPlaying = false;
    let progressInterval;

    if (mainPlayBtn && vinylRecord) {
        mainPlayBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;

            if (isPlaying) {
                // Start playing animation
                vinylRecord.style.animationPlayState = 'running';
                mainPlayBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                `;

                // Animate progress
                let progress = 27;
                progressInterval = setInterval(() => {
                    progress += 0.1;
                    if (progress >= 100) {
                        progress = 0;
                    }
                    progressFill.style.width = `${progress}%`;
                    document.querySelector('.progress-handle').style.left = `${progress}%`;
                }, 100);
            } else {
                // Pause animation
                vinylRecord.style.animationPlayState = 'paused';
                mainPlayBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"/>
                    </svg>
                `;
                clearInterval(progressInterval);
            }
        });
    }

    // Progress bar click
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            progressFill.style.width = `${percent}%`;
            document.querySelector('.progress-handle').style.left = `${percent}%`;
        });
    }
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    // Add fade-in class to animatable elements
    const animatableElements = document.querySelectorAll(
        '.section-header, .show-card, .feature-list li, .creator-card, .pricing-card, .experience-visual'
    );

    animatableElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatableElements.forEach(el => observer.observe(el));

    // Parallax effect for sections
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            const distanceFromMiddle = scrolled - sectionMiddle + window.innerHeight / 2;
            const parallaxAmount = distanceFromMiddle * 0.02;

            // Subtle parallax on section backgrounds
            section.style.backgroundPositionY = `${parallaxAmount}px`;
        });
    });
}

// ========================================
// Hero Button Interactions
// ========================================
document.querySelectorAll('.hero-cta .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple keyframes
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

// ========================================
// Equalizer Animation Enhancement
// ========================================
function enhanceEqualizer() {
    const equalizerBars = document.querySelectorAll('.equalizer span');

    // Randomize initial heights for more organic feel
    equalizerBars.forEach(bar => {
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 0.5 + Math.random() * 0.5;
        bar.style.animationDelay = `${randomDelay}s`;
        bar.style.animationDuration = `${randomDuration}s`;
    });
}

// Call equalizer enhancement
enhanceEqualizer();

// ========================================
// Lazy Loading for Images (if any added later)
// ========================================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Space toggles play on audio player when focused
    if (e.key === ' ' && document.activeElement.classList.contains('main-play')) {
        e.preventDefault();
        document.activeElement.click();
    }
});

// ========================================
// Performance: Debounce scroll events
// ========================================
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

// Apply debounce to scroll-heavy operations
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll operations can go here
}, 10));

// ========================================
// Console Easter Egg
// ========================================
console.log('%c🎧 Echosphere Studios', 'font-size: 24px; font-weight: bold; color: #7c3aed;');
console.log('%cPremium audio drama production studio', 'font-size: 14px; color: #a855f7;');
console.log('%cClose your eyes. See everything.', 'font-size: 12px; color: #666; font-style: italic;');
