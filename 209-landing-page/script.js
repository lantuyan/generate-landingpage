/**
 * Kintsugi Coffee — Museum-slow interactions
 * Japandi × Analog Tech aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initMethodTabs();
    initCoffeeWheel();
    initSmoothScroll();
});

/**
 * Navigation — Show/hide on scroll, mobile menu toggle
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let lastScroll = 0;
    let ticking = false;

    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Add/remove scrolled class
                if (currentScroll > 50) {
                    nav.classList.add('nav--scrolled');
                } else {
                    nav.classList.remove('nav--scrolled');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * Scroll Animations — Museum-slow reveal
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Method Tabs — Brewing method selection
 */
function initMethodTabs() {
    const tabs = document.querySelectorAll('.method-tab');
    const description = document.getElementById('methodDescription');
    const wheelSegments = document.querySelectorAll('.wheel-segment');
    
    const methodData = {
        pour: {
            description: 'Light-roasted Ethiopians and Kenyans shine here—floral aromatics, bright acidity, the full spectrum of origin character revealed through careful extraction.',
            stats: { ratio: '1:16', temp: '205°F', time: '3:00' }
        },
        espresso: {
            description: 'Medium-roasted Central and South Americans develop the caramelized sugars and body needed to cut through milk, or stand alone with rich crema.',
            stats: { ratio: '1:2', temp: '201°F', time: '0:30' }
        },
        cold: {
            description: 'Naturally processed Brazilians and Indonesians yield low-acid, chocolate-forward brews that develop sweetness over 12-24 hours.',
            stats: { ratio: '1:8', temp: 'Room', time: '16:00' }
        },
        immersion: {
            description: 'Full-bodied Colombians and Guatemalans suit the French press or AeroPress—bold flavors, heavier mouthfeel, forgiving extraction.',
            stats: { ratio: '1:15', temp: '200°F', time: '4:00' }
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.dataset.method;
            const data = methodData[method];
            
            if (!data) return;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update description with fade
            description.style.opacity = '0';
            setTimeout(() => {
                description.textContent = data.description;
                description.style.opacity = '1';
            }, 300);

            // Update stats
            updateMethodStats(data.stats);

            // Update wheel
            updateWheelSegment(method);
        });
    });
}

function updateMethodStats(stats) {
    const statValues = document.querySelectorAll('.m-stat-value');
    if (statValues.length >= 3) {
        // Animate out
        statValues.forEach(el => el.style.opacity = '0');
        
        setTimeout(() => {
            statValues[0].textContent = stats.ratio;
            statValues[1].textContent = stats.temp;
            statValues[2].textContent = stats.time;
            
            // Animate in
            statValues.forEach(el => el.style.opacity = '1');
        }, 300);
    }
}

function updateWheelSegment(method) {
    const segments = document.querySelectorAll('.wheel-segment');
    segments.forEach(segment => {
        segment.classList.remove('active');
        if (segment.dataset.segment === method) {
            segment.classList.add('active');
        }
    });
}

/**
 * Coffee Wheel — Interactive wheel segments
 */
function initCoffeeWheel() {
    const segments = document.querySelectorAll('.wheel-segment');
    const tabs = document.querySelectorAll('.method-tab');

    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            const method = segment.dataset.segment;
            const correspondingTab = document.querySelector(`.method-tab[data-method="${method}"]`);
            
            if (correspondingTab) {
                correspondingTab.click();
            }
        });

        segment.addEventListener('mouseenter', () => {
            segment.style.transform = segment.style.transform.replace('translate(60px, -90px)', 'translate(55px, -85px)');
        });

        segment.addEventListener('mouseleave', () => {
            const method = segment.dataset.segment;
            if (!segment.classList.contains('active')) {
                // Reset to original position based on segment number
                const segmentNum = Array.from(segments).indexOf(segment) + 1;
                const rotations = [-45, 45, 135, 225];
                segment.style.transform = `rotate(${rotations[segmentNum - 1]}deg) translate(60px, -90px)`;
            }
        });
    });

    // Set initial active state
    updateWheelSegment('pour');
}

/**
 * Smooth Scroll — Refined scrolling behavior
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
 * Parallax — Subtle depth on scroll (hero only)
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBlobs = document.querySelectorAll('.hero .sunset-blob');
    
    if (scrolled < window.innerHeight) {
        heroBlobs.forEach((blob, index) => {
            const speed = 0.1 + (index * 0.05);
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}, { passive: true });

/**
 * Button feedback — Subtle interaction enhancement
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 600ms linear;
            pointer-events: none;
        `;
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple keyframes dynamically
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);
