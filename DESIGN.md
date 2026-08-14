# Teron — Design System & Motion Spec

> **Last updated:** 2026-08-04
> **Status:** Phase 1 — Active Development
> **Benchmark:** Clerk, Vercel, Linear, Stripe dashboards

---

## Visual Direction

Premium, minimal, **dark theme with yellow accents**. The product must feel like premium software first, and a crypto product second. No neon gradients, no generic rocket/moon iconography, no stock crypto templates.

Direct inspiration from:
- **Clerk** — clean surfaces, sophisticated dark mode, restrained use of color
- **Vercel** — sharp typography, precise spacing, minimal decoration
- **Linear** — fluid motion, consistent density, professional feel
- **Stripe** — premium gradients, excellent information hierarchy, trustworthy aesthetic

---

## Color Tokens

All colors defined as CSS custom properties in `globals.css` via Tailwind v4 `@theme inline`.

### Background Layers
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#09090b` | Page background (zinc-950) |
| `--color-bg-secondary` | `#111113` | Slightly elevated surfaces |
| `--color-bg-tertiary` | `#18181b` | Cards, panels (zinc-900) |

### Surface Layers
| Token | Value | Usage |
|-------|-------|-------|
| `--color-surface-primary` | `#1c1c20` | Card backgrounds |
| `--color-surface-secondary` | `#222226` | Hovered cards, active panels |
| `--color-surface-tertiary` | `#2a2a2e` | Nested surfaces, table rows |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-primary` | `#27272a` | Default borders (zinc-800) |
| `--color-border-secondary` | `#3f3f46` | Emphasized borders (zinc-700) |
| `--color-border-focus` | `#facc15` | Focus ring color (yellow accent) |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#fafafa` | Primary text (zinc-50) |
| `--color-text-secondary` | `#a1a1aa` | Secondary text (zinc-400) |
| `--color-text-tertiary` | `#71717a` | Muted text (zinc-500) |
| `--color-text-disabled` | `#52525b` | Disabled text (zinc-600) | 

### Yellow Accent (Single Accent Color)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#facc15` | Primary actions, highlights (yellow-400) |
| `--color-accent-hover` | `#fbbf24` | Hover state (yellow-400 lighter) |
| `--color-accent-active` | `#f59e0b` | Active/pressed state (amber-500) |
| `--color-accent-disabled` | `#854d0e80` | Disabled state (yellow-800 @ 50%) |
| `--color-accent-subtle` | `#facc1510` | Subtle backgrounds (yellow @ 6%) |
| `--color-accent-text` | `#422006` | Text on yellow backgrounds (yellow-950) |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#22c55e` | Success states (green-500) |
| `--color-error` | `#ef4444` | Error states (red-500) |
| `--color-warning` | `#f59e0b` | Warning states (amber-500) |
| `--color-info` | `#3b82f6` | Info states (blue-500) |

---

## Typography

### Font Family
- **Primary:** Inter (loaded via `next/font/google`)
- **Monospace:** JetBrains Mono (for contract addresses, hashes, code)

### Weight Scale
| Weight | Token | Usage |
|--------|-------|-------|
| 400 | Regular | Body text |
| 500 | Medium | Labels, navigation, secondary headings |
| 600 | Semibold | Headings, buttons, emphasized text |
| 700 | Bold | Hero headings, key numbers |

### Size Scale
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Captions, badges |
| `text-sm` | 14px | 20px | Body small, table cells |
| `text-base` | 16px | 24px | Body default |
| `text-lg` | 18px | 28px | Section headings |
| `text-xl` | 20px | 28px | Card headings |
| `text-2xl` | 24px | 32px | Page headings |
| `text-3xl` | 30px | 36px | Major headings |
| `text-4xl` | 36px | 40px | Hero secondary |
| `text-5xl` | 48px | 48px | Hero primary |

