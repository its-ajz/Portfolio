# Jellyfish Visual Rework — Analysis & Proposal (NOT IMPLEMENTED)

Reference image: soft backlit bell, no hard specular reflection, dense hair-thin
irregular trailing tendrils fading toward tips, frilled oral arms.
Current: `MeshTransmissionMaterial` bell with a hard bright horizon reflection,
12 uniform `TubeGeometry` tentacles/arms, no per-length glow falloff.

Nothing in this document has been implemented. It's organized as requested:
analysis first, then proposals A–D, each with a cost estimate and an explicit
check against the prior audit's per-frame-allocation problem.

---

## ANALYZE FIRST

### 1. Why the hard bright horizon reflection?

**Both causes, and they compound.** Confirmed by reading
`node_modules/@react-three/drei/core/MeshTransmissionMaterial.js` directly:

- The outer bell is `MeshPhysicalMaterial`-based (`MeshTransmissionMaterialImpl extends THREE.MeshPhysicalMaterial`, `MeshTransmissionMaterial.js:8`) with `roughness={0.08}` and `ior={1.45}` set in `Jellyfish.tsx:243,245`. Physical materials compute a specular IBL term (`EnvironmentBRDF`, `MeshTransmissionMaterial.js:242`) from `scene.environment` in addition to the transmission term. At `roughness 0.08` the specular lobe is nearly mirror-sharp — any bright feature in the environment map gets reflected as a crisp highlight rather than a soft blur. This is inherent to the roughness/IOR configuration, independent of what's in the environment.
- `Environment(preset="night")` (`Scene.tsx:33`) is what populates `scene.environment` with an actual HDRI. Drei's night preset has a bright sky/horizon band. That's the specific bright feature being mirrored. Without it, there'd be nothing bright to reflect — but the material would still be capable of producing a hard reflection if *any* other bright object entered the environment map.
- So: **low roughness makes the material capable of a hard mirror reflection; the night-preset HDRI supplies the bright thing being mirrored.** Removing either one removes the artifact; removing only roughness (cranking it up) would also kill the transmission clarity the material is otherwise there for, which nothing in the reference wants preserved anyway.

### 2. Would a custom fresnel-driven emissive ShaderMaterial look closer to the reference, and be cheaper?

**Yes to both, confirmed from source, not guessed.**

Visually: the reference reads as light *emanating from inside* the tissue — brightest at the rim, dim/translucent at the crown, no mirror-sharp reflections, no coherent background-shaped highlight. That is exactly what a fresnel-driven emissive term produces (rim brightens because `fresnel = pow(1 - dot(N,V), power)` naturally goes to 1 at grazing angles) and exactly what optical transmission/reflection does *not* naturally produce without a lot of extra tuning to suppress the reflection term.

Performance: `MeshTransmissionMaterial.js:333-378` shows its `useFrame` does not just "sample a texture" — every frame it:
1. Hides the parent mesh (swaps in a discard material),
2. Renders the **entire scene** into an FBO for the backside (`state.gl.render(state.scene, state.camera)`, line 354) — because `backside={true}` is set in `Jellyfish.tsx:240`,
3. Renders the **entire scene again** into a second FBO for the front (line 365),
4. Restores state.

That's **two full extra scene renders per frame**, every frame, purely to feed this one material — on top of the actual visible render. A custom `ShaderMaterial` with a fresnel/emissive fragment shader is a normal single-pass forward-rendered material: no FBOs, no extra scene traversals, no `state.gl.render()` calls. It is unambiguously cheaper, not just stylistically closer.

**Conclusion: default to replacing `MeshTransmissionMaterial`, per your instruction.** No finding here justifies keeping true transmission.

---

## A. BELL MATERIAL REWORK

