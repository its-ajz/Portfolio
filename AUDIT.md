# Jellyfish / Scroll Implementation Audit

Scope: `app/` directory of `Portfolionew/Portfolio`. Read-only analysis, no code changed.

---

## 1. SCROLL MECHANISM

**Native browser scroll — no scroll library.** There is no Lenis, GSAP ScrollTrigger, Framer Motion scroll, or any other scroll-smoothing library installed or imported anywhere in `app/`.

- The scrollable height is a plain empty div: `app/page.tsx:52` — `<div style={{ height: '900vh', pointerEvents: 'none' }} />`. This is what makes the page natively scrollable; the 3D canvas itself is `position: fixed` (`app/page.tsx:55`) and does not scroll.
- Scroll position is read via **three separate, independent** `window.addEventListener('scroll', ...)` listeners, each recomputing the same `0–1` progress value from `window.scrollY`:
  1. `app/page.tsx:30-39` — updates `scrollState.t` (a module-level mutable object, `app/utils/ScrollState.ts:1`) **and** calls `setScrollT(t)`, a React state setter, on every scroll event. `setScrollT` triggers a re-render of `Home` and all of its scroll-driven child components (`NavBar`, `SectionNav`, `ZoneIndicator`, `AboutSection`, `WorkSidebar`, `ContactSection` — all take `scrollT` as a prop, `app/page.tsx:70-76`).
  2. `app/components/ScrollManager.tsx:29-36` — updates `scrollRef.current` (a `useRef`, no re-render), consumed inside `useFrame`.
  3. `scrollState.t` (written at `app/page.tsx:34`) is **never read anywhere** — grepped across `app/`, its only other reference is the declaration in `app/utils/ScrollState.ts:1`. Dead state.
- `document.documentElement.scrollHeight - window.innerHeight` is recomputed on every single scroll event in both listeners above (`app/page.tsx:32`, `app/components/ScrollManager.tsx:31`) — a synchronous layout read (forces reflow) on every scroll tick, done twice.

**Scroll-jacking:** None found. Grepped for `preventDefault`, `scroll-snap`/`scrollSnap`, and `IntersectionObserver` — zero matches in `app/`. The only `window.scrollTo(...)` calls are user-initiated jumps from nav clicks (`app/components/NavBar.tsx:23,53`, `app/components/SectionNav.tsx:17`) and a one-time reset on load (`app/page.tsx:27`). The wheel/touch scroll gesture itself is never intercepted.

---

## 2. JELLYFISH PATH

- **Path definition:** `app/components/ScrollManager.tsx:8-17` — a `THREE.CatmullRomCurve3` with 8 hardcoded `Vector3` waypoints, curve type `'catmullrom'`, tension `0.5`, not closed (`false`).
- **Driving value:** `scrollRef.current` (raw scroll fraction, updated by the native `scroll` listener at `app/components/ScrollManager.tsx:29-36`) is smoothed into `smoothRef.current` via exponential lerp **inside `useFrame`**: `smoothRef.current += (scrollRef.current - smoothRef.current) * 0.06` (`ScrollManager.tsx:39`). Both are plain `useRef`s — no GSAP timeline, no component state driving the path.
- The jellyfish's path parameter `tJ` is offset from the smoothed scroll (`t + 0.04`, `ScrollManager.tsx:43`) so it leads the camera slightly along the curve.
- **Read location:** Entirely inside `useFrame` (`ScrollManager.tsx:38-65`). It does not trigger a React re-render — `jellyfishPos` is a `MutableRefObject<THREE.Vector3>` passed down as a prop and mutated in place (`ScrollManager.tsx:53`, declared in `Scene.tsx:16`), and the jellyfish group's actual transform is set imperatively (`jellyRef.current.position.lerp(...)`, `ScrollManager.tsx:56`).

---

## 3. PER-FRAME PERFORMANCE RISKS

### All `useFrame` callbacks found

| # | File:Line | Component | Instances at runtime |
|---|---|---|---|
| 1 | `app/components/Jellyfish.tsx:22-37` | `Tentacle` | 8 (desktop only, `Jellyfish.tsx:316-318`) |
| 2 | `app/components/Jellyfish.tsx:59-85` | `OralArm` | 4 (`Jellyfish.tsx:313`) |
| 3 | `app/components/Jellyfish.tsx:152-157` | `InnerGlowParticles` | 1 |
| 4 | `app/components/Jellyfish.tsx:180-186` | `LuminousEdge` | 1 |
| 5 | `app/components/Jellyfish.tsx:206-218` | `Jellyfish` (root) | 1 |
| 6 | `app/components/ScrollManager.tsx:38-65` | `ScrollManager` | 1 |
| 7 | `app/components/ProjectNode.tsx:22-37` | `ProjectNode` | 23 (`ALL_PROJECTS.length`, `app/data/project.tsx`) |
| 8 | `app/components/OceanParticles.tsx:32-36` | `ParticleLayer` | 3 (`OceanParticles.tsx:59-80`) |

Total live `useFrame` invocations per rendered frame (desktop): **8 + 4 + 1 + 1 + 1 + 1 + 23 + 3 = 42**.

