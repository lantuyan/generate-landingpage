/* ============================================
   STEAMPUNK ESCAPE ROOM - JAVASCRIPT
   Chronos Enigma Landing Page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initGauges();
    initScrollAnimations();
    initCarousel();
    initBookingForm();
    initValveInteraction();
    initSmoothScroll();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Scroll behavior for navbar
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
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate gear icon rotation
        const gearIcon = navToggle.querySelector('.gear-icon');
        if (navMenu.classList.contains('active')) {
            gearIcon.style.transform = 'translate(-50%, -50%) rotate(180deg)';
        } else {
            gearIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        }
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

/* ============================================
   GAUGE ANIMATIONS
   ============================================ */
function initGauges() {
    const gauges = document.querySelectorAll('.gauge-dial');

    // Animate gauges when hero is visible
    const animateGauges = () => {
        gauges.forEach(gauge => {
            const value = parseInt(gauge.dataset.value) || 50;
            const needle = gauge.querySelector('.gauge-needle');

            // Convert value (0-100) to rotation angle (-90 to 90 degrees)
            const angle = ((value / 100) * 180) - 90;

            // Add slight randomness for mechanical feel
            const wobble = (Math.random() - 0.5) * 5;

            setTimeout(() => {
                needle.style.transform = `translateX(-50%) rotate(${angle + wobble}deg)`;
            }, Math.random() * 500);
        });
    };

    // Initial animation
    setTimeout(animateGauges, 500);

    // Subtle continuous wobble
    setInterval(() => {
        gauges.forEach(gauge => {
            const value = parseInt(gauge.dataset.value) || 50;
            const needle = gauge.querySelector('.gauge-needle');
            const baseAngle = ((value / 100) * 180) - 90;
            const wobble = (Math.random() - 0.5) * 3;

            needle.style.transform = `translateX(-50%) rotate(${baseAngle + wobble}deg)`;
        });
    }, 2000);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = [
        ...document.querySelectorAll('.room-card'),
        ...document.querySelectorAll('.feature-item'),
        ...document.querySelectorAll('.info-card'),
        document.querySelector('.booking-form'),
        document.querySelector('.schematic-display')
    ].filter(Boolean);

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add mechanical sound effect (visual feedback)
                addMechanicalEffect(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(el => {
        if (el) observer.observe(el);
    });

    // Parallax effect for gears
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const gears = document.querySelectorAll('.gears-bg .gear');

        gears.forEach((gear, index) => {
            const speed = 0.05 * (index + 1);
            const rotation = scrolled * speed;
            const currentTransform = gear.style.transform || '';

            // Extract current animation transform and add scroll-based rotation
            gear.style.transform = `rotate(${rotation}deg)`;
        });
    });
}

// Add subtle mechanical effect when elements appear
function addMechanicalEffect(element) {
    // Add a brief "click" animation
    element.style.transition = 'transform 0.1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    setTimeout(() => {
        element.style.transition = '';
    }, 100);
}

/* ============================================
   TESTIMONIALS CAROUSEL
   ============================================ */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    let currentIndex = 0;
    let autoplayInterval;

    // Show specific slide
    const showSlide = (index) => {
        // Handle wrap-around
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;

        // Update cards
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });

        currentIndex = index;
    };

    // Navigation handlers
    const nextSlide = () => {
        showSlide(currentIndex + 1);
        resetAutoplay();
    };

    const prevSlide = () => {
        showSlide(currentIndex - 1);
        resetAutoplay();
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };

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
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    // Start autoplay
    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    track.addEventListener('mouseleave', startAutoplay);
}

