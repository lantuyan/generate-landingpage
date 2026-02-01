/* ============================================
   ROSIE'S DINER - JavaScript
   Vintage/Retro Landing Page Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initMenuFlipCards();
    initReservationForm();
    initSmoothScroll();
    initParallaxEffects();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const nav = document.querySelector('.nav');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar background change on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'linear-gradient(135deg, rgba(211, 47, 47, 0.98) 0%, rgba(183, 28, 28, 0.98) 100%)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'linear-gradient(135deg, var(--cherry-red) 0%, var(--cherry-red-dark) 100%)';
            nav.style.backdropFilter = 'none';
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('[data-animate]');

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);

                // Unobserve after animation
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Add CSS for animated elements if not already present
    addAnimationStyles();
}

function addAnimationStyles() {
    if (document.getElementById('animation-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'animation-styles';
    styles.textContent = `
        [data-animate] {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-animate].animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .feature-card[data-animate] {
            transition-delay: calc(var(--index, 0) * 0.1s);
        }
    `;
    document.head.appendChild(styles);
}

/* ============================================
   MENU FLIP CARDS
   ============================================ */
function initMenuFlipCards() {
    const menuItems = document.querySelectorAll('.menu-item[data-flip]');

    menuItems.forEach(item => {
        // For touch devices, toggle on tap
        item.addEventListener('click', () => {
            // Close other flipped items
            menuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('flipped');
                }
            });

            item.classList.toggle('flipped');
        });
    });

    // Close flipped items when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-item')) {
            menuItems.forEach(item => {
                item.classList.remove('flipped');
            });
        }
    });
}

/* ============================================
   RESERVATION FORM
   ============================================ */
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const modal = document.getElementById('successModal');
    const modalClose = modal?.querySelector('.modal-close');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission with vintage feel
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span class="btn-text">Booking...</span>';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Show success modal
            modal?.classList.add('active');

            // Reset form
            form.reset();

            // Add confetti effect
            createConfetti();
        }, 1500);
    });

    // Close modal
    modalClose?.addEventListener('click', () => {
        modal?.classList.remove('active');
    });

    // Close modal on backdrop click
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

/* ============================================
   CONFETTI EFFECT
   ============================================ */
