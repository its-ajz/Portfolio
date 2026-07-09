# Portfolio Ship-Readiness Audit

Read-only, no code changed. Performance numbers are measured (Lighthouse against a
production `next build` + `next start`, plus a real Playwright scroll-through and an
injected-rAF frame-rate profile) — not estimated. Where a number could not be
trustworthy measured, that's stated explicitly rather than guessed.

**Methodology note that matters:** my first Lighthouse pass used
`--chrome-flags="--no-sandbox --disable-gpu"`, which silently broke WebGL entirely
(`THREE.WebGLRenderer: A WebGL context could not be created`) — meaning that run
scored a *blank canvas*, not the real site (Performance 85 mobile / 100 desktop, total
byte weight only 578 KiB). I caught this from the `errors-in-console` audit, isolated
the cause by testing flag combinations, and reran with `--chrome-flags="--headless=new"`
only, confirmed via `errors-in-console` scoring 1/1 (zero console errors) and total
byte weight jumping to 2,284 KiB — that's the actual 3D scene loading. **All performance
numbers below are from the corrected run.** I'm calling this out up front because it's
the single most important methodological fact in this document: a shallow performance
check on this site will silently under-count its real cost.

---

## Ranked findings (most severe first)

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | **BLOCKING** | Project cards — the core "see my work" interaction — are keyboard-unreachable | `WorkSidebar.tsx:75,129` |
| 2 | **BLOCKING** | Mobile LCP is 14.0s; desktop LCP is 2.7s. Both dominated by a deliberately-delayed intro fade-in | `IntroScreen.tsx`, measured |
| 3 | **BLOCKING** | No resume/CV download anywhere on the site | site-wide, confirmed absent |
| 4 | **BLOCKING** | Zero `aria-*`, zero `tabIndex`, zero `role=`, zero `onKeyDown` anywhere in the codebase | site-wide |
| 5 | **SHOULD FIX** | Link previews (LinkedIn/Slack/iMessage) show title+description with no image | `layout.tsx:11-20` |
| 6 | **SHOULD FIX** | 7 distinct text-color instances fail WCAG AA contrast, 4 of them badly (1.7–2.6:1 vs. 4.5:1 required) | multiple files, ratios computed below |
| 7 | **SHOULD FIX** | No analytics of any kind — no visibility into whether any of this is working | site-wide, confirmed absent |
| 8 | **SHOULD FIX** | Four independently hardcoded section-threshold tables, still not consolidated | `NavBar.tsx`, `SectionNav.tsx`, `ZoneIndicator.tsx`, `WorkSidebar.tsx` |
| 9 | **SHOULD FIX** | Three.js/R3F/drei bundle is 367 KB gzip-measured-as-374KB-raw-chunk, 66% (243 KB) unused on first paint | `.next/static/chunks/0we7pqyibmwzm.js` |
| 10 | **SHOULD FIX** | `prefers-reduced-motion` is completely unhandled on a scroll-driven, constantly-animating 3D site | site-wide, confirmed absent |
| 11 | **NICE TO HAVE** | No robots.txt, no sitemap.xml, no manifest.json/apple-touch-icon | `app/`, `public/` |
| 12 | **NICE TO HAVE** | Favicon is 25.9 KB (should be low single-digit KB) | `app/favicon.ico` |
| 13 | **NICE TO HAVE** | `backdrop-filter` used unprefixed in 5 files — degrades silently on older Safari | multiple files |
| 14 | **NICE TO HAVE** | Duplicate/misplaced `<h1>` — the page's actual first heading-like text (name, in the intro) isn't a heading tag; a second `<h1>` with the same name appears later in `AboutSection` | `IntroScreen.tsx:44-53`, `AboutSection.tsx:94` |

Full detail follows, organized by the six requested areas.

---

## 1. CONTENT & NARRATIVE

**Every section, one sentence each:**

