/**
 * RoundUp for Good - Charity/Nonprofit Landing Page
 * JavaScript for animations, interactions, and dynamic content
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initCounterAnimations();
    initLiveImpactFeed();
    initProjectFilters();
    initFormHandler();
    initScrollReveal();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll effects
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
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

    // Smooth scroll for anchor links
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

/**
 * Scroll Effects Module
 * Handles parallax and scroll-based animations
 */
function initScrollEffects() {
    const shapes = document.querySelectorAll('.shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        shapes.forEach((shape, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            shape.style.transform = `translate(${rate * direction * 0.1}px, ${rate * 0.2}px)`;
        });
    });
}

/**
 * Counter Animations Module
 * Animates numbers when they come into view
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    const duration = 2000; // Animation duration in milliseconds

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            // Format number with commas
            const formatted = current.toLocaleString();
            element.textContent = `${prefix}${formatted}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Live Impact Feed Module
 * Simulates real-time donations appearing
 */
function initLiveImpactFeed() {
    const impactFeed = document.querySelector('.impact-feed');
    if (!impactFeed) return;

    const donations = [
        { emoji: '🌻', action: '$0.52 from Emma\'s smoothie', project: 'Elm Street Garden', bg: '#E8F5E9' },
        { emoji: '📚', action: '$0.31 from Tom\'s lunch', project: 'Youth Reading Program', bg: '#E3F2FD' },
        { emoji: '🍲', action: '$0.89 from Alex\'s groceries', project: 'Community Kitchen', bg: '#FFF3E0' },
        { emoji: '🎨', action: '$0.17 from Sam\'s coffee', project: 'Mural Arts Project', bg: '#F3E5F5' },
        { emoji: '🏀', action: '$0.43 from Chris\'s gas', project: 'Youth Sports League', bg: '#E8F5E9' },
        { emoji: '🌳', action: '$0.76 from Jordan\'s snack', project: 'Tree Planting Initiative', bg: '#E3F2FD' },
        { emoji: '📖', action: '$0.28 from Taylor\'s tea', project: 'Library Expansion', bg: '#FFF3E0' },
        { emoji: '🎵', action: '$0.65 from Morgan\'s dinner', project: 'Music Education Fund', bg: '#F3E5F5' }
    ];

    let donationIndex = 4; // Start after initial items

    const addNewDonation = () => {
        const donation = donations[donationIndex % donations.length];
        donationIndex++;

        const newItem = document.createElement('div');
        newItem.className = 'impact-item';
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateX(-20px)';
        newItem.innerHTML = `
            <div class="avatar" style="background: ${donation.bg};">${donation.emoji}</div>
            <div class="impact-details">
                <span class="impact-action">${donation.action}</span>
                <span class="impact-project">→ ${donation.project}</span>
            </div>
        `;

        // Remove old items if more than 4
        const items = impactFeed.querySelectorAll('.impact-item');
        if (items.length >= 4) {
            const lastItem = items[items.length - 1];
            lastItem.style.opacity = '0';
            lastItem.style.transform = 'translateX(20px)';
            setTimeout(() => lastItem.remove(), 300);
        }

        // Add new item at the top
        impactFeed.insertBefore(newItem, impactFeed.firstChild);

        // Animate in
        setTimeout(() => {
            newItem.style.transition = 'all 0.5s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateX(0)';
        }, 50);

        // Update today's total
        updateTodayTotal();
    };

    // Add new donation every 5-8 seconds
    const scheduleNextDonation = () => {
        const delay = 5000 + Math.random() * 3000;
        setTimeout(() => {
            addNewDonation();
            scheduleNextDonation();
        }, delay);
    };

    scheduleNextDonation();
}

/**
 * Update Today's Total
 * Simulates incrementing total
 */
let todayTotal = 4287.53;
function updateTodayTotal() {
    const totalElement = document.querySelector('.today-total strong');
    if (!totalElement) return;

    const increment = (Math.random() * 0.5 + 0.1).toFixed(2);
    todayTotal += parseFloat(increment);

    // Animate the update
    totalElement.style.transform = 'scale(1.1)';
    totalElement.style.color = '#48BB78';

    setTimeout(() => {
        totalElement.textContent = '$' + todayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        totalElement.style.transform = 'scale(1)';
        totalElement.style.color = '';
    }, 200);
}

/**
 * Project Filters Module
 * Handles filtering of project cards
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    }, 200);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // Add transition styles to project cards
    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

/**
 * Form Handler Module
 * Handles form submission with validation and feedback
 */
function initFormHandler() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            showFormError(emailInput, 'Please enter a valid email address');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Signing up...</span>';

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Welcome aboard!</span> ✓';
            submitBtn.style.background = '#48BB78';
            emailInput.value = '';

            // Show success message
            showSuccessMessage(form);

            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormError(input, message) {
    input.style.borderColor = '#F56565';
    input.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.3)';

    // Shake animation
    input.style.animation = 'shake 0.5s ease';

    setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        input.style.animation = '';
    }, 2000);
}

function showSuccessMessage(form) {
    const note = form.querySelector('.form-note');
    if (note) {
        const originalText = note.textContent;
        note.textContent = '🎉 Check your email to complete signup!';
        note.style.color = '#48BB78';
        note.style.fontWeight = '600';

        setTimeout(() => {
            note.textContent = originalText;
            note.style.color = '';
            note.style.fontWeight = '';
        }, 3000);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

/**
 * Scroll Reveal Module
 * Animates elements as they enter the viewport
 */
function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = [
        '.step-card',
        '.impact-counter',
        '.project-card',
        '.testimonial-card',
        '.transparency-features li',
        '.section-header'
    ];

    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            el.classList.add(`reveal-delay-${(index % 4) + 1}`);
        });
    });

    // Intersection Observer for reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Progress Bar Animation
 * Animates progress bars when in view
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => progressObserver.observe(bar));
}

// Initialize progress bars
document.addEventListener('DOMContentLoaded', initProgressBars);

/**
 * Accessibility Enhancements
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navToggle && navLinks && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}