### Unmemoized per-frame allocations

- **`Jellyfish.tsx:34`** (`Tentacle`, ×8 on desktop): `new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), SEGS, radius, 4, false)` — allocates a **new curve and a new geometry every frame**, for every tentacle. The old geometry is disposed (`Jellyfish.tsx:35`), but the allocate+build+dispose cycle runs 8×/frame.
- **`Jellyfish.tsx:81`** (`OralArm`, desktop branch, ×4): same pattern — `new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), SEGS, 0.035, 6, false)` every frame. Note the mobile branch (`Jellyfish.tsx:70-78`) avoids this by writing into a pre-allocated `Float32Array` (`positions`, `Jellyfish.tsx:57`) and setting `needsUpdate` — mobile does **not** have this allocation problem, desktop does.
- **`ScrollManager.tsx:46,47,52,57`**: four calls to `PATH.getPoint(t)` with no `optionalTarget` argument. Three.js's `Curve.getPoint(t, optionalTarget = new Vector3())` (confirmed in `node_modules/three/src/extras/curves/CatmullRomCurve3.js:175`) allocates a fresh `Vector3` whenever the target isn't supplied — so this is **4 new Vector3 allocations per frame**.
- **`ScrollManager.tsx:58`**: `nextJellyPos.clone().sub(jellyPos)` — a 5th `Vector3` allocation per frame, used only to compute a instantaneous velocity direction for tilt.
- **`ProjectNode.tsx`, `InnerGlowParticles`, `LuminousEdge`, `Jellyfish` root, `OceanParticles`**: no `new THREE.*` / `.clone()` calls inside their `useFrame` bodies — these mutate existing refs' `.scale`, `.rotation`, `.position`, or material properties in place. Clean.

### Postprocessing passes

`app/components/Scene.tsx:41-45`, active only when `!isMobile` (`Scene.tsx:40`):
- `Bloom` — `intensity={1.8}`, `mipmapBlur` enabled (`Scene.tsx:42`). Mipmap-blur bloom is the more expensive Bloom variant (multiple downsample/blur passes vs. single-pass).
- `Vignette` — cheap, single fullscreen pass (`Scene.tsx:43`).
- `ChromaticAberration` — cheap, single fullscreen pass (`Scene.tsx:44`).

All three run through a single `EffectComposer`, meaning at least one extra offscreen render target plus the full-screen Bloom downsample chain, every frame, on top of the primary scene render — on desktop only.

Separately, `MeshTransmissionMaterial` on the jellyfish's outer bell (`Jellyfish.tsx:239-250`, desktop only, `samples={4}`) performs its own internal render-to-texture pass of the scene behind the mesh to simulate transmission/refraction — this is independent of and in addition to the `EffectComposer` passes.

### Particle / instanced counts

- `OceanParticles.tsx:59-80` — three separate `THREE.Points` clouds (not instanced meshes): 8000 + 2000 + 60 = **10,060 points** total, each in its own `bufferGeometry`/`pointsMaterial`.
- `InnerGlowParticles` (`Jellyfish.tsx:140-175`) — 1 more `THREE.Points` cloud of 30 particles.
- No `InstancedMesh` usage found anywhere in `app/`.
- Lights: `ProjectNode.tsx:45` gives every one of the 23 project nodes its own `THREE.PointLight` (intensity animated toward 0 unless the jellyfish is near, `ProjectNode.tsx:34-36`, but the light object exists and is processed by the renderer regardless of its current intensity). Plus 2 more point lights on the jellyfish itself (`Jellyfish.tsx:296-301`, `304-310`). That's **25 dynamic point lights** in the scene graph simultaneously, plus `ambientLight` (`Scene.tsx:32`) and an `Environment preset="night"` IBL (`Scene.tsx:33`).

---

## 4. CURSOR REACTIVITY

- Cursor tracking exists in exactly one place: `app/components/CustomCursor.tsx:8-16`. A `mousemove` listener directly sets `dotRef.current.style.left/top` to `e.clientX/clientY` (`CustomCursor.tsx:11-12`) — **not** lerped or damped; it is a direct 1:1 DOM style write per mouse event. The only softening is a CSS `transition: 'transform 0.1s ease'` on the element (`CustomCursor.tsx:30`), which only smooths the `translate(-50%, -50%)` centering transform, not the position itself.
- This is a 2D HTML cursor dot only. There is no cursor-to-3D-scene reactivity anywhere — the jellyfish, camera, and particles do not respond to mouse position at all. Confirmed by grepping for `mousemove`/`pointermove` across `app/`: `CustomCursor.tsx` is the only hit.

---

## 5. SECTION/CHAPTER REVEALS

**Manual math against `scrollT`, no scroll-snap, no IntersectionObserver.** Confirmed via grep — zero matches for `scroll-snap`, `scrollSnap`, or `IntersectionObserver` in `app/`.

Every scroll-reactive UI component receives `scrollT` (the same `0–1` float from `app/page.tsx:35`) as a prop and computes its own visibility/opacity window from hardcoded thresholds:

