// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference or default to system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Initialize theme
setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ===== Mobile Menu =====
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Smooth Scroll for Anchor Links =====
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

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate stat numbers when visible
            if (entry.target.classList.contains('hero-stats')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.about-card, .program-card, .success-card, .hero-stats').forEach(el => {
    observer.observe(el);
});

// Add staggered animation delays to about cards
document.querySelectorAll('.about-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== Animate Numbers =====
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        const suffix = num.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                num.textContent = Math.floor(current).toLocaleString() + suffix;
                requestAnimationFrame(updateNumber);
            } else {
                num.textContent = target.toLocaleString() + suffix;
            }
        };

        updateNumber();
    });
}

// ===== Success Stories Slider =====
const successTrack = document.getElementById('successTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

let currentSlide = 0;
const cards = successTrack.querySelectorAll('.success-card');
const totalSlides = cards.length;

// Create dots
function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
}

function updateDots() {
    const dots = sliderDots.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function getSlideWidth() {
    const card = cards[0];
    const style = window.getComputedStyle(card);
    const width = card.offsetWidth;
    const marginRight = parseInt(style.marginRight) || 0;
    const gap = 24; // CSS gap value
    return width + gap;
}

function goToSlide(index) {
    // Handle boundaries based on viewport
    const viewportWidth = window.innerWidth;
    let maxSlide = totalSlides - 1;

    if (viewportWidth > 1024) {
        maxSlide = 0; // All cards visible on desktop
    } else if (viewportWidth > 768) {
        maxSlide = totalSlides - 2; // 2 cards visible on tablet
    }

    currentSlide = Math.max(0, Math.min(index, maxSlide));
    const offset = -currentSlide * getSlideWidth();
    successTrack.style.transform = `translateX(${offset}px)`;
    updateDots();
}

function nextSlide() {
    const viewportWidth = window.innerWidth;
    let maxSlide = totalSlides - 1;

    if (viewportWidth > 1024) {
        maxSlide = 0;
    } else if (viewportWidth > 768) {
        maxSlide = totalSlides - 2;
    }

    if (currentSlide < maxSlide) {
        goToSlide(currentSlide + 1);
    } else {
        goToSlide(0);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    } else {
        const viewportWidth = window.innerWidth;
        let maxSlide = totalSlides - 1;

        if (viewportWidth > 1024) {
            maxSlide = 0;
        } else if (viewportWidth > 768) {
            maxSlide = totalSlides - 2;
        }
        goToSlide(maxSlide);
    }
}

createDots();
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-play slider
let autoplayInterval = setInterval(nextSlide, 5000);

// Pause on hover
successTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
successTrack.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, 5000);
});

// Touch support for slider
let touchStartX = 0;
let touchEndX = 0;

successTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(autoplayInterval);
}, { passive: true });

successTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    autoplayInterval = setInterval(nextSlide, 5000);
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
        nextSlide();
    } else if (diff < -swipeThreshold) {
        prevSlide();
    }
}

// ===== Form Submission =====
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('emailInput');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;

    // Simple email validation
    if (!email || !email.includes('@')) {
        showFormFeedback('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    const btn = signupForm.querySelector('.btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    setTimeout(() => {
        showFormFeedback('Welcome to LaunchPad! Check your inbox 🚀', 'success');
        emailInput.value = '';
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }, 1500);
});

function showFormFeedback(message, type) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) existingFeedback.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        margin-top: 16px;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        animation: fadeInUp 0.3s ease;
        ${type === 'success'
            ? 'background: rgba(34, 197, 94, 0.1); color: #22c55e;'
            : 'background: rgba(239, 68, 68, 0.1); color: #ef4444;'}
    `;

    signupForm.appendChild(feedback);

    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-10px)';
        setTimeout(() => feedback.remove(), 300);
    }, 4000);
}

// ===== Parallax Effect for Orbs =====
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== Typing Effect for Discord Preview =====
function initTypingEffect() {
    const messages = [
        "let's collaborate on a fintech app",
        "anyone tried the new AI tools?",
        "just closed my first investor meeting!",
        "looking for a co-founder 👀"
    ];

    const typingMessage = document.querySelector('.message.typing .msg-text');
    if (!typingMessage) return;

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typedText = '';

    function type() {
        const currentMessage = messages[messageIndex];

        if (!isDeleting) {
            typedText = currentMessage.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentMessage.length) {
                isDeleting = true;
                setTimeout(type, 2000); // Pause at end
                return;
            }
        } else {
            typedText = currentMessage.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
            }
        }

        // Create cursor effect
        if (typingMessage) {
            typingMessage.innerHTML = typedText + '<span class="cursor">|</span>';
        }

        const speed = isDeleting ? 30 : 80;
        setTimeout(type, speed);
    }

    // Add cursor style
    const style = document.createElement('style');
    style.textContent = `
        .cursor {
            animation: blink 0.7s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Replace typing indicator with typed text
    const typingContainer = document.querySelector('.message.typing');
    if (typingContainer) {
        typingContainer.innerHTML = `
            <span class="msg-user">@you</span>
            <span class="msg-text"></span>
        `;
        setTimeout(type, 2000);
    }
}

// Initialize typing effect when community section is visible
const communitySection = document.getElementById('community');
const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initTypingEffect();
            typingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

typingObserver.observe(communitySection);

// ===== Resize Handler =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        goToSlide(currentSlide); // Recalculate slider position
    }, 250);
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Slider keyboard navigation when focused
    if (document.activeElement.closest('.success-slider')) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }

    // Theme toggle with 't' key
    if (e.key === 't' && !e.ctrlKey && !e.metaKey &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        themeToggle.click();
    }

    // Escape to close mobile menu
    if (e.key === 'Escape') {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// ===== Prefers Reduced Motion =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable autoplay for users who prefer reduced motion
    clearInterval(autoplayInterval);
}