| Section | File | Communicates |
|---|---|---|
| Intro gate | `IntroScreen.tsx` | Name + "XR · Installation · Interaction Design" tagline, click-to-enter |
| Nav bar | `NavBar.tsx` | Persistent jump-links (About/XR/Installations/UI‑UX/Art/Contact) once past the intro |
| About | `AboutSection.tsx` | Name, title "Immersive Experience Designer", a 2-paragraph bio, USC affiliation |
| Work sidebar (5 zones) | `WorkSidebar.tsx` + `data/project.tsx` | Project cards grouped by category (XR, Installations, UI/UX, Art, Research), each with a short description |
| Contact | `ContactSection.tsx` | Email, LinkedIn, GitHub — plain links |
| Project modal | `ProjectModal.tsx` | Full case-study text per project, opened by clicking a card |

**Generic/placeholder-feeling or context-dependent copy:**
- None of the actual project case-study copy (`data/project.tsx`) reads as placeholder — it's specific, detailed, and has real outcomes/numbers (e.g. "won against 80+ competitors," "3000+ person festival installation"). This is a genuine strength, worth stating plainly rather than only flagging problems.
- `AboutSection.tsx:47` (mobile bio) and `:131` (desktop second paragraph) both start "Student at USC's Iovine and Young Academy" — assumes the reader already knows what that program is. One clause of context (e.g., "USC's program for entrepreneurship + interactive media") would remove the ambiguity for a recruiter unfamiliar with the school. **NICE TO HAVE.**
- The intro tagline "XR · Installation · Interaction Design" (`IntroScreen.tsx:75`) is the very first thing a visitor reads and is also the page's *measured LCP element* (see §3) — it's abstract/categorical rather than a claim, which is a reasonable stylistic choice, but worth knowing it's carrying real weight as the first impression *and* the performance-critical element simultaneously.

**"What does this person do and what's their strongest proof point" — first two sections:**
The intro screen (section 1, `IntroScreen.tsx`) gives *category* ("XR · Installation · Interaction Design") but no proof point. About (section 2, `AboutSection.tsx:124-141`) gives one dense paragraph of description but the single strongest, most concrete proof point I found in the data — ShadeLA winning "against 80+ competitors" at a hackathon (`data/project.tsx:93-113`) — is buried in project #3 of the XR zone, reachable only after About *and* scrolling well into Work. **A recruiter skimming only the first two sections gets positioning, not evidence.** This is a real content-sequencing gap, not a copy-quality one — the proof exists, it's just not surfaced early. **SHOULD FIX.**

---

## 2. INFORMATION ARCHITECTURE / ESCAPE HATCHES

**Can a user skip the scroll narrative?** Partially, and the partial matters. `page.tsx:61-66` forces every visitor through `IntroScreen` first (`{!started && <IntroScreen onEnter={...} />}`) — one full-screen click-through gate, unavoidable, no skip link. **After** that single click, `NavBar.tsx:59-75` and `SectionNav.tsx` both provide instant jump-to-section links (`jumpTo(pos)` → `window.scrollTo({top: pos*max, behavior:'smooth'})`) — so a recruiter *can* jump straight to Contact or a work zone in one more click without scroll-swimming through all 900vh. The real gap isn't "no escape hatch" — it's that the escape hatch doesn't exist until after the mandatory intro click, and it still jumps to *zones*, not individual projects — there's no direct link to, say, the ShadeLA project specifically. **SHOULD FIX**, not blocking, since a working jump-nav does exist post-intro.

**Resume/CV, independent of the 3D experience:** Confirmed absent — grepped the entire `app/` tree for `resume`, `cv`, `download`: zero matches. Only email/LinkedIn/GitHub links exist (`ContactSection.tsx:5-9`). A recruiter who wants a traditional one-page PDF has no way to get one from this site. **BLOCKING** — this is table-stakes for a portfolio aimed at recruiters specifically, which the audit prompt itself frames as the primary skim-user.

**Nav consistency — re-checking the earlier audit's finding:** Confirmed **not consolidated.** All four files are untouched since the original audit and still hardcode independent threshold tables:
- `NavBar.tsx:6-19` — `SECTIONS` (6 entries) and a separate `MOBILE_SECTIONS` (4 entries), values don't match `SectionNav`'s.
- `SectionNav.tsx:5-13` — its own 7-entry array with different `pos` values than NavBar's (e.g. NavBar's "Installations" is at `0.42`, SectionNav's is at `0.40`).
- `ZoneIndicator.tsx:3-9` — its own 5-zone `{start,end}` table.
- `WorkSidebar.tsx:6-12` — a fourth, near-but-not-identical copy of the same 5 zones.