function createConfetti() {
    const colors = ['#D32F2F', '#4DD0E1', '#FFD54F', '#FF6B9D', '#A5D6A7'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Random styles
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 2 + Math.random() * 2;
        const randomSize = 5 + Math.random() * 10;

        confetti.style.cssText = `
            position: fixed;
            width: ${randomSize}px;
            height: ${randomSize}px;
            background: ${randomColor};
            left: ${randomLeft}%;
            top: -20px;
            z-index: 3000;
            pointer-events: none;
            animation: confetti-fall ${randomDuration}s ease-out ${randomDelay}s forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;

        // Random shape
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, (randomDuration + randomDelay) * 1000);
    }

    // Add confetti animation if not exists
    if (!document.getElementById('confetti-styles')) {
        const styles = document.createElement('style');
        styles.id = 'confetti-styles';
        styles.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    const starbursts = document.querySelectorAll('.starburst');

    // Parallax on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Hero parallax
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }

        // Starburst parallax
        starbursts.forEach((starburst, index) => {
            const speed = 0.1 + (index * 0.05);
            starburst.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Mouse parallax for hero elements
    const heroContent = document.querySelector('.hero-content');
    const heroIllustration = document.querySelector('.hero-illustration');

    hero?.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable on mobile

        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (heroContent) {
            heroContent.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
        }

        if (heroIllustration) {
            heroIllustration.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    });

    hero?.addEventListener('mouseleave', () => {
        if (heroContent) {
            heroContent.style.transform = 'translate(0, 0)';
        }
        if (heroIllustration) {
            heroIllustration.style.transform = 'translate(0, 0)';
        }
    });
}

/* ============================================
   JUKEBOX ANIMATION
   ============================================ */
(function initJukebox() {
    const jukebox = document.querySelector('.jukebox');

    if (!jukebox) return;

    // Add click interaction
    jukebox.addEventListener('click', () => {
        jukebox.classList.toggle('playing');

        // Play a sound effect if Web Audio API is available
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 440;
            oscillator.type = 'sine';

            gainNode.gain.value = 0.1;
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio not supported, fail silently
        }
    });

    // Add playing animation styles
    const styles = document.createElement('style');
    styles.textContent = `
        .jukebox.playing {
            animation: jukebox-shake 0.5s ease-in-out;
        }

        .jukebox.playing .music-note {
            animation: bounce-note 0.3s ease-in-out infinite alternate;
        }

        @keyframes jukebox-shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
        }
    `;
    document.head.appendChild(styles);
})();

/* ============================================
   NEON SIGN FLICKER
   ============================================ */
(function initNeonFlicker() {
    const neonSign = document.querySelector('.neon-sign');

    if (!neonSign) return;

    // Random flicker effect
    function flicker() {
        const neonText = neonSign.querySelector('.neon-text');
        if (!neonText) return;

        neonText.style.opacity = Math.random() > 0.9 ? '0.7' : '1';

        // Random interval for more natural effect
        setTimeout(flicker, 100 + Math.random() * 200);
    }

    // Start flicker after a delay
    setTimeout(flicker, 2000);
})();

/* ============================================
   SCROLL INDICATOR HIDE
   ============================================ */
(function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (!scrollIndicator) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '0.7';
            scrollIndicator.style.visibility = 'visible';
        }
    });
})();

/* ============================================
   NEWSLETTER FORM
   ============================================ */
(function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');

    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        const email = input.value;

        if (email) {
            button.textContent = 'Sent!';
            button.style.background = '#A5D6A7';
            input.value = '';

            setTimeout(() => {
                button.textContent = 'Join';
                button.style.background = '';
            }, 2000);
        }
    });
})();

/* ============================================
   TYPEWRITER EFFECT FOR HERO
   ============================================ */
(function initTypewriter() {
    const tagline = document.querySelector('.hero-tagline');

    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.visibility = 'visible';

    let index = 0;

    function typeChar() {
        if (index < text.length) {
            tagline.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 50 + Math.random() * 50);
        }
    }

    // Start after page load animation
    setTimeout(typeChar, 1000);
})();

/* ============================================
   COUNTER ANIMATION FOR STATS
   ============================================ */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ============================================
   VINTAGE CURSOR EFFECT
   ============================================ */
(function initVintageCursor() {
    // Only on desktop
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;

    const cursor = document.createElement('div');
    cursor.className = 'vintage-cursor';
    cursor.innerHTML = '★';
    document.body.appendChild(cursor);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .vintage-cursor {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            font-size: 1.5rem;
            color: var(--cherry-red);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.1s ease;
            transform: translate(-50%, -50%);
        }

        .vintage-cursor.active {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(cursorStyle);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    // Smooth cursor follow
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(updateCursor);
    }

    updateCursor();
})();

/* ============================================
   PRELOADER (Optional - hidden by default)
   ============================================ */
(function initPreloader() {
    // Add preloader if needed
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <span class="preloader-star">★</span>
            <span class="preloader-text">Rosie's Diner</span>
        </div>
    `;

    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--cream, #FFF8E7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .preloader-content {
            text-align: center;
        }

        .preloader-star {
            font-size: 3rem;
            color: var(--cherry-red, #D32F2F);
            display: block;
            animation: preloader-spin 1s ease-in-out infinite;
        }

        .preloader-text {
            font-family: 'Pacifico', cursive;
            font-size: 2rem;
            color: var(--cherry-red, #D32F2F);
            margin-top: 1rem;
            display: block;
        }

        @keyframes preloader-spin {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
        }
    `;

    // Only show preloader on initial load
    if (sessionStorage.getItem('visited')) {
        return;
    }

    document.head.appendChild(preloaderStyle);
    document.body.appendChild(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            sessionStorage.setItem('visited', 'true');

            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
})();

/* ============================================
   ACCESSIBILITY IMPROVEMENTS
   ============================================ */
(function initAccessibility() {
    // Focus visible styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    const a11yStyles = document.createElement('style');
    a11yStyles.textContent = `
        .keyboard-nav *:focus {
            outline: 3px solid var(--turquoise, #4DD0E1) !important;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(a11yStyles);

    // Reduce motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
})();
