/**
 * Mindful Landing Page — Interactions & Animations
 * Bauhaus + Museum Labeling Design
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initScrollReveal();
  initHeader();
  initCounters();
  initPhoneCarousel();
  initTestimonialsCarousel();
  initFAQ();
  initTimelineProgress();
  initSmoothScroll();
});

/**
 * Scroll Reveal Animation
 * Uses Intersection Observer to trigger reveal animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for elements in the same container
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.reveal'));
        const siblingIndex = siblings.indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.classList.add('active');
        }, siblingIndex * 100);
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Header Scroll Behavior
 * Adds 'scrolled' class and handles visibility
 */
function initHeader() {
  const header = document.getElementById('nav');
  let lastScroll = 0;
  let ticking = false;
  
  const updateHeader = () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Counter Animation
 * Animates numbers counting up when they come into view
 */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500; // ms
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(startValue + (target - startValue) * easeOut);
          
          counter.textContent = current;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.textContent = target;
          }
        };
        
        requestAnimationFrame(animate);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Phone Mockup Screen Carousel
 * Cycles through app screens with auto-advance
 */
function initPhoneCarousel() {
  const screens = document.querySelectorAll('.screen-content');
  const features = document.querySelectorAll('.feature-item');
  
  if (screens.length === 0) return;
  
  let currentIndex = 0;
  const interval = 5000; // 5 seconds
  
  const showScreen = (index) => {
    // Update screens
    screens.forEach((screen, i) => {
      screen.classList.toggle('active', i === index);
    });
    
    // Update feature items
    features.forEach((feature, i) => {
      feature.classList.toggle('active', i === index);
    });
  };
  
  const nextScreen = () => {
    currentIndex = (currentIndex + 1) % screens.length;
    showScreen(currentIndex);
  };
  
  // Auto-advance
  let autoAdvance = setInterval(nextScreen, interval);
  
  // Manual navigation via feature items
  features.forEach((feature, index) => {
    feature.addEventListener('mouseenter', () => {
      clearInterval(autoAdvance);
      currentIndex = index;
      showScreen(currentIndex);
    });
    
    feature.addEventListener('mouseleave', () => {
      autoAdvance = setInterval(nextScreen, interval);
    });
    
    feature.addEventListener('click', () => {
      currentIndex = index;
      showScreen(currentIndex);
    });
  });
}

/**
 * Testimonials Carousel
 * Manual carousel with dots and arrows
 */
function initTestimonialsCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  let autoAdvance;
  const interval = 6000; // 6 seconds
  
  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    currentIndex = index;
  };
  
  const nextCard = () => {
    showCard((currentIndex + 1) % cards.length);
  };
  
  const prevCard = () => {
    showCard((currentIndex - 1 + cards.length) % cards.length);
  };
  
  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextCard();
      resetAutoAdvance();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevCard();
      resetAutoAdvance();
    });
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showCard(index);
      resetAutoAdvance();
    });
  });
  
  const resetAutoAdvance = () => {
    clearInterval(autoAdvance);
    autoAdvance = setInterval(nextCard, interval);
  };
  
  // Start auto-advance
  autoAdvance = setInterval(nextCard, interval);
}

/**
 * FAQ Accordion
 * Expandable/collapsible FAQ items
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other items (optional - remove for multiple open)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      item.classList.toggle('open');
      question.setAttribute('aria-expanded', !isOpen);
    });
  });
}

/**
 * Timeline Progress Animation
 * Animates the timeline progress line based on scroll position
 */
function initTimelineProgress() {
  const timeline = document.querySelector('.timeline');
  const progress = document.querySelector('.timeline-progress');
  
  if (!timeline || !progress) return;
  
  let ticking = false;
  
  const updateProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the timeline is visible
    const timelineTop = rect.top;
    const timelineHeight = rect.height;
    
    // Start progress when timeline enters viewport
    const startOffset = windowHeight * 0.3;
    const endOffset = windowHeight * 0.7;
    
    let progressPercent = 0;
    
    if (timelineTop <= startOffset) {
      const scrolled = startOffset - timelineTop;
      const total = timelineHeight + startOffset - endOffset;
      progressPercent = Math.min(Math.max(scrolled / total, 0), 1) * 100;
    }
    
    progress.style.height = `${progressPercent}%`;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  
  // Initial check
  updateProgress();
}

/**
 * Smooth Scroll for Anchor Links
 * Handles navigation to section anchors
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
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
 * Utility: Throttle Function
 * Limits the execution of a function
 */
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

/**
 * Utility: Debounce Function
 * Delays the execution of a function
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Parallax Effect for Hero Geometric Elements
 * Subtle parallax based on scroll position
 */
(function initParallax() {
  const heroShapes = document.querySelectorAll('.geo-shape');
  
  if (heroShapes.length === 0) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch
  
  let ticking = false;
  
  const updateParallax = () => {
    const scrollY = window.pageYOffset;
    const rate = 0.1;
    
    heroShapes.forEach((shape, index) => {
      const speed = (index + 1) * rate;
      const yPos = scrollY * speed;
      shape.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

/**
 * Magnetic Button Effect
 * Buttons that slightly follow the cursor
 */
(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-cta');
  
  if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/**
 * Focus Management for Accessibility
 * Ensures proper focus states for keyboard navigation
 */
document.addEventListener('keydown', (e) => {
  // Add visible focus ring when using keyboard
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

/**
 * Prefers Reduced Motion
 * Respects user's motion preferences
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable all animations
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}
