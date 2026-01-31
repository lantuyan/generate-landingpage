/**
 * HomeSync - Material Design Landing Page
 * JavaScript for interactions, animations, and Material Design effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initRippleEffect();
    initAppBar();
    initMobileNav();
    initSmoothScroll();
    initPricingToggle();
    initScrollAnimations();
    initFAB();
    initMockupAnimations();
});

/**
 * Material Design Ripple Effect
 * Creates expanding circle effect on button/link clicks
 */
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.ripple');

    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Remove existing ripple
            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            // Create new ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * App Bar Scroll Effect
 * Adds elevation shadow when scrolled
 */
function initAppBar() {
    const appBar = document.getElementById('appBar');
    let lastScrollY = 0;
    let ticking = false;

    function updateAppBar() {
        const scrollY = window.scrollY;

        if (scrollY > 10) {
            appBar.classList.add('scrolled');
        } else {
            appBar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateAppBar);
            ticking = true;
        }
    });
}

/**
 * Mobile Navigation Drawer
 * Handles opening/closing of mobile nav
 */
function initMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const navDrawer = document.getElementById('navDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = navDrawer.querySelectorAll('.drawer-link');

    function openDrawer() {
        navDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        navDrawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when link is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close drawer on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const appBarHeight = 64;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - appBarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Pricing Toggle (Monthly/Annual)
 */
function initPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    const prices = document.querySelectorAll('.price');
    const monthlyLabel = document.querySelector('.toggle-label[data-period="monthly"]');
    const annualLabel = document.querySelector('.toggle-label[data-period="annual"]');

    function updatePrices(isAnnual) {
        prices.forEach(priceEl => {
            const monthly = priceEl.dataset.monthly;
            const annual = priceEl.dataset.annual;
            priceEl.textContent = isAnnual ? annual : monthly;
        });

        if (isAnnual) {
            monthlyLabel.classList.remove('active');
            annualLabel.classList.add('active');
        } else {
            monthlyLabel.classList.add('active');
            annualLabel.classList.remove('active');
        }
    }

    // Initialize
    updatePrices(false);

    toggle.addEventListener('change', () => {
        updatePrices(toggle.checked);
    });

    // Allow clicking on labels to toggle
    monthlyLabel.addEventListener('click', () => {
        toggle.checked = false;
        updatePrices(false);
    });

    annualLabel.addEventListener('click', () => {
        toggle.checked = true;
        updatePrices(true);
    });
}

/**
 * Scroll Animations (AOS-like)
 * Animates elements into view as user scrolls
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));

                // Optionally stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Also animate elements that are already in view on page load
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const delay = el.dataset.aosDelay || 0;
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, 100);
}

/**
 * Floating Action Button
 * Shows/hides based on scroll and provides interaction
 */
function initFAB() {
    const fab = document.getElementById('fab');
    let isVisible = true;
    let lastScrollY = 0;

    // Show FAB after hero section
    function updateFABVisibility() {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('hero').offsetHeight;

        // Show FAB after scrolling past half of hero
        if (scrollY > heroHeight / 2) {
            if (!isVisible) {
                fab.style.transform = 'scale(1)';
                fab.style.opacity = '1';
                isVisible = true;
            }
        } else {
            if (isVisible) {
                fab.style.transform = 'scale(0)';
                fab.style.opacity = '0';
                isVisible = false;
            }
        }

        lastScrollY = scrollY;
    }

    // Initialize FAB as hidden
    fab.style.transform = 'scale(0)';
    fab.style.opacity = '0';
    fab.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateFABVisibility);
    });

    // FAB click action
    fab.addEventListener('click', () => {
        // Create a simple tooltip/snackbar effect
        showSnackbar('Live chat coming soon!');
    });
}

/**
 * Snackbar Notification
 * Material Design snackbar for feedback
 */