None import from a shared source. This means moving a section boundary requires editing four files by hand and they can (and already do, slightly) drift out of sync with each other. **SHOULD FIX.**

---

## 3. PERFORMANCE — measured

### Lighthouse scores (production build, corrected run)

| | Mobile | Desktop |
|---|---|---|
| Performance | **65** | **60** |
| Accessibility | 94 | 94 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

### Core metrics

| | Mobile | Desktop |
|---|---|---|
| FCP | 0.8s | 0.2s |
| **LCP** | **14.0s** | **2.7s** |
| TBT | 420ms | 660ms |
| CLS | 0 | 0 |
| Total transfer weight | 2,284 KiB | 2,284 KiB |

CLS is genuinely 0 on both — no layout-shift problems. That's a real positive, worth noting since it's easy for an audit to read as all-negative.

### What's driving LCP

Lighthouse identifies the LCP element as the intro tagline text on **both** profiles:
```
<div style="font-size: clamp(10px, 1.2vw, 13px); color: rgb(0, 229, 255);">
  XR · INSTALLATION · INTERACTION DESIGN
```
Breakdown: time-to-first-byte is 8-24ms (network is not the problem) — element render delay is **2.69s (mobile) / 2.94s (desktop)**. That delay traces directly to `IntroScreen.tsx`: a `setTimeout(() => setPhase('visible'), 400)` (`:11`) gates the fade-in, and the tagline's own style adds `transition: 'opacity 1.2s ease 0.4s'` (`:72-73`) — an *additional* 0.4s delay before a 1.2s fade even starts. That's ~1.6-2.9s of deliberate, code-level delay before the LCP element is visible, independent of any network or bundle-size factor. This is directly fixable by adjusting the intro's animation timing, and I'm flagging it factually rather than proposing a fix since this audit is read-only.

The 14.0s mobile figure is larger than the ~2.7s render-delay breakdown alone accounts for — Lighthouse's default mobile profile applies CPU throttling (~4x slowdown), and the main-thread work breakdown below shows real script-evaluation cost that would be amplified by that throttling. I don't have a fully reconciled explanation for the exact gap between the breakdown table's ~2.7s and the reported 14.0s LCP, and I'd rather say that plainly than assert a specific mechanism I haven't verified further.

### Bundle size breakdown — what's the largest contributor

Direct answer: **the Three.js/R3F/drei bundle**, not images or fonts.

| Chunk | Raw | Gzip | Content (confirmed via string search) |
|---|---|---|---|
| `0we7pqyibmwzm.js` | 1.2 MB | 375 KB | `WebGLRenderer` ×37, `CatmullRom` ×13, `@react-three`, `drei` — this is Three.js core + fiber + drei |
| `0yfvu7ya_th9d.js` | 227 KB | 71 KB | app code |
| `0xc7a.~y8i_xg.js` | 200 KB | 50 KB | app code |
| `03~yq9q893hmn.js` | 112 KB | 39 KB | app code |
| DM Sans font (woff2) | 36 KB | — | |
| `favicon.ico` | 26 KB | — | see §14 above |

Lighthouse's `unused-javascript` audit measured **243 KB (66%) of the largest chunk as unused** on initial page load — the Three.js bundle downloads and parses in full before the intro screen is even interactive, but most of it (postprocessing, materials never used until scroll, etc.) isn't needed for first paint. This is the highest-leverage, most factual performance finding in the whole audit: the biggest single cost is a library bundle that's mostly idle at first paint. **SHOULD FIX.**

### Frame rate — measured via injected rAF counter, not assumed

Ran a `requestAnimationFrame` sampler in-page (not simulated) for both branches, idle and during active scroll:

```
DESKTOP (1400×900):      idle avg=120.4fps min=107.5fps   |  scroll avg=119.5fps min=40.7fps
MOBILE-WIDTH (390×844,   idle avg=121.0fps min=97.1fps    |  scroll avg=120.4fps min=37.6fps
  forces useIsMobile()=true)
```

