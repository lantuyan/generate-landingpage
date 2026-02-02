/**
 * Atelier Auto — Art Deco × Analog Tech Landing Page
 * Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initCounterAnimation();
    initShowcaseSlider();
    initFormHandling();
    initAnalogMeters();
    initSmoothScroll();
});

/**
 * Navigation — Scroll behavior and active states
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class for background
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveLink);
    }, { passive: true });
}

/**
 * Scroll Reveal — Frictiony slide animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .craftsman-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay for craftsman cards
                if (entry.target.classList.contains('craftsman-card')) {
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Also reveal section titles and content
    const sectionHeaders = document.querySelectorAll('.section-title, .section-desc, .heritage-text, .network-content');
    sectionHeaders.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/**
 * Counter Animation — Analog counter effect
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Frictiony easing - starts fast, slows at end like analog gauge
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (target - startValue) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/**
 * Showcase Slider — Restoration portfolio
 */
function initShowcaseSlider() {
    const track = document.querySelector('.showcase-track');
    const items = document.querySelectorAll('.showcase-item');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (!track || items.length === 0) return;

    let currentIndex = 0;

    // Update active states
    function updateSlider(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            items[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        });
    });

    // Scroll-based update
    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = track.scrollLeft;
            const itemWidth = items[0].offsetWidth + 24; // gap
            const newIndex = Math.round(scrollLeft / itemWidth);
            
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
                updateSlider(newIndex);
            }
        }, 100);
    }, { passive: true });

    // Auto-rotate (optional, can be removed if not desired)
    let autoRotate = setInterval(() => {
        const nextIndex = (currentIndex + 1) % items.length;
        updateSlider(nextIndex);
        items[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 6000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoRotate));
    track.addEventListener('mouseleave', () => {
        autoRotate = setInterval(() => {
            const nextIndex = (currentIndex + 1) % items.length;
            updateSlider(nextIndex);
            items[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }, 6000);
    });
}

/**
 * Form Handling — Access form
 */
function initFormHandling() {
    const form = document.getElementById('accessForm');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.btn');
        const originalText = btn.querySelector('.btn-text').textContent;
        
        // Button loading state
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Processing...';
        
        // Simulate submission
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Request Received';
            btn.style.background = 'var(--color-primary)';
            btn.style.color = 'var(--color-bg)';
            
            // Reset after delay
            setTimeout(() => {
                btn.disabled = false;
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                form.reset();
            }, 3000);
        }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/**
 * Analog Meters — Vintage gauge animation
 */
function initAnalogMeters() {
    const meters = document.querySelectorAll('.meter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pointer = entry.target.querySelector('.meter-pointer');
                if (pointer) {
                    // Random rotation between -60 and 60 degrees
                    const rotation = -60 + Math.random() * 120;
                    pointer.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    meters.forEach(meter => observer.observe(meter));
}

/**
 * Smooth Scroll — Anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
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
 * Parallax Effects — Subtle movement on scroll
 */
let parallaxElements = [];

function initParallax() {
    parallaxElements = document.querySelectorAll('.hero-ornament, .bg-spiral');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

function updateParallax() {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(el => {
        const speed = el.classList.contains('hero-ornament') ? 0.3 : 0.1;
        const yPos = scrollY * speed;
        el.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

// Initialize parallax after DOM ready
initParallax();

/**
 * Network Node Animation — Concentric pulse
 */
function initNetworkAnimation() {
    const nodes = document.querySelectorAll('.node');
    
    nodes.forEach((node, index) => {
        node.style.animationDelay = `${index * 0.2}s`;
    });
}

initNetworkAnimation();

/**
 * Decorative Rotation — Slow continuous animation
 */
function initRotatingElements() {
    const spirals = document.querySelectorAll('.ornament-rays, .bg-spiral');
    
    spirals.forEach(el => {
        let rotation = 0;
        
        function rotate() {
            rotation += 0.02;
            el.style.transform = `rotate(${rotation}deg)`;
            requestAnimationFrame(rotate);
        }
        
        // Only animate if not reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            rotate();
        }
    });
}

initRotatingElements();
