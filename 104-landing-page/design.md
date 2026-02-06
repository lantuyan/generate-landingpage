# Design Document: Mindful Finance App Landing Page

## Part 1: Visual Design System

### Color Palette

**Primary Colors (Rare Sparks - Used Strategically)**
| Color | Value | Usage |
|-------|-------|-------|
| Bauhaus Red | `#D7263D` | CTA buttons, accent highlights, emotional insights |
| Mustard Yellow | `#F4A900` | Section dividers, key metrics, active states |
| Cobalt Blue | `#0055B8` | Links, secondary actions, data visualizations |

**Neutral Colors (Predominant Palette)**
| Color | Value | Usage |
|-------|-------|-------|
| Gallery White | `#FAFAF9` | Main background |
| Museum Card | `#F5F5F3` | Card backgrounds, module blocks |
| Placard Gray | `#E8E8E6` | Secondary backgrounds, dividers |
| Clay Gray | `#9A9A98` | Muted text, disabled states |
| Ink Black | `#1A1A1A` | Primary text, headings |
| Soft Black | `#333333` | Secondary text, body copy |

**Texture Colors**
| Color | Value | Usage |
|-------|-------|-------|
| Glaze Shadow | `rgba(0,0,0,0.05)` | Ceramic depth shadows |
| Glaze Highlight | `rgba(255,255,255,0.6)` | Ceramic light reflection |

### Typography System

**Font Families**
- **Headings**: `"Helvetica Neue", Helvetica, Arial, sans-serif` - Clinical precision, museum signage quality
- **Body**: `"Helvetica Neue", Helvetica, Arial, sans-serif` - Clean, highly legible
- **Labels/Meta**: `"IBM Plex Mono", monospace` - Museum catalog numbers, data points

**Type Scale**
| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Hero | 72px/56px mobile | 700 | 1.1 | -0.02em | Main headline |
| H1 | 48px/36px mobile | 700 | 1.2 | -0.01em | Section titles |
| H2 | 32px/28px mobile | 600 | 1.3 | 0 | Feature headings |
| H3 | 24px/20px mobile | 600 | 1.4 | 0 | Card titles |
| Body | 18px/16px mobile | 400 | 1.6 | 0 | Paragraphs |
| Label | 14px/12px mobile | 500 | 1.4 | 0.05em | Museum labels (uppercase) |
| Meta | 12px | 400 | 1.3 | 0.02em | Catalog numbers, captions |

### Spacing System

**Section Spacing**
| Type | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Section padding | 120px | 80px | 60px |
| Section gap | 0 (continuous scroll) | - | - |

**Content Spacing**
| Token | Value | Usage |
|-------|-------|-------|
| xs | 8px | Tight groupings |
| sm | 16px | Related elements |
| md | 24px | Component padding |
| lg | 40px | Section subsections |
| xl | 64px | Major divisions |
| xxl | 100px | Section breaks |

**Container**
- Max width: 1200px
- Padding: 24px (mobile) / 40px (desktop)

### Common Components

#### Museum Label (Primary UI Element)
```
Structure: [Catalog Number] + [Title] + [Description]
Style:
- Catalog Number: Mono font, Clay Gray, uppercase
- Title: Bold, Ink Black
- Description: Body text, Soft Black
- Left border: 2px solid Mustard Yellow or Cobalt Blue
- Padding: 24px
- Background: Museum Card with subtle ceramic texture
```

#### Buttons
**Primary CTA (Red Spark)**
- Background: Bauhaus Red
- Text: white, 16px, weight 600
- Padding: 16px 32px
- Border radius: 0 (sharp Bauhaus corners)
- Hover: Darken 10%, subtle lift shadow

**Secondary CTA**
- Background: transparent
- Border: 2px solid Ink Black
- Text: Ink Black
- Hover: Background fills with Ink Black, text white

**Tertiary (Link)**
- Text: Cobalt Blue
- Underline on hover
- Arrow indicator (→) that shifts right on hover

