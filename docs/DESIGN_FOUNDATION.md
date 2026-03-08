# Design Foundation

Canonical site-wide visual baseline for the Anastasia Nikolskaya project.
All rules below apply across every page unless overridden by page-level rules (see `HOMEPAGE_RULES.md`).

---

## Color Palette

All tokens are defined in `src/styles/global.css` via the Tailwind 4 `@theme` block.

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#694671` | CTA buttons, links, active states |
| `--color-primary-dark` | `#553A5C` | Hover states, derived accents |
| `--color-dark` | `#281F1D` | Headings, strong text |
| `--color-text-body` | `#60514F` | Body copy |
| `--color-bg-light` | `#FBF8F2` | Main page background (body) |
| `--color-bg-cream` | `#EEEBE4` | Distinct section backgrounds |
| `--color-border` | `#E7DBD5` | Soft borders, card borders |
| `--color-border-strong` | `#E8E4DD` | Stronger structural borders |
| `--color-card-fill` | `#FFFDFA` | Card and panel surfaces |
| `--color-secondary` | `#E4D1DD` | Pills, chips, soft accents |
| `--color-secondary-fg` | `#423644` | Text on secondary elements |
| `--color-accent` | `#DBA8AF` | Dusty rose, rare decorative |
| `--color-ring` | `#86628F` | Focus ring, selected state ring |

Body background: `var(--color-bg-light)` (#FBF8F2).

---

## Typography

**Fonts:** Lora 700 (serif headings) + Inter 400/600 (body sans-serif).
Self-hosted WOFF2 with Cyrillic + Latin subsets.

| Element | Desktop | Mobile | Line Height | Letter Spacing |
|---|---|---|---|---|
| `h1` | 52px | 30px | 1.15 | -0.025em |
| `h2` | 40px | 26px | 1.2 | -0.015em |
| `h3` | 28px | 22px | 1.25 | — |
| `body` | 17px | 16px | 1.5 | — |

All headings: `font-family: var(--font-heading)`, `font-weight: 700`, `color: var(--color-dark)`.

---

## Radius System

| Element | Radius |
|---|---|
| Buttons (`.btn`) | `9999px` (pill) |
| Cards (`.card`) | `16px` |
| Images (hero, CTA) | `16px` (`rounded-2xl`) |
| Skip link | `8px` |
| Mobile menu links | `8px` (`rounded-lg`) |
| Language toggle | `9999px` (pill) |

---

## Spacing Rhythm

### Section spacing (`.section`)

| | Desktop | Mobile |
|---|---|---|
| Padding top | 96px | 72px |
| Padding bottom | 96px | 72px |

### Container

- Max width: `1170px`
- Horizontal padding: `20px` mobile, `30px` desktop

---

## Button System

All buttons use the `.btn` base class.

```
.btn {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
  padding: 14px 24px;
  border-radius: 9999px;
  border: 2px solid transparent;
  transition: all 0.2s;
}
```

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `.btn-primary` | `--color-primary` | `#FAF8F5` | `--color-primary` | darker + box-shadow |
| `.btn-secondary` | transparent | `--color-dark` | `--color-border` | `--color-bg-cream` fill |

For larger CTAs (Hero, FinalCta), use Tailwind responsive utilities `md:py-6 md:px-8` on the element directly instead of a global class — Tailwind 4 strips custom class media query overrides.

---

## Card Treatment

```
.card {
  background: var(--color-card-fill);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
```

Large cards (reviews, pricing) may override padding to `p-8` (32px) locally.

---

## Section Heading Pattern

Standard pattern for content sections:

1. `.label-uppercase` — 12px, 600 weight, 2px letter-spacing, uppercase, `--color-primary-dark`
2. `h2` — centered or left-aligned per section
3. Content below with `mb-12` to `mb-14` gap from heading

---

## Image Treatment

- Hero and FinalCta images: `rounded-2xl`
- All images: `loading="lazy"` except hero (`loading="eager"`)
- Hero image: `aspect-[4/5] object-cover object-top`

---

## Sticky Header

- `sticky top-0 z-40`
- Background: `bg-white/95 backdrop-blur-sm`
- Bottom border: `border-b border-[var(--color-border)]`
- Height: `h-16` mobile, `h-20` desktop
- Desktop nav breakpoint: `xl` (1280px) — not `lg` (1024px). Russian nav labels require 1280px+ to fit with booking CTA pill.
- Nav gap: `gap-3`, nav text: `13px`, links use `whitespace-nowrap`
- Contains: logo, nav links (5 items), booking CTA pill, language toggle
- Mobile/tablet (<1280px): hamburger menu with full-width booking CTA at top

---

## Focus / Accessibility

- `:focus-visible` ring: `2px solid var(--color-ring)` (#86628F), offset 2px
- Skip link: positioned offscreen, appears on focus
- All interactive elements have minimum 44px touch targets on mobile
- Language toggle has `aria-label` for screen readers

---

## What Is Global

These rules propagate to ALL pages automatically via `global.css`:

- Color tokens
- Typography scale
- Button system
- Card system
- Section spacing
- Container width
- Focus styles
- Header behavior

Page-specific overrides (like homepage section order or hero composition) belong in their respective component files, not in `global.css`.
