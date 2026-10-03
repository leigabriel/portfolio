# Plan: Consistent Font Sizing Across All Devices

> Status: **Pending Approval**
> Based on research into responsive typography best practices (fluid `clamp()`, modular scales, WCAG accessibility).

---

## 1. Research Summary (Sources)

| Source | Key Takeaway |
|--------|-------------|
| [web.dev — Responsive Typography](https://web.dev) | `clamp(min, preferred, max)` is the modern standard for fluid type. Combine `clamp()` with targeted `@media` breakpoints at 30em / 45em to adjust the scale per device tier. |
| [Smashing Magazine — Fluid Typography](https://www.smashingmagazine.com) | Modular scales (1.125–1.25 ratio for mobile, 1.25–1.5 for desktop) keep proportional harmony. Always test zoom-to-200% for WCAG 1.4.4 compliance. |
| [Stylecode — Fluid Type Scales](https://stylec.de) | Use 1–7 step scales: steps 1–2 (xs) for long-form reading, step 4 (m) balanced default, steps 6–7 (xl/xxl) for dramatic display. |

**Breakpoints used in this project (from Tailwind config):**

| Tailwind | Pixels | Device |
|----------|--------|--------|
| `<sm`     | <640px | Small / mobile |
| `sm`–`<md`| 640–767px | Small-medium |
| `md`–`<lg`| 768–1023px | Medium / tablet |
| `lg`–`<xl`| 1024–1279px | Large / small desktop |
| `xl`–`<2xl` | 1280–1535px | Large desktop |
| `>2xl`   | >1536px | Extra-large |

---

## 2. Unified Typography Scale

### Base font: **JetBrains Mono**, 1rem (16px) root

A **modular scale** with ratio ≈ **1.25** (Major Third) keeps hierarchy tight and readable across devices. This matches the project's existing tight, editorial-style aesthetic.

### Fluid token definitions

Every value is defined via `clamp()` so text scales smoothly between breakpoints:

```css
:root {
    /* Micro / caption — metadata, filenames, badge text */
    --text-micro: clamp(0.56rem, 1.4vw + 0.35rem, 0.75rem);

    /* Small / footnote — tags, year labels, small nav */
    --text-small: clamp(0.69rem, 1.6vw + 0.42rem, 0.875rem);

    /* Base / body copy — paragraph text */
    --text-base: clamp(0.85rem, 1.8vw + 0.55rem, 1.0625rem);

    /* Medium / label — form labels, card titles */
    --text-medium: clamp(1rem, 2vw + 0.65rem, 1.25rem);

    /* Large / h3 — sub-section headings */
    --text-large: clamp(1.2rem, 3vw + 0.7rem, 1.875rem);

    /* XL / h2 — section titles (folder tabs) */
    --text-xl: clamp(1.5rem, 4.8vw + 0.6rem, 2.5rem);

    /* XXL / h1 page title — About, Works, Archive */
    --text-xxl: clamp(2rem, 6.4vw + 0.6rem, 4rem);

    /* 3XL / display — Hero title, Footer wordmark */
    --text-3xl: clamp(2.5rem, 9.4vw, 7rem);
}
```

### Device-specific mapping

| Element | Small (<640px) | Medium (768–1023px) | Large (1024–1535px) | XL (>1536px) | Token |
|---------|----------------|---------------------|----------------------|---------------|-------|
| Page H1 | ~48px | ~56px | ~64px | 64px | `--text-3xl` |
| Section H2 | ~26px | ~32px | ~40px | 48px | `--text-xl` |
| Folder tab titles | ~24px | ~30px | ~38px | 40px | `--text-xl` |
| H3 / section subtitle | ~16px | ~20px | ~26px | 30px | `--text-large` |
| Body copy | ~14px | ~16px | ~17px | 17px | `--text-base` |
| Small label (year, tags) | ~11px | ~12px | ~14px | 14px | `--text-small` |
| Micro label (file records) | ~10px | ~11px | ~12px | 12px | `--text-micro` |

---

## 3. Current Inconsistencies (Audit from Existing Code)

| Element | Current Size | Problem |
|---------|-------------|---------|
| Page H1 (`About.jsx`, `Works.jsx`, `Archive.jsx`) | `clamp(2.75rem, 8vw, 8rem)` | Caps at 8rem — too large at desktop |
| Hero title (`Hero.jsx`) | `clamp(4rem, 4vw, 20rem)` | Different clamp entirely; reaches 20rem |
| Footer wordmark | `clamp(2rem, 14.1vw, 24rem)` | Extreme max; not reusable |
| Detail page titles (`WebDetail`, `PosterDetail`, `MotionDetail`) | `clamp(2rem, 6vw, 5rem)` | Inconsistent with page H1s |
| Small labels | `text-[9px]`, `text-[10px]`, `text-xs`, `sm:text-sm` | **4 different values for identical elements** |
| About body text | `clamp(1rem, 5.2vw, 2.5rem)` | Max 2.5rem = h3 size; too large |
| Works sub-nav buttons | `text-lg sm:text-4xl` | Dramatically oversized vs. Header nav |
| Header nav links | `text-xs sm:text-sm` | Different scale system from rest |
| `font-bold` / `font-semibold` used on text where only `wght 400` fonts loaded | N/A | Font weights that don't exist (Bonny/Tritopani only have wght 400) |

---

## 4. Implementation Steps

### Phase 1 — Foundation (single file change)
1. **Edit `src/assets/index.css`** — Replace existing `:root` with the 8 new CSS tokens (§2 above). Add `@font-face` for additional weights if needed, or accept that only `400` is available and use `font-medium` (500) fallback where supported.

2. **Create a single source of truth** — Add a comment block mapping tokens to purposes:
   ```css
   /* Typography tokens — applies to ALL pages.
      Use these classes: .text-micro, .text-small, .text-base, .text-medium,
      .text-large, .text-xl, .text-xxl, .text-3xl
   */
   ```

### Phase 2 — Component-by-component refactor
Walk every JSX file and replace literal sizes with the new tokens:

| File | Current → Replacement | Notes |
|------|----------------------|-------|
| `Hero.jsx` | `.spotlight-title` `clamp(4rem...)` → `--text-3xl` | Keep Tritopani |
| `Hero.jsx` | `.spotlight-copy` `text-[10px]` → `.text-micro` | Role subtitle |
| `Featured.jsx` | `h2` `clamp(2.25rem...)` → `.text-xxl` | Page-level heading |
| `Featured.jsx` | card tags/labels `text-[9px]`/`text-[10px]` → `.text-small` | Year, role |
| `Featured.jsx` | "View Project" `text-[9px]` → `.text-small` | |
| `About.jsx` | `.about-title` `clamp(2.75rem...)` → `.text-3xl` | Now matches Hero cap |
| `About.jsx` | `.about-body` `clamp(1rem…2.5rem)` → `.text-base` | Fix oversized body |
| `About.jsx` | `.about-section-title` → `.text-xl` | |
| `About.jsx` | tab labels `text-xs sm:text-sm` → `.text-small` | |
| `About.jsx` | skill labels `text-2xl sm:text-4xl` → `.text-medium` or `.text-large` | Reassess hierarchy |
| `Works.jsx` | same as About — `.projects-title` → `.text-3xl`, etc. | |
| `Works.jsx` | Archive/Shop buttons `text-lg sm:text-4xl` → `.text-small` or `.text-medium` | Make subordinate |
| `Archive.jsx` | `.archive-title` → `.text-3xl`; `.archive-number` stays as-is (decorative) | |
| `Archive.jsx` | file records `text-[9px] sm:text-[10px]` → `.text-micro` | |
| `Footer.jsx` | wordmark inline `clamp(2rem…24rem)` → `--text-3xl` | |
| `Footer.jsx` | nav labels inline `clamp(1.35rem…3.5rem)` → `.text-xl` | |
| `Footer.jsx` | index/hint `text-[9px] sm:text-[10px]` → `.text-micro` | |
| `Footer.jsx` | social links inline `clamp(0.8rem…2.4rem)` → `.text-base` | |
| `Header.jsx` | `text-xs sm:text-sm` → `.text-small` | |
| `Header.jsx` | mobile brand `text-xs sm:text-sm` → `.text-small` | |
| `WebDetail.jsx` | `.web-detail-title` → `.text-3xl` | |
| `WebDetail.jsx` | all `text-[9px]` / `text-[10px]` → `.text-small` or `.text-micro` | |
| `WebDetail.jsx` | `.text-sm` body → `.text-base` | |
| `PosterDetail.jsx` | same refactor as WebDetail | |
| `MotionDetail.jsx` | same refactor | |

### Phase 3 — Visual polish
1. Align **line-height** values to the scale (e.g., `1.1` for display, `1.4` for body, `1.5` for small).
2. Normalize **letter-spacing** — use `tracking-wide` (0.025em) for nav, `tracking-wider` (0.05em) for uppercase labels, `-0.02em` for titles.
3. Consolidate **font-weight** usage — since Bonny/Tritopani only ship weight 400, replace `font-bold` calls with the loaded weight or load `wght 500` and `wght 700` from the font files.
4. Remove all inline `font-size`/`fontFamily` declarations (Footer wordmark) and route everything through the CSS tokens + utility classes.

---

## 5. Testing Checklist

| Device | Width | Check |
|--------|-------|-------|
| Small phone | 320–639px | No text is too cramped; body ≥ ~14px |
| Large phone | 480–639px | |
| Tablet portrait | 768–1023px | Section titles and body maintain hierarchy |
| Tablet landscape / small desktop | 1024–1279px | Hero title doesn't touch edges |
| Desktop | 1280–1535px | All caps at 1rem (16px) root |
| Large desktop | 1536px+ | Max font sizes enforced; no overflow |

### Accessibility checks
- [ ] Zoom page to 200% — text remains readable, layout doesn't break
- [ ] Disable custom fonts — fallback stack (`Bonny, Georgia, serif` / `JetBrains Mono, monospace`) is legible
- [ ] Verify no `text-[9px]` literal values remain anywhere in the codebase
- [ ] Verify `clamp()` preferred values use `vw` (not fixed units) so fluid scaling works

---

## 6. Files Changed (Summary)

| Change type | Files |
|------------|-------|
| Core tokens | `src/assets/index.css` |
| Component refactor | `src/components/home/Hero.jsx` |
| | `src/components/home/Featured.jsx` |
| | `src/components/layout/Footer.jsx` |
| | `src/components/layout/Header.jsx` |
| | `src/components/details/WebDetail.jsx` |
| | `src/components/details/PosterDetail.jsx` |
| | `src/components/details/MotionDetail.jsx` |
| Page refactor | `src/pages/About.jsx` |
| | `src/pages/Works.jsx` |
| | `src/pages/Archive.jsx` |
| | `src/pages/Home.jsx` (pass-through, no changes) |

---

## 7. Rationale

- **`clamp()` over media queries:** The project already uses `clamp()` everywhere; centralizing the tokens is the least-disruptive path.
- **8-step scale:** Matches the visual language of editorial design (tight hierarchies, mono-spaced body). More than 8 steps would be overkill for a portfolio.
- **`rem`-based body cap:** Prevents the `2.5rem` bug in the current About body copy.
- **Single H1 max size (4rem):** Brings the Hero, About, Works, Archive titles into visual agreement while still allowing Hero to be larger via the `--text-3xl` display token.