### Rules
- Body text: `text-base`, `font-regular`, `text-secondary` for descriptions
- Headings: `font-semibold` or `font-bold`, `text-primary`
- Monospace: Contract addresses, tx hashes, code snippets only
- Letter spacing: -0.01em for headings ≥ `text-2xl`, normal for body

---

## Spacing Scale

Use Tailwind's default spacing scale. Key values:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight inline spacing |
| `2` | 8px | Compact element gaps |
| `3` | 12px | Standard inline padding |
| `4` | 16px | Standard padding |
| `5` | 20px | Card padding (compact) |
| `6` | 24px | Card padding (standard) |
| `8` | 32px | Section gaps |
| `10` | 40px | Major section gaps |
| `12` | 48px | Page section gaps |
| `16` | 64px | Hero padding |
| `20` | 80px | Large page sections |

---

## Border Radius Scale

Restrained, not oversized. Avoids the "cheap" look of overly rounded elements.

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, small elements |
| `rounded` | 6px | Buttons, inputs, selects |
| `rounded-md` | 8px | Cards, panels |
| `rounded-lg` | 12px | Modals, large cards |
| `rounded-xl` | 16px | Hero sections, featured cards |
| `rounded-full` | 9999px | Avatars, pill badges, circle buttons |

---

## Grid System

### Responsive 12-Column Grid
| Breakpoint | Min Width | Columns | Gutter | Container Max |
|------------|-----------|---------|--------|---------------|
| `sm` | 640px | 4 | 16px | 640px |
| `md` | 768px | 8 | 24px | 768px |
| `lg` | 1024px | 12 | 24px | 1024px |
| `xl` | 1280px | 12 | 32px | 1280px |
| `2xl` | 1536px | 12 | 32px | 1440px |

### Layout Patterns
- **Landing page:** Full-width with max-w container
- **App pages:** Sidebar (w-64) + main content area
- **Admin pages:** Sidebar (w-64) + main content area
- **Public token page:** Single column, centered, max-w-4xl
- **Wizard:** Centered, max-w-2xl, step indicators at top

---

## Component Inventory

### Buttons
| Variant | Description | States |
|---------|-------------|--------|
| Primary | Yellow accent background, dark text | default, hover, active, disabled, loading |
| Secondary | Transparent with border | default, hover, active, disabled |
| Ghost | No background, no border | default, hover, active |
| Danger | Red background for destructive actions | default, hover, active, disabled |
| Icon | Square button for icon-only actions | default, hover, active |

Sizes: `sm` (32px h), `md` (40px h), `lg` (48px h)

### Inputs
| Type | States |
|------|--------|
| Text | default, focused, error, disabled |
| Textarea | default, focused, error, disabled |
| Number | default, focused, error, disabled |
| File/Upload | default, dragover, uploading, uploaded, error |

All inputs: dark surface background, subtle border, yellow focus ring, error state with red border + message below.

### Select
Custom styled select with dropdown. States: default, open, focused, error, disabled.

### Modals
- Centered overlay with backdrop blur
- Header, body, footer sections
- Close button (top-right)
- Escape to close, click-outside to close
- Enter/exit animation (scale + fade)

### Toasts
- Bottom-right position
- Variants: success (green), error (red), warning (amber), info (blue)
- Auto-dismiss after 5s (configurable)
- Enter from right, exit to right

### Cards
- Surface background with subtle border
- Optional header, body, footer
- Hover state (slightly elevated border or background change)

### Tables
- Zebra-striped rows (alternating surface colors)
- Sortable column headers
- Pagination controls
- Empty state component
- Loading skeleton

### Wizard / Stepper
- Horizontal step indicator at top
- Step numbers with labels
- Active step: yellow accent
- Completed step: checkmark, yellow
- Upcoming step: muted
- Animated transitions between steps (slide left/right)

### Badges
- Variants: default (zinc), accent (yellow), success (green), error (red), warning (amber)
- Sizes: `sm`, `md`
- Pill shape (`rounded-full`)

