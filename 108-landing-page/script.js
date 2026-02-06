/**
 * ContextFlow Landing Page - Tech Forward with Playful Precision
 * Interactive animations, elastic bounce, and confetti highlights
 */

(function() {
    'use strict';

    // ==========================================================================
    // Confetti System - Unexpected color moments celebrating organized chaos
    // ==========================================================================

    class ConfettiSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.colors = ['#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa'];
            this.isActive = false;

            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticle(x, y) {
            return {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            };
        }

        burst(x, y, count = 30) {
            for (let i = 0; i < count; i++) {
                this.particles.push(this.createParticle(x, y));
            }
            if (!this.isActive) {
                this.isActive = true;
                this.animate();
            }
        }

        animate() {
            if (this.particles.length === 0) {
                this.isActive = false;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                return;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles = this.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.3; // gravity
                p.rotation += p.rotationSpeed;
                p.life -= p.decay;
                p.vx *= 0.99; // friction

                if (p.life <= 0) return false;

                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = p.life;
                this.ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
                return true;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ==========================================================================
    // Navigation
    // ==========================================================================

    class Navigation {
        constructor() {
            this.nav = document.getElementById('nav');
            this.toggle = document.getElementById('nav-toggle');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.lastScrollY = 0;

            this.init();
        }

        init() {
            // Scroll behavior
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

            // Mobile toggle
            if (this.toggle) {
                this.toggle.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Close mobile menu on link click
            document.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
            });
        }

        handleScroll() {
            const scrollY = window.scrollY;

            // Add scrolled class for background
            if (scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            this.lastScrollY = scrollY;
        }

        toggleMobileMenu() {
            this.toggle.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        }

        closeMobileMenu() {
            this.toggle.classList.remove('active');
            this.mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        handleAnchorClick(e) {
            const href = e.currentTarget.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                    this.closeMobileMenu();
                }
            }
        }
    }

    // ==========================================================================
    // Scroll Animations with Intersection Observer
    // ==========================================================================

    class ScrollAnimations {
        constructor() {
            this.init();
        }

        init() {
            // Animate sections on scroll
            const sections = document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card, .integration-category');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                observer.observe(section);
            });

            // Special handling for steps
            const steps = document.querySelectorAll('.step');
            const stepObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.2
            });

            steps.forEach(step => stepObserver.observe(step));
        }
    }

    // ==========================================================================
    // Counter Animation - Elastic bounce effect
    // ==========================================================================

    class CounterAnimation {
        constructor() {
            this.init();
        }

        init() {
            const counters = document.querySelectorAll('.stat-value[data-count]');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(element) {
            const target = parseFloat(element.dataset.count);
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                // Elastic easing
                const easeOutElastic = (x) => {
                    const c4 = (2 * Math.PI) / 3;
                    return x === 0 ? 0 : x === 1 ? 1 :
                        Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
                };

                const current = target * easeOutElastic(progress);
                element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = isDecimal ? target.toFixed(1) : target;
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // ==========================================================================
    // Pricing Toggle
    // ==========================================================================

    class PricingToggle {
        constructor() {
            this.toggle = document.getElementById('pricing-toggle');
            this.isYearly = false;

            if (this.toggle) {
                this.init();
            }
        }

        init() {
            this.toggle.addEventListener('click', () => this.handleToggle());

            // Also handle clicking on labels
            document.querySelectorAll('.toggle-label').forEach(label => {
                label.addEventListener('click', () => {
                    const period = label.dataset.period;
                    if ((period === 'yearly') !== this.isYearly) {
                        this.handleToggle();
                    }
                });
            });
        }

        handleToggle() {
            this.isYearly = !this.isYearly;
            this.toggle.classList.toggle('active', this.isYearly);

            // Update labels
            document.querySelectorAll('.toggle-label').forEach(label => {
                label.classList.toggle('toggle-active',
                    (label.dataset.period === 'yearly') === this.isYearly
                );
            });

            // Update prices with elastic animation
            document.querySelectorAll('.amount-value').forEach(price => {
                const monthly = parseFloat(price.dataset.monthly);
                const yearly = parseFloat(price.dataset.yearly);
                const newValue = this.isYearly ? yearly : monthly;

                price.style.transform = 'scale(0.8)';
                price.style.opacity = '0.5';

                setTimeout(() => {
                    price.textContent = newValue;
                    price.style.transform = 'scale(1.1)';
                    price.style.opacity = '1';

                    setTimeout(() => {
                        price.style.transform = 'scale(1)';
                    }, 150);
                }, 150);
            });
        }
    }

    // ==========================================================================
    // Interactive Button Effects with Confetti
    // ==========================================================================

    class InteractiveButtons {
        constructor(confetti) {
            this.confetti = confetti;
            this.init();
        }

        init() {
            // Add elastic bounce to buttons
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('mousedown', () => {
                    btn.style.transform = 'scale(0.95)';
                });

                btn.addEventListener('mouseup', () => {
                    btn.style.transform = '';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });

            // Primary buttons trigger confetti
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (this.confetti) {
                        const rect = btn.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
                        this.confetti.burst(x, y, 25);
                    }
                });
            });
        }
    }

    // ==========================================================================
    // Parallax Effects for Hero
    // ==========================================================================

    class ParallaxEffects {
        constructor() {
            this.hero = document.querySelector('.hero');
            this.visualCards = document.querySelectorAll('.visual-card');
            this.heroContent = document.querySelector('.hero-content');

            if (this.hero) {
                this.init();
            }
        }

        init() {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

            // Mouse move parallax for visual cards
            if (window.innerWidth > 1024) {
                this.hero.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            }
        }

        handleScroll() {
            const scrollY = window.scrollY;
            const heroHeight = this.hero.offsetHeight;

            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;

                this.visualCards.forEach((card, index) => {
                    const speed = 0.2 + (index * 0.1);
                    card.style.transform = `translateY(${scrollY * speed}px)`;
                });
            }
        }

        handleMouseMove(e) {
            const rect = this.hero.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

            this.visualCards.forEach((card, index) => {
                const intensity = 20 + (index * 10);
                const rotateX = y * -5;
                const rotateY = x * 5;
                card.style.transform = `translate(${x * intensity}px, ${y * intensity}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }
    }

    // ==========================================================================
    // Magnetic Cursor Effect for Cards
    // ==========================================================================

    class MagneticEffect {
        constructor() {
            if (window.innerWidth > 1024) {
                this.init();
            }
        }

        init() {
            const cards = document.querySelectorAll('.feature-card, .integration-category, .pricing-card');

            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMove(e, card));
                card.addEventListener('mouseleave', (e) => this.handleLeave(card));
            });
        }

        handleMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${deltaY * -3}deg) rotateY(${deltaX * 3}deg)`;
        }

        handleLeave(card) {
            card.style.transform = '';
        }
    }

    // ==========================================================================
    // Typing Animation for Hero
    // ==========================================================================

    class TypingAnimation {
        constructor() {
            this.phrases = [
                'meeting notes',
                'research links',
                'chat threads',
                'documents',
                'decisions'
            ];
            this.currentIndex = 0;
            this.element = null;

            this.init();
        }

        init() {
            // Could be used to add a typing effect in the hero
            // Currently handled by CSS animations
        }
    }

    // ==========================================================================
    // Ambient Particle Background
    // ==========================================================================

    class AmbientParticles {
        constructor() {
            this.particles = [];
            this.canvas = null;
            this.ctx = null;

            this.init();
        }

        init() {
            // Create ambient canvas
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
                opacity: 0.3;
            `;
            document.body.prepend(this.canvas);

            this.ctx = this.canvas.getContext('2d');
            this.resize();

            window.addEventListener('resize', () => this.resize());

            // Create particles
            for (let i = 0; i < 30; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    color: this.getRandomColor()
                });
            }

            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        getRandomColor() {
            const colors = ['#6366f1', '#f472b6', '#34d399', '#fbbf24', '#60a5fa'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.fill();
            });

            // Draw connections
            this.particles.forEach((p1, i) => {
                this.particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 150)})`;
                        this.ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ==========================================================================
    // Feature Demo Animation
    // ==========================================================================

    class FeatureDemo {
        constructor() {
            this.init();
        }

        init() {
            const demo = document.querySelector('.feature-demo');
            if (!demo) return;

            // Observe when demo comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startDemo(demo);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(demo);
        }

        startDemo(demo) {
            // Reset and replay animations
            const results = demo.querySelectorAll('.demo-result');
            results.forEach((result, index) => {
                result.style.animation = 'none';
                result.offsetHeight; // Trigger reflow
                result.style.animation = `resultFade 0.5s ease-out ${0.3 + index * 0.2}s forwards`;
            });
        }
    }

    // ==========================================================================
    // Initialize Everything
    // ==========================================================================

    document.addEventListener('DOMContentLoaded', () => {
        // Core systems
        const confetti = new ConfettiSystem('confetti-canvas');
        const nav = new Navigation();
        const scrollAnimations = new ScrollAnimations();
        const counterAnimation = new CounterAnimation();
        const pricingToggle = new PricingToggle();
        const interactiveButtons = new InteractiveButtons(confetti);
        const parallaxEffects = new ParallaxEffects();
        const magneticEffect = new MagneticEffect();
        const featureDemo = new FeatureDemo();

        // Ambient particles (subtle background effect)
        if (window.innerWidth > 768) {
            const ambientParticles = new AmbientParticles();
        }

        // Add confetti burst on page load for delight
        setTimeout(() => {
            if (window.innerWidth > 768) {
                confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 40);
            }
        }, 1500);

        // Easter egg: Konami code triggers massive confetti
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            konamiCode = konamiCode.slice(-10);

            if (konamiCode.join(',') === konamiSequence.join(',')) {
                // Massive confetti celebration
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        confetti.burst(
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerHeight / 2,
                            50
                        );
                    }, i * 200);
                }
            }
        });

        // Log initialization
        console.log('%c✨ ContextFlow Landing Page Initialized', 'color: #6366f1; font-weight: bold; font-size: 14px;');
        console.log('%cTech Forward with Playful Precision', 'color: #a78bfa; font-size: 12px;');
    });

})();
