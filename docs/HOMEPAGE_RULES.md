# Homepage Rules

Homepage-only structural and compositional rules for `ru/index.astro` and `en/index.astro`.
These rules do NOT propagate to inner pages.

---

## Section Order (8 sections)

```
1. Hero          → bg-[var(--color-bg-cream)]
2. RouteSelector → bg-white
3. WhoThisIsFor  → bg-[var(--color-bg-cream)]
4. WhyChoose     → bg-white
5. SafetyProcess → bg-[var(--color-bg-cream)]
6. OfferLadder   → bg-white
7. Reviews       → bg-[var(--color-bg-cream)]
8. FinalCta      → bg-white
```

Background rhythm: alternating cream / white.

### Removed from homepage (component files preserved)

- `TrustStrip` — absorbed into Hero trust pills
- `ThreeSteps` — removed for conciseness
- `FaqSection` — accessible via inner FAQ page
- `BlogPreview` — accessible via inner blog page

---

## Hero Composition

- **Layout:** two-column, text left (50%), image right (50%)
- **Gap:** `gap-10 lg:gap-16`
- **Padding top:** 96px desktop, 64px mobile (custom, no bottom padding)
- **Image:** `rounded-2xl`, `aspect-[4/5]`, `object-cover object-top`, `loading="eager"`
- **Trust signals:** 4 pill tags (not dot items), using `--color-secondary` background, `rounded-full`
  - RU: "Самара и онлайн", "Сертифицированный тренер", "До и после родов", "Безопасный подход"
  - EN: "Samara & online", "Certified trainer", "Prenatal & postpartum", "Safe personal approach"
- **CTAs:** BookingCta (primary, `md:py-6 md:px-8`) + secondary link to formats-pricing (`md:py-6 md:px-8`)
- **Mobile:** text first, image below (natural flex-col order)

---

## WhoThisIsFor

- **Background:** `bg-[var(--color-bg-cream)]`
- **Cards:** `bg-[var(--color-card-fill)]`, `rounded-2xl`
- **Icon:** inline SVG checkmark circle in plum (not `»` chevron)
- **Grid:** 2-column on desktop, 1-column on mobile
- **Items:** 5 items preserved

---

## Reviews

- **Background:** `bg-[var(--color-bg-cream)]`
- **Cards:** `.card` class with `p-8`, left-aligned
- **Stars:** removed entirely (no fake social proof)
- **Avatar:** initial-based circle, `w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]`
- **Grid:** 3-column on desktop, 1-column on mobile
- **Gap:** 32px (`gap-8`)

---

## FinalCta

- **Background:** `bg-white`
- **Image:** `rounded-2xl`, no offset accent-border frame
- **Copy tone:** calm, premium, safety-forward, clear action intent without pressure
  - RU title: "Начните с безопасного первого шага"
  - EN title: "Start with a safe first step"
- **CTAs:** BookingCta (primary, `md:py-6 md:px-8`) + FallbackContact below
- **Grid:** `grid-cols-[7fr_5fr]` — image left, text right

---

## What Must NOT Propagate

The following are homepage-specific and must not be applied to inner pages:

- 8-section order and background rhythm
- Hero trust pill treatment
- Reduced section count (inner pages may use FaqSection, BlogPreview, etc.)
- Large CTA sizing via `md:py-6 md:px-8` (only Hero and FinalCta)
- Custom hero padding override (96px/64px)

---

## Copy Restrictions

- Do not rewrite homepage copy broadly
- Only refine copy where explicitly requested: Hero trust pills, FinalCta tone
- Preserve existing project copy elsewhere