**Important caveat, stated plainly:** this machine is a desktop-class Mac running headless Chromium at a 120Hz-capable frame rate — the "MOBILE-WIDTH" row exercises the `useIsMobile()` code branch (simpler tentacle/oral-arm rendering, no postprocessing) but runs on desktop CPU/GPU, not real phone silicon. This measures "does the mobile code path itself run smoothly here," not "does it run smoothly on an actual phone." **I cannot verify real mobile-device frame rate from this environment — that needs to happen on real hardware, not simulated.**

What I can say with confidence from this data: both branches sustain well above 60fps at idle, and **both show a real, reproducible dip during active scrolling** — minimum dropping to 37-41fps, a ~65% drop from the idle baseline. That's not currently visible as jank in any of the many screenshots taken across this whole project's iteration (none showed stutter artifacts), but it's a measured, repeatable dip worth knowing about, especially combined with the Lighthouse mobile profile's 420ms TBT and 1.5s of script-evaluation time under throttling — real mobile hardware would likely show a more pronounced version of this same dip. **SHOULD FIX**, ranked below the LCP/bundle findings because it's not currently visibly broken, just measurably suboptimal.

### Render-blocking / lazy-loading

- `render-blocking-insight` scored 0 (worst), with 150ms of FCP/LCP savings identified by Lighthouse — a concrete, fixable render-blocking resource exists, though the audit tool didn't attribute it to a single named file in the data I extracted.
- **No image lazy-loading anywhere.** Every `<img>` tag in the codebase (`AboutSection.tsx:32,76`, `ProjectModal.tsx:101`, `WorkSidebar.tsx:86,147`) loads eagerly — no `loading="lazy"` attribute, no `next/image` usage anywhere (confirmed via grep, zero hits). All images are hosted externally on `i.imgur.com` — a third-party dependency with no local fallback if imgur has an outage, and no automatic format/size optimization (no WebP/AVIF conversion, no responsive `srcset`). None were broken at the time of this audit (0 failed requests in a full scroll-through, see §5), but this is architecturally a single point of failure and a missed optimization. **SHOULD FIX.**

---

## 4. ACCESSIBILITY

**`prefers-reduced-motion`: confirmed completely unhandled.** Grepped `app/` for the string — zero matches, anywhere. This is a scroll-driven site with a continuously-animating 3D creature, particle fields, a bell that pulses on a fixed rhythm regardless of scroll, and camera motion tied to scroll input — exactly the category of experience where motion-sensitive users need an opt-out, and there currently is none, not even a coarse one (e.g. disabling the ambient bell pulse or particle drift for `prefers-reduced-motion: reduce` users). **SHOULD FIX**, and I'd personally rank this higher than "nice to have" given the explicit prompt framing about motion-sensitive usability risk.

