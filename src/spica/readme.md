# Spica System

version: 2.70 · 2026-10-20 · Alice/Nunito/JetBrains Mono · primary #F9578A · dashed focus · spring motion

> *Joyful, personal, a little magical. The brightest star in Virgo, made into a design language.*

Spica is the cool-led evolution of the Elysia brand: **soft-pink blossom leads**, a harmonic blue→purple spread supports, and everything sits on a near-white base lifted by soft corner-light and the occasional glow. Headers are set in a calm serif; everything else is a soft, rounded sans — so the system reads *friendly first*, elegant second. The signature decoration is a **star-chart** motif — soft compass arcs, dashed axes, twinkling ✦ markers, and a traced Virgo constellation with **Spica** as the one bright point — kept light and decorative, never scholarly.

Every decision passes one filter: **would this make someone smile, and still be easy to read?** Humanism is the craft underneath; joy is what shows.

Plugin teaching diagrams use responsive HTML scenes, explicit playback, reserved captions, and a read-only waveform timer that preserves elapsed time when paused. NumberFlow animates countdown and stage numbers. Short diagram labels morph with Torph and briefly highlight when their text changes. Keyboard navigation and reduced motion skip transitions.

## Sources

- Evolved from the **Elysia Humanism System** (bound at `_ds/spica-humanism-system-019de957-fb6b-7de9-b135-a756efb73b99/`). *Cormorant Garamond and Berkeley Mono were both retired — Cormorant read too sharp against the rounded system, Berkeley for licensing.*
- **Alice** (headings), **Nunito** (body/UI) and **JetBrains Mono** (code) are pulled from Google Fonts in `tokens/fonts.css` — no binaries bundled. *Drop self-hosted files into `fonts/` and add `@font-face` rules if you need full offline use.*

## Content fundamentals — voice

A warm, playful **onee-san**: the big sister who's genuinely delighted you showed up. Friendly, a little cheeky, quietly confident — never smug, never condescending, never a lecture. Extends "Humanizer" and "Unslop" skill.

| Do | Don't |
| --- | --- |
| Contractions (it's, you'll, let's) | "it is" / "you will" |
| Talk *to* "you", often as "we/let's" | "the developer" / "the user" |
| Small warm asides — *see? told you* | Stack disclaimers, hedge |
| Lead with the answer, then the fun | Bury the answer in setup |
| Celebrate small wins — one "!" is fine | Exclaim on every line, or gush |
| Playful micro-copy in empty/loading/success states | Jokes inside reference tables or error text |

**Examples.** Empty state: *"Nothing here yet — go on, make the first one."* Success toast: *"Saved. That was the easy part!"* Loading: *"One sec, warming things up…"* Docs aside: *"Hover `listen` in your editor, see that? That's the whole point."* Error: plain and kind — *"That email doesn't look right. Mind checking it?"*

Casing: **sentence case everywhere** — body, headings, UI, eyebrows, badges (New, Beta, v2). **No uppercase, no letter-spaced labels.** Italics in body = a warm aside. **No emoji in body** — the ✦ sparkle, the glow, and the fox carry the magic. In docs the voice is seasoning, not the meal: clarity always wins; save the louder personality for marketing.

### Technical writing

Use [route.mdx](../content/docs/essential/route.mdx) as a reference for the teaching sequence: introduce a concept, show the smallest useful example, then explain what happens. Follow the sentence-case rule above even where the reference page still uses title case.

- Teach one idea per section. Start with what the reader can do, such as "Add `?` after a parameter name to make it optional."
- Keep paragraphs to one or two short sentences. Use lists for alternatives, ordered steps, or matching rules; use tables when readers need to compare values.
- Show concrete inputs and results. "When `/user/42` matches `/user/:id`, `params.id` is `42`" is more useful than "Access dynamic parameters."
- Use inline code for paths, methods, parameters, values, and API names. Reserve bold for a term's introduction or a rule readers must notice.
- Use `##` for concepts and `###` for details within them. Write headings and step labels in sentence case, preserving API spelling such as `GET` and `params.id`.
- Keep warm asides brief. Avoid repeated definitions, filler introductions, and jokes that interrupt an explanation. Put a caveat beside the example it affects; add a callout only when it needs extra attention.
- Keep prose, displayed code, and playground responses in agreement. Check route names, HTTP methods, returned values, and the API being taught when copying an example.

### Documentation components

These Astro components live in [`../components/interactive-code/`](../components/interactive-code/) and [`../components/playground/`](../components/playground/), separately from the Spica UI kit.

| Content | Use |
| --- | --- |
| A standalone snippet or API reference | A fenced code block with a language, usually `ts` |
| An example that changes as the explanation progresses | `InteractiveDocLayout`, `InteractiveDoc`, and `InteractiveStep` |
| Routes whose responses readers can inspect | `CodePlayground` around a fenced code block |

#### Interactive explanations

`InteractiveDoc` pairs each explanation with a complete TypeScript code snapshot. Change only the lines needed for the next idea so the transition is easy to follow. It displays a scroll-linked code pane when enhanced and inline code per step as the fallback.

The example below is a complete MDX page. Import paths assume the page lives beside `route.mdx`; adjust them for other directories.

```mdx
---
title: Routing
description: Add a route and read a path parameter.
template: splash
---

import InteractiveDocLayout from '../../../components/interactive-code/layout.astro';
import InteractiveDoc from '../../../components/interactive-code/doc.astro';
import InteractiveStep from '../../../components/interactive-code/step.astro';

export const steps = [
    {
        label: 'Static paths',
        code: `import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')`,
        highlight: [4],
    },
    {
        label: 'Dynamic paths',
        code: `import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params }) => params.id)`,
        highlight: [5],
    },
];