/* ============================================
   BOOKING FORM
   ============================================ */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const adventurersInput = document.getElementById('adventurers');
    const minusBtn = document.querySelector('.num-btn.minus');
    const plusBtn = document.querySelector('.num-btn.plus');

    // Number input controls
    if (minusBtn && plusBtn && adventurersInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(adventurersInput.value) || 2;
            const minValue = parseInt(adventurersInput.min) || 2;
            if (currentValue > minValue) {
                adventurersInput.value = currentValue - 1;
                addClickEffect(minusBtn);
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(adventurersInput.value) || 2;
            const maxValue = parseInt(adventurersInput.max) || 8;
            if (currentValue < maxValue) {
                adventurersInput.value = currentValue + 1;
                addClickEffect(plusBtn);
            }
        });
    }

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Animate submit button
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.innerHTML = `
                <span class="btn-text">Processing...</span>
                <span class="btn-gears">
                    <span class="s-gear" style="animation: rotate 0.5s linear infinite;"></span>
                    <span class="s-gear" style="animation: rotate-reverse 0.5s linear infinite;"></span>
                </span>
            `;

            // Simulate submission
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <span class="btn-text">Expedition Confirmed!</span>
                    <span class="btn-gears">
                        <span class="s-gear"></span>
                        <span class="s-gear"></span>
                    </span>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #43B3AE, #2E8B88)';

                // Show confirmation message
                showConfirmation(data);

                // Reset after delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = `
                        <span class="btn-text">Confirm Expedition</span>
                        <span class="btn-gears">
                            <span class="s-gear"></span>
                            <span class="s-gear"></span>
                        </span>
                    `;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }
}

// Visual click effect
function addClickEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
}

// Show confirmation message
function showConfirmation(data) {
    // Create confirmation overlay
    const overlay = document.createElement('div');
    overlay.className = 'confirmation-overlay';
    overlay.innerHTML = `
        <div class="confirmation-modal">
            <div class="confirmation-gear"></div>
            <h3>Expedition Booked!</h3>
            <p>Your adventure awaits, ${data.name || 'brave adventurer'}.</p>
            <p class="confirmation-details">
                <strong>${getExpeditionName(data.expedition)}</strong><br>
                ${data.date} at ${data.time}<br>
                ${data.adventurers} adventurers
            </p>
            <p class="confirmation-email">Confirmation sent to ${data.email}</p>
            <button class="confirmation-close">Prepare for Adventure</button>
        </div>
    `;

    // Add styles for confirmation
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(26, 20, 16, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .confirmation-modal {
            background: rgba(42, 24, 16, 0.95);
            border: 3px solid #B8860B;
            padding: 50px;
            text-align: center;
            max-width: 500px;
            animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .confirmation-gear {
            width: 60px;
            height: 60px;
            border: 3px solid #B8860B;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: rotate 3s linear infinite;
        }
        .confirmation-modal h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.8rem;
            color: #D4A44A;
            margin-bottom: 15px;
        }
        .confirmation-modal p {
            color: #F5E6C8;
            margin-bottom: 15px;
        }
        .confirmation-details {
            background: rgba(184, 134, 11, 0.1);
            padding: 15px;
            border: 1px solid rgba(184, 134, 11, 0.3);
            margin: 20px 0;
        }
        .confirmation-email {
            font-family: 'Special Elite', monospace;
            font-size: 0.85rem;
            color: #CD853F;
        }
        .confirmation-close {
            background: linear-gradient(135deg, #B8860B, #8B6914);
            color: #1A1410;
            border: 2px solid #D4A44A;
            padding: 12px 30px;
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 20px;
        }
        .confirmation-close:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(184, 134, 11, 0.4);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Close confirmation
    overlay.querySelector('.confirmation-close').addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 300);
    });

    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

// Get expedition name from value
function getExpeditionName(value) {
    const expeditions = {
        'clocktower': "The Clockmaker's Conspiracy",
        'airship': 'Airship Heist',
        'inventor': "The Inventor's Paradox"
    };
    return expeditions[value] || 'Your Expedition';
}

/* ============================================
   VALVE INTERACTION
   ============================================ */
function initValveInteraction() {
    const valveWheel = document.querySelector('.valve-wheel');

    if (valveWheel) {
        let rotation = 0;

        valveWheel.addEventListener('click', () => {
            rotation += 90;
            valveWheel.style.transform = `rotate(${rotation}deg)`;

            // Add steam effect
            createSteamEffect(valveWheel);
        });
    }
}

// Create steam particle effect
function createSteamEffect(element) {
    const rect = element.getBoundingClientRect();
    const container = element.parentElement;

    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            pointer-events: none;
            animation: steamRise 1s ease-out forwards;
        `;

        // Add animation keyframes if not exists
        if (!document.querySelector('#steam-animation')) {
            const style = document.createElement('style');
            style.id = 'steam-animation';
            style.textContent = `
                @keyframes steamRise {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translate(${(Math.random() - 0.5) * 50}px, -50px) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

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

/* ============================================
   ADDITIONAL MECHANICAL EFFECTS
   ============================================ */

// Room card hover effect with gear rotation
document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const gears = card.querySelectorAll('.card-gear');
        gears.forEach((gear, index) => {
            gear.style.animationDuration = index === 0 ? '2s' : '1.5s';
        });
    });

    card.addEventListener('mouseleave', () => {
        const gears = card.querySelectorAll('.card-gear');
        gears.forEach((gear, index) => {
            gear.style.animationDuration = index === 0 ? '8s' : '6s';
        });
    });
});

// CTA button gear animation on hover
document.querySelectorAll('.cta-button, .room-cta, .submit-btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        const gears = button.querySelectorAll('.mini-gear, .s-gear');
        gears.forEach(gear => {
            gear.style.animationDuration = '0.5s';
        });
    });

    button.addEventListener('mouseleave', () => {
        const gears = button.querySelectorAll('.mini-gear, .s-gear');
        gears.forEach(gear => {
            gear.style.animationDuration = '3s';
        });
    });
});

// Pressure gauge in experience section - random fluctuations
const pressureGauge = document.querySelector('.pg-needle');
if (pressureGauge) {
    setInterval(() => {
        const randomAngle = -45 + Math.random() * 90;
        pressureGauge.style.transform = `translateX(-50%) rotate(${randomAngle}deg)`;
    }, 3000);
}

// Add mechanical click sound effect (visual only - screen flash)
document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(184, 134, 11, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(20);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        if (this.style.position !== 'absolute' && this.style.position !== 'fixed') {
            this.style.position = 'relative';
        }
        this.style.overflow = 'hidden';

        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Initialize scroll-based animations for hero gauges
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger gauge animations when hero is visible
                document.querySelectorAll('.gauge-dial').forEach(gauge => {
                    const value = parseInt(gauge.dataset.value) || 50;
                    const needle = gauge.querySelector('.gauge-needle');
                    const angle = ((value / 100) * 180) - 90;

                    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(heroSection);
}

// Console easter egg
console.log('%c⚙️ Chronos Enigma ⚙️', 'font-size: 24px; color: #B8860B; font-family: serif;');
console.log('%cWelcome, curious adventurer. The gears of fate are turning...', 'color: #D4A44A; font-style: italic;');