**Keyboard navigation:**
- `<button>` elements (6 in the codebase) are keyboard-accessible by default and no `outline: none` was found suppressing focus rings (checked `globals.css` and all component styles) — so standard nav buttons, the intro's click-to-enter, and section-nav dots *do* work with keyboard + Enter/Space.
- **Confirmed broken:** `WorkSidebar.tsx:75` and `:129` — the project cards that open `ProjectModal` (the actual "see my work" interaction) are plain `<div onClick={...}>` with zero `tabIndex`, `role`, or `onKeyDown`. Grepped the entire codebase for `tabIndex`, `onKeyDown`, `role=` — **zero results, all three, site-wide.** A keyboard-only user cannot open a single project. **BLOCKING** — this is the site's core content-viewing mechanism.
- `ProjectModal.tsx:113-121` — the image-pagination dots inside an open modal are also plain divs with no keyboard handling. Same class of issue, lower severity since it's a secondary control inside content that keyboard users can't reach anyway right now. **NICE TO HAVE** once the blocking issue above is fixed.
- Native document scrolling (Page Down / arrow keys / Space) is not intercepted anywhere (confirmed no `preventDefault` on scroll, matching the original jellyfish audit's finding) — so keyboard users *can* move through scroll-gated sections once past the intro, that part works.

**Screen reader / semantic structure:**
- Only **3** heading tags in the entire codebase: `AboutSection.tsx:94` (`<h1>`), `ContactSection.tsx:34` (`<h2>`), `ProjectModal.tsx:140` (`<h2>`). For a page with 6+ distinct sections, that's not enough structure for heading-based screen-reader navigation to be useful.
- Zero `aria-*` attributes anywhere in the codebase (confirmed via grep).
- The R3F `<canvas>` (`Scene.tsx`) has no `aria-label` or `aria-hidden` — a screen reader gets no context about what it is, while visually it's the entire background of the page.
- `IntroScreen.tsx:44-53` — the page's actual first, largest text ("Anjali Zalani") is a plain `<div>`, not a heading — while `AboutSection.tsx:94` has a *second*, separate `<h1>` with the identical text later in the DOM. Net effect: the visually-first heading isn't marked up as one, and there's a duplicate `<h1>` elsewhere. **NICE TO HAVE** on its own, but compounds the thin-heading-structure problem above.

**Text contrast — computed, not eyeballed** (WCAG formula, against the site's `#020818` background, `globals.css:13`):

| Color | Ratio | AA normal (4.5:1) | Where used |
|---|---|---|---|
| `rgba(255,255,255,0.2)` | 1.74:1 | **FAIL** | `SectionNav.tsx:59` — inactive section labels |
| `rgba(255,255,255,0.25)` | 2.11:1 | **FAIL** | `OnboardingHint.tsx:72` — "Click anywhere to skip" |
| `rgba(255,255,255,0.3)` | 2.56:1 | **FAIL** | `IntroScreen.tsx:87` ("Click to enter"), `ContactSection.tsx:70` (link labels) |
| `rgba(255,255,255,0.45)` | 4.47:1 | **FAIL** (just under) | `AboutSection.tsx:136` (bio paragraph body text), `WorkSidebar.tsx:154` (project descriptions), `NavBar.tsx:68` (inactive nav items) |
| `rgba(255,255,255,0.5)` | 5.31:1 | PASS | `ScrollHint.tsx:27` |
| `rgba(255,255,255,0.55)` | 6.25:1 | PASS | `ZoneIndicator.tsx:32` |
| `rgba(255,255,255,0.7)` | 9.74:1 | PASS | `ContactSection.tsx:77` |

**7 of the 10 distinct text-color values checked fail WCAG AA for normal text**, 4 of them by a wide margin (under 2.6:1, less than 60% of the required contrast). Notably `AboutSection.tsx:136` is the site's actual bio *content* (not a decorative label) failing at 4.47:1. **SHOULD FIX** — ranked below the keyboard-blocking issue because low contrast degrades readability rather than removing functionality entirely, but it's the most widespread single issue in this audit by instance count.

**A structural risk worth naming:** `globals.css:5` sets `cursor: none !important` on every element, unconditionally, relying entirely on `CustomCursor.tsx`'s JS-driven dot to provide any cursor at all. If JS fails to load, errors out, or is disabled, every visitor gets **zero visible cursor** anywhere on the site — no graceful CSS fallback. **NICE TO HAVE** to flag as a risk (narrow trigger condition), but worth knowing it's an unconditional `!important` rule, not a progressive enhancement.

---

## 5. TECHNICAL / SEO HYGIENE

**Meta title/description:** Present and accurate (`layout.tsx:11-13`) — "Anjali Zalani — Immersive Experience Designer" / a description matching the actual content. This is single-page (`app/page.tsx` is the only route — confirmed via `next build`'s route output: `○ /` and `○ /_not-found` only), so there's no per-section metadata to check; the one title/description pair is reasonable for the whole site.

**Open Graph / Twitter cards — what this looks like pasted into LinkedIn/Slack/iMessage right now:** `layout.tsx:14-19` sets `openGraph.title`, `.description`, `.url`, `.siteName` — but **no `images` field**, and **no `twitter` metadata block at all**. Pasted into any of those apps today, this site would show as a plain text card: title + description, **no thumbnail image**. For a visually-driven immersive-design portfolio, that's a meaningful missed first impression exactly at the moment (a shared link) recruiters are most likely to encounter it. **SHOULD FIX.**

**Favicon:** Present (`app/favicon.ico`, confirmed valid multi-size ICO: 16×16 and 32×32 at 32bpp) but unusually large at **25.9 KB** — typical favicons run 1-15 KB. It also showed up as a top-10 network request by size in the Lighthouse run. No `manifest.json` and no `apple-touch-icon` — if someone adds this site to a mobile home screen, they get a generic fallback icon, not a designed one. **NICE TO HAVE.**

**robots.txt / sitemap.xml:** Both confirmed absent (`find` returned nothing in `app/` or `public/`). For a single-page site this is low-stakes (nothing complex to crawl-control or sitemap), but a `sitemap.xml` costs nothing to add and a `robots.txt` is a one-line file that's expected by convention. **NICE TO HAVE.**

**Broken links / missing images / console errors — actually tested, full scroll-through:** Ran a real Playwright session against the production build: loaded, clicked through the intro, scrolled the full document in 12 steps with dwell time at each, and monitored console + network the whole way. **Result: 0 console errors, 0 failed/4xx/5xx requests.** All external `i.imgur.com` images resolved successfully. This is a genuine clean bill of health for the current, deployed state — stating it plainly since it's easy for an audit to read as all-problems.

**Analytics: confirmed absent.** Grepped for Google Analytics, gtag, Vercel Analytics, Plausible, PostHog, Mixpanel — zero matches in code or `package.json` dependencies. There is currently no way to know how many people visit this site, how far they scroll, whether they open any project, or whether they reach Contact. **SHOULD FIX** — you can't validate any of the other findings in this document against real user behavior without it.

---

## 6. CROSS-BROWSER / CROSS-DEVICE REALITY

What I can actually check from code (and did):

- **No `browserslist` config** — no `.browserslistrc`, no `browserslist` key in `package.json`. The project relies entirely on Next.js's built-in default target. Not broken, just unverified/uncustomized.
- **WebGL2 is a hard requirement, unconditionally.** Confirmed directly from the installed `three@0.184.0` source (`node_modules/three/src/renderers/webgl/WebGLCapabilities.js:119`: `isWebGL2: true, // keeping this for backwards compatibility`) — this version of three.js only creates WebGL2 contexts, no WebGL1 fallback exists in the library itself. WebGL2 has been supported in Safari since Safari 15 / iOS 15 (2021) and is standard in current Chrome/Firefox/Edge — reasonably safe for *modern* browsers, but this is a genuine hard floor: any browser without WebGL2 gets nothing (see the "no error boundary" point below), not a degraded experience.
- **No WebGL failure fallback anywhere.** Grepped for `ErrorBoundary`, `componentDidCatch`, `isWebGLAvailable`, any WebGL capability check — zero results. I confirmed directly (via a broken Lighthouse flag combination) that when WebGL context creation fails, the site throws uncaught errors into the console with **no visible fallback UI for the user** — someone on a browser/device/sandboxed environment where WebGL genuinely can't initialize (older hardware, some corporate/locked-down browsers, hardware acceleration disabled) would see a broken or blank page with no explanation. This is real and checkable in code, independent of the specific flag artifact that surfaced it.
- **`backdrop-filter` used unprefixed in 5 files** (glassmorphism panels throughout the site). Safari shipped unprefixed `backdrop-filter` only as of Safari 18 (2024); earlier versions need `-webkit-backdrop-filter`, which isn't present anywhere in the codebase (inline React styles don't auto-vendor-prefix). On older Safari this degrades *silently* (the blur simply won't render, panels stay whatever their background color is) rather than breaking anything — low severity, but a real, checkable-in-code cross-browser gap.
- **What I cannot verify by reading code, and want to be explicit about:** actual behavior on real Safari (desktop and iOS), actual behavior on a range of real Android devices/GPUs, actual touch-scroll feel on a physical phone, and whether the WebGL2 requirement above excludes any meaningful fraction of this site's real target audience (recruiters using work laptops, some of which run locked-down browser configurations). **None of this can be fully verified by reading source — it needs manual testing on real devices before this ships**, and I'm flagging that as the honest limit of a code-only audit rather than guessing at outcomes.

---

## What's already solid (stated plainly, not just problems)

- Project case-study copy is specific and has real proof points, not filler.
- Zero console errors and zero broken requests across a full real scroll-through of the production build.
- CLS is 0 on both mobile and desktop — no layout-shift problems.
- A working instant-jump nav exists post-intro (`NavBar`/`SectionNav`), so the "no escape hatch" risk is real but partial, not total.
- Alt text is present on every `<img>` tag found.
- Focus rings are not suppressed (no `outline: none` anywhere), so the accessible elements that do exist work correctly with keyboard.
