/* ========================================
   Dimension3D - JavaScript
   3D Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initHero3D();
    initShowcase();
    initGallery();
    initParallax();
    initScrollAnimations();
    initSmoothScroll();
});

/* ========================================
   Navbar
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
   Mobile Menu
   ======================================== */

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

/* ========================================
   Hero 3D Product Interaction
   ======================================== */

function initHero3D() {
    const showcase = document.getElementById('heroShowcase');
    const product = document.getElementById('heroProduct');
    const controls = document.querySelectorAll('.control-btn');

    if (!showcase || !product) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let rotationX = -15;
    let rotationY = 0;
    let targetRotationX = -15;
    let targetRotationY = 0;
    let currentView = 'front';

    // View presets
    const views = {
        front: { x: -15, y: 0 },
        side: { x: -15, y: 90 },
        back: { x: -15, y: 180 },
        top: { x: -70, y: 0 }
    };

    // Mouse/Touch drag rotation
    showcase.addEventListener('mousedown', startDrag);
    showcase.addEventListener('touchstart', startDrag, { passive: true });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: true });

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        isDragging = true;
        const point = e.touches ? e.touches[0] : e;
        startX = point.clientX;
        startY = point.clientY;
        showcase.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;

        const point = e.touches ? e.touches[0] : e;
        const deltaX = point.clientX - startX;
        const deltaY = point.clientY - startY;

        targetRotationY = rotationY + deltaX * 0.5;
        targetRotationX = Math.max(-70, Math.min(20, rotationX + deltaY * 0.3));
    }

    function endDrag() {
        if (isDragging) {
            rotationX = targetRotationX;
            rotationY = targetRotationY;
        }
        isDragging = false;
        showcase.style.cursor = 'grab';
    }

    // Smooth animation loop
    function animate() {
        const currentX = parseFloat(product.dataset.rotationX) || -15;
        const currentY = parseFloat(product.dataset.rotationY) || 0;

        const newX = currentX + (targetRotationX - currentX) * 0.1;
        const newY = currentY + (targetRotationY - currentY) * 0.1;

        product.dataset.rotationX = newX;
        product.dataset.rotationY = newY;

        product.style.transform = `rotateX(${newX}deg) rotateY(${newY}deg)`;

        requestAnimationFrame(animate);
    }

    animate();

    // Control buttons
    controls.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (views[view]) {
                targetRotationX = views[view].x;
                targetRotationY = views[view].y;
                rotationX = targetRotationX;
                rotationY = targetRotationY;
                currentView = view;

                controls.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // Mouse parallax effect on stage lights
    showcase.addEventListener('mousemove', (e) => {
        if (isDragging) return;

        const rect = showcase.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const lights = showcase.querySelectorAll('.stage-light');
        lights.forEach((light, i) => {
            const intensity = (i + 1) * 10;
            light.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
        });
    });
}

/* ========================================
   Showcase Gallery
   ======================================== */

function initShowcase() {
    // Add 3D rotation to product wrappers on mouse move
    const wrappers = document.querySelectorAll('.product-wrapper');

    wrappers.forEach(wrapper => {
        const container = wrapper.closest('.gallery-3d-container');
        if (!container) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rotateY = x * 30;
            const rotateX = -y * 20;

            wrapper.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            wrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
}

/* ========================================
   Gallery Navigation
   ======================================== */

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const navBtns = document.querySelectorAll('.gallery-nav-btn');
    let currentIndex = 0;
    let autoplayInterval;

    if (galleryItems.length === 0) return;

    function showItem(index) {
        galleryItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });

        navBtns.forEach((btn, i) => {
            btn.classList.remove('active');
            if (i === index) {
                btn.classList.add('active');
            }
        });

        currentIndex = index;
    }

    // Navigation button clicks
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showItem(index);
            resetAutoplay();
        });
    });

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            showItem(nextIndex);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Pause autoplay on hover
    const gallery = document.querySelector('.showcase-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        gallery.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }
}

/* ========================================
   Parallax Effects
   ======================================== */

function initParallax() {
    const depthLayers = document.querySelectorAll('.hero-depth-layer');
    const featureCards = document.querySelectorAll('.feature-card');
    const pricingCards = document.querySelectorAll('.pricing-card');

    // Mouse parallax for hero depth layers
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        depthLayers.forEach((layer, i) => {
            const depth = (i + 1) * 20;
            layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    });

    // 3D tilt effect for feature cards
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rotateX = -y * 10;
            const rotateY = x * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // 3D tilt effect for pricing cards
    pricingCards.forEach(card => {
        if (card.classList.contains('featured')) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const rotateX = -y * 8;
                const rotateY = x * 8;

                card.style.transform = `scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1.05)';
            });
        } else {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const rotateX = -y * 8;
                const rotateY = x * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        }
    });
}

/* ========================================
   Scroll Animations
   ======================================== */

function initScrollAnimations() {
    // Elements to animate
    const animatedElements = [
        { selector: '.section-header', class: 'fade-in' },
        { selector: '.feature-card', class: 'fade-in', stagger: 100 },
        { selector: '.step', class: 'fade-in', stagger: 150 },
        { selector: '.pricing-card', class: 'fade-in', stagger: 100 },
        { selector: '.testimonial-card', class: 'fade-in', stagger: 100 },
        { selector: '.gallery-info', class: 'slide-in-right' },
        { selector: '.gallery-3d-container', class: 'slide-in-left' }
    ];

    // Add initial classes
    animatedElements.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el, i) => {
            el.classList.add(config.class);
            if (config.stagger) {
                el.style.transitionDelay = `${i * config.stagger}ms`;
            }
        });
    });

    // Intersection Observer
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
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Animate hero elements on load
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 200);
}

/* ========================================
   Smooth Scroll
   ======================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Step Box 3D Rotation
   ======================================== */

document.querySelectorAll('.step-3d-box').forEach(box => {
    const step = box.closest('.step');
    if (!step) return;

    step.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        const rotateX = -y * 20;
        const rotateY = x * 20;

        box.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    step.addEventListener('mouseleave', () => {
        box.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ========================================
   Floating Cubes Animation Enhancement
   ======================================== */

document.querySelectorAll('.floating-cube').forEach((cube, index) => {
    // Add random initial rotation
    const randomRotateX = Math.random() * 30 - 15;
    const randomRotateY = Math.random() * 30 - 15;

    cube.style.setProperty('--initial-rotate-x', `${randomRotateX}deg`);
    cube.style.setProperty('--initial-rotate-y', `${randomRotateY}deg`);
});

/* ========================================
   Testimonial Cards 3D Effect
   ======================================== */

document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = -y * 10;
        const rotateY = x * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ========================================
   Logo Cube Interaction
   ======================================== */

document.querySelectorAll('.logo-cube').forEach(cube => {
    cube.addEventListener('mouseenter', () => {
        cube.style.animationPlayState = 'paused';
    });

    cube.addEventListener('mouseleave', () => {
        cube.style.animationPlayState = 'running';
    });
});

/* ========================================
   Button Ripple Effect
   ======================================== */

document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out forwards;
        `;

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
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ========================================
   Performance: Throttle scroll events
   ======================================== */

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll handlers
window.addEventListener('scroll', throttle(() => {
    // Update any scroll-based animations here
}, 16));

/* ========================================
   Preloader (Optional)
   ======================================== */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    document.querySelectorAll('.hero-text > *').forEach((el, i) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 100);
    });
});
