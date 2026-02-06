# Technical Specification: Mindful Finance Landing Page

## Component Inventory

### shadcn/ui Components
None required - custom implementation for Bauhaus aesthetic

### Third-party Components
None required

### Custom Components
1. **MuseumLabel** - Reusable label component with catalog number, title, description
2. **GeometricShape** - CSS-generated Bauhaus geometric elements
3. **AnimatedCounter** - Count-up animation for stats
4. **ScrollReveal** - Intersection Observer wrapper for reveal animations
5. **Accordion** - FAQ accordion with smooth animations
6. **Carousel** - Testimonial slider

---

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Page load sequence | CSS + JS | Staggered CSS animations triggered by JS on DOMContentLoaded | Medium |
| Hero text reveal | CSS | Character-by-character animation with CSS variables and delay | Medium |
| Smooth scroll | CSS | `scroll-behavior: smooth` on html | Low |
| Scroll-triggered reveals | Intersection Observer API | IO triggers CSS class addition for fade/slide animations | Medium |
| Museum label border draw | CSS | Height animation on pseudo-element | Low |
| Magnetic snap hover | CSS | Transform translate on hover with custom easing | Low |
| Geometric shape rotation | CSS | `@keyframes rotate` 60s linear infinite | Low |
| Parallax scrolling | JS | RequestAnimationFrame with scroll position | Medium |
| Timeline draw | CSS + JS | SVG stroke-dashoffset animation triggered by scroll | High |
| Counter animation | JS | requestAnimationFrame number interpolation | Medium |
| Accordion toggle | CSS | Height transition with max-height technique | Low |
| Carousel transitions | CSS + JS | Transform translateX with opacity fade | Medium |
| Button hover fills | CSS | Pseudo-element width animation | Low |
| Card lift effect | CSS | Transform translateY + box-shadow transition | Low |

---

## Animation Library Choices

### Primary: CSS Animations
- **Rationale**: Best performance, no external dependencies
- **Use for**: All hover states, scroll reveals, page load, transitions

### Secondary: Vanilla JavaScript
- **Rationale**: Fine-grained control for scroll-triggered animations
- **Use for**: Intersection Observer, parallax, counter animations

### Easing Functions
```css
--ease-glide: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-snap: cubic-bezier(0.4, 0, 0.2, 1);
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## Project File Structure

```
/
├── index.html          # Single-page structure, semantic HTML
├── styles.css          # All styles, CSS variables, animations
├── script.js           # Interactions, scroll animations, utilities
└── design.md           # Design reference
```

---

## Dependencies

### CDN Resources
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### No External JS Libraries
- Pure CSS + Vanilla JS for optimal performance
- Intersection Observer API (native)
- requestAnimationFrame (native)

---

## CSS Architecture

### Variables
```css
:root {
  /* Colors */
  --color-red: #D7263D;
  --color-yellow: #F4A900;
  --color-blue: #0055B8;
  --color-white: #FAFAF9;
  --color-card: #F5F5F3;
  --color-gray: #E8E8E6;
  --color-clay: #9A9A98;
  --color-ink: #1A1A1A;
  --color-soft: #333333;
  
  /* Typography */
  --font-primary: "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  
  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 64px;
  --space-xxl: 100px;
  
  /* Easing */
  --ease-glide: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-snap: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Key Classes
- `.museum-label` - Base label component
- `.reveal` - Scroll reveal base
- `.reveal.active` - Revealed state
- `.geometric-*` - Geometric shape variants
- `.btn-primary`, `.btn-secondary` - Button styles
- `.section-*` - Section-specific styles

---

## Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Mobile */
@media (max-width: 767px) { }
```

---

## Performance Considerations

1. **will-change**: Applied only to actively animating elements
2. **contain**: CSS containment for isolated sections
3. **Passive listeners**: All scroll/touch listeners passive
4. **Reduced motion**: Full support for `prefers-reduced-motion`
5. **Image optimization**: SVG/CSS for all graphics, no external images

---

## Accessibility

1. **Focus states**: Visible focus indicators on all interactive elements
2. **Color contrast**: WCAG AA compliance for all text
3. **Semantic HTML**: Proper heading hierarchy, landmarks
4. **ARIA labels**: For icon-only buttons and interactive elements
5. **Keyboard navigation**: Full tab navigation support