### Tooltips
- Dark background, light text
- Arrow pointing to trigger
- Delay: 300ms show, immediate hide

### Empty States
- Centered illustration/icon
- Title + description
- Optional action button

### Loading States
- Skeleton loaders matching content layout
- Pulse animation
- Never show a blank/white flash

### Error States
- Error icon
- Title + description of what went wrong
- Retry action where applicable

---

## Motion Principles

Using the `motion` package from motion.dev. Import path: `motion/react`.

### What Animates
| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transitions | Fade + slight Y translate | 200ms | ease-out |
| Wizard step transitions | Slide left/right + fade | 300ms | ease-in-out |
| Modal enter | Scale from 0.95 + fade in | 200ms | ease-out |
| Modal exit | Scale to 0.95 + fade out | 150ms | ease-in |
| Toast enter | Slide from right + fade in | 300ms | spring (stiffness: 500, damping: 30) |
| Toast exit | Slide to right + fade out | 200ms | ease-in |
| Hover micro-interactions | Scale 1.02 or background shift | 150ms | ease-out |
| Skeleton loading | Pulse (opacity 0.4 ↔ 1) | 1500ms | ease-in-out, infinite |
| Button press | Scale 0.97 | 100ms | ease-out |
| Card hover | Border color transition | 200ms | ease-out |
| Dropdown open | Scale Y from 0.95 + fade | 150ms | ease-out |

### Easing Standards
- **ease-out:** `[0, 0, 0.2, 1]` — for entering elements
- **ease-in:** `[0.4, 0, 1, 1]` — for exiting elements
- **ease-in-out:** `[0.4, 0, 0.2, 1]` — for continuous animations
- **spring:** `{ type: "spring", stiffness: 500, damping: 30 }` — for bouncy, physical-feeling motions

### Reduced Motion
When `prefers-reduced-motion` is set:
- Disable all translate/scale animations
- Keep opacity transitions (reduced to 100ms)
- Disable spring physics
- Keep loading indicators (essential for UX)

---

## Icon Usage

### Library
**Hugeicons Stroke Rounded** exclusively, via `@hugeicons/react`.

### Sizing Scale
| Size | Value | Usage |
|------|-------|-------|
| `xs` | 16px | Inline with small text |
| `sm` | 20px | Buttons (sm), badges |
| `md` | 24px | Default icon size, buttons (md) |
| `lg` | 32px | Section headers, empty states |
| `xl` | 48px | Hero sections, large empty states |

### Rules
- Consistent stroke width (1.5px default)
- Always use `currentColor` for fill/stroke to inherit text color
- Never mix icon libraries
- Descriptive import names (e.g., `Wallet02Icon`, `ArrowRight01Icon`)

---

## Accessibility Baseline

### Contrast Ratios
- Body text on dark background: minimum 4.5:1
- Large text (≥18px): minimum 3:1
- Interactive elements: minimum 3:1 against adjacent colors
- Yellow accent on dark: passes AA for large text; use dark text on yellow backgrounds for body

### Focus States
- Visible focus ring: 2px solid yellow accent, 2px offset
- Never remove focus outlines
- Tab order follows visual order

### Keyboard Navigation
- Wizard: Tab through fields, Enter to advance, Escape to go back
- Modals: Focus trapped inside, Escape to close, Tab cycles through modal elements
- Dropdowns: Arrow keys to navigate, Enter to select, Escape to close
- Tables: Tab through interactive cells

### Screen Reader Support
- All interactive elements have accessible labels
- Icons paired with text or `aria-label`
- Form fields associated with labels
- Error messages linked to inputs via `aria-describedby`
- Dynamic content updates announced via `aria-live` regions

### Other
- All images have meaningful `alt` text
- Color is never the only way to convey information (icons/text accompany color states)
- Touch targets: minimum 44×44px on mobile
