---
name: AMC AI Coach
description: AI-powered AMC MCQ study performance tool for International Medical Graduates
colors:
  signal-blue: "#0A84FF"
  signal-blue-deep: "#0071E3"
  signal-blue-wash: "#EBF5FF"
  secondary-ink: "#6B6B70"
  tertiary-ink: "#8A8A8F"
  success: "#28A745"
  danger: "#D63031"
  warning: "#A85400"
  surface: "#FFFFFF"
  background: "#F5F5F7"
  border: "#0000001A"
  brand-mark: "#1C1C1E"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
  mono:
    fontFamily: "'SF Mono', ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "#F2F2F7"
    textColor: "#1C1C1E"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "#1C1C1E"
    rounded: "{rounded.sm}"
    height: "38px"
    padding: "0 12px"
  chip-topic:
    backgroundColor: "{colors.signal-blue-wash}"
    textColor: "{colors.signal-blue}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: AMC AI Coach

## 1. Overview: The Evidence Room

**Creative North Star: "The Evidence Room"**

The interface surfaces data the way a case file surfaces facts — methodically, without decoration. Every metric on screen exists to answer one question: *what should I study next?* If a data point does not serve that judgment, it does not earn space. The AI coach is the analyst; the user is the credentialed expert who decides. Nothing is celebrated that hasn't been earned.

This is a tool, not an experience. The reference is Linear: dense, keyboard-first, deliberately unglamorous. The system is quiet so the data can be loud. The accent colour appears where action is required and nowhere else. Motion is reserved for state feedback, never choreography. The font is the system font — there is no typographic personality, because the interface is not the point.

What this system explicitly rejects: the generic SaaS AI aesthetic (purple gradients, hero metrics, "Sign up for free" energy); clinical hospital software (grey-on-grey EMR aesthetics, passive data tables, form-heavy layouts); and gamified study apps (streak counters as identity, bright reward animations, Duolingo-style encouragement). This exam is serious. The tool reflects that.

