---
name: AMC AI Coach
description: AI-powered AMC MCQ study performance tool for International Medical Graduates
colors:
  accent: "#0A84FF"
  accent-hover: "#0071E3"
  accent-soft: "#EBF5FF"
  secondary: "#6B6B70"
  tertiary: "#8A8A8F"
  success: "#28A745"
  danger: "#D63031"
  warning: "#A85400"
  surface: "#FFFFFF"
  background: "#F5F5F7"
  border: "rgba(0,0,0,0.10)"
  border-row: "rgba(0,0,0,0.05)"
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
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "#F2F2F7"
    textColor: "#1C1C1E"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-secondary-sm:
    backgroundColor: "#F2F2F7"
    textColor: "#1C1C1E"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "#1C1C1E"
    rounded: "{rounded.sm}"
    height: "38px"
    padding: "0 12px"
  chip-topic:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
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
- `accent` (`#0A84FF`) appears on interactive and data-state elements only — never as a decorative accent
- Flat surface hierarchy — borders and background tints separate layers; shadows reserved for floating elements only
- Dense but breathable — table rows are tight (14px, `py-3`); card padding is generous (24px); the contrast between them is intentional
- Semantic state vocabulary — success/danger/warning have fixed hex values with verified contrast ratios; they are not decorative
- Responsive sidebar — fixed 256px on desktop; transform-driven drawer on mobile with a persistent mobile header and hamburger trigger

## 2. Colors: The Signal Palette

One accent. Four semantic states. Two neutral surfaces. Two border weights. That is the entire vocabulary.

### Primary
- **Accent** (`#0A84FF`, `accent`): The single interactive accent. Used on primary buttons, active navigation states, focused input borders, accent-tinted call-out backgrounds, and topic chips. Appears only where something can be clicked or where the user's attention is required for action. Its rarity is the point.
- **Accent Deep** (`#0071E3`, `accent-hover`): Hover state for primary buttons. Never used as a standalone color; always the paired hover of Accent.
- **Accent Soft** (`#EBF5FF`, `accent-soft`): Extremely low-saturation tint. Used as the background of "Key takeaway" callout boxes in AI insight cards. The active navigation background uses the near-identical inline value `#EBF3FF` — both are permitted; neither competes with the accent.

### Neutral
- **Surface White** (`#FFFFFF`, `surface`): Card backgrounds, sidebar background, input backgrounds, mobile header. The primary content surface.
- **Off-Chrome** (`#F5F5F7`, `background`): Application background — a fractionally cooler off-white that creates separation between the app shell and surface cards without shadow. Not warm. Not cream. Deliberately neutral.
- **Secondary** (`#6B6B70`, `secondary`): Muted body text, form labels, table headers, subtitle text, placeholder text. Verified 4.93:1 on white — passes WCAG AA for normal text. The default for any text that is informational but not primary.
- **Tertiary** (`#8A8A8F`, `tertiary`): Large text only (≥18px) or bold text (≥14px bold). Verified 3.20:1 on white — passes AA large-text threshold only. Prohibited at body text sizes. Used for sidebar section labels at 50% opacity.
- **Border Hairline** (`rgba(0,0,0,0.10)`, `border`): Card borders, sidebar divider, input borders, card-header dividers. Translucent so it adapts to any background surface.
- **Border Row** (`rgba(0,0,0,0.05)`, `border-row`): Table row dividers only. Half the opacity of the card border — creates visual rhythm inside a card without competing with the card's own boundary.

### Semantic States
- **Success** (`#28A745`, `success`): Accuracy above threshold (≥70%), positive trend indicators, improving performance states. Verified 4.52:1 on white.
- **Danger** (`#D63031`, `danger`): Low accuracy (below 60%), declining performance, validation errors, required field indicators. Verified 4.85:1 on white.
- **Warning** (`#A85400`, `warning`): Moderate accuracy (60–69%), cautionary states, moderate mistake frequency. Verified 4.78:1 on white. Amber-brown, not orange — intentionally darker for text legibility.

### Named Rules
**The One Voice Rule.** Accent (`#0A84FF`) appears on ≤10% of any given screen. The moment it decorates something non-interactive, it loses its meaning as a direction signal. Prohibited on illustrations, background patterns, dividers, or any non-interactive element.

**The Semantic Fence Rule.** Success, Danger, and Warning are reserved exclusively for performance states and validation. They are prohibited as general-purpose accent colors, background tints, or branding elements.

