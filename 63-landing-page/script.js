/* ========================================
   RITMO LATINO - Interactive JavaScript
   Latin Vibrant Music Festival Landing Page
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initSmoothScroll();
    initNewsletterForm();
    initParallaxNotes();
    initGenreHover();
});

/* ========================================
   NAVBAR SCROLL EFFECT
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
}

/* ========================================
   MOBILE MENU TOGGLE
   ======================================== */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    // Elements to animate
    const animateElements = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.artist-card'),
        ...document.querySelectorAll('.exp-card'),
        ...document.querySelectorAll('.genre-item'),
        ...document.querySelectorAll('.ticket-card')
    ];

    // Add fade-in class
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 6) * 0.1}s`;
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // ms
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });
    };

    // Trigger when hero stats come into view
    const statsSection = document.querySelector('.hero-stats');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

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

/* ========================================
   NEWSLETTER FORM
   ======================================== */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const originalText = button.innerHTML;

            // Animate button
            button.innerHTML = '<span>Subscribed!</span> <span class="btn-icon">🎉</span>';
            button.style.background = 'var(--tropical-turquoise)';

            // Add pulse effect
            button.style.animation = 'pulse 0.5s ease';

            // Reset after delay
            setTimeout(() => {
                input.value = '';
                button.innerHTML = originalText;
                button.style.background = '';
                button.style.animation = '';
            }, 3000);
        });
    }
}

/* ========================================
   PARALLAX FLOATING NOTES
   ======================================== */
function initParallaxNotes() {
    const notes = document.querySelectorAll('.note');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        notes.forEach((note, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = scrolled * speed;
            note.style.transform = `translateY(${-yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

/* ========================================
   GENRE HOVER EFFECTS
   ======================================== */
function initGenreHover() {
    const genreItems = document.querySelectorAll('.genre-item');

    genreItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Add rhythmic pulse to the circle
            const circle = item.querySelector('.genre-circle');
            circle.style.animation = 'rhythmPulse 0.5s ease infinite alternate';
        });

        item.addEventListener('mouseleave', () => {
            const circle = item.querySelector('.genre-circle');
            circle.style.animation = '';
        });
    });

    // Add keyframe animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rhythmPulse {
            from { transform: scale(1.15) rotate(15deg); }
            to { transform: scale(1.2) rotate(-5deg); }
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   ARTIST CARD TILT EFFECT
   ======================================== */
function initCardTilt() {
    const cards = document.querySelectorAll('.artist-card, .ticket-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ========================================
   MUSIC BEAT ANIMATION ON CTA
   ======================================== */
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.animation = 'beatPulse 0.3s ease 3';
    });

    btn.addEventListener('animationend', () => {
        btn.style.animation = '';
    });
});

// Add beat pulse keyframe
const beatStyle = document.createElement('style');
beatStyle.textContent = `
    @keyframes beatPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(beatStyle);

/* ========================================
   MARQUEE PAUSE ON HOVER
   ======================================== */
const marquee = document.querySelector('.marquee-content');
if (marquee) {
    const parent = marquee.parentElement;

    parent.addEventListener('mouseenter', () => {
        marquee.style.animationPlayState = 'paused';
    });

    parent.addEventListener('mouseleave', () => {
        marquee.style.animationPlayState = 'running';
    });
}

/* ========================================
   CURSOR TRAIL EFFECT (OPTIONAL)
   ======================================== */
function initCursorTrail() {
    const trail = [];
    const trailLength = 10;
    const colors = ['#FF2D7B', '#FFD93D', '#17D7A0', '#C56CF0', '#FF6B35'];

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: ${12 - i}px;
            height: ${12 - i}px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - (i / trailLength)};
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;
    let positions = Array(trailLength).fill({ x: 0, y: 0 });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        positions.unshift({ x: mouseX, y: mouseY });
        positions.pop();

        trail.forEach((dot, i) => {
            const pos = positions[i];
            dot.style.left = `${pos.x - 6}px`;
            dot.style.top = `${pos.y - 6}px`;
        });

        requestAnimationFrame(animate);
    }

    // Only enable on larger screens
    if (window.innerWidth > 1024) {
        // Uncomment below to enable cursor trail
        // animate();
    }
}

/* ========================================
   PRELOADER (OPTIONAL)
   ======================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
});
