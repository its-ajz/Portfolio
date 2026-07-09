export type ProjectData = {
  id: string
  title: string
  shortDesc: string
  fullDesc: string
  category: 'xr' | 'installation' | 'uiux' | 'art' | 'research'
  images: string[]
  videoLink?: string
  tags: string[]
  link?: string
  position: [number, number, number]
  year?: number
  role?: string
}

export const ZONE_COLORS = {
  xr:           '#00E5FF',
  installation: '#7B2FFF',
  uiux:         '#1BFFD3',
  art:          '#FF2D9B',
  research:     '#FF6B35',
}

export const ZONE_LABELS = [
  { label: 'XR & Spatial Computing', position: [18, 12, -20] as [number,number,number], color: '#00E5FF' },
  { label: 'Installations',           position: [-18, 12, -24] as [number,number,number], color: '#7B2FFF' },
  { label: 'UI / UX',                 position: [14, 10, -44] as [number,number,number], color: '#1BFFD3' },
  { label: 'Traditional Art',         position: [-16, 10, -42] as [number,number,number], color: '#FF2D9B' },
  { label: 'Research & Other',        position: [2,  10, -58] as [number,number,number], color: '#FF6B35' },
]

export const ALL_PROJECTS: ProjectData[] = [
  // ── XR / SPATIAL ─────────────────────────────────────────────
  {
    id: 'xr-mural',
    title: 'AR Scavenger Hunt: Vision Pro',
    shortDesc: 'World-anchored mixed-reality experience transforming physical architecture into an interactive spatial playground.',
    fullDesc: `Built an immersive AR scavenger hunt for Apple Vision Pro that turned a physical mural and the surrounding architecture into a playable mixed-reality system — hand tracking and real-world anchoring instead of a 2D UI.

- Hand-tracked projectile system: users physically aim and launch virtual planes to collect objects scattered through 3D space, with gesture-based pinch input and collision detection
- Persistent message board anchored in the environment — 3D notes and emojis that stayed in place across sessions, so interaction layered up over time

I was lead software engineer: built the gesture systems, world anchoring, collision mechanics, and spatial interaction design. Started with an iOS prototype to nail the core interaction before moving to visionOS/RealityKit, then spent weeks tuning hand tracking, anchor drift, and interaction distance until gestures felt natural in 3D space.

People understood it immediately and spent time actually exploring, which was the real goal — not just "look, AR," but a space worth spending time in.`,
    category: 'xr',
    images: ['https://i.imgur.com/GYQUbgI.jpeg'],
    videoLink: 'https://drive.google.com/file/d/1hY-z30uIEjuqdQ2V7aYT0V1oX2xZMI0o/view?usp=sharing',
    tags: ['visionOS', 'RealityKit', 'SwiftUI', 'Spatial Computing', 'Hand Tracking'],
    link: 'https://drive.google.com/file/d/1hY-z30uIEjuqdQ2V7aYT0V1oX2xZMI0o/view?usp=sharing',
    position: [20, 3, -22],
    year: 2025,
    role: 'Lead Software Engineer',
  },
  {
    id: 'project-atlas',
    title: 'Project Atlas: VR Horror Experience',
    shortDesc: 'Hackathon VR prototype using environmental storytelling and psychological tension through lighting and space.',
    fullDesc: `Built a VR horror experience with a team of three at Viverse Spark Hackathon. Instead of jump scares, we used lighting and spatial design to control what players could see and predict, and let the tension build from that.

Constrain space. Control visibility. Guide emotion through light — that was the whole design philosophy, and everything else followed from it:
- Modeled a claustrophobic cityscape in Maya, designed to feel disorienting and inescapable
- Laid out the space so directional light, not UI, guided where players went
- Proximity triggers timed environmental changes as players moved through the space
- Built and optimized all assets for real-time rendering in Unity

My role was asset modeling and set/environment layout design specifically — the cityscape geometry and how the space was laid out to control what players could see were mine to build and tune.

Horror works better when players imagine the worst thing themselves. Keep visibility low, make them lean into the unknown, and the environment does the scaring for you — you're not creating fear, you're creating the conditions where it shows up on its own.

Shipped in the hackathon window. Not every asset was polished, but the pacing held up, and that's the part that actually carries a horror experience.`,
    category: 'xr',
    images: ['https://i.imgur.com/JqIccUl.jpeg'],
    videoLink: 'https://worlds.viverse.com/GhMiNtd',
    tags: ['VR', 'Unity', 'Environmental Design', 'Maya', 'Atmosphere Design'],
    link: 'https://worlds.viverse.com/GhMiNtd',
    position: [14, -2, -30],
    year: 2024,
    role: 'Designer, Asset Modeling',
  },
  {
    id: 'shade-la',
    title: 'ShadeLA: VR Experience',
    shortDesc: 'First-place hackathon VR experience tackling LA\'s urban heat inequality through embodied gameplay.',
    fullDesc: `Built in 12 hours at RealityShift, USC's first XR hackathon. Won against 80+ competitors.

Some LA neighborhoods have 4x more tree canopy than others — about an 11°F difference. People know it's hot. They don't feel what that gap means for the people living in it.

The experience: a Meta Quest VR piece set in Pico Union, one of LA's least-shaded neighborhoods. Players complete quests while overheating and dehydrating — moving between sparse shaded spots, collecting water, trying to finish before the sun wins.

I was project lead and handled 3D asset design — coordinated the team across build and project management, and made the call on what shipped in 12 hours versus what got cut. That speedrun pressure was useful: it forces you to decide what's essential fast, and the result was tighter than if we'd had more time to overthink it.

Judges recognized it because it wasn't a data visualization — it was empathy through experience.`,
    category: 'xr',
    images: ['/images/shade-la-1.jpg'],
    videoLink: 'https://devpost.com/software/operation-atlas-blaze-edition',
    tags: ['Meta Quest', 'VR Design', 'Social Impact', 'Hackathon', 'Environmental Design'],
    link: 'https://devpost.com/software/operation-atlas-blaze-edition',
    position: [18, 2, -28],
    year: 2025,
    role: 'Project Lead, 3D Asset Design',
  },
  {
    id: 'android-xr-hackathon',
    title: 'Android XR Hackathon: XREAL Project Aura',
    shortDesc: 'Two-day AR spatial computing hackathon building for cutting-edge XREAL Project Aura glasses alongside engineers from Google, Qualcomm, Unity, and XREAL.',
    fullDesc: `Participated in the Android XR Hackathon in Long Beach (June 2026) — a two-day sprint building for XREAL Project Aura, next-gen AR glasses powered by Google.

Two days working on hardware I'd never used before, alongside engineers from Google, Google DeepMind, Qualcomm, Unity, Unreal Engine, Godot Engine, Snapdragon, and XREAL. In the room: CEOs who've shaped AR, people who've been in the space for years, and people just getting started.

What made it special wasn't the competition — it was hearing how differently everyone thinks about building for XR. Each perspective was a different bet on where spatial computing goes next.

Building for a platform I'd never touched forced me back to AR fundamentals without the guardrails of established tools. It also made the "Vision Pro vs. Android XR" framing feel wrong — the real question isn't which platform wins, it's which problems each one solves best. Vision Pro for premium, tethered experiences. Snapdragon XR for lightweight, persistent, always-on AR. The tooling and the thinking for each are already diverging.`,
    category: 'xr',
    images: ['/images/android-xr-hackathon-1.jpg', '/images/android-xr-hackathon-2.jpg'],
    tags: ['Android XR', 'XREAL', 'Spatial Computing', 'Hackathon'],
    link: 'https://lnkd.in/gEfjPuh3',
    position: [22, 0, -22],
    year: 2026,
    role: 'Developer',
  },
  {
    id: 'its-a-date',
    title: 'It\'s a Date!: VR Choose-Your-Own-Adventure',
    shortDesc: 'Immersive branching narrative on Apple Vision Pro where every choice changes the story (and the ending gets chaotic).',
    fullDesc: `A 180° immersive video experience for Apple Vision Pro — you're dropped directly into a first-person date. Every choice branches the story. Some endings are wholesome. Some spiral into chaos. One inexplicably becomes a stalker thriller.

- Shot all footage on an Insta360 X4 for true 180° video
- Built natively in SwiftUI/Xcode, branching entirely through a JSON architecture where each decision loads a different video path
- Wrapped 180° footage onto an inverted sphere mesh to make it read as immersive, not just "video in a headset"
- Built floating spatial UI that lives inside the immersive space without breaking it

Co-created with Cooper Queen — I handled the visionOS build, the branching logic, and the spatial UI; Cooper co-designed the narrative and led production. Huge thanks to Eve Nepo, Steven Dang, and Ethan Ryan Wu for acting their hearts out in 180°.

VR storytelling isn't just film with a headset on — first-person changes what feels natural narratively, and the same line of dialogue hits differently when you're physically standing in the space with the person saying it. Also: debugging corrupted 180° video files at 2am is its own genre of pain.`,
    category: 'xr',
    images: ['/images/its-a-date-1.jpg'],
    videoLink: 'https://azalani.itch.io/its-a-date',
    tags: ['visionOS', 'SwiftUI', 'Immersive Video', 'Narrative Design', '180° Video'],
    link: 'https://azalani.itch.io/its-a-date',
    position: [16, 1, -40],
    year: 2025,
    role: 'Co-Designer & Developer',
  },
  {
    id: 'nike-rage',
    title: 'Nike Rage Room: Experience Concept',
    shortDesc: 'Immersive wellness experience pitch: controlled environment where physical expression becomes emotional release.',
    fullDesc: `Designed an immersive rage room concept for Nike — a controlled environment where physical expression becomes emotional release, pitched as a branded wellness activation.

Movement is therapy. Give someone a structured way to express frustration physically and something actually shifts.

- Spatial flow that builds intensity in stages: entry → warm-up → peak → cooldown
- Physical interaction points designed specifically for cathartic release
- Sound, lighting, and texture tuned to match the emotional arc, not just for atmosphere

I designed the full experience flow, spatial layout, and interaction design solo. The pitch to Nike framed this as mental health infrastructure, not destruction-as-entertainment — healthy outlets for young athletes under pressure, not a stunt.

It didn't ship, but the thinking behind it — how a physical space can actually support someone's wellbeing rather than just look good — stuck with me and shows up in how I approach immersive design now.`,
    category: 'xr',
    images: ['https://i.imgur.com/dcALKBj.jpeg'],
    tags: ['Experience Design', 'Spatial Design', 'Wellness', 'Concept Pitch'],
    link: 'https://drive.google.com/file/d/12PcbZKZgxNsUv1tqCwu-azp_q37XDrrM/view?usp=sharing',
    position: [24, -4, -26],
    year: 2025,
    role: 'Experience Designer',
  },

  // ── INSTALLATIONS ─────────────────────────────────────────────
  {
    id: 'band-together',
    title: 'Band Together: Interactive Installation',
    shortDesc: 'Large-scale sensor-triggered installation where movement through space reconstructs a song instrument-by-instrument.',
    fullDesc: `A 3000+ person festival installation that turned a song into something walkable. Built as a guitar-shaped structure from 12-gauge wire, with each section representing a different instrument — bass, drums, lead, rhythm, vocal.

Walk through a section, a motion sensor triggers, that instrument's audio layer and synced lighting play. Walk through all of them and you've reconstructed the full song; take a different path and you get a different combination.

Built 5 wire instruments from scratch over weeks of bending and fabricating. Two hours before the festival, humidity took down half the wiring. Only 2 sensors were still reliable and the audio wouldn't sync as planned — so I hardcoded a playback loop instead: instruments solo, then together, then full piece. Not what we designed, but it worked, and nobody watching knew the difference.

This was my first project as lead: material sourcing, scheduling, problem-solving as things broke, holding it together on no sleep for the last 48 hours. People ran back and forth triggering lights and danced around it — they didn't care it wasn't the version we'd planned. Simple but works beats complex but broken.`,
    category: 'installation',
    images: ['https://i.imgur.com/kgRnBWR.jpeg'],
    videoLink: 'https://drive.google.com/file/d/1NAw_HMRQjRLfuD89z_nzBgQzkhCOCjVS/view?usp=sharing',
    tags: ['Physical Computing', 'Sensors', 'LED', 'Audio Integration', 'Project Leadership'],
    link: 'https://drive.google.com/file/d/1NAw_HMRQjRLfuD89z_nzBgQzkhCOCjVS/view?usp=sharing',
    position: [-16, 2, -24],
    year: 2026,
    role: 'Project Lead, Fabrication',
  },
  {
    id: 'synesthesia',
    title: 'Synesthesia: Audio-Visual Installation',
    shortDesc: 'Interactive installation where sound becomes visible: users manipulate audio to drive real-time generative projections.',
    fullDesc: `An installation exploring what happens when sound and sight blend. Built interactive DJ podiums where manipulating music — via mixer boards with real knobs and sliders — immediately reshaped the audio spectrum into evolving projected visuals on custom boards.

Frequency mapped to color. Amplitude controlled animation speed. Rhythm shaped pattern behavior. Nothing pre-baked, everything computed live in TouchDesigner from the raw audio input.

I led concept design, environment renders, and the spatial layout, plus wood fabrication and scenic painting on the boards. Midway through the build we realized the boards were flipped wrong and didn't line up — repainted them last-minute, then had to reshuffle the entire layout during setup to get the space balanced. Not ideal timing, but it came together.

Walk up, talk or sing or play something, and watch your own voice turn into color and motion in real time. People got it immediately, brought friends over, stayed to keep experimenting with it — which is the whole point of a feedback loop like this.`,
    category: 'installation',
    images: ['https://i.imgur.com/3pb21td.jpeg'],
    tags: ['TouchDesigner', 'Audio-Reactive', 'Generative Visuals', 'Interactive Art', 'Real-time Systems'],
    link: 'https://www.canva.com/design/DAG3-GsJSmM/Kr-AhlUcaQyIfKWi4vpRWg/view',
    position: [-20, -3, -32],
    year: 2026,
    role: 'Visual & Spatial Design',
  },
  {
    id: 'terra-lumen',
    title: 'Terra Labs Demo Day: Volcano Installation',
    shortDesc: '12ft interactive volcano with eye-tracking portals, projection mapping, and real-time body tracking for 100+ visitors.',
    fullDesc: `Led the physical build and coordination for Terra Labs' first demo day — a 12ft long, 8ft tall volcano we designed and CNC'd ourselves, surrounded by real-time interactive systems.

- Portal screens using eye and head tracking, so the environment shifts with you like looking through a window into another space
- Projection-mapped lava flow running down the volcano live
- A wall-sized projection tracking visitor body and hand movement into live visual effects
- A robotic arm pouring matcha (Cove team) and a robotic dog running LED liquid sims plus drink dispensing (Glyph team)

I was Director of Internals and co-PM on Lumen — kept the club running while building alongside everyone else, coordinated across teams so different technical systems actually synced, and was hands-on with CNC fabrication and structural assembly.

20–25 people built it. 100+ showed up and didn't just walk through — they stayed, went back to things, brought friends. We shipped two robotic systems instead of the three we planned, and some projection elements were makeshift, but people interacted with genuine excitement anyway. That's the actual lesson from Terra Labs for me: it only works because people show up for each other, and that's what I'm building on as VP next semester.`,
    category: 'installation',
    images: [
      '/images/terra-lumen-1.jpg',
      '/images/terra-lumen-2.jpg',
      '/images/terra-lumen-3.jpg',
      '/images/terra-lumen-4.jpg',
      '/images/terra-lumen-5.jpg',
      '/images/terra-lumen-6.jpg',
    ],
    tags: ['Project Leadership', 'Computer Vision', 'Projection Mapping', 'CNC Fabrication', 'Real-time Systems'],
    link: 'https://www.uscterralabs.com/',
    position: [0, 5, -24],
    year: 2026,
    role: 'Director of Internals, Co-PM, Fabrication Lead',
  },

  // ── UI/UX ──────────────────────────────────────────────────────
  {
    id: 'gptfy-redesign',
    title: 'GPTfy: Salesforce AI Platform Redesign',
    shortDesc: 'Site audit and redesign for a Salesforce-native agentic AI platform. Navigation architecture, chatbot integration, pricing structure.',
    fullDesc: `Leading the UX redesign of gptfy.ai, a Salesforce-native agentic AI platform that automates complex workflows inside a company's CRM.

GPTfy solves a real Salesforce problem but was communicating like a generic AI company — the site needed to say "this is for Salesforce, and here's why that's the point," not just "we do AI."

- Site audit across 68+ pages
- Navigation rebuilt audience-first (Admins / Developers / Business Users) instead of product-first, with an AI chatbot as the primary navigation and lead-capture tool — one that actually understands what the visitor's asking, not a gimmick bolted onto the homepage
- Homepage rebuilt to lead with the problem (Salesforce teams losing time to manual workflows) before the solution
- Pricing page rebuilt around a calculator — "how many workflows do you have" — that suggests a tier and shows ROI in Salesforce terms, instead of a confusing static tier table

Most SaaS redesigns just make things look better. This one is about getting GPTfy's actual value in front of the right person at the right moment — the design's job here is mostly to get out of the way.`,
    category: 'uiux',
    images: ['/images/gptfy-homepage.jpg'],
    tags: ['Figma', 'Information Architecture', 'SaaS Design', 'Product Strategy', 'AI Integration'],
    link: 'https://gptfy.ai/',
    position: [14, 1, -48],
    year: 2026,
    role: 'UX Designer (Ongoing)',
  },
  {
    id: 'undercover-cookies',
    title: 'Undercover Cookies: Brand Identity & Web',
    shortDesc: 'Full brand identity, e-commerce design, and animation for a specialty cookie brand.',
    fullDesc: `Full brand identity and digital experience for Undercover Cookies, a specialty cookie company with a personality-driven brand — playful and a little irreverent, but still premium enough to not feel gimmicky.

- Logo, brand mark variations, color system, and typography
- E-commerce site design in Figma, built on Squarespace
- Animated transitions and micro-interactions in Jitter, used for product showcases and hero moments — motion that reinforces the brand's tone without competing with it

I ran this as a one-person design and brand lead — logo through e-commerce flow through the final Squarespace build. The site shipped and handled growth well, and the brand stayed consistent across social, packaging, and digital, which is the part that's actually hard to pull off solo.`,
    category: 'uiux',
    images: ['https://i.imgur.com/PZscfOj.jpeg'],
    tags: ['Brand Design', 'Figma', 'E-commerce', 'Jitter', 'Squarespace'],
    position: [10, 0, -52],
    year: 2024,
    role: 'Brand Designer, Web Designer',
  },
  {
    id: 'healmed-design',
    title: 'HealMed: Healthcare Platform Design',
    shortDesc: 'Website UI/UX redesign for a patient-provider healthcare platform. Focus on accessibility and trust.',
    fullDesc: `Designed website UI and UX flows for HealMed, a platform connecting patients with healthcare providers. The core challenge: make healthcare feel human, not clinical or corporate.

**Project scope:**
- Website information architecture
- Onboarding flows for patients and providers
- Dashboard design for appointment management
- Provider profile pages
- Mobile responsiveness across all flows

**Design philosophy:**
Healthcare platforms are often sterile because they prioritize compliance over experience. Good design doesn't require sterile. It requires clarity, empathy, and accessible patterns.

**Key design decisions:**
- Clean typography hierarchy for easy scanning
- Color used purposefully (green for actions/progress, not gratuitous)
- Forms optimized for healthcare data (insurance, medical history) without feeling invasive
- Mobile-first approach (many patients access on phones)
- Trust signals without overdoing it (real credentials > marketing language)

**Accessibility focus:**
- WCAG AA compliant color contrasts
- Keyboard navigation throughout
- Form patterns that work with screen readers
- Clear language (avoided jargon where possible)

**Outcome:**
The redesign improved onboarding completion rates and user satisfaction scores. Proved that healthcare UX doesn't have to be boring: it just has to be honest.`,
    category: 'uiux',
    images: ['https://i.imgur.com/leO1e71.jpeg'],
    tags: ['Figma', 'Healthcare', 'Accessibility', 'Product Design'],
    link: 'https://docs.google.com/presentation/d/163QLYaCWrJKHXHl1fen40gfUfXLP39G7IZb9SPbYarw/edit',
    position: [16, 2, -44],
    year: 2024,
    role: 'UX Designer',
  },

  // ── TRADITIONAL ART ───────────────────────────────────────────
  {
    id: 'chameleon',
    title: 'Chameleon Portrait',
    shortDesc: 'Digital art: expressive portrait study.',
    fullDesc: 'A digital portrait study exploring texture, color, and character through the subject of a chameleon. Created using digital painting techniques focusing on iridescent color transitions and detailed surface texture.',
    category: 'art',
    images: ['https://i.imgur.com/ny3ECuL.jpeg'],
    tags: ['Digital Art', 'Portrait', 'Illustration'],
    position: [-14, 4, -40],
  },
  {
    id: 'beneath-the-sea',
    title: 'Beneath the Sea',
    shortDesc: 'White charcoal study of underwater life.',
    fullDesc: 'A white charcoal drawing exploring the ethereal quality of underwater environments. Uses the tension between light and dark to create depth and atmosphere.',
    category: 'art',
    images: ['https://i.imgur.com/gmcuqv1.jpeg'],
    tags: ['Charcoal', 'Drawing', 'Traditional'],
    position: [-22, -1, -46],
  },
  {
    id: 'connecting',
    title: 'Connecting',
    shortDesc: 'Mixed media: graphite and string.',
    fullDesc: 'A mixed media work combining graphite drawing with physical string elements. The piece explores themes of connection, relationship, and the tension between two-dimensional mark-making and three-dimensional materiality.',
    category: 'art',
    images: ['https://i.imgur.com/nQU6RnZ.jpeg'],
    tags: ['Mixed Media', 'Graphite', 'String'],
    position: [-18, 6, -52],
  },
  {
    id: 'northern-lights',
    title: 'Northern Lights',
    shortDesc: 'Linocut print: atmospheric abstraction.',
    fullDesc: 'A linocut print capturing the abstract, layered quality of the aurora borealis. Relief printing technique used to build up translucent color layers that mimic the movement of light across a night sky.',
    category: 'art',
    images: ['https://i.imgur.com/C41fLzj.jpeg'],
    tags: ['Linocut', 'Printmaking', 'Traditional'],
    position: [-12, -3, -48],
  },
  {
    id: 'collisions',
    title: 'Collisions',
    shortDesc: 'Digital art: abstract composition.',
    fullDesc: 'A digital artwork exploring the visual language of collision: the moment two forces meet and transform each other. Uses sharp geometric forms against organic marks to create dynamic tension.',
    category: 'art',
    images: ['https://i.imgur.com/k7PVfxd.jpeg'],
    tags: ['Digital Art', 'Abstract'],
    position: [-20, 2, -56],
  },

  // ── RESEARCH & OTHER ──────────────────────────────────────────
  {
    id: 'accessibility',
    title: 'Digital Accessibility Research',
    shortDesc: '6-month research project: how accessibility features in games change player understanding and inclusion.',
    fullDesc: `A research project exploring the relationship between accessibility design and player empathy. Spent 6 months analyzing how accessibility features in video games influence player experience and inclusion: not from a compliance angle, but from a human one.

**The research questions:**
How do adaptive controls change the way players approach problem-solving? Does haptic feedback improve comprehension for players with visual impairments? Can accessibility systems (when designed well) actually improve experience for *everyone*?

**What I did:**
- Conducted 10+ user interviews with players of different abilities
- Analyzed accessibility systems in 6 different games
- Built a prototype game concept that removed accessibility features entirely to show what's lost
- Documented how design decisions create or eliminate barriers to understanding

**The insights:**
Accessibility isn't a feature: it's a design philosophy. Games that think about multiple input methods, multiple sensory channels, and multiple difficulty approaches end up being better games, period. Players with disabilities often *prefer* games with strong accessibility: not because they need it, but because it's better designed.

**Why this mattered:**
Most accessibility discussion is about compliance. This was about empathy through data. Showed that accessible design is good design. Published research paper + video documentation through Polygence.`,
    category: 'research',
    images: ['https://i.imgur.com/dOTkJlm.jpeg'],
    tags: ['Research', 'Game Design', 'Accessibility', 'User Testing'],
    link: 'https://drive.google.com/file/d/1jOhy8WOHaHyfSanqxFAoCtetOFnOJ80W/view?usp=sharing',
    position: [4, -2, -56],
    year: 2024,
    role: 'Researcher',
  },
  {
    id: 'hdi',
    title: 'HDI Data Analysis Tool',
    shortDesc: 'Java system for analyzing and projecting global development trends.',
    fullDesc: 'A Java-based system for analyzing and projecting Human Development Index trends using historical datasets. Implemented data parsing, interpolation algorithms, and automated graph generation to visualize global development patterns across countries and decades.',
    category: 'research',
    images: ['https://i.imgur.com/x3Rr7XE.jpeg'],
    tags: ['Java', 'Data Analysis', 'Algorithms'],
    link: 'https://docs.google.com/presentation/d/10PkX51O9ja_R8tuk6YigMKr3hVbBoGWhJ2YpDcSkyPs/edit',
    position: [0, 3, -62],
  },
  {
    id: 'pcb',
    title: '4-Bit Logic Counter PCB',
    shortDesc: 'Custom PCB built from scratch using only logic gates.',
    fullDesc: 'Designed and fabricated a custom PCB implementing a 4-bit counter using only logic gates. Built through schematic design, breadboarding, PCB layout, and soldering. Debugging done through signal tracing and systematic testing of each gate stage.',
    category: 'research',
    images: ['https://i.imgur.com/ppUXSli.jpeg'],
    tags: ['Hardware', 'PCB', 'Logic Gates', 'Electronics'],
    link: 'https://docs.google.com/document/d/1FaN6FeVWWgSNVlhgHmLLYerJ0ENETOrdJvpsdk37iNc/edit',
    position: [-4, -4, -58],
  },
  {
    id: 'smart-lighting',
    title: 'Smart Lighting Logic System',
    shortDesc: 'Sequential logic system for automated lighting using flip-flop circuits.',
    fullDesc: 'A sequential logic system simulating automated lighting behavior based on environmental inputs like occupancy and light levels. Built using flip-flop circuits and tested in Multisim. Models a real-world smart building system with multiple input conditions and output states.',
    category: 'research',
    images: ['https://i.imgur.com/343nxLR.jpeg'],
    tags: ['Logic Systems', 'Simulation', 'Hardware', 'Multisim'],
    link: 'https://docs.google.com/document/d/1q1SM0IBxurEh7JEm2gZfWxiLiQP4Zxqx9990J7avit4/edit',
    position: [8, 1, -64],
  },
]