**Key Characteristics:**
- System-font stack — no loaded display fonts; renders natively on macOS, iOS, Windows, and Android with zero flash
- Signal Blue (#0A84FF) appears on interactive and data-state elements only — never as a decorative accent
- Flat surface hierarchy — borders and background tints separate layers; shadows reserved for floating elements
- Dense but breathable — table rows are tight (14px, `py-3`); card padding is generous (24px); the contrast between them is intentional
- Semantic state vocabulary — success/danger/warning have fixed hex values with verified contrast ratios; they are not decorative

## 2. Colors: The Signal Palette

One accent. Four semantic states. Two neutral layers. That is the entire vocabulary.

### Primary
- **Signal Blue** (`#0A84FF`, `signal-blue`): The single interactive accent. Used on primary buttons, active navigation states, focused input borders, accent-tinted call-out backgrounds, and topic chips. Appears only where something can be clicked or where the user's attention is required for action. Its rarity is the point.
- **Signal Blue Deep** (`#0071E3`, `signal-blue-deep`): Hover state for primary buttons and interactive elements. Never used as a standalone color; always the paired hover of Signal Blue.
- **Signal Blue Wash** (`#EBF5FF`, `signal-blue-wash`): Extremely low-saturation tint of Signal Blue. Used as the active navigation background and as the background of "Key takeaway" callout boxes. Signals affiliation with the accent without competing with it.

### Neutral
- **Surface White** (`#FFFFFF`, `surface`): Card backgrounds, sidebar background, input backgrounds. The primary content surface.
- **Off-Chrome** (`#F5F5F7`, `background`): Application background — a fractionally cooler off-white that creates separation between the app background and surface cards without adding shadow. Not warm. Not cream. Deliberately neutral.
- **Secondary Ink** (`#6B6B70`, `secondary-ink`): Muted body text, form labels, table headers, subtitle text, placeholder text. Verified 4.93:1 on white — passes WCAG AA for normal text. The default for any text that is informational but not primary.
- **Tertiary Ink** (`#8A8A8F`, `tertiary-ink`): Large text only (≥18px) or bold text (≥14px bold). Verified 3.20:1 on white — passes AA large-text threshold only. Prohibited at body text sizes. Used for sidebar section labels and decoration-only labels.
- **Border Hairline** (`rgba(0,0,0,0.10)`, `border`): Card borders, sidebar divider, input borders. Translucent so it adapts to any background surface.

### Semantic States
- **Success** (`#28A745`, `success`): Accuracy above threshold (≥70%), positive trend indicators, improving performance states. Verified 4.52:1 on white.
- **Danger** (`#D63031`, `danger`): Low accuracy (below 60%), declining performance, validation errors, required field indicators. Verified 4.85:1 on white.
- **Warning** (`#A85400`, `warning`): Moderate accuracy (60–69%), cautionary states, moderate mistake frequency. Verified 4.78:1 on white. Amber-brown, not orange — intentionally darker for text legibility.

### Named Rules
**The One Voice Rule.** Signal Blue appears on ≤10% of any given screen. The moment it decorates something non-interactive, it loses its meaning as a direction signal. Prohibited on illustrations, background patterns, dividers, or any non-interactive element.

**The Semantic Fence Rule.** Success (#28A745), Danger (#D63031), and Warning (#A85400) are reserved exclusively for performance states and validation. They are prohibited as general-purpose accent colors, background tints, or branding elements.

**The Contrast Floor Rule.** Tertiary Ink (#8A8A8F) is prohibited on text smaller than 18px (or smaller than 14px bold). Every new text element using tertiary ink must pass the 3.20:1 large-text threshold before shipping.

## 3. Typography

**Body & UI Font:** System font stack — `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif`
**Mono Font:** `"SF Mono", ui-monospace, monospace`

**Character:** No loaded fonts. The system renders in SF Pro Text on macOS/iOS, Segoe UI on Windows, and Roboto on Android. This is a deliberate choice, not a cost-cutting measure — the app targets medical professionals who trust system-native UI. Loading a personality font would make the app feel like software, not like a tool.

### Hierarchy

- **Display** (700 weight, 30px, line-height 1.1, tracking −0.02em): Page titles only (`h1` within `SectionTitle` and the Dashboard header). One per page. Never used inside cards.
- **Headline** (600 weight, 20px, line-height 1.3): AI insight headlines within the coaching brief. Dense informational heading where the data headline is the message.
- **Title** (600 weight, 17px, line-height 1.4): Card section titles, table-like labels ("Topic Performance", "Weak Topic Analysis"). One level below Display; used inside the card, not outside it.
- **Body** (400 weight, 14px, line-height 1.5): All primary UI text — table cells, form values, insight body copy. Cap body prose at 65–75ch to prevent line-length fatigue.
- **Label** (500 weight, 13px, line-height 1.3): Secondary UI text — form field labels, table column headers, meta information. Medium weight distinguishes it from body at the same optical size.
- **Mono** (400 weight, 14px, line-height 1.5): Numeric data — question counts, accuracy percentages, session numbers. Applied via `tabular-nums` and the SF Mono stack for columnar alignment.
- **Micro** (600 weight, 10.5px, uppercase, tracking 0.08em): Navigation section labels only ("Overview", "Learning", "AI", "Reports"). Used exclusively as navigation taxonomy; prohibited as marketing kickers or section headers in content.

### Named Rules
**The No-Personality Rule.** No display fonts. No custom type. If the brief says "the product should feel warm and human", the warmth comes from copy and data specificity — not from a humanist serif or a custom script. The font is the system. The system is trusted.

**The Tabular Fence Rule.** All numeric data — accuracy percentages, question counts, session totals — must use `tabular-nums` and the monospace stack. Mixed proportional and tabular numbers in the same table column is prohibited.

## 4. Elevation

Surfaces are flat at rest. Content cards, form panels, and data tables sit directly on the Off-Chrome background, separated by a 1px translucent border (`rgba(0,0,0,0.10)`) rather than a shadow. This creates crisp, predictable layering without visual noise.

Two shadow steps are defined for floating elements that genuinely need to break out of the layout plane:

### Shadow Vocabulary

- **Brand Glow** (`0 1px 4px rgba(10,132,255,0.45)`): Reserved exclusively for the sidebar brand logo mark. A colored drop shadow matching the accent hue. One deliberate use; its singularity makes the brand mark feel anchored.
- **Surface Lift** (`0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`): For floating elements that must read as above the page surface — future modal dialogs, dropdown menus, popovers, command palettes. Not yet used in the current UI; defined here to establish the vocabulary before it's needed.
- **Modal Lift** (`0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)`): For full modals and overlay sheets that must clearly separate from all page content.

### Named Rules
**The Flat-By-Default Rule.** Content surfaces are never elevated. A card that is always flat and a card that is sometimes elevated are visually indistinguishable, destroying the affordance. Shadows appear only on elements that genuinely float above the layout — dropdowns, modals, command palettes.

**The One Glow Rule.** The Brand Glow shadow is singular. No other element uses a colored shadow. Using the accent-colored shadow anywhere else dilutes the brand mark's identity.

## 5. Components

Components are tight and confident. Padding is specific, not generous. The border is visible. Nothing looks placeholder.

### Buttons

- **Shape:** Gently rounded (8px radius — `rounded-sm` in the token scale). Not a pill; not a rectangle. Confident without softness.
- **Primary:** Signal Blue (#0A84FF) background, white text, 14px body weight 500, padding 8px 16px. Full accent saturation — this is the only element where Signal Blue fills a surface.
- **Hover:** Deepens to Signal Blue Deep (#0071E3) in 150ms ease-out. Scale to 98% on active (`active:scale-[0.98]`) for tactile feedback.
- **Focus-visible:** 2px ring in `rgba(10,132,255,0.40)` offset 2px — visible, branded, non-obtrusive.
- **Disabled:** 50% opacity, `cursor-not-allowed`. No color change; the opacity communicates the state.
- **Secondary:** Off-Chrome (#F2F2F7) background, near-black (#1C1C1E) text. Same shape and padding as primary. Hover deepens to gray-200. Focus ring: 2px `rgba(0,0,0,0.20)`.
- **Small variant** (`sm`): 13px text, padding 6px 12px. Used for in-card generate buttons.

### Cards / Containers

- **Corner Style:** Moderately rounded (12px radius — `rounded-md` in token scale). Distinguishes cards from buttons (8px) without feeling decorative.
- **Background:** Surface White (#FFFFFF).
- **Border:** 1px translucent hairline (`rgba(0,0,0,0.10)`). Visible in both light and any future dark mode without hardcoding a color.
- **Shadow:** None at rest (flat-by-default). Cards are always resting; they never float.
- **Internal Padding:** 24px (`p-6`) for padded content cards. Card headers with dividers use `px-6 py-4` (24px/16px) — tighter vertical rhythm to signal "header" vs. "body".

### Inputs / Fields

- **Style:** White background, 1px translucent border, 8px radius, 38px height. Matching the button's radius — consistent corner language.
- **Focus:** Border shifts to Signal Blue (`border-accent`), adds a 2px ring in `rgba(10,132,255,0.20)`. The blue ring is the only indicator; no background shift, no glow spread.
- **Placeholder:** Secondary Ink (#6B6B70). Verified 4.93:1 on white — passes WCAG AA. Prohibited from using Tertiary Ink as placeholder color.
- **Error state:** Inline `<p role="alert">` in Danger red (#D63031) rendered below the offending field. No `alert()` dialogs.
- **Textarea:** Same visual language as single-line inputs. `resize-none` — user-resizable textareas create layout shift and are prohibited.

### Navigation (Sidebar)

- **Container:** 256px fixed sidebar, white background, 1px right border (`rgba(0,0,0,0.07)` — slightly lighter than card borders for visual hierarchy).
- **Brand mark:** 32px × 32px rounded square (12px radius), Signal Blue gradient (from #0A84FF to #0060D0), Brand Glow shadow, white icon.
- **Section labels:** 10.5px, 600 weight, uppercase, letter-spacing 0.08em, Tertiary Ink at 50% opacity (`rgba(134,134,139,0.5)`). Navigation taxonomy only — not a content pattern.
- **Nav items (default):** 14px, medium weight, Secondary Ink (#3C3C43 at 80% opacity). Hover: Off-Chrome (#F2F2F7) background, near-black text. 8px radius.
- **Nav items (active):** Signal Blue Wash (#EBF3FF) background, Signal Blue text and icon. `aria-current="page"` present.
- **Profile footer:** Near-black (#1C1C1E) avatar circle, white initial, 11px bold. Name 13.5px semibold, role 11.5px secondary-ink. Bordered from nav content by hairline divider.

### Topic Chips

- **Style:** Signal Blue Wash (#EBF5FF) background, Signal Blue (#0A84FF) text, 12px medium weight, pill shape (`rounded-full`), padding 2px 10px.
- **Usage:** Mistakes table topic column only. Not used as filter chips; not used for navigation. `title` attribute present for truncated long topic names.

### AI Evidence Panel

- **Container:** `bg-gray-50` rounded panel (8px radius) inside a card. Gray-50 is the only interior background tint in the system — it distinguishes "computed evidence" from "primary content" without nesting a card inside a card.
- **Evidence values:** 18px bold tabular-nums for metric values; 12px Secondary Ink for labels; 11px (secondary or semantic color) for delta sub-labels.
- **`aria-live="polite" aria-atomic="true"`** required on the wrapper — these panels update asynchronously and must announce to screen readers.

### Loading Skeleton

- **Style:** Tailwind `animate-pulse` with stacked `bg-gray-200` rectangles of varying widths (100%, 88%, 74%, 82%). Width variation is required — identical skeletons look broken.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` in `index.css` overrides all animations globally. Skeletons freeze in place; content still appears when loaded.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Blue (#0A84FF) only on interactive elements and active states — buttons, active nav links, focused inputs, topic chips. Its rarity is what makes it meaningful.
- **Do** use `text-secondary` (#6B6B70) as the default for all informational text that isn't primary content. It passes WCAG AA (4.93:1 on white) and carries the design's restrained voice.
- **Do** verify contrast before shipping any text in Tertiary Ink (#8A8A8F). It is legal only at ≥18px or ≥14px bold. At body sizes, use `text-secondary` instead.
- **Do** use `placeholder:text-secondary` on all form inputs. Placeholder text at `text-tertiary` fails WCAG AA and is prohibited.
- **Do** replace `alert()` validation with inline `<p role="alert">` rendered adjacent to the failing field. This is the only permitted validation pattern.
- **Do** wire `aria-current="page"` on active nav links. Screen readers use this to announce location.
- **Do** wrap async AI output panels in `aria-live="polite" aria-atomic="true"`.
- **Do** annotate every `<label>` with `htmlFor` matching its input's `id`. Unassociated labels are inaccessible.
- **Do** apply `tabular-nums` and the mono stack (`font-mono`) to all numeric data in tables and evidence panels.
- **Do** use `rounded-sm` (8px) for interactive elements (buttons, inputs, nav items) and `rounded-md` (12px) for containers (cards, callout boxes, brand mark).
- **Do** keep the `prefers-reduced-motion` override in `index.css`. It covers all Tailwind animations globally; don't remove it or scope it narrowly.

### Don't:
- **Don't** use purple gradients, violet tints, cyan-on-dark, or any multi-hue gradient as an accent. These are the most recognizable AI-generated UI tells. The system uses one accent: Signal Blue.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe on cards, list items, alerts, or callouts. Rewrite with background tints, full borders, or nothing.
- **Don't** use `background-clip: text` with a gradient. Gradient text is never meaningful. Emphasis comes from weight and size.
- **Don't** use `alert()` for validation. It is synchronous, blocks the thread, behaves poorly on iOS, and cannot be styled.
- **Don't** use Tertiary Ink (#8A8A8F) on text ≤14px weight 400–500. The contrast ratio is 3.20:1 — it passes only for large or bold text.
- **Don't** ship loading states without a `prefers-reduced-motion` alternative. The global CSS override in `index.css` handles this; don't remove it.
- **Don't** design for generic SaaS startup aesthetic — no hero metrics with gradient accents, no "AI-powered" badges, no celebratory empty states with illustration characters. This product's users are preparing a high-stakes credentialing exam; the tone is precise, not enthusiastic.
- **Don't** design for clinical/hospital software aesthetics — no grey-on-grey, no heavy table borders, no clunky form controls that look like they run on a hospital server.
- **Don't** gamify — no streak counters as identity, no reward animations, no Duolingo-style encouragement. Every interaction should feel like using a serious professional tool.
- **Don't** add a page subtitle that doesn't answer "where am I and why does it matter?" Vague subtitles ("Welcome to your dashboard") are prohibited.
- **Don't** nest cards inside cards. A gray-50 panel inside a white card is the only permitted interior tint — it communicates "computed evidence", not "nested container".
- **Don't** use `resize` on textareas. `resize-none` is required to prevent layout shift.
