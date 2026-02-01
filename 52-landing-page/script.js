/* =====================================================
   GRIDFORM - De Stijl Landing Page JavaScript
   Modular furniture system with pure geometric interactions
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initConfigurator();
    initContactForm();
    initParallaxEffects();
    initGridHoverEffects();
});

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Hide/show navigation on scroll
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavScroll(nav, lastScrollY);
                lastScrollY = window.scrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

function handleNavScroll(nav, lastScrollY) {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }
}

/* =====================================================
   MOBILE MENU
   ===================================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    toggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = [
        { selector: '.about-content', class: 'slide-in-left' },
        { selector: '.about-visual', class: 'slide-in-right' },
        { selector: '.section-title', class: 'fade-in' },
        { selector: '.feature-card', class: 'fade-in', stagger: true },
        { selector: '.configurator-preview', class: 'slide-in-left' },
        { selector: '.configurator-content', class: 'slide-in-right' },
        { selector: '.philosophy-block', class: 'fade-in', stagger: true },
        { selector: '.contact-content', class: 'slide-in-left' },
        { selector: '.contact-visual', class: 'slide-in-right' }
    ];

    // Add animation classes to elements
    animatedElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach((el, index) => {
            el.classList.add(item.class);
            if (item.stagger) {
                el.classList.add(`stagger-${(index % 4) + 1}`);
            }
        });
    });

    // Create Intersection Observer
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

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

/* =====================================================
   FURNITURE CONFIGURATOR
   ===================================================== */
function initConfigurator() {
    const cells = document.querySelectorAll('.builder-cell');
    const paletteButtons = document.querySelectorAll('.palette-btn');
    let selectedColor = 'red';

    // Handle palette selection
    paletteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            paletteButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
        });
    });

    // Handle cell clicks
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (selectedColor === 'clear') {
                // Remove all filled classes
                cell.className = 'builder-cell';
                animateCellClear(cell);
            } else {
                // Remove existing fill and add new one
                cell.className = 'builder-cell';
                cell.classList.add(`filled-${selectedColor}`);
                animateCellFill(cell);
            }
        });

        // Add hover preview
        cell.addEventListener('mouseenter', () => {
            if (selectedColor !== 'clear' && !cell.classList.contains(`filled-${selectedColor}`)) {
                cell.style.opacity = '0.7';
            }
        });

        cell.addEventListener('mouseleave', () => {
            cell.style.opacity = '1';
        });
    });

    // Initialize with a default pattern
    initDefaultPattern();
}

function initDefaultPattern() {
    const pattern = [
        { row: 0, col: 0, color: 'red' },
        { row: 0, col: 1, color: 'red' },
        { row: 1, col: 0, color: 'red' },
        { row: 1, col: 3, color: 'yellow' },
        { row: 2, col: 2, color: 'blue' },
        { row: 2, col: 3, color: 'blue' },
        { row: 3, col: 0, color: 'black' },
        { row: 3, col: 3, color: 'white' }
    ];

    pattern.forEach((item, index) => {
        setTimeout(() => {
            const cell = document.querySelector(
                `.builder-cell[data-row="${item.row}"][data-col="${item.col}"]`
            );
            if (cell) {
                cell.classList.add(`filled-${item.color}`);
                animateCellFill(cell);
            }
        }, index * 150);
    });
}

function animateCellFill(cell) {
    cell.style.transform = 'scale(0.9)';
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
    }, 150);
}

function animateCellClear(cell) {
    cell.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
    }, 150);
}

/* =====================================================
   CONTACT FORM
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Simple validation
        if (!name || !email) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';

        setTimeout(() => {
            showFormMessage('Thank you! We\'ll be in touch soon to discuss your composition.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Send Message';
        }, 1500);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.875rem;
        border: 3px solid var(--black);
        background-color: ${type === 'success' ? 'var(--yellow)' : 'var(--red)'};
        color: ${type === 'success' ? 'var(--black)' : 'var(--white)'};
    `;

    const form = document.getElementById('contactForm');
    form.appendChild(messageEl);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

/* =====================================================
   PARALLAX EFFECTS
   ===================================================== */
function initParallaxEffects() {
    const heroBlocks = document.querySelectorAll('.grid-block');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Only apply parallax in hero section
        if (scrollY < windowHeight) {
            heroBlocks.forEach((block, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrollY * speed;
                block.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
}

/* =====================================================
   GRID HOVER EFFECTS
   ===================================================== */
function initGridHoverEffects() {
    // Mondrian composition hover effects
    const mondrianBlocks = document.querySelectorAll('.m-block');

    mondrianBlocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            mondrianBlocks.forEach(b => {
                if (b !== block) {
                    b.style.opacity = '0.6';
                }
            });
        });

        block.addEventListener('mouseleave', () => {
            mondrianBlocks.forEach(b => {
                b.style.opacity = '1';
            });
        });
    });

    // Philosophy blocks counter animation
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statEl = entry.target;
                const finalValue = statEl.textContent;

                // Only animate numeric values
                if (!isNaN(parseInt(finalValue))) {
                    animateCounter(statEl, parseInt(finalValue));
                } else {
                    // For infinity symbol, just add a pulse effect
                    statEl.style.animation = 'pulse 1s ease-in-out';
                }

                statsObserver.unobserve(statEl);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element, target) {
    const duration = 1500;
    const steps = 30;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepDuration);
}

/* =====================================================
   HERO TITLE ANIMATION
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const titleLines = document.querySelectorAll('.title-line');

    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-50px)';
        line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        line.style.transitionDelay = `${0.3 + (index * 0.2)}s`;

        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, 100);
    });

    // Animate hero subtitle and CTA
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroSubtitle.style.transitionDelay = '1s';

        setTimeout(() => {
            heroSubtitle.style.opacity = '0.9';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 100);
    }

    if (heroCta) {
        heroCta.style.opacity = '0';
        heroCta.style.transform = 'translateY(20px)';
        heroCta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroCta.style.transitionDelay = '1.2s';

        setTimeout(() => {
            heroCta.style.opacity = '1';
            heroCta.style.transform = 'translateY(0)';
        }, 100);
    }
});

/* =====================================================
   RIETVELD CHAIR ANIMATION
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const chair = document.querySelector('.rietveld-chair');

    if (chair) {
        chair.addEventListener('mouseenter', () => {
            chair.style.transition = 'transform 0.5s ease';
            chair.style.transform = 'perspective(500px) rotateY(-25deg) rotateX(10deg) scale(1.05)';
        });

        chair.addEventListener('mouseleave', () => {
            chair.style.transform = 'perspective(500px) rotateY(-15deg) rotateX(5deg) scale(1)';
        });
    }
});

/* =====================================================
   KEYBOARD NAVIGATION
   ===================================================== */
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

/* =====================================================
   GRID LINE ANIMATION ON LOAD
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const gridLines = document.querySelectorAll('.grid-line');

    gridLines.forEach((line, index) => {
        if (line.classList.contains('line-h-1') ||
            line.classList.contains('line-h-2') ||
            line.classList.contains('line-h-3')) {
            line.style.width = '0';
            line.style.transition = 'width 0.8s ease';
            line.style.transitionDelay = `${0.5 + (index * 0.1)}s`;

            setTimeout(() => {
                line.style.width = '100%';
            }, 100);
        } else {
            line.style.height = '0';
            line.style.transition = 'height 0.8s ease';
            line.style.transitionDelay = `${0.5 + (index * 0.1)}s`;

            setTimeout(() => {
                line.style.height = '100%';
            }, 100);
        }
    });
});
