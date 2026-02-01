/**
 * ARCHIVE.RAW - Minimal JavaScript
 * No frameworks. No dependencies. Just function.
 */

(function() {
    'use strict';

    // Update current time in UTC
    function updateTime() {
        var timeElement = document.getElementById('current-time');
        if (timeElement) {
            var now = new Date();
            var utc = now.toISOString().replace('T', ' ').substring(0, 19);
            timeElement.textContent = utc;
        }
    }

    // Simulate live page count
    function updatePageCount() {
        var countElement = document.getElementById('pages-count');
        if (countElement) {
            var currentCount = parseInt(countElement.textContent.replace(/,/g, ''));
            var increment = Math.floor(Math.random() * 50) + 10;
            var newCount = currentCount + increment;
            countElement.textContent = newCount.toLocaleString();
        }
    }

    // Animate stats numbers on scroll
    function animateStats() {
        var stats = {
            'stat-pages': { target: 12847293847, prefix: '' },
            'stat-domains': { target: 847293, prefix: '' },
            'stat-today': { target: 2847293, prefix: '' }
        };

        Object.keys(stats).forEach(function(id) {
            var element = document.getElementById(id);
            if (element && !element.dataset.animated) {
                var target = stats[id].target;
                var current = 0;
                var step = Math.ceil(target / 50);
                var interval = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    element.textContent = current.toLocaleString();
                }, 30);
                element.dataset.animated = 'true';
            }
        });
    }

    // Check if element is in viewport
    function isInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();

        var form = event.target;
        var responseDiv = document.getElementById('form-response');
        var submitButton = form.querySelector('button[type="submit"]');

        // Disable button
        submitButton.disabled = true;
        submitButton.textContent = 'PROCESSING...';

        // Simulate form submission
        setTimeout(function() {
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;

            // Show success message
            responseDiv.className = 'success';
            responseDiv.innerHTML =
                '<pre>' +
                '┌────────────────────────────────────┐\n' +
                '│  REQUEST RECEIVED                  │\n' +
                '├────────────────────────────────────┤\n' +
                '│                                    │\n' +
                '│  NAME: ' + name.substring(0, 20).padEnd(20) + '      │\n' +
                '│  EMAIL: ' + email.substring(0, 20).padEnd(20) + '     │\n' +
                '│  STATUS: QUEUED                   │\n' +
                '│  REF: #' + Math.random().toString(36).substring(2, 10).toUpperCase() + '                    │\n' +
                '│                                    │\n' +
                '│  We will contact you within       │\n' +
                '│  24-48 hours.                     │\n' +
                '│                                    │\n' +
                '└────────────────────────────────────┘' +
                '</pre>';
            responseDiv.style.display = 'block';

            // Reset form
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = '>> SUBMIT REQUEST <<';
        }, 1500);
    }

    // Smooth scroll for anchor links
    function smoothScroll(target) {
        var element = document.querySelector(target);
        if (element) {
            var headerOffset = 60;
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Handle anchor click
    function handleAnchorClick(event) {
        var target = event.target;
        if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
            event.preventDefault();
            var hash = target.getAttribute('href');
            if (hash !== '#') {
                smoothScroll(hash);
                history.pushState(null, null, hash);
            }
        }
    }

    // Typewriter effect for terminal
    function typewriterEffect(element, text, speed) {
        var i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Add glitch effect to elements
    function addGlitchEffect() {
        var headers = document.querySelectorAll('#hero h2, #hero h3');
        headers.forEach(function(header) {
            header.setAttribute('data-text', header.textContent);
        });
    }

    // Console Easter egg
    function consoleEasterEgg() {
        console.log('%c' +
            '╔═══════════════════════════════════════════╗\n' +
            '║                                           ║\n' +
            '║   █████╗ ██████╗  ██████╗██╗  ██╗██╗██╗   ║\n' +
            '║  ██╔══██╗██╔══██╗██╔════╝██║  ██║██║██║   ║\n' +
            '║  ███████║██████╔╝██║     ███████║██║██║   ║\n' +
            '║  ██╔══██║██╔══██╗██║     ██╔══██║██║╚═╝   ║\n' +
            '║  ██║  ██║██║  ██║╚██████╗██║  ██║██║██╗   ║\n' +
            '║  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝   ║\n' +
            '║                                           ║\n' +
            '║   ARCHIVE.RAW - Digital Preservation      ║\n' +
            '║   The web is disappearing. We save it.    ║\n' +
            '║                                           ║\n' +
            '╚═══════════════════════════════════════════╝',
            'color: #00ff00; font-family: monospace;'
        );
        console.log('%cViewing source? Good. That\'s the spirit.',
            'color: #0000ff; font-family: monospace;');
    }

    // Scroll reveal animation
    function scrollReveal() {
        var sections = document.querySelectorAll('section');
        sections.forEach(function(section) {
            if (isInViewport(section) && !section.classList.contains('revealed')) {
                section.classList.add('revealed');
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize scroll reveal styles
    function initScrollReveal() {
        var sections = document.querySelectorAll('section:not(#hero)');
        sections.forEach(function(section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }

    // Keyboard navigation
    function handleKeyboard(event) {
        // Press 'S' to jump to services
        if (event.key === 's' && !event.ctrlKey && !event.metaKey) {
            var activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' &&
                activeElement.tagName !== 'TEXTAREA' &&
                activeElement.tagName !== 'SELECT') {
                // Don't interfere with typing
            }
        }
    }

    // Initialize everything on DOM ready
    function init() {
        // Update time immediately and every second
        updateTime();
        setInterval(updateTime, 1000);

        // Update page count every 2 seconds
        setInterval(updatePageCount, 2000);

        // Form handler
        var form = document.getElementById('archiveForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        // Anchor link handling
        document.addEventListener('click', handleAnchorClick);

        // Scroll reveal
        initScrollReveal();
        scrollReveal();
        window.addEventListener('scroll', function() {
            scrollReveal();

            // Animate stats when in view
            var statsSection = document.getElementById('stats');
            if (statsSection && isInViewport(statsSection)) {
                animateStats();
            }
        });

        // Add glitch effect
        addGlitchEffect();

        // Console Easter egg
        consoleEasterEgg();

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