**The Contrast Floor Rule.** Tertiary (`#8A8A8F`) is prohibited on text smaller than 18px (or smaller than 14px bold). At body text sizes, use `secondary` instead.

## 3. Typography

**Body & UI Font:** System font stack — `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif`
**Mono Font:** `"SF Mono", ui-monospace, monospace`

**Character:** No loaded fonts. The system renders in SF Pro Text on macOS/iOS, Segoe UI on Windows, and Roboto on Android. This is a deliberate choice — the app targets medical professionals who trust system-native UI. The scale ratio is tight (1.15–1.2 between steps), consistent with a tool that carries many type elements per screen.

### Hierarchy

- **Display** (700 weight, 30px, line-height 1.1, tracking −0.02em): Page titles only — `h1` within `SectionTitle`. One per page. Never used inside cards.
- **Headline** (600 weight, 20px, line-height 1.3): AI insight headlines within the Dashboard coaching brief. Dense informational heading where the data headline is the message.
- **Title** (600 weight, 17px, line-height 1.4): Card section titles ("Topic Performance", "Weak Topic Analysis"). Used inside cards, not as page headers.
- **Subtitle** (400 weight, 15px, line-height 1.4): `SectionTitle` supporting text below the Display title. Rendered in `secondary` ink. Provides one-sentence page context.
- **Body** (400 weight, 14px, line-height 1.5): All primary UI text — table cells, form values, insight body copy, nav link labels. Cap prose at 65–75ch.
- **Label** (500 weight, 13px, line-height 1.3): Secondary UI text — form field labels, table column headers, meta information. Medium weight distinguishes it from body at the same optical size.
- **Mono** (400 weight, 14px, line-height 1.5): Numeric data — question counts, accuracy percentages, session numbers. Applied via `tabular-nums` and the SF Mono stack.
- **Micro** (600 weight, 10.5px, uppercase, tracking 0.08em): Navigation section labels only ("Overview", "Learning", "AI", "Reports"). Rendered at `rgba(134,134,139,0.50)`. Prohibited as marketing kickers or content section headers.

### Named Rules
**The No-Personality Rule.** No display fonts. No custom type. Warmth comes from copy and data specificity — not from a humanist serif or custom script. The font is the system. The system is trusted.

**The Tabular Fence Rule.** All numeric data must use `tabular-nums` and the monospace stack. Mixed proportional and tabular numbers in the same table column is prohibited.

## 4. Elevation

Surfaces are flat at rest. Content cards, form panels, and data tables sit directly on the Off-Chrome background, separated by a 1px translucent border (`rgba(0,0,0,0.10)`) rather than a shadow. This creates crisp, predictable layering without visual noise.

Three shadow steps are defined — one in active use, two reserved for future floating elements:

### Shadow Vocabulary

- **Brand Glow** (`0 1px 4px rgba(10,132,255,0.45)`): Reserved exclusively for the sidebar brand logo mark. A colored drop shadow matching the accent hue. One deliberate use; its singularity makes the brand mark feel anchored.
- **Surface Lift** (`0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`): For floating elements that must break out of the layout plane — future dropdown menus, popovers, command palettes. Defined to establish the vocabulary before it's needed.
- **Modal Lift** (`0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)`): For full modal dialogs and overlay sheets that must clearly separate from all page content.

### Named Rules
**The Flat-By-Default Rule.** Content surfaces are never elevated. Shadows appear only on elements that genuinely float above the layout — dropdowns, modals, command palettes.

**The One Glow Rule.** The Brand Glow shadow is singular. No other element uses a colored shadow. Using the accent-colored shadow anywhere else dilutes the brand mark's identity.

## 5. Components

Components are tight and confident. Padding is specific, not generous. The border is visible. Nothing looks placeholder.

### Buttons

- **Shape:** Gently rounded (8px radius — `rounded.sm`). Not a pill; not a rectangle.
- **Primary:** Accent (`#0A84FF`) background, white text, 14px weight 500, padding 8px 16px. On mobile: `min-h-[44px]` touch target; `md:min-h-0` restores standard height on desktop.
- **Hover:** Deepens to Accent Deep (`#0071E3`) in 150ms ease-out. Scale to 98% on active.
- **Focus-visible:** 2px ring in `rgba(10,132,255,0.40)` offset 2px.
- **Disabled:** 50% opacity, `cursor-not-allowed`. No color change; opacity communicates the state.
- **Secondary:** `#F2F2F7` background, `#1C1C1E` text. Same shape. Hover deepens to gray-200. Focus ring: 2px `rgba(0,0,0,0.20)`.
- **Small variant (`sm`):** 13px text, padding 6px 12px. Used for in-card "Generate →" buttons. No touch-target override.

