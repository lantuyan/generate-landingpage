/**
 * VERITAS Landing Page - Interactive Scripts
 * Frictiony slide animations and scroll-triggered reveals
 */

(function() {
    'use strict';

    // ===== Configuration =====
    const config = {
        friction: 0.08,
        spring: 0.15,
        threshold: 0.15,
        rootMargin: '-50px 0px -50px 0px'
    };

    // ===== Utility Functions =====
    const lerp = (start, end, factor) => start + (end - start) * factor;
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ===== Frictiony Scroll Progress =====
    class FrictionyScroll {
        constructor() {
            this.target = 0;
            this.current = 0;
            this.elements = [];
            this.ticking = false;
            
            this.init();
        }
        
        init() {
            window.addEventListener('scroll', () => {
                this.target = window.scrollY;
                if (!this.ticking) {
                    requestAnimationFrame(() => this.update());
                    this.ticking = true;
                }
            }, { passive: true });
        }
        
        update() {
            // Apply friction to scroll
            this.current = lerp(this.current, this.target, config.friction);
            
            // Update registered elements with frictiony offset
            this.elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = (centerY - viewportCenter) / window.innerHeight;
                
                // Calculate parallax offset with friction
                const offset = distance * el.dataset.parallax * (this.current - this.target) * 0.01;
                el.style.transform = `translateY(${offset}px)`;
            });
            
            if (Math.abs(this.target - this.current) > 0.01) {
                requestAnimationFrame(() => this.update());
            } else {
                this.ticking = false;
            }
        }
        
        register(element, intensity = 20) {
            element.dataset.parallax = intensity;
            this.elements.push(element);
        }
    }

    // ===== Intersection Observer for Reveals =====
    class RevealOnScroll {
        constructor() {
            this.observer = new IntersectionObserver(
                (entries) => this.handleEntries(entries),
                {
                    threshold: config.threshold,
                    rootMargin: config.rootMargin
                }
            );
            
            this.init();
        }
        
        init() {
            // Method cards
            document.querySelectorAll('.method-card').forEach((el, i) => {
                el.style.transitionDelay = `${i * 100}ms`;
                this.observer.observe(el);
            });
            
            // Instrument panel
            const panel = document.querySelector('.instrument-panel');
            if (panel) this.observer.observe(panel);
            
            // Data cards
            document.querySelectorAll('.data-card').forEach((el, i) => {
                el.style.transitionDelay = `${i * 150}ms`;
                this.observer.observe(el);
            });
            
            // Brand logos
            document.querySelectorAll('.brand-logo').forEach((el, i) => {
                el.style.transitionDelay = `${i * 80}ms`;
                this.observer.observe(el);
            });
            
            // Access cards
            document.querySelectorAll('.access-card').forEach((el, i) => {
                el.style.transitionDelay = `${i * 100}ms`;
                this.observer.observe(el);
            });
        }
        
        handleEntries(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger data bar animations
                    if (entry.target.classList.contains('data-card')) {
                        const bar = entry.target.querySelector('.data-bar');
                        if (bar) {
                            setTimeout(() => {
                                bar.style.width = bar.dataset.value + '%';
                            }, 300);
                        }
                    }
                    
                    // Unobserve after reveal
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // ===== Navigation Behavior =====
    class Navigation {
        constructor() {
            this.nav = document.querySelector('.nav');
            this.toggle = document.querySelector('.nav-toggle');
            this.links = document.querySelector('.nav-links');
            this.lastScroll = 0;
            this.hidden = false;
            
            this.init();
        }
        
        init() {
            // Scroll behavior
            window.addEventListener('scroll', throttle(() => {
                const currentScroll = window.scrollY;
                
                // Hide/show nav on scroll direction
                if (currentScroll > 100) {
                    if (currentScroll > this.lastScroll && !this.hidden) {
                        this.nav.style.transform = 'translateY(-100%)';
                        this.hidden = true;
                    } else if (currentScroll < this.lastScroll && this.hidden) {
                        this.nav.style.transform = 'translateY(0)';
                        this.nav.style.background = 'rgba(10, 10, 11, 0.95)';
                        this.hidden = false;
                    }
                } else {
                    this.nav.style.transform = 'translateY(0)';
                    this.nav.style.background = 'rgba(10, 10, 11, 0.8)';
                    this.hidden = false;
                }
                
                this.lastScroll = currentScroll;
            }, 100), { passive: true });
            
            // Mobile toggle
            if (this.toggle) {
                this.toggle.addEventListener('click', () => {
                    this.links.classList.toggle('active');
                    this.toggle.classList.toggle('active');
                });
            }
            
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const offset = 80;
                        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu
                        this.links.classList.remove('active');
                        this.toggle.classList.remove('active');
                    }
                });
            });
        }
    }

    // ===== Hero Parallax =====
    class HeroParallax {
        constructor() {
            this.hero = document.querySelector('.hero');
            this.heroVisual = document.querySelector('.hero-visual');
            this.heroContent = document.querySelector('.hero-content');
            
            if (!this.hero) return;
            
            this.init();
        }
        
        init() {
            window.addEventListener('scroll', () => {
                const scroll = window.scrollY;
                const heroHeight = this.hero.offsetHeight;
                
                if (scroll < heroHeight) {
                    const progress = scroll / heroHeight;
                    
                    // Subtle parallax on hero visual
                    if (this.heroVisual) {
                        this.heroVisual.style.transform = `translateY(${scroll * 0.15}px)`;
                    }
                    
                    // Fade out hero content
                    if (this.heroContent) {
                        this.heroContent.style.opacity = 1 - progress * 1.5;
                        this.heroContent.style.transform = `translateY(${scroll * 0.1}px)`;
                    }
                }
            }, { passive: true });
        }
    }

    // ===== Magnetic Elements =====
    class MagneticElements {
        constructor() {
            this.elements = document.querySelectorAll('.btn, .method-card');
            this.isTouch = window.matchMedia('(pointer: coarse)').matches;
            
            if (!this.isTouch) {
                this.init();
            }
        }
        
        init() {
            this.elements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    el.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
                });
                
                el.addEventListener('mouseleave', () => {
                    el.style.transform = '';
                });
            });
        }
    }

    // ===== Glitch Effect on Scan Line =====
    class ScanLineGlitch {
        constructor() {
            this.scanLine = document.querySelector('.scan-line');
            if (!this.scanLine) return;
            
            this.init();
        }
        
        init() {
            // Random glitch
            setInterval(() => {
                if (Math.random() > 0.95) {
                    this.glitch();
                }
            }, 2000);
        }
        
        glitch() {
            this.scanLine.style.transform = 'translateY(50%) scaleX(1.1)';
            this.scanLine.style.opacity = '0.8';
            this.scanLine.style.boxShadow = '0 0 40px var(--color-accent), 0 0 80px var(--color-accent)';
            
            setTimeout(() => {
                this.scanLine.style.transform = '';
                this.scanLine.style.opacity = '';
                this.scanLine.style.boxShadow = '';
            }, 100);
        }
    }

    // ===== Counter Animation =====
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number');
            this.observer = new IntersectionObserver(
                (entries) => this.handleEntries(entries),
                { threshold: 0.5 }
            );
            
            this.init();
        }
        
        init() {
            this.counters.forEach(counter => {
                this.observer.observe(counter);
            });
        }
        
        handleEntries(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }
        
        animate(element) {
            const text = element.textContent;
            const isDecimal = text.includes('.');
            const isMillion = text.includes('M');
            const suffix = text.replace(/[0-9.,]/g, '');
            const target = parseFloat(text.replace(/[^0-9.]/g, ''));
            
            let current = 0;
            const duration = 2000;
            const startTime = performance.now();
            
            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = target * easeOutQuart;
                
                if (isMillion) {
                    element.textContent = current.toFixed(1) + 'M';
                } else if (isDecimal) {
                    element.textContent = current.toFixed(1) + suffix;
                } else {
                    element.textContent = Math.floor(current).toLocaleString() + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            requestAnimationFrame(update);
        }
    }

    // ===== Instrument Panel Animation =====
    class InstrumentPanel {
        constructor() {
            this.panel = document.querySelector('.instrument-panel');
            if (!this.panel) return;
            
            this.gridCells = this.panel.querySelectorAll('.grid-cell');
            this.readings = this.panel.querySelectorAll('.reading-value');
            
            this.init();
        }
        
        init() {
            // Animate grid cells sequentially
            this.gridCells.forEach((cell, i) => {
                setTimeout(() => {
                    if (cell.classList.contains('active')) {
                        cell.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            cell.style.transform = '';
                        }, 200);
                    }
                }, i * 100);
            });
            
            // Random reading updates
            setInterval(() => {
                this.updateReadings();
            }, 3000);
        }
        
        updateReadings() {
            const hashes = ['0x7a3f...9e2d', '0x8b4a...2f1c', '0x9c5b...3g2d', '0xad6c...4h3e'];
            const times = ['2024.01.15 14:32:07', '2024.01.15 14:33:22', '2024.01.15 14:34:15'];
            
            this.readings.forEach(reading => {
                reading.style.opacity = '0';
                setTimeout(() => {
                    if (reading.textContent.startsWith('0x')) {
                        reading.textContent = hashes[Math.floor(Math.random() * hashes.length)];
                    } else if (reading.textContent.includes('2024')) {
                        reading.textContent = times[Math.floor(Math.random() * times.length)];
                    }
                    reading.style.opacity = '1';
                }, 200);
            });
        }
    }

    // ===== Initialize Everything =====
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all modules
        new FrictionyScroll();
        new RevealOnScroll();
        new Navigation();
        new HeroParallax();
        new MagneticElements();
        new ScanLineGlitch();
        new CounterAnimation();
        new InstrumentPanel();
        
        // Add visibility class to body for initial animations
        document.body.classList.add('loaded');
        
        // Console greeting
        console.log('%cVERITAS MANUFACTURING', 'font-size: 20px; font-weight: bold; color: #00f0ff;');
        console.log('%cSupply Chain Transparency Platform', 'font-size: 12px; color: #9a9aa4;');
        console.log('%cEvery claim is verifiable. Every audit is documented.', 'font-size: 10px; color: #5a5a64; font-style: italic;');
    });

})();
