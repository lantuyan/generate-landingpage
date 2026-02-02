/**
 * RankUp - Performance Coaching Platform
 * Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initKineticEffects();
    initFormHandling();
    initCounterAnimations();
});

/**
 * Navigation Module
 * Handles navbar scroll effects and mobile menu toggle
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
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
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations Module
 * Reveal elements as they enter the viewport
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.section-header, .coach-card, .step, .program-card, .result-card, .stone-block, .big-stat'
    );
    
    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Intersection Observer for scroll reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add stagger delay for card grids
                const parent = entry.target.parentElement;
                if (parent && (parent.classList.contains('coaches-grid') || 
                              parent.classList.contains('programs-grid') ||
                              parent.classList.contains('results-grid'))) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Parallax effect for hero section
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && !window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }
}

/**
 * Kinetic Effects Module
 * Adds subtle flicker and pulse animations
 */
function initKineticEffects() {
    // Random flicker effect for certain elements
    const flickerElements = document.querySelectorAll('.rank-tier, .metric-value');
    
    flickerElements.forEach(el => {
        // Add random flicker interval
        const flickerInterval = () => {
            const delay = 2000 + Math.random() * 3000;
            setTimeout(() => {
                el.style.opacity = '0.7';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 50);
                flickerInterval();
            }, delay);
        };
        
        flickerInterval();
    });
    
    // Progress ring animation on scroll
    const progressRing = document.querySelector('.progress-fill');
    
    if (progressRing) {
        const ringObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate the stroke dashoffset
                    progressRing.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
                    progressRing.style.strokeDashoffset = '37';
                    ringObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        ringObserver.observe(progressRing);
    }
    
    // Mouse move parallax for monolith card
    const monolithCard = document.querySelector('.monolith-card');
    
    if (monolithCard && !window.matchMedia('(pointer: coarse)').matches) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;
            
            const rotateX = yPercent * -5;
            const rotateY = xPercent * 5;
            
            monolithCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }
}

/**
 * Form Handling Module
 * Handles form submission and validation
 */
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const game = document.getElementById('game').value;
            
            // Simple validation
            if (!name || !email || !game) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Matching...</span>';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
                
                showNotification('Coach matching request submitted! We\'ll be in touch soon.', 'success');
                
                // Trigger confetti effect
                triggerConfetti(submitBtn);
            }, 1500);
        });
    }
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#f97316'};
        color: white;
        border-radius: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .notification-close:hover { opacity: 1; }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto dismiss
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Trigger confetti burst effect
 */
function triggerConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#ff6b35', '#00d9ff', '#a3e635', '#ffd700'];
    const shapes = ['✦', '◆', '▲', '●'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('span');
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            font-size: ${12 + Math.random() * 16}px;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 100;
        
        confetti.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy + 200}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }).onfinish = () => confetti.remove();
    }
}

/**
 * Counter Animation Module
 * Animates numbers counting up
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value, .big-stat-value');
    
    const countUp = (element, target, duration = 2000) => {
        const start = 0;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out expo
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * (target - start) + start);
            
            // Format number
            if (target >= 1000) {
                element.textContent = current >= 1000 
                    ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K+'
                    : current;
            } else if (element.textContent.includes('%')) {
                element.textContent = current + '%';
            } else if (element.textContent.includes('.')) {
                element.textContent = (current / 10).toFixed(1);
            } else {
                element.textContent = current + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                
                // Parse target value
                let target = parseFloat(text.replace(/[^0-9.]/g, ''));
                if (text.includes('K')) target *= 1000;
                if (text.includes('.') && target > 10) target *= 10;
                
                countUp(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Rank Progress Animation
 * Animates rank progress bars when in view
 */
function initRankAnimations() {
    const rankCards = document.querySelectorAll('.result-rank');
    
    rankCards.forEach(card => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const arrow = card.querySelector('.rank-arrow');
                    if (arrow) {
                        arrow.style.transform = 'translateX(0)';
                        arrow.style.opacity = '1';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });
}

// Initialize rank animations
document.addEventListener('DOMContentLoaded', initRankAnimations);