**Proposal:** Replace `MeshTransmissionMaterial` (`Jellyfish.tsx:239-250`, desktop branch) with a custom `THREE.ShaderMaterial`:
- Fragment shader computes `fresnel = pow(1.0 - saturate(dot(normal, viewDir)), power)` and mixes a dim core color with a bright rim color driven by `fresnel`, plus a small amount of the existing point-light-driven internal glow (the `InnerGlowParticles`/inner core mesh already provide the "light source" feel — the shell just needs to look like it's *letting that light through*, not generating its own PBR-correct refraction).
- `transparent: true`, `side: THREE.DoubleSide` (replaces the `backside` prop — both faces in one draw call, one pass, no FBO), `depthWrite: false`, additive-leaning blend so overlapping shell layers glow instead of occlude.
- No `envMap` uniform is bound or sampled — because this is a from-scratch shader, "no reflections" isn't a flag to disable, it's simply code we don't write. This is what makes A2's answer safe by construction.

**Cost vs. current:** Cheaper, not more expensive. Current material forces 2 extra full-scene renders/frame (see analysis above) plus a full PBR lighting/IBL evaluation per fragment. The replacement is a single-pass shader with a handful of dot products and a `pow()` — no extra render targets, no extra scene traversal, no IBL sampling.

**Does Environment(preset="night") need to go too?**
Checked dependents before proposing removal, and found real ones — **do not remove it:**
- `ProjectNode.tsx:43` — all 23 project-node icosahedrons use `meshStandardMaterial` with `metalness={0.8}, roughness={0.2}`. High-metalness PBR materials derive almost all of their visible color from environment reflections; without `scene.environment` these would render as flat, near-black shapes. They need `Environment` to look like anything.
- The jellyfish's **other** `meshPhysicalMaterial` layers — inner bell (`Jellyfish.tsx:255-266`), velarium (`Jellyfish.tsx:269-280`), and the mobile bell (`Jellyfish.tsx:228-237`) — currently also sample `scene.environment` and likely show a milder version of the same hard-reflection artifact, since they're also low-roughness physical materials. These are candidates for the *same* shader treatment (see "Follow-up scope" below), but that's a separate, smaller change from removing `Environment` outright.

Net: keep `Environment`. The new custom bell shader is automatically unaffected by it (it doesn't sample `scene.environment` at all), so there's no conflict — the fix for the reflection problem is "the new material doesn't look at the environment," not "delete the environment for everyone."

**Follow-up scope (flagging, not proposing to do now):** the inner bell and velarium meshes (`Jellyfish.tsx:255-280`) are smaller, cheaper wins using the identical fresnel-shader technique, for visual consistency across all bell layers. Worth a fast pass after A ships, out of scope for this proposal unless you want it folded in.

---

## B. TENTACLE RENDERING — approach change, not just count

Confirmed motion driver first (relevant to both B and C): current tentacles use `THREE.TubeGeometry` built from a `CatmullRomCurve3` recomputed from a `points` array every frame (`Jellyfish.tsx:22-37` for `Tentacle`, `Jellyfish.tsx:59-85` desktop branch for `OralArm`). The "hair-thin trailing tendril" look in the reference doesn't need volumetric tube geometry at all — a thin, glowing *line/ribbon* primitive is both the right visual tool and removes the tube's per-frame Frenet-frame/tessellation cost entirely.

### Option 1 — `Line2` (fat lines), CPU-updated positions into a reused buffer

`three/examples/jsm/lines/{Line2,LineGeometry,LineMaterial}.js` are present in `node_modules/three` and drei re-exports a `<Line>` wrapper (`node_modules/@react-three/drei/core/Line.js:73`). Each strand becomes a `Line2` with screen-space width (supports true "hair-thin" constant pixel width, unlike a 3D tube which gets visually thicker/thinner with distance) and per-vertex color/opacity (so glow-fade-toward-tips is a vertex attribute, cheap).

- **Visual:** Supports thickness (via `LineMaterial.linewidth`, one value per line — not per-vertex tapering, so "uneven thickness along one strand" isn't native, only per-strand thickness). Supports glow-fade-toward-tip and irregular path (both via vertex data). Additive blending gives the glow look for free. Does **not** natively support intra-strand thickness variation — a real gap vs. the reference's tapering look, though tapering reads as secondary compared to the glow-fade and irregular-path traits.
- **Cost / allocation check:** If positions are written into a pre-allocated buffer and pushed via `LineGeometry.setPositions()` (analogous to the existing mobile `OralArm` pattern at `Jellyfish.tsx:70-78` — write into a buffer, flag dirty, no `new`), this avoids the current problem of allocating a new curve + new `TubeGeometry` every frame. CPU still walks every point of every strand every frame to compute the curve (SEGS+1 points × strand count), same order of work as today, just without the geometry-object churn. **Moderate cost, allocation-safe if implemented with a reused buffer — this is a real constraint on the implementation, not automatic.**

### Option 2 — GPU vertex-shader-driven ribbons, batched into one `InstancedMesh` (recommended)

Author one static base geometry **once** (`useMemo`, never touched again): a thin ribbon strip (two vertex columns, `SEGS+1` rows) running from `y=0` to `y=-length` in local space, with a `progress` attribute (0→1 along its length) baked in at creation. Batch 30–40+ of these as instances of a single `THREE.InstancedMesh`, with **per-instance attributes** (`phaseOffset`, freq/amp scale, a random seed, base rotation angle) set once at creation. A custom vertex shader displaces each vertex using `uniform time` + that vertex's `progress` + its instance's per-instance attributes (sine/noise-based bend, amplitude tapering toward the tip). A fragment shader fades opacity/emissive intensity by `1.0 - progress` for the tip fade the reference shows.

- **Visual:** Supports everything asked for — irregular per-strand path (seeded noise per instance), independent secondary motion (per-instance phase/freq, no two strands move identically), glow fade toward tips (fragment-shader falloff on `progress`), and thickness tapering (ribbon width scaled by `progress` directly in the vertex shader, actually easier here than in Option 1).
- **Cost / allocation check:** This is the cheapest of the two by a wide margin, and scales *better* as strand count grows, not worse. **Zero per-frame CPU allocation and zero per-frame CPU position math** — the only per-frame CPU work is one `uniforms.time.value = clock.elapsedTime` write. All curve/wave computation happens in the vertex shader, on the GPU, across a single draw call (that's what `InstancedMesh` collapses 30-40 objects into). Going from 12 CPU-rebuilt tubes to 30-40+ GPU-displaced instanced ribbons is a net cost *reduction*, not just a wash — this is the only option that fully satisfies "denser, at equal or lower cost."
- **Trade-off to flag honestly:** this is more upfront engineering (writing and debugging a custom vertex-displacement shader) than Option 1's CPU loop, which is closer to what the codebase already does. Higher one-time implementation cost, lowest possible runtime cost. Given the audit already flagged per-frame geometry rebuild as the #2 jank cause, I'd rather pay that complexity cost once than carry a CPU loop that merely got cheaper instead of actually cheap.

**Recommendation: Option 2**, with Option 1 as a fallback if the instanced-shader approach proves too time-consuming to get right on the first pass — Option 1 is still a strict improvement over today.

### Oral arm "frilled" texture — two ways, no new geometry complexity

Both apply to the same ribbon-based approach (oral arms become wider ribbons than the hair tendrils, still only 4 of them so can afford slightly more fragment cost per-pixel):

- **Alpha-cutout frill texture (recommended):** author or source one small tileable PNG with a ruffled/scalloped alpha edge, sample it in the fragment shader along the ribbon's width axis, `discard` below a threshold. **Cost: cheap** — one texture sample + compare per fragment, standard mipmapped texture, no geometry change at all.
- **Procedural shader-ruffle:** generate the ruffled edge with a `sin(progress * frequency + edgeSeed)`-based alpha cutoff instead of a texture, avoiding an asset dependency. **Cost: cheap**, marginally more ALU per fragment than a texture sample but avoids texture memory/load — reasonable if you'd rather not source/author a frill texture asset right now.

Either is fine; texture version will look richer for the same rough cost, procedural version has zero asset pipeline. Your call, not a performance-driven decision either way.

---

## C. MOTION CHARACTER — correction to the premise, then the proposal

You asked me to confirm whether motion currently comes from "a single shared sine/lerp driver." **Partially true, and worth being precise about:** each `Tentacle` and `OralArm` already gets a per-instance phase offset baked into the sine argument — `Math.sin(t * 1.8 + p * 10 + index * 1.4)` (`Jellyfish.tsx:29`) and `Math.cos(t * 2.1 + p * 8 + index * 1.1)` (`Jellyfish.tsx:31`); same pattern for `OralArm` at `Jellyfish.tsx:64,66` using `index * 2.1`/`index * 1.6`. So phase already varies per strand. What does **not** vary per strand: frequency (`t * 1.8`, `t * 2.1` — identical multiplier for every instance), amplitude curve (`amp = p * p * 2.0` — identical formula for every instance), and the phase offset itself is a deterministic linear function of `index` (`index * 1.4`), not randomized — so with 8 tentacles the motion reads as a rotated copy of one waveform repeated 8 times, which is exactly why it looks like "a single wave applied to everything," even though technically the phase term differs.

**Proposal:** per-strand `freqScale` and `ampScale` (small random multipliers, e.g. `0.85–1.15×` computed once at creation and stored per-instance/per-strand — not recomputed per frame), plus replacing the deterministic `index * const` phase with a seeded-random phase per strand. This directly attacks the "reads as one wave" problem instead of just adding more copies of it.

**Cost:** Near-zero, as you predicted — these are scalar multipliers baked into per-instance data (attributes, in the Option 2 architecture from B) computed once at mount via `useMemo`/`useRef`, not recomputed per frame. If B is implemented as the CPU-loop Option 1 instead, this is still just extra multiplication inside an already-running per-frame loop — no new allocations either way. **Confirmed: does not reintroduce the audit's per-frame-allocation problem.**

---

## D. MOBILE PARITY

Mobile's current tentacle path (`Jellyfish.tsx:70-78`) already does the right thing architecturally — write into a pre-allocated `Float32Array`, flag `needsUpdate`, no per-frame object creation — and mobile currently renders **zero** `Tentacle` instances at all (`!isMobile && Array.from(...)`, `Jellyfish.tsx:316`), only the 4 `OralArm`s via the buffer-geometry line path.

**Proposal: give mobile the same GPU-instanced-ribbon technique from B (Option 2), at a reduced instance count**, rather than leaving mobile on the old buffer-array approach or trying to give it full 30-40-strand parity. Reasoning, not just "mobile gets less":

- The instanced-shader approach's entire cost advantage is that per-frame CPU work is *constant* regardless of strand count (one `uniform.time` write). That means the expensive dimension on mobile isn't strand count, it's **GPU fragment/vertex throughput and fill-rate** — mobile GPUs are disproportionately fill-rate and bandwidth limited, not draw-call-count limited. A single `InstancedMesh` draw call is already the ideal shape for mobile regardless of instance count; the lever that actually matters for a mobile budget is keeping vertex-per-ribbon count low (fewer `SEGS`) and instance count moderate (e.g. 12-16 instead of 30-40), not switching techniques.
- This also means mobile can finally get real tentacles with tip-fade and organic motion (something it currently lacks entirely, since `Tentacle` is desktop-only) **without** reintroducing the CPU per-frame curve math the old desktop path had — mobile was never at risk from the *old* Tentacle component because it simply didn't run it; the new technique is safe to extend to mobile precisely because its cost model is different (GPU-bound, not CPU-bound).
- Oral arms: keep using the alpha-cutout-frill ribbon technique on mobile too, since that's also just a texture sample in the fragment shader — cheap on mobile GPUs, and mobile already renders 4 `OralArm`s today so this isn't new load, just a shader swap.

**Cost:** Moderate GPU cost added (mobile currently has zero tentacle rendering cost at all, so any addition is a net increase) — mitigated by lower `SEGS` and lower instance count than desktop. This is a real trade-off to confirm with you: mobile goes from "no trailing tentacles" to "a lighter version of the new look," which is a bigger visual change for mobile than for desktop. If mobile's GPU budget is tighter than I'm accounting for, the fallback is instance count 8 (matching current desktop tentacle count) rather than 12-16 — cheap to tune after first implementation, doesn't change the architecture.

---

## Summary table

| Change | Visual result | Relative cost vs. current | Reintroduces per-frame allocation? |
|---|---|---|---|
| A: custom fresnel ShaderMaterial replacing `MeshTransmissionMaterial` | Soft backlit rim glow, no hard reflection | **Cheaper** (removes 2 full extra scene renders/frame) | No |
| A: keep `Environment(preset="night")` | Unchanged for `ProjectNode` metals; new bell shader ignores it | No change (kept as-is) | N/A |
| B: Option 2, instanced GPU-ribbon tendrils (30-40+) | Hair-thin, irregular, tip-fade, independent motion | **Cheaper than current 12 tubes**, and scales better | No — zero per-frame CPU allocation by design |
| B: Option 1, `Line2` fallback | Same visual minus intra-strand taper | Moderate — same order of CPU work as today, but allocation-safe *if* implemented with a reused buffer | Only if implemented carelessly; flagged as a real implementation constraint |
| B: oral arm frill (texture or procedural) | Visible ruffled edge | Cheap either way | No |
| C: per-strand freq/amp/phase variation | Organic, non-uniform motion | Near-zero | No |
| D: mobile gets scaled-down instanced ribbons (8-16 strands) | Mobile goes from 0 tentacles to a lighter version of the new look | Moderate net increase (mobile currently renders none) | No |

Waiting for your go-ahead on A–D (or a mix — e.g. approve A and C now, hold B/D for a follow-up) before implementing anything.