<InteractiveDocLayout>

<div class="content-layout">

<h1 id="_top">Routing</h1>

A route matches a request's method and path to a handler.

</div>

<InteractiveDoc steps={steps}>

<InteractiveStep>

## Static paths

Use a static path for an exact match. A `GET` request to `/` returns `Hello Elysia`.

</InteractiveStep>

<InteractiveStep>

## Dynamic paths

Prefix a segment with `:` to capture its value. A `GET` request to `/user/42` returns `42`.

</InteractiveStep>

</InteractiveDoc>

</InteractiveDocLayout>
```

- Keep `InteractiveDoc` inside `InteractiveDocLayout`. For this splash-page pattern, supply `<h1 id="_top">` and wrap ordinary prose in `.content-layout`; leave `InteractiveDoc` outside that narrow wrapper.
- Pass a non-empty `steps` array. Each entry needs a non-empty `label` and `code`; optional `highlight` contains one-based integer line numbers within that snapshot, including blank lines in the count.
- Write one direct `InteractiveStep` child per array entry, in the same order. Do not nest steps or put prose between them. Pass code through `steps`, not through the authored `InteractiveStep` tags.
- Add `class` to an authored `InteractiveStep` to style its rendered section, for example `<InteractiveStep class="mb-8">`.
- Start each step with a Markdown `##` or `###` heading. Its generated ID must be unique on the page. The Spica title dropdown lists only the steps in its own `InteractiveDoc`. Keep the label aligned with that heading; use `###` only for a subordinate topic.
- Keep the explanation useful with inline code and without animation. The component handles the fallback and reduced motion.

See [`doc.astro`](../components/interactive-code/doc.astro), [`step.astro`](../components/interactive-code/step.astro), and [`layout.astro`](../components/interactive-code/layout.astro) for the component contract.

#### Route playgrounds

`CodePlayground` shows source code with a route selector and response. The selector sits in a browser-style tab above a scrollable response panel with a soft iris wash. A thin border follows the tab and panel, leaving the rest of the header open. Its source code omits the outer frame inside the playground card; standalone Markdown fences keep theirs. Pass an exported Elysia instance through `elysia` and place the displayed code in its default slot. The instance must register at least one route.

This MDX fragment uses the same routes and return values in both places:

````mdx
import { Elysia } from 'elysia';
import CodePlayground from '../../../components/playground/code.astro';

export const demo = new Elysia()
    .get('/', 'Hello Elysia')
    .get('/hi', 'Hello!');

<CodePlayground elysia={demo}>

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/hi', 'Hello!')
    .listen(3000)