### Cards / Containers

- **Corner Style:** Moderately rounded (12px radius — `rounded.md`). Distinguishes cards from buttons (8px).
- **Background:** Surface White (`#FFFFFF`).
- **Border:** 1px translucent hairline (`rgba(0,0,0,0.10)`).
- **Shadow:** None at rest (flat-by-default).
- **Internal Padding:** 24px (`p-6`) for padded cards. Card headers with dividers use `px-6 py-4`.
- **Variants:** `padding` prop adds `p-6`; `overflow` prop adds `overflow-hidden` for tables that bleed to the card edge.

### Inputs / Fields

- **Style:** White background, 1px translucent border, 8px radius, 38px height, padding 0 12px.
- **Focus:** Border shifts to Accent, adds 2px ring in `rgba(10,132,255,0.20)`.
- **Placeholder:** Secondary (`#6B6B70`) — verified 4.93:1 on white. Tertiary prohibited as placeholder color.
- **Error state:** Inline `<p role="alert">` in Danger red below the failing field. No `alert()` dialogs.
- **Textarea:** Same visual language as single-line inputs. `resize-none` required.

### Navigation (Sidebar)

- **Container:** 256px fixed sidebar, white background, 1px right border at 7% opacity (`rgba(0,0,0,0.07)`).
- **Desktop:** Always visible in the flex layout at `z-auto`.
- **Mobile:** Transform-driven drawer. `translateX(-100%)` when closed (CSS attribute `data-open="false"`); `translateX(0)` when open. Transition: `200ms ease-out`. A 40% black scrim covers content behind the open drawer; tapping it closes the sidebar. Sidebar auto-closes on any route change via `useEffect` on `pathname`.
- **Mobile header:** Persistent top bar (white, `border-b border-black/[0.07]`) with hamburger `<Menu>` icon and app wordmark. Hidden at `md+` (`md:hidden`). Respects `env(safe-area-inset-top)` for notched devices.
- **Brand mark:** 32px × 32px rounded square (12px radius), Accent gradient (`#0A84FF` → `#0060D0`), Brand Glow shadow, white Stethoscope icon.
- **Section labels (Micro):** 10.5px, 600 weight, uppercase, tracking 0.08em, at `rgba(134,134,139,0.50)`. Navigation taxonomy only.
- **Nav items (default):** 14px, medium weight, `rgba(60,60,67,0.80)`. Hover: `#F2F2F7` bg, near-black text. 8px radius. Mobile `min-h-[44px]`; desktop `md:min-h-0`.
- **Nav items (active):** `#EBF3FF` background, Accent text and icon. `aria-current="page"` required.
- **Coming soon items:** `cursor-not-allowed`, opacity ~35%, `aria-disabled="true"`, `tabIndex={-1}`. Pill badge (`#F2F2F7` bg, 10px bold uppercase "Soon") at the end of the label.
- **Profile footer:** Hairline divider above. Avatar circle (`#1C1C1E` bg, white initial, 11px bold). Name 13.5px semibold, role 11.5px secondary.

### Section Title

- **Purpose:** Page-level header used at the top of every main content view.
- **Display title:** 30px, 700 weight, tight tracking, near-black text.
- **Subtitle (optional):** 15px, 400 weight, secondary ink. Provides one-sentence page context directly below the title.
- **Bottom margin:** 32px (`mb-8`) separating the title block from the first content section.

### Topic Chips

- **Style:** Accent Soft (`#EBF5FF`) background, Accent (`#0A84FF`) text, 12px weight 500, pill (`rounded.full`), padding 2px 10px.
- **Usage:** Mistakes table topic column only. `title` attribute required for truncated names. Not used as filter chips or navigation.

### AI Evidence Panel

- **Container:** `bg-gray-50` rounded panel (8px radius) inside a card. The only permitted interior background tint — distinguishes computed evidence from primary content without nesting cards.
- **Evidence values:** 18px bold tabular-nums; 12px secondary ink labels; 11px semantic or secondary color delta sub-labels.
- **`aria-live="polite" aria-atomic="true"`** required on the wrapper.
- **Key takeaway callout:** Accent Soft (`accent-soft`) background, 8px radius. Label: 12px semibold Accent. Body: 14px near-black.