function showSnackbar(message, duration = 3000) {
    // Remove existing snackbar if any
    const existing = document.querySelector('.snackbar');
    if (existing) {
        existing.remove();
    }

    const snackbar = document.createElement('div');
    snackbar.className = 'snackbar';
    snackbar.innerHTML = `
        <span class="snackbar-text">${message}</span>
        <button class="snackbar-action ripple">DISMISS</button>
    `;

    // Snackbar styles
    Object.assign(snackbar.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%) translateY(100px)',
        background: '#323232',
        color: 'white',
        padding: '14px 24px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
        zIndex: '9999',
        transition: 'transform 0.3s cubic-bezier(0, 0, 0.2, 1)',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '14px'
    });

    const actionBtn = snackbar.querySelector('.snackbar-action');
    Object.assign(actionBtn.style, {
        background: 'none',
        border: 'none',
        color: '#ff9800',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '8px',
        marginRight: '-8px',
        borderRadius: '4px'
    });

    document.body.appendChild(snackbar);

    // Animate in
    requestAnimationFrame(() => {
        snackbar.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Dismiss action
    const dismiss = () => {
        snackbar.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => snackbar.remove(), 300);
    };

    actionBtn.addEventListener('click', dismiss);

    // Auto dismiss
    setTimeout(dismiss, duration);
}

/**
 * Device Mockup Animations
 * Simulates activity in the phone mockup
 */
function initMockupAnimations() {
    const mockupDevices = document.querySelectorAll('.mockup-device');
    const mockupRooms = document.querySelectorAll('.mockup-room');

    // Randomly toggle device states
    setInterval(() => {
        const randomDevice = mockupDevices[Math.floor(Math.random() * mockupDevices.length)];
        randomDevice.classList.toggle('on');

        // Update status text
        const status = randomDevice.querySelector('.device-status');
        if (status && !status.textContent.includes('°')) {
            status.textContent = randomDevice.classList.contains('on') ? 'On' : 'Off';
        }
    }, 3000);

    // Cycle through rooms
    let activeRoomIndex = 0;
    setInterval(() => {
        mockupRooms.forEach((room, index) => {
            room.classList.toggle('active', index === activeRoomIndex);
        });
        activeRoomIndex = (activeRoomIndex + 1) % mockupRooms.length;
    }, 4000);
}

/**
 * Card Lift Effect on Hover
 * Adds elevation effect to cards
 */
document.querySelectorAll('.feature-card, .category-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

/**
 * Parallax Effect for Hero Shapes
 */
function initParallax() {
    const shapes = document.querySelectorAll('.hero-shape');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// Initialize parallax if on desktop
if (window.innerWidth > 768) {
    initParallax();
}

/**
 * Active Navigation Highlight
 * Highlights nav link based on current section
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

initActiveNavigation();

/**
 * Floating Cards Animation Enhancement
 * Adds subtle mouse-follow effect
 */
function initFloatingCardsEffect() {
    const heroVisual = document.querySelector('.hero-visual');
    const floatingCards = document.querySelectorAll('.floating-card');

    if (!heroVisual || floatingCards.length === 0) return;

    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        floatingCards.forEach((card, index) => {
            const intensity = 10 + (index * 5);
            card.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 5}px) translate(${x * intensity}px, ${y * intensity}px)`;
        });
    });

    heroVisual.addEventListener('mouseleave', () => {
        floatingCards.forEach(card => {
            card.style.transform = '';
        });
    });
}

// Initialize on desktop only
if (window.innerWidth > 1024) {
    initFloatingCardsEffect();
}

/**
 * Recipe Builder Animation
 * Animates the recipe flow in automation section
 */
function initRecipeAnimation() {
    const recipeBuilder = document.querySelector('.recipe-builder');
    if (!recipeBuilder) return;

    const actionItems = recipeBuilder.querySelectorAll('.action-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                actionItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Initial state
    actionItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    observer.observe(recipeBuilder);
}

initRecipeAnimation();

/**
 * Number Counter Animation
 * Animates stat numbers when in view
 */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const finalValue = el.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[0-9]/g, '');

                if (isNaN(numericValue)) return;

                let current = 0;
                const increment = numericValue / 50;
                const duration = 1500;
                const stepTime = duration / 50;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        el.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        el.textContent = Math.floor(current) + suffix;
                    }
                }, stepTime);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

initCounterAnimation();