#### Cards/Modules
- Background: Museum Card (#F5F5F3)
- Border: none or 1px solid Placard Gray
- Shadow: subtle ceramic glaze depth
- Sharp corners (Bauhaus geometry)
- Padding: 32px

#### Geometric Dividers
- 45° diagonal blocks using CSS clip-path
- Color blocks for section transitions
- Size: 80px height

---

## Part 2: Global Animations & Interactions

### Page Load Animation Sequence
1. **Ceramic texture fade-in** (0-400ms): Background texture opacity 0→1
2. **Hero headline reveal** (200-800ms): Split text animation, characters slide up from 30px below
3. **Hero subtext fade** (600-1000ms): Opacity 0→1, translateY 20px→0
4. **Primary CTA emergence** (800-1200ms): Scale 0.9→1, opacity 0→1
5. **Museum label decoration** (1000-1400ms): Left border draws from top to bottom

### Smooth Scroll Behavior (Glide Rhythm)
- Native smooth scroll: `scroll-behavior: smooth`
- Scroll-triggered reveals use Intersection Observer
- Parallax on geometric background elements (subtle, 0.1x rate)

### Scroll-Triggered Reveal Animations
**Standard Module Reveal**
- Trigger: Element enters viewport (threshold 0.2)
- Animation: translateY 40px→0, opacity 0→1
- Duration: 600ms
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` (smooth glide)
- Stagger: 100ms between sibling elements

**Museum Label Reveal**
- Trigger: Element enters viewport
- Animation sequence:
  1. Left border draws: height 0→100% (400ms)
  2. Content fades in: opacity 0→1 (300ms, delay 200ms)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

**Geometric Block Animation**
- Trigger: Scroll position
- Animation: Blocks slide in from edges
- Duration: 800ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (magnetic snap)

### Magnetic Snap Interactions
**Hover States**
- Duration: 250ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

**Button Hover**
- Primary: Transform translateY(-2px), box-shadow increases
- Secondary: Background fill animation (left to right)

**Card Hover**
- Subtle lift: translateY(-4px)
- Shadow deepens (ceramic glaze depth effect)
- Border color intensifies

**Link Hover**
- Arrow shifts right 4px
- Underline draws from left

### Performance Optimizations
- Use `transform` and `opacity` only for animations
- Add `will-change: transform, opacity` on animated elements
- Respect `prefers-reduced-motion` media query

---

## Part 3: Content Sections

### Section: Navigation (Fixed Header)

**Layout & Style**
- Position: Fixed, top: 0, full width
- Background: Gallery White with 95% opacity + backdrop blur
- Height: 72px
- Z-index: 1000
- Border-bottom: 1px solid Placard Gray
- Container: max-width 1200px, centered

**Content**
- Logo: "MINDFUL" (wordmark, bold, Ink Black) + small red square dot
- Nav items: Features, Method, Insights, Download
- CTA: "Start Free" (Primary button style, compact)

**Interactions**
- Nav links: Underline draws from center on hover (300ms)
- Logo: Subtle pulse on hover
- Scroll behavior: Background opacity increases to 100% after 100px scroll

---

### Section: Hero

**Layout & Style**
- Full viewport height (100vh)
- Background: Gallery White with subtle ceramic texture overlay
- Grid: Asymmetric Bauhaus layout
  - Left column (60%): Main headline, subtext, CTA
  - Right column (40%): Abstract geometric composition
- Geometric elements: Overlapping squares and circles in muted colors
- Museum label positioned bottom-left: "Exhibit 01 / Introduction"

**Content**
- Catalog Label: "EXHIBIT 01"
- Headline: "Money is Emotional"
- Subheadline: "Discover the hidden patterns between your mood and your spending. Build a healthier relationship with money through mindful awareness."
- CTA Primary: "Begin Your Journey"
- CTA Secondary: "View Methodology"
- Museum placard: "A new approach to personal finance that honors the psychological reality of spending."

**Interactions**
- Hero headline: Character-by-character reveal on load (stagger 30ms per char)
- Geometric shapes: Slow continuous rotation (60s per revolution) + parallax on scroll
- CTA buttons: Magnetic snap hover effect
- Scroll indicator at bottom: Gentle bounce animation (infinite)

**Images**
- Abstract geometric composition (CSS-generated, no image needed)

---

### Section: The Pattern Gallery (Features)

**Layout & Style**
- Background: Museum Card (#F5F5F3)
- Padding: 120px 0
- Grid: Modular tile layout (Bauhaus-inspired)
  - Large feature tile (spans 2 rows): Left side
  - 4 smaller tiles: Right side (2x2 grid)
- Gap: 24px
- Each tile has museum label format

**Content**
- Section Label: "EXHIBIT 02 / THE PATTERNS"
- Section Title: "Six Signals of Emotional Spending"

**Tile 1 (Large): Stress Spending**
- Catalog: "02-A"
- Title: "Stress Spending"
- Description: "Purchases made during high-cortisol moments, often followed by regret."
- Stat: "73% of impulse buys occur under stress"
- Visual: Abstract wave pattern (CSS)

**Tile 2: Celebration Splurge**
- Catalog: "02-B"
- Title: "Celebration Splurge"
- Description: "Reward-based purchases that feel earned but may exceed means."

**Tile 3: Boredom Browsing**
- Catalog: "02-C"
- Title: "Boredom Browsing"
- Description: "Mindless scrolling transformed into mindless spending."

**Tile 4: Social Comparison**
- Catalog: "02-D"
- Title: "Social Comparison"
- Description: "Purchases driven by FOMO and the need to keep up."

**Tile 5: Retail Therapy**
- Catalog: "02-E"
- Title: "Retail Therapy"
- Description: "Attempting to purchase happiness, one transaction at a time."

**Interactions**
- Tiles: Magnetic snap hover (lift + shadow)
- Tiles reveal with stagger on scroll (100ms delay each)
- Catalog numbers: Mono font animates (count-up effect on reveal)
- Click: Tile expands (if implemented) or subtle pulse

---

### Section: The Method (How It Works)

**Layout & Style**
- Background: Gallery White
- Padding: 120px 0
- Layout: Horizontal scroll or stacked timeline
- Timeline: Vertical line connecting steps
- Each step: Number (large, outlined) + Museum label

**Content**
- Section Label: "EXHIBIT 03 / METHODOLOGY"
- Section Title: "The Practice of Money Mindfulness"

**Step 1: Observe**
- Number: "01"
- Title: "Observe Without Judgment"
- Description: "We track your spending alongside your emotional state, building a picture of your unique patterns."

**Step 2: Reflect**
- Number: "02"
- Title: "Reflect on Patterns"
- Description: "Weekly insights reveal the connections between your mood and your wallet."

**Step 3: Respond**
- Number: "03"
- Title: "Respond With Intention"
- Description: "Gentle nudges help you pause during high-risk moments, creating space for choice."

**Step 4: Grow**
- Number: "04"
- Title: "Grow Your Awareness"
- Description: "Over time, financial decisions become conscious acts aligned with your values."

**Interactions**
- Timeline draws as user scrolls (SVG path animation)
- Steps reveal in sequence as scroll progresses
- Numbers: Scale pulse on reveal
- Connecting line: Mustard Yellow, animates stroke-dashoffset

---

### Section: The Insight Dashboard (App Preview)

**Layout & Style**
- Background: Placard Gray (#E8E8E6)
- Padding: 120px 0
- Grid: Two columns
  - Left: App interface mockup (CSS-styled)
  - Right: Feature labels (museum style)
- Mockup: Phone frame with app screens

**Content**
- Section Label: "EXHIBIT 04 / THE INTERFACE"
- Section Title: "Clarity in Every Glance"

**App Features (labeled)**
1. "Mood Map" - Visual correlation between emotions and spending
2. "Pattern Recognition" - AI-powered insights about your triggers
3. "Mindful Pause" - Breathing exercises before high-risk purchases
4. "Progress Garden" - Visual growth representing financial wellness

**Interactions**
- Phone mockup: Subtle float animation (up/down 10px, 4s cycle)
- App screens: Auto-advance carousel (5s interval)
- Feature labels: Highlight when corresponding screen shows
- Parallax: Phone moves slower than background on scroll

**Images**
- Phone mockup: CSS-generated
- App screens: Abstract data visualizations (CSS)

---

### Section: Testimonials (Voices)

**Layout & Style**
- Background: Gallery White
- Padding: 120px 0
- Layout: Horizontal slider or grid of quote cards
- Cards: Museum label style with quote
- Accent: Bauhaus Red for quotation marks

**Content**
- Section Label: "EXHIBIT 05 / TESTIMONIES"
- Section Title: "Stories of Transformation"

**Quote 1**
- Quote: "I finally understand why I spend. It's not about the money—it's about the moment."
- Attribution: "Sarah K., Member since 2024"
- Catalog: "T-2847"

**Quote 2**
- Quote: "The app doesn't judge my coffee habit. It just helps me notice when I'm buying my third cup because I'm stressed."
- Attribution: "Marcus T., Member since 2023"
- Catalog: "T-2848"

**Quote 3**
- Quote: "For the first time, I feel like my finances and my feelings can coexist peacefully."
- Attribution: "Elena R., Member since 2024"
- Catalog: "T-2849"

**Interactions**
- Cards: Magnetic snap hover
- Quote marks: Scale animation on card hover
- Carousel: Auto-advance with manual controls
- Transition: Fade + slide (500ms)

---

### Section: Pricing (Investment)

**Layout & Style**
- Background: Museum Card (#F5F5F3)
- Padding: 120px 0
- Grid: Three pricing cards, center one highlighted
- Cards: Clean, sharp corners, museum label at top

**Content**
- Section Label: "EXHIBIT 06 / INVESTMENT"
- Section Title: "Choose Your Practice"

**Plan 1: Observer**
- Price: "Free"
- Features:
  - Basic expense tracking
  - Weekly mood check-ins
  - Monthly pattern summary
- CTA: "Begin Free"

**Plan 2: Practitioner (Featured)**
- Price: "$9/month"
- Badge: "Most Popular"
- Features:
  - Everything in Observer
  - Real-time emotional spending alerts
  - Advanced pattern insights
  - Mindful pause exercises
  - Export data
- CTA: "Start Practicing"

**Plan 3: Guide**
- Price: "$19/month"
- Features:
  - Everything in Practitioner
  - 1:1 financial wellness coaching
  - Custom mindfulness exercises
  - Family account (up to 4)
- CTA: "Elevate Your Practice"

**Interactions**
- Featured card: Slight scale (1.02) and elevated shadow
- Price: Count-up animation on scroll reveal
- Feature list: Stagger fade-in
- CTA: Primary hover effects
- Background: Subtle geometric pattern (CSS)

---

### Section: FAQ

**Layout & Style**
- Background: Gallery White
- Padding: 120px 0
- Layout: Two-column grid of accordion items
- Accordion: Clean lines, museum label aesthetic

**Content**
- Section Label: "EXHIBIT 07 / INQUIRIES"
- Section Title: "Common Questions"

**Q1**: "Is my financial data secure?"
**A1**: "Absolutely. We use bank-level encryption and never sell your data. Your financial life is private, period."

**Q2**: "Do you connect to my bank accounts?"
**A2**: "Yes, with your permission. We use Plaid to securely connect to over 10,000 financial institutions. Read-only access means we can't move your money."

**Q3**: "What if I'm not good at tracking my emotions?"
**A3**: "That's exactly why we built this. Start simple—just note whether you're feeling positive, neutral, or negative. The app guides you to deeper awareness over time."

**Q4**: "Can I use this with my existing budget app?"
**A4**: "Many members do. We focus on the emotional layer that other apps miss. Use us alongside your favorite budgeting tool for complete awareness."

**Interactions**
- Accordion: Smooth height transition (300ms)
- Plus icon: Rotates 45° to become X when open
- Content: Fade in when expanded
- Hover: Subtle background shift

---

### Section: CTA / Final Call

**Layout & Style**
- Background: Bauhaus Red (rare spark - full bleed)
- Padding: 160px 0
- Layout: Centered, minimal
- Text: White on red
- Geometric accent: Large circle partially off-screen

**Content**
- Headline: "Your Money, Your Mind, Your Journey"
- Subheadline: "Begin building a conscious relationship with your finances today."
- CTA: "Download Free" (White button on red)
- Secondary: Available on iOS and Android

**Interactions**
- Background: Subtle parallax shift on scroll
- Geometric circle: Slow rotation (continuous)
- CTA: Invert colors on hover (red text on white)
- Text reveal: Fade up on scroll

---

### Section: Footer

**Layout & Style**
- Background: Ink Black (#1A1A1A)
- Padding: 80px 0 40px
- Text: White and Clay Gray
- Grid: 4 columns (logo/about, product, company, connect)
- Border-top: None (contrast with CTA section)

**Content**
**Column 1: Brand**
- Logo: "MINDFUL" (white) + red dot
- Tagline: "Financial awareness for emotional beings."
- Copyright: "© 2024 Mindful Finance. All rights reserved."

**Column 2: Product**
- Features, Pricing, Security, Download

**Column 3: Company**
- About, Blog, Careers, Press

**Column 4: Connect**
- Twitter, Instagram, LinkedIn icons
- Contact: hello@mindful.finance

**Interactions**
- Links: Opacity 0.7 → 1 on hover
- Logo: Subtle glow on hover
- Social icons: Scale 1.1 on hover

---

## Implementation Notes

1. **Bauhaus Geometric Elements**: Use CSS shapes (squares, circles, triangles) with clip-path for authentic geometric aesthetic
2. **Ceramic Texture**: Create subtle SVG noise pattern or gradient overlay for depth
3. **Museum Labels**: Consistent left-border accent, mono font for catalog numbers
4. **Rare Sparks**: Use red, yellow, blue ONLY for CTAs, key insights, and accent moments
5. **Glide Scrolling**: Ensure smooth scroll behavior throughout, no jarring transitions
6. **Magnetic Snap**: All interactive elements should feel precise and satisfying
