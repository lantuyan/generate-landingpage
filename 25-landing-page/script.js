/**
 * FlowBoard - Flat Design Landing Page
 * JavaScript for interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initKanbanAnimation();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');

        // Toggle button animation
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');

            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.nav').offsetHeight;
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
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.feature-card, .workflow-step, .pricing-card, .integration-item, .testimonial-content'
    );

    animateElements.forEach(function(el, index) {
        el.style.opacity = '0';
        el.style.animationDelay = (index % 4) * 0.1 + 's';
        observer.observe(el);
    });

    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(function(header) {
        header.style.opacity = '0';
        observer.observe(header);
    });
}

/**
 * Navbar Background on Scroll
 */
function initNavbarScroll() {
    const nav = document.querySelector('.nav');

    if (!nav) return;

    function handleScroll() {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/**
 * Kanban Card Animation
 */
function initKanbanAnimation() {
    const kanbanCards = document.querySelectorAll('.kanban-card');

    kanbanCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Animate progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    progressBar.style.transition = 'width 1s ease-out';
                    progressBar.style.width = '65%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Reset width initially
        progressBar.style.width = '0%';
        observer.observe(progressBar);
    }
}

/**
 * Button Hover Effects (Flat Design - Instant Color Swap)
 */
document.querySelectorAll('.btn').forEach(function(btn) {
    btn.style.transition = 'background-color 0s, color 0s, border-color 0s';
});

/**
 * Feature Card Hover Effects
 */
document.querySelectorAll('.feature-card').forEach(function(card) {
    const icon = card.querySelector('.feature-icon');
    const originalBg = icon ? window.getComputedStyle(icon).backgroundColor : null;

    card.addEventListener('mouseenter', function() {
        if (icon) {
            icon.style.transform = 'scale(1.1)';
        }
    });

    card.addEventListener('mouseleave', function() {
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

/**
 * Integration Icons Hover
 */
document.querySelectorAll('.integration-item').forEach(function(item) {
    const icon = item.querySelector('.integration-icon');

    item.addEventListener('mouseenter', function() {
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });

    item.addEventListener('mouseleave', function() {
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

/**
 * Pricing Card Hover
 */
document.querySelectorAll('.pricing-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('pricing-card-featured')) {
            this.style.borderColor = '#3B82F6';
        }
    });

    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('pricing-card-featured')) {
            this.style.borderColor = '#E5E7EB';
        }
    });
});

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const text = stat.textContent;

                // Extract number and suffix
                const match = text.match(/^([\d.]+)(.*)$/);
                if (match) {
                    const targetNum = parseFloat(match[1]);
                    const suffix = match[2];
                    animateNumber(stat, targetNum, suffix);
                }

                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(function(stat) {
        observer.observe(stat);
    });
}

function animateNumber(element, target, suffix) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;

        // Format number
        let displayValue;
        if (target >= 1000) {
            displayValue = (current / 1000).toFixed(current >= target ? 0 : 1);
            if (suffix.includes('K')) {
                displayValue += 'K';
                suffix = suffix.replace('K+', '+');
            } else if (suffix.includes('M')) {
                displayValue = (current / 1000).toFixed(0) + 'M';
                suffix = suffix.replace('M+', '+');
            }
        } else if (target < 100 && target > 1) {
            displayValue = current.toFixed(1);
        } else {
            displayValue = Math.round(current);
        }

        element.textContent = displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Initialize stats counter when DOM is ready
document.addEventListener('DOMContentLoaded', initStatsCounter);

/**
 * Workflow Step Connector Animation
 */
function initWorkflowAnimation() {
    const connectors = document.querySelectorAll('.workflow-connector');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'transform 0.5s ease-out';
                entry.target.style.transform = 'scaleX(1)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    connectors.forEach(function(connector) {
        connector.style.transform = 'scaleX(0)';
        connector.style.transformOrigin = 'left center';
        observer.observe(connector);
    });
}

document.addEventListener('DOMContentLoaded', initWorkflowAnimation);