```

</CodePlayground>
````

The displayed `.listen(3000)` tells readers how to start their own local server. Never call `.listen()` on the exported demo instance. The playground prepares response text while Astro renders the page, then switches between those saved responses in the browser. It does not execute edits or send live requests.

Use `examples={[{ method: 'POST', displayPath: '/body — valid name', response: '{"name":"Elysia"}' }]}` instead of `elysia` for saved request/response examples. This supports several inputs for the same route without executing an app during rendering. Verify these responses against the displayed code and describe them as saved examples, not live requests. Provide at least one example.

When using `elysia`, optional props let you supply a response and a readable route label:

- `mock` maps the registered path to an exact HTTP method and response string, for example `mock={{ '/user/:id': { GET: '42' } }}`. Use it for deterministic examples or handlers that require request data or external services.
- `alias` maps the registered path to a display label only, for example `alias={{ '/user/:id': '/user/42' }}`. It does not substitute parameters or change the request. Without a mock, the helper calls `elysia.handle()` with the literal registered path and method, with no body.
- For those props, the demo must register `/user/:id` and the displayed handler should return `params.id`. Use the mock and alias together to illustrate `/user/42` returning `42`.
- Keep demo handlers safe to run during page rendering. Make mocked responses explicit when describing the example; do not imply that the reader has made a live request.

See [`code.astro`](../components/playground/code.astro) and [`prepare-playground-routes.ts`](../components/playground/prepare-playground-routes.ts) for prop types and response preparation.

### Page navigation

Previous and next links use Spica cards with Alice titles and Nunito labels. They follow the sidebar order through Getting Started, the essential docs, Patterns, Eden, Plugins, Comparison, Integration, and Internal, retaining Starlight's native arrows, localization, and link semantics. Links stack in narrow containers; the next link sits on the right when two columns fit.

### Documentation navigation

The page navigation uses rounded neutral hover pills and pink current-heading pills without a vertical rail, and shows whole-page reading progress in its header ring. Interactive explanations retain their continuous rail with softened 45-degree turns toward nested headings and back, and their scroll-linked gradient.

### Framed buttons

Use `Button variant="framed"` for a featured action. It pairs a surface frame with an inset dawn wash, using the same two-border treatment as code blocks. Existing sizes, icons, `pill`, and native button props work as usual; disabled buttons hide the wash.

```tsx
<Button variant="framed" size="lg">Get started</Button>
```

### Menu panels

`Dropdown` supports nested `items` for submenus that open on hover, click, or keyboard, and `current` marks the active page link.

Its translucent panel has a fine border and top-edge glint. The focused row shows a pink left-edge bar. Panels open with a 240ms spring in scale and position while opacity fades, then close with a 100ms fade. Reduced motion and instant transitions skip the panel animation.

### Card links

Pass `href` to `Card` to make its entire surface a native link with the dashed Spica focus outline. Native anchor props such as `target` and `rel` are supported. Linked cards and previous/next links use the button’s 0.98 press scale and base-duration ease-out transition; reduced motion skips the transition.

```tsx
<Card href="/essential/route" title="Routing">
    Match a request to a handler.
</Card>
```

Use plain `CardTitle` text or the `title` prop inside a linked card. Do not nest links, buttons, form controls, or Markdown headings that generate section anchor links. Omit `href` when a card contains separate actions or multiple destinations.

### Ripple feedback

Production `Button`, `SelectMenu`, `Dropdown` rows, sidebar links and chapter toggles, and linked `Card` include the [m3-ripple](https://github.com/saltyaom/m3-ripple) soft hover and press feedback, loaded by the documentation layout. Buttons, selectors, menu rows, and sidebar controls use primary pink ripple feedback. Active sidebar links pair a soft pink fill with a rounded left accent bar. Native clicks, focus outlines, and disabled controls keep their behavior. Reduced motion skips wave growth; forced colors hides the decoration.

Use the Astro component as a direct child of a positioned button or link with a border radius:

```astro
---
import Ripple from '../components/ui/ripple.astro';
---
<button style="position: relative; border-radius: 10px;">
    <Ripple />
    Save
</button>
```

`Ripple` accepts `disabled`, `hoverOpacity` (0), `pressedOpacity` (0.12), `duration` (150ms), `minimumPressDuration` (225ms), `touchDelay` (150ms), `easing`, `class`, and `style`. Set `--ripple-color` to override its inherited ink color. It loads its own script and styles without React hydration.

### Numbered cards

Use `NumberedCards` for one to four short, ordered ideas. It composes the normal `Card` and `CardTitle`, numbers items automatically, and gives each card its own gradient bloom and outlined numeral.

```tsx
import { NumberedCards } from './components/ui/numbered-cards';