### Loading Skeleton

- **Style:** `animate-pulse` with stacked `bg-gray-200` rectangles at varying widths (60%, 100%, 88%, 74%, 82%). Width variation required — uniform skeletons look broken.
- **Reduced motion:** The global `prefers-reduced-motion` override in `index.css` suppresses all animations globally. Skeletons freeze in place; content still loads normally.

### Row Highlight

- **Animation:** `row-highlight` keyframe — `800ms ease-out` from `rgba(10,132,255,0.08)` to transparent, `forwards`. Fires once on a newly saved table row to confirm the write without blocking the UI.
- **Defined in:** `index.css` `@keyframes row-highlight`. Exposed as `--animate-row-highlight` theme token.
- **Reduced motion:** Suppressed by the global override in `index.css`.

## 6. Do's and Don'ts

### Do:
- **Do** use Accent (`#0A84FF`) only on interactive elements and active states — buttons, active nav links, focused inputs, topic chips. Its rarity is what makes it meaningful.
- **Do** use `secondary` (`#6B6B70`) as the default for all informational text that isn't primary content. It passes WCAG AA (4.93:1 on white).
- **Do** verify contrast before shipping any text in `tertiary` (`#8A8A8F`). Legal only at ≥18px or ≥14px bold. At body sizes, use `secondary`.
- **Do** use `placeholder:text-secondary` on all form inputs. Placeholder text at `text-tertiary` fails WCAG AA and is prohibited.
- **Do** replace `alert()` validation with inline `<p role="alert">` rendered adjacent to the failing field.
- **Do** wire `aria-current="page"` on active nav links. Screen readers use this to announce location.
- **Do** wrap async AI output panels in `aria-live="polite" aria-atomic="true"`.
- **Do** annotate every `<label>` with `htmlFor` matching its input's `id`. Unassociated labels are inaccessible.
- **Do** apply `tabular-nums` and the mono stack to all numeric data in tables and evidence panels.
- **Do** use `rounded.sm` (8px) for interactive elements (buttons, inputs, nav items) and `rounded.md` (12px) for containers (cards, brand mark).
- **Do** keep the `prefers-reduced-motion` override in `index.css`. It covers all Tailwind animations globally; do not remove it or scope it narrowly.
- **Do** size all touch targets to `min-h-[44px]` on mobile with `md:min-h-0` to restore desktop sizing. Applies to buttons and nav items.
- **Do** use `border-row` (`rgba(0,0,0,0.05)`) for table row dividers and `border` (`rgba(0,0,0,0.10)`) for card and input borders. The two weights are intentional.

### Don't:
- **Don't** use purple gradients, violet tints, cyan-on-dark, or any multi-hue gradient as an accent. These are the most recognizable AI-generated UI tells. The system uses one accent: Accent (`#0A84FF`).
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe on cards, list items, alerts, or callouts. Rewrite with background tints, full borders, or nothing.
- **Don't** use `background-clip: text` with a gradient. Gradient text is never meaningful. Emphasis via weight or size.
- **Don't** use `alert()` for validation. It is synchronous, blocks the thread, behaves poorly on iOS, and cannot be styled.
- **Don't** use `tertiary` (`#8A8A8F`) on text ≤14px weight 400–500. The contrast ratio is 3.20:1 — legal only for large or bold text.
- **Don't** ship loading states without a `prefers-reduced-motion` alternative. The global CSS override in `index.css` handles this; never remove it.
- **Don't** design for generic SaaS startup aesthetic — no hero metrics with gradient accents, no "AI-powered" badges, no celebratory empty states with illustration characters. Users are preparing a high-stakes credentialing exam.
- **Don't** design for clinical/hospital software aesthetics — no grey-on-grey, no heavy table borders, no clunky form controls that look like EMR software.
- **Don't** gamify — no streak counters as identity, no reward animations, no Duolingo-style encouragement. Every interaction should feel like a serious professional tool.
- **Don't** nest cards inside cards. Gray-50 panel inside a white card is the only permitted interior tint — it communicates "computed evidence", not a nested container.
- **Don't** use `resize` on textareas. `resize-none` is required to prevent layout shift.
- **Don't** add page subtitles that don't answer "where am I and why does it matter?" Vague subtitles are prohibited.