- `app/components/AboutSection.tsx:7-10` — visible between `0.09` and `0.22`, opacity ramps over `0.04`-wide bands.
- `app/components/WorkSidebar.tsx:6-12,21-24` — 5 hardcoded `{start, end}` zones (`0.20`–`0.90`), opacity ramps over `0.03`-wide bands at each edge.
- `app/components/ZoneIndicator.tsx:3-9,15-18` — a second, slightly different copy of the same 5 zone ranges, `0.025`-wide fade bands.
- `app/components/ContactSection.tsx:13` — single threshold fade-in starting at `0.88` over `0.04`.
- `app/components/SectionNav.tsx:5-13,24-26` — 7 hardcoded `pos` values, active dot picked via `reduce` over `scrollT >= s.pos - 0.02`.
- `app/components/NavBar.tsx:6-19,29,31` — its own separate `SECTIONS`/`MOBILE_SECTIONS` arrays (values don't exactly match `SectionNav`'s or `ZoneIndicator`'s), active label picked via `reverse().find(...)`.

Note: `app/components/ZoneIndicator.tsx` and `app/components/SectionNav.tsx` each hardcode their own copy of the zone boundaries independently from `app/components/WorkSidebar.tsx`, and `NavBar.tsx` has yet another independent set of section positions — four separate hardcoded threshold tables driving overlapping UI, none imported from a shared source.

Two components exist in the tree but are **not imported/rendered anywhere** (confirmed via grep — no import outside their own file): `app/components/ScrollProgress.tsx` and `app/components/ZoneLabels.tsx`. Dead code.

---

## 6. DEPENDENCIES

From `node_modules/*/package.json` (installed versions, not just `package.json` semver ranges):

| Package | Installed version |
|---|---|
| `three` | `0.184.0` |
| `@react-three/fiber` | `9.6.1` |
| `@react-three/drei` | `10.7.7` |
| `@react-three/postprocessing` | `3.0.4` |

`package.json:12-19` semver ranges match (`^10.7.7`, `^9.6.1`, `^3.0.4`, `^0.184.0`).

**GSAP: not installed.** No `gsap` entry in `package.json` dependencies/devDependencies, no `node_modules/gsap` directory, no match for `gsap` in `package-lock.json`.

**Lenis: not installed.** No `lenis`/`@studio-freight/lenis` entry in `package.json`, no `node_modules/lenis` directory, no match in `package-lock.json`.

Other notable dependencies: `howler@^2.2.4` (ambient sound, `app/components/SoundManager.tsx` — note this component is defined but not imported in `app/page.tsx`, so it currently does not run), `next@16.2.6`, `react@19.2.4`.

---

## 7. KNOWN JANK

Ranked by confidence, based strictly on evidence above:

1. **Highest confidence — triple-redundant scroll listeners forcing layout + a React re-render on every scroll tick.** `app/page.tsx:30-39` reads `document.documentElement.scrollHeight` (forces reflow) and calls `setScrollT`, re-rendering `Home` plus 6 prop-drilled children (`NavBar`, `SectionNav`, `ZoneIndicator`, `AboutSection`, `WorkSidebar`, `ContactSection` — `page.tsx:70-76`) on **every native scroll event** (which can fire many times per second during a fling/trackpad scroll). `ScrollManager.tsx:29-36` does the same reflow-triggering computation independently, in parallel, for the same value. This is the most direct candidate for scroll-related stutter, since it couples input-frequency DOM events to React's render cycle rather than confining scroll response to the `useFrame`/rAF loop.

2. **Second — per-frame geometry rebuild for 12 tendril meshes on desktop.** `Jellyfish.tsx:34` (8 `Tentacle` instances) and `Jellyfish.tsx:81` (4 `OralArm` instances, desktop branch only) each allocate a new `CatmullRomCurve3` + build a new `TubeGeometry` (with associated vertex/index buffer generation) from scratch every single frame, then dispose the old one. That's 12 full geometry rebuilds/frame just for the tentacle system, which is GC-pressure- and CPU-heavy compared to the mobile code path (`Jellyfish.tsx:70-78`) that reuses a `Float32Array` and just flags `needsUpdate` — the codebase itself demonstrates the cheaper pattern exists but isn't used on desktop.

3. **Third — heavy per-frame lighting/postprocessing/transmission stack compounding on desktop.** 25 simultaneous `THREE.PointLight`s (`ProjectNode.tsx:45` ×23, `Jellyfish.tsx:296-301,304-310` ×2) plus a mipmap-blur `Bloom` pass (`Scene.tsx:42`) plus `MeshTransmissionMaterial`'s own internal transmission render pass (`Jellyfish.tsx:239-250`) all execute every frame on top of ~10,090 points (`OceanParticles.tsx` + `InnerGlowParticles`) and the 5 extra `Vector3` allocations/frame in `ScrollManager.tsx:46-58`. No single one of these is necessarily disqualifying alone, but stacked together on the same frame budget as #1 and #2, they're the most likely explanation for frame-time variance (vs. a scroll-input-latency problem specifically).