<NumberedCards minHeight="16rem" items={[
    { title: 'Choose a path', children: <>Start with a URL, like <code>/hello</code>.</> },
    { title: 'Add a handler', children: 'Return a message for that route.' },
]} />
```

Adjust the import path for your file. Each item accepts a string `title` and React content in `children`. Empty groups and groups larger than four throw an error. Keep titles and descriptions short. The ordered list stays readable without client JavaScript; its giant numbers are decorative.

Dark mode softens the numbered cards’ corner blooms so muted descriptions stay readable.

Titles and descriptions sit together at the bottom. Set `minHeight` to change the minimum card height, using a CSS length such as `"18rem"` or a number in pixels. It defaults to `"8rem"`. Cards grow when the copy needs more room, keeping text clear of the numeral.

The group uses its available width: one column below 32rem, up to two columns from 32rem, and one row from 56rem. Four cards form a 2-by-2 grid at the middle size. Give the group a wide container for a full row; a narrow documentation column keeps the grid.

See [`numbered-cards.tsx`](../components/ui/numbered-cards.tsx) and its [styles](../components/ui/numbered-cards.css).

## Visual foundations

- **Color.** One accent — `--primary`, a soft-pink blossom (OKLCH, chroma boosted \~1.25× so vivid hues reach into P3, gamut-mapping back on sRGB). Pink *means something* — it marks attention, never a decorative fill. Cool support is a harmonic spread named by position: `--harmony-left` (coolest blue) · `--harmony-center` (periwinkle workhorse) · `--harmony-right` (lavender, nearest the primary). Warm light is a pink-centred `--bloom`. Functional (success/warning/danger) is separate from brand; **cape-yellow survives only as `--warning`**. `--gold` is ceremonial (masthead/colophon only).
- **No pure white, no pure black.** Base is `#FFFFFF` lifted by washes; ink is a soft plum-charcoal.
- **Surface washes.** Near-white + soft pastel blooms anchored in the corners (`--surface-wash` + `-rose/-cool/-iris/-dawn`). The page background and big featured cards. Dark mode uses a violet-charcoal canvas; `--surface-night` remains a deliberate deep indigo feature surface in either theme.
- **Type.** Headers = **Alice** (a soft, round storybook serif — one weight, so hierarchy comes from size); body + UI = **Nunito** (16/1.6, rounded sans — soft and friendly); code = **JetBrains Mono**. Eyebrows and badges are Nunito bold, sentence case — never uppercase or tracked. 1.25 modular ramp. Reading measure 680px.
- **Magic.** Three small things, used sparingly: (1) a **soft pink→blue glow** (`--glow` / `--glow-soft`) on the moments that matter — primary hover, a just-finished task, the fox waving; (2) **pastel gradients** (`--gradient-magic`) on featured surfaces — hero cards, empty states, celebration; (3) **gentle motion** — `spica-float` (a slow bob for hero art / the fox), `spica-twinkle` (✦ accents breathing), `spica-glow-in` (glow arrives with the surface, once). Never all three on one element.
- **Radii.** Friendly and rounded: 8 (`--radius-sm`, chips) / 12 (`--radius`, buttons, inputs) / 16 (`--radius-card`, cards, callouts) / 22 (`--radius-lg`, frames, nav shells) / pill. No sharp corners.
- **Shadow & light.** Three tiers — flat page → **quiet glass** (elevated floating surfaces: menus, popovers, nav, modal — translucent `--glass` + a gentle `--glass-blur`, kept subtle so rows stay crisp) → attention light (a soft pink→violet→blue bloom for the moment that interrupts you). Shadows are warm-ink tinted, never blue-black. *(This evolution embraces a subtle quiet-glass for elevation — the old Elysia "no glass" rule is retired.)*
- **Focus.** A 1.5px **dashed pink outline** sitting 3px off the control, following its corner radius (`outline: var(--focus-outline); outline-offset: var(--focus-offset)`) — the same thin-bar language as the slider. The control's own border softens to `--primary-line` underneath. No glow rings on inputs; `--glow` is reserved for hover/celebration moments. Danger flavour: `--focus-outline-danger`.
- **Motion.** Soft and a little bouncy — cute earns it. `--ease-spring` (a visible overshoot) is the house easing for anything that moves, grows or appears: toggles, chips, popovers, the slider, the fox. `--ease-bounce` for celebration moments (a success check popping in). Plain `--ease-out` only for colour/opacity fades and long-distance moves. Keep durations short (140–420ms) so bouncy never becomes sluggish. Signature animations: `spica-pop` (a happy scale-in), `spica-wiggle`, `spica-float`, `spica-twinkle`, `spica-spin`, `spica-march`. Respects `prefers-reduced-motion`.

