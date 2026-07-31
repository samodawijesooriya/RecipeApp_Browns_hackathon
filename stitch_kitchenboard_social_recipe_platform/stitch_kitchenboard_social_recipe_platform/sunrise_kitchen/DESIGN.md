---
name: Sunrise Kitchen
colors:
  surface: '#fdf8f7'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f1'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e0'
  on-surface: '#1c1b1b'
  on-surface-variant: '#474741'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#787770'
  outline-variant: '#c8c7be'
  surface-tint: '#5f5e5b'
  primary: '#5f5e5b'
  on-primary: '#ffffff'
  primary-container: '#faf7f2'
  on-primary-container: '#72716d'
  inverse-primary: '#c8c6c2'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#615d5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#fdf6f7'
  on-tertiary-container: '#757071'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2dd'
  primary-fixed-dim: '#c8c6c2'
  on-primary-fixed: '#1c1c19'
  on-primary-fixed-variant: '#474743'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e7e1e2'
  tertiary-fixed-dim: '#cbc5c6'
  on-tertiary-fixed: '#1d1b1c'
  on-tertiary-fixed-variant: '#494647'
  background: '#fdf8f7'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  handwritten-note:
    fontFamily: Bricolage Grotesque
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style
The design system is built around the "Cozy Kitchen at Sunrise" narrative. It targets home cooks and food enthusiasts who value the ritual of cooking as much as the result. The UI evokes a sense of warmth, morning optimism, and the tactile comfort of a physical kitchen.

The style is a sophisticated hybrid of **Modern Minimalism** and **Tactile Skeuomorphism**. It leverages the precision and whitespace of premium software while integrating physical metaphors—sticky notes, magnets, and paper textures—to create a "handmade" digital corkboard. The emotional response is nostalgic yet highly functional, avoiding corporate coldness in favor of a soft, welcoming atmosphere.

## Colors
The palette is inspired by the soft, diffused light of a kitchen at dawn. 

- **Foundation:** The Primary Background (#FAF7F2) provides a creamy, non-clinical base, while Warm White (#FFFFFF) is used for elevated cards and surfaces to create subtle "paper-on-table" contrast.
- **Accents:** A collection of pastels is used to categorize recipes or tag content, mimicking the variety of post-it notes or ceramic dishware.
- **Typography:** Dark Brown (#4A403A) replaces traditional black to maintain warmth and reduce eye strain, ensuring high readability without the harshness of high-contrast digital interfaces.
- **Textures:** Light wood and paper textures should be applied as subtle overlays (2-5% opacity) on large background areas to break up flat digital planes.

## Typography
The typographic system balances utilitarian clarity with expressive personality.

- **Functional Text:** Inter is the workhorse font, used for all instructions, ingredients, and navigation. It provides the "Apple-quality" precision expected of a modern SaaS.
- **Expressive Accents:** Bricolage Grotesque is utilized for titles on sticky notes and short annotations. Its quirky, characterful nature provides the "handwritten" feel while maintaining better accessibility and rendering consistency than traditional script fonts.
- **Scale:** High-level headers use tight tracking and bold weights to anchor sections, while body text uses generous line-height to ensure recipes are easy to follow while cooking.

## Layout & Spacing
The layout follows an **Organic Fluid Grid**. While global navigation and core containers align to a standard 12-column grid, individual content pieces (like recipe cards or notes) should feature "imperfect" positioning.

- **The "Tossed" Effect:** Apply slight CSS rotations (between -2deg and +2deg) to sticky-note components to simulate items pinned to a board.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **Responsive Behavior:** On mobile, rotations are reduced to 0 to maximize screen real estate and touch accuracy. Desktop layouts should use wide margins (64px) to create a spacious, editorial feel.

## Elevation & Depth
This design system uses depth to simulate physical layering. 

- **Sticky Note Shadows:** Use multi-layered shadows. A sharp, low-opacity shadow for the top edge and a deep, diffused shadow for the bottom right corner creates the illusion of a paper curling off the surface.
- **Glassmorphism:** Use for persistent navigation bars and overlay modals. Apply a `backdrop-filter: blur(12px)` with a semi-transparent white tint to simulate frosted glass containers sitting on the kitchen counter.
- **Objects:** Magnets and paper clips are treated as high-elevation elements with tighter, darker shadows to appear "on top" of the paper layers.

## Shapes
The shape language is soft and approachable. 

- **Primary Radius:** Use a base radius of 18px-24px for all cards and primary containers.
- **Interactive Elements:** Buttons and input fields should use a slightly smaller radius (12px) to differentiate them from static cards.
- **Organic Variation:** For recipe images, consider using very subtle blob-like masks or slightly irregular corner radii (e.g., 24px, 20px, 28px, 22px) to enhance the handmade aesthetic.

## Components
- **Sticky Notes:** Square containers using the Pastel palette colors. They must feature a "tape" or "magnet" element at the top center. Titles use the `handwritten-note` style.
- **Buttons:** Primary buttons use the Accent Green (#4CAF50) with white text for "Commit" actions (Save, Post). They should have a subtle 3D lift effect on hover rather than a color change.
- **Input Fields:** Styled like ruled notebook paper with horizontal light grey lines. The focus state is a soft yellow glow.
- **Cards (Recipe):** High-quality imagery with the bottom 30% of the card featuring a glassmorphic blur to house the title and author.
- **Decorations:** Use SVG assets of coffee stains (low opacity #4A403A) and paper-clip icons sparsely to anchor floating elements or "pin" images to the background.