/**
 * MakerNet Landing Page — Interactive Script
 * Pulse scrolling, magnetic snap, confetti highlights
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initConfetti();
    initFormHandler();
});

/* ========================================
   Navigation
   ======================================== */

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Scroll effect for navigation
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle aria-expanded
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close mobile menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = nav.offsetHeight;
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
   Scroll Animations (Pulse Rhythm)
   ======================================== */

function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with stagger delay if specified
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe equipment cards
    document.querySelectorAll('.equipment-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe step elements
    document.querySelectorAll('.step').forEach(step => {
        observer.observe(step);
    });
    
    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe certification categories
    document.querySelectorAll('.cert-category').forEach(cat => {
        observer.observe(cat);
    });
    
    // Magnetic snap effect for cards
    initMagneticSnap();
}

function initMagneticSnap() {
    const cards = document.querySelectorAll('.equipment-card, .testimonial-card, .pricing-card');
    
    // Only apply magnetic effect on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

/* ========================================
   Counter Animation
   ======================================== */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
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
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-quart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOut * (target - start) + start);
        
        // Format number with K/M suffix if large
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K';
        } else {
            element.textContent = current + '+';
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final value
            if (target >= 1000) {
                element.textContent = (target / 1000) + 'K';
            } else {
                element.textContent = target + '+';
            }
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   Confetti Highlights
   ======================================== */

function initConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = [
        '#FF6B5B', // coral
        '#FFB84D', // amber
        '#7CB69D', // sage
        '#5BA3D0', // sky
        '#9B8EC7'  // lavender
    ];
    
    const shapes = ['square', 'circle', 'triangle'];
    
    function createConfettiPiece() {
        const piece = document.createElement('div');
        piece.className = 'confetti';
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 8 + Math.random() * 6;
        const size = 6 + Math.random() * 8;
        
        piece.style.left = `${left}%`;
        piece.style.backgroundColor = color;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.animationDelay = `${delay}s`;
        piece.style.animationDuration = `${duration}s`;
        
        // Shape variations
        if (shape === 'circle') {
            piece.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            piece.style.width = '0';
            piece.style.height = '0';
            piece.style.backgroundColor = 'transparent';
            piece.style.borderLeft = `${size/2}px solid transparent`;
            piece.style.borderRight = `${size/2}px solid transparent`;
            piece.style.borderBottom = `${size}px solid ${color}`;
        }
        
        return piece;
    }
    
    // Create initial confetti
    for (let i = 0; i < 30; i++) {
        container.appendChild(createConfettiPiece());
    }
    
    // Burst effect on CTA button click
    const ctaButton = document.querySelector('.signup-form .btn-primary');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            // Don't prevent default - let form submit
            createConfettiBurst(e.clientX, e.clientY);
        });
    }
    
    function createConfettiBurst(x, y) {
        const burstCount = 20;
        
        for (let i = 0; i < burstCount; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'fixed';
            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;
            piece.style.width = '8px';
            piece.style.height = '8px';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            piece.style.pointerEvents = 'none';
            piece.style.zIndex = '9999';
            
            document.body.appendChild(piece);
            
            // Animate
            const angle = (Math.PI * 2 * i) / burstCount;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animate = () => {
                posX += vx * 0.02;
                posY += vy * 0.02 + 2; // gravity
                opacity -= 0.02;
                
                piece.style.left = `${posX}px`;
                piece.style.top = `${posY}px`;
                piece.style.opacity = opacity;
                piece.style.transform = `rotate(${posX}deg)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    piece.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

/* ========================================
   Form Handler
   ======================================== */

function initFormHandler() {
    const form = document.getElementById('signupForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const input = form.querySelector('input[type="email"]');
            const email = input.value.trim();
            
            if (email) {
                // Show success message
                const button = form.querySelector('button');
                const originalText = button.innerHTML;
                
                button.innerHTML = '<span>✓ You\'re on the list!</span>';
                button.style.background = '#7CB69D';
                
                input.value = '';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 3000);
            }
        });
    }
}

/* ========================================
   Map Node Animation
   ======================================== */

// Randomly activate map nodes
function animateMapNodes() {
    const nodes = document.querySelectorAll('.map-node');
    
    setInterval(() => {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        randomNode.classList.add('active');
        
        setTimeout(() => {
            randomNode.classList.remove('active');
        }, 2000);
    }, 3000);
}

// Start map animation when section is visible
document.addEventListener('DOMContentLoaded', () => {
    const locationsSection = document.getElementById('locations');
    
    if (locationsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMapNodes();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(locationsSection);
    }
});

/* ========================================
   Parallax Effect (Subtle)
   ======================================== */

// Only on non-touch devices
if (!window.matchMedia('(pointer: coarse)').matches) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                // Subtle parallax for hero elements
                const heroPulse = document.querySelector('.hero-pulse');
                if (heroPulse) {
                    heroPulse.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.1}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}