### Dark mode

Set `data-theme="dark"` on `<html>` to use the native dark tokens. The canvas is Spica's own `--base: oklch(0.2100 0.0240 285.00)` (`#171723`), with violet-to-plum surfaces, light inks, and dark tonal fills. Pink remains the attention accent. `data-theme="light"` restores the light palette. The documentation's existing theme picker also follows the system preference.

The Tailwind bridge in `../styles/spica.css` mirrors these tokens; it does not depend on Tailwind's gray palette. Night cards retain their indigo treatment.

Dark surfaces get lighter and slightly warmer as they lift, from quiet violet to soft plum: `--base` (0.21) is the canvas and recessed code/input area; `--surface` (0.25) holds cards and controls; `--surface-2` (0.295) marks hover states and chip trays; `--surface-raised` (0.32) lifts neutral selected pills. Floating menus, tooltips, and dialogs use `--glass`, a 99% raised surface. Surface washes stay anchored to the canvas. Dark washes use deeper pink, blue, periwinkle, and lavender colors with soft corner fades and quiet centers, like the light washes. Playground code uses the blue-led cool wash in both themes; responses keep the lavender iris wash. Text and control contrast remain intact.

Dark primary pink is lighter, with `--on-primary` for labels, checks, and selected switch thumbs. Destructive fills use `--on-danger`. Both foregrounds stay dark instead of inheriting body ink. `--control-border` keeps input and unchecked control boundaries visible; decorative dividers retain `--border` and `--border-strong`. Text placeholders use muted ink, and sliders retain a visible keyboard focus outline.

## Iconography & motif

- **Icons: Tabler Icons** is the default set — outline style, 24px grid, stroke 1.5–2px, rounded caps/joins (matches the soft, rounded system). Use via `@tabler/icons-react` in code, or the CDN webfont/SVGs (`https://unpkg.com/@tabler/icons-webfont@latest/dist/tabler-icons.min.css`) in static mocks. Use the *outline* variants by default; *filled* variants only for an active/selected state. No colorful multi-tone glyphs, no emoji in body.
- **The signature is a soft star-chart, not a blueprint:** compass arcs and dashed axes drawn faint and rounded, the 4-point sparkle `✦` (often twinkling), scattered stars, and a traced Virgo constellation with Spica glowing in `--primary`. Registration crosshairs and numbered callout pins are allowed but rare — the mood is *wonder*, not *lecture hall*. Loud in marketing, a quiet subset in software.
- Draw these as inline SVG against the tokens — they always have a job (hero, divider, empty state), never filler.

## Handoff rules

- **Source of truth for the visual system is only:** `readme.md` · [`../../skills/spica-design/SKILL.md`](../../skills/spica-design/SKILL.md) · `styles.css` · `tokens/` · `components/`. For documentation component APIs, use the linked Astro components and helpers above.
- **Never hand off a bundled `.html` export** (the single-file "standalone" builds). They embed a frozen copy of fonts, tokens and components and silently go stale. Regenerate one only for viewing, and delete it after.
- **Before every handoff:** run `grep -ri "cormorant\|berkeley\|text-transform: *uppercase" .` at the project root — it must return nothing outside `readme.md` history notes.
- **Version stamp:** bump the `version:` line at the top of `readme.md` on any token/component change; Claude Code should quote it back so you can confirm it read the right copy.

## Index

- `styles.css` — global entry (link this one file). `@import`s only.
- `tokens/` — `colors.css` · `typography.css` · `effects.css` · `fonts.css`
- `components/` (29 dirs) — `Button` · `ButtonGroup` · `SplitButton` · `ToggleButton` · `IconButton` · `IconToggle` · `IconToggleButton` · `IconToolbar` · `Toolbar` · `Tabs` · `NavItem` · `Callout` · `Badge` · `Card` · `CodeBlock` · `Field` · `InputGroup` · `Stepper` · `OTP` · `Slider` · `Progress` · `Chip` · `Switch` · `Checkbox` · `Radio` · `Select` · `SelectMenu` · `Dropdown` · `Alert` (each `.jsx` + `.d.ts` + `.prompt.md` + preview card)
- `guidelines/` — foundation specimen cards (Colors · Type · Spacing)
- [`../../skills/spica-design/SKILL.md`](../../skills/spica-design/SKILL.md) — repo-local Agent Skill manifest
