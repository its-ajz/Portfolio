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
    fullDesc: `Built an immersive AR scavenger hunt for Apple Vision Pro that turned a physical mural and surrounding architecture into a playable mixed-reality system. The goal was to encourage spatial exploration and embodied interaction: replacing traditional 2D UI with hand tracking, movement, and real-world anchoring.

**Core interactions:**
Hand-tracked projectile system where users physically aim and launch virtual planes to collect objects scattered in 3D space. Gesture-based pinch input with collision detection and state tracking.

Persistent message board anchored in the environment: users could leave 3D notes and emojis that stayed in place across sessions, creating layered interaction over time.

**Technical approach:**
Started with an iOS prototype to figure out the core interaction before moving to visionOS/RealityKit. Got hands-on with the challenges: hand tracking inconsistency, anchor drift, animation timing, interaction distance tuning. Weeks of iteration to make gestures feel natural in 3D space.

The final experience worked. People understood it immediately and spent time exploring, which was the real goal.`,
    category: 'xr',
    images: ['https://i.imgur.com/GYQUbgI.jpeg'],
    videoLink: 'https://drive.google.com/file/d/1hY-z30uIEjuqdQ2V7aYT0V1oX2xZMI0o/view?usp=sharing',
    tags: ['visionOS', 'RealityKit', 'SwiftUI', 'Spatial Computing', 'Hand Tracking'],
    link: 'https://drive.google.com/file/d/1hY-z30uIEjuqdQ2V7aYT0V1oX2xZMI0o/view?usp=sharing',
    position: [20, 3, -22],
    year: 2025,
    role: 'Designer & Developer',
  },
  {
    id: 'project-atlas',
    title: 'Project Atlas: VR Horror Experience',
    shortDesc: 'Hackathon VR prototype using environmental storytelling and psychological tension through lighting and space.',
    fullDesc: `Built a VR horror experience in a team of three during Viverse Spark Hackathon. The focus was on environmental storytelling: using lighting, spatial design, and interaction triggers to control pacing and create psychological tension rather than jump scares.

**Design philosophy:**
Constrain space. Control visibility. Guide emotion through light.

**What we built:**
- Modeled a claustrophobic cityscape in Maya, designed spaces to feel disorienting and inescapable
- Low-visibility environments where directional lighting guides player movement
- Proximity triggers and timed environmental changes for pacing control
- Assets optimized for real-time rendering in Unity
- Atmosphere as the primary mechanic

**Why this approach:**
Horror works best when players imagine the worst thing. Keep them in the dark (literally). Make them lean into the unknown. The environment becomes the threat.

Realized during this project how much of game design is about controlling what players can see and predict. You're not creating fear: you're creating the conditions where fear naturally emerges.

Shipped something cohesive under time pressure. Not every asset was perfect, but the vibe was there. That's what mattered.`,
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
    fullDesc: `A VR experience built in 12 hours at RealityShift (USC's first XR hackathon) that turned data about LA's shade inequality into something you could actually feel. Won against 80+ competitors.

**The problem:** Some LA neighborhoods have 4x more tree canopy than others, resulting in ~11°F temperature differences. People know it's hot. They don't feel what that difference means for different communities.

**The solution:** Meta Quest VR experience set in Pico Union, one of LA's least-shaded neighborhoods. Players had to complete quests while overheating and dehydrating: moving between sparse shaded areas, collecting water, trying to survive long enough to finish objectives.

The game was intentionally harsh. The sun is relentless. You feel the weight of those temperature differences when you're running out of water and there's nowhere to cool down.

**The outcome:**
Judges recognized it because it wasn't just data visualization: it was empathy through experience. Made an abstract problem visceral.

Coordinated the team across asset building, project management, and ensuring we shipped something cohesive in 12 hours while everyone was running on adrenaline. The speedrun forced hard creative decisions: what's essential? What can we cut? Results in tighter, more focused design.`,
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
    fullDesc: `Participated in the Android XR Hackathon in Long Beach (June 2026): a two-day sprint building for XREAL Project Aura, next-gen AR glasses powered by Google.

**The experience:**
Two days working on hardware I'd never used before. Built alongside engineers and developers from Google, Google DeepMind, Qualcomm, Unity, Unreal Engine, Godot Engine, Snapdragon, and XREAL. In the same room: CEOs who've shaped AR, people who've been in this space for years, people just getting started, people from all over the world.

What made it special wasn't the competition: it was listening to how differently everyone thinks about building for XR. Each perspective reflected a different vision of where spatial computing goes next.

**What I built:**
An AR sea creature experience using free-roaming creatures tied to ARPlane detection. Users could pinch to "catch" creatures. Each creature had different behaviors. A "Marina" companion AI provided narration using Android TTS. Creature collection persisted via PlayerPrefs.

**Technical approach:**
- ARCore planes for creature spawning and grounding
- Gesture recognition for catch mechanics
- Real-time audio narration synced to creature state
- Data persistence for creature collection

**Why it mattered:**
This was the first time building for a spatial computing platform I'd never seen before. Forced me to think about AR fundamentals without the guardrails of established tools. Also got to see how the industry thinks about Android XR as a real competitor to Vision Pro.

**Key takeaway:**
The future isn't "which platform wins." It's "which problems does each platform solve best?" Vision Pro for premium, tethered experiences. Snapdragon XR for lightweight, persistent, always-on AR. The tooling and thinking for each is already diverging.`,
    category: 'xr',
    images: ['/images/android-xr-hackathon-1.jpg', '/images/android-xr-hackathon-2.jpg'],
    tags: ['Android XR', 'XREAL', 'ARCore', 'Spatial Computing', 'Hackathon'],
    link: 'https://lnkd.in/gEfjPuh3',
    position: [22, 0, -22],
    year: 2026,
    role: 'Developer',
  },
  {
    id: 'its-a-date',
    title: 'It\'s a Date!: VR Choose-Your-Own-Adventure',
    shortDesc: 'Immersive branching narrative on Apple Vision Pro where every choice changes the story (and the ending gets chaotic).',
    fullDesc: `Built a 180° immersive video experience for Apple Vision Pro where you're dropped directly into a first-person date scenario. Every choice branches the narrative. Some endings are wholesome. Some spiral into complete chaos. One inexplicably turns into a stalker thriller.

**Technical approach:**
Shot all footage on an Insta360 X4 (true 180° video). Built natively in SwiftUI/Xcode for Vision Pro. The entire branching system runs through a JSON architecture: each decision loads a different video path and outcome.

Key technical challenges:
- Wrapping 180° video onto an inverted sphere mesh to make it actually feel immersive
- Building floating spatial UI elements that live inside immersive space without breaking the experience
- Handling branching video logic + scene state management
- VR filmmaking workflows and headset-compatible video export
- Debugging a lot of black screens and corrupted video files at 2am

**Why it mattered:**
Realized how fundamentally different storytelling works in VR vs. traditional film. First-person immersion changes what feels natural narratively. The same dialogue hits different when you're standing in the space.

Co-created with Cooper Queen. Huge thanks to Eve Nepo, Steven Dang, and Ethan Ryan Wu for being our main characters and acting their hearts out in 180° video.

One of the most fun projects because it broke something technically while making something you actually want to experience.`,
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
    fullDesc: `Designed an immersive rage room concept focused on stress release through intentional physical interaction. Developed the full experience flow, spatial layout, and interaction design to create a branded wellness activation for Nike.

**The insight:**
Movement is therapy. Give people a structured way to express frustration physically, and something shifts. The goal was to make the space feel safe while intense.

**What we designed:**
- Spatial flow that builds intensity progressively (entry → warm-up → peak → cooldown)
- Physical interaction points optimized for cathartic release
- Sensory design (sound, lighting, texture) that matches emotional trajectory
- Feedback loops so every swing/hit/throw feels satisfying

**Why it mattered:**
This was framed as a mental health activation, not just destruction for entertainment. Nike's angle was about healthy outlets for young athletes dealing with pressure. Made the case that movement-based experiences are legitimate wellness tools.

Pitched this to Nike as a branded experience concept. Even though it didn't ship, the thinking around how physical spaces can support emotional wellbeing shaped how I approach immersive design now.`,
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
    fullDesc: `A 3000+ person festival installation that transformed a song into a physical, walkable experience. Built as a guitar-shaped structure from 12-gauge wire where each section represented a different instrument (bass, drums, lead, rhythm, vocal).

**The concept:** Walk through an instrument's section → motion sensor triggers → that instrument's audio layer + synchronized lighting plays. Users could reconstruct the full composition through movement, or trigger different combinations by choosing their path.

**What actually happened:**
Built 5 wire instruments from scratch over weeks of bending and fabricating. Got 4 working, then 2 hours before the festival, moisture from humidity took down half the wiring setup. Day-of pivot: only 2 sensors worked reliably, audio wasn't syncing the way we planned.

Solution: hardcoded a playback loop where instruments played individually, then together, then as a full piece. Not what we designed, but it worked.

**The outcome that mattered:**
People didn't care it wasn't perfect. They ran back and forth triggering lights, groups danced around it, couples stood there playing with the interaction. They made it their own.

Led this as my first big project, which meant material sourcing, scheduling, problem-solving as things broke, and holding everything together when we weren't sleeping in the last 48 hours. Biggest lesson: "simple but works" beats "complex but broken."`,
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
    fullDesc: `An immersive installation exploring what happens when sound and sight blend. Built interactive DJ podiums where users could manipulate music (via mixer boards with knobs and sliders) and immediately see the audio spectrum transform into evolving projected visuals on custom-designed boards.

**The system:**
Audio input → TouchDesigner receives frequency data → generative visuals compute in real-time → projected onto 8ft installation boards. Users acted as DJs, sculpting both sound and visuals simultaneously.

Frequency mapped to color palette. Amplitude controlled animation speed. Rhythm shaped pattern behavior. Everything reactive, nothing pre-baked.

**The build:**
Started with 4ft × 8ft boards we had to fabricate and paint. Mid-way discovered boards were flipped wrong: they didn't line up. Solution: repaint them last-minute. Then had to shift the entire layout during final setup to make everything balance in the space. Not ideal timing, but it worked.

**What people experienced:**
Walk up to podium → talk, play music, sing → watch your voice turn into color and motion in real-time. That feedback loop was the whole point. And it worked. People understood it immediately, brought friends over, and stayed to experiment.

First time thinking deeply about how physical interaction shapes digital output in immersive environments.`,
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
    fullDesc: `Led the physical build and coordination for Terra Labs' first demo day: a 12ft long, 8ft tall volcano we designed and CNC'd ourselves. Around it, everything was interactive and real-time responsive.

**What we built:**
- Portal screens using eye + head tracking so the environment moves with you (looking through a window into another space)
- Projection-mapped lava flow running down the volcano in real-time
- Giant projection tracking visitor body + hand movements, creating live visual effects
- Robotic arm pouring matcha (Cove team's work)
- Robotic dog with LED liquid simulations + drink dispensing (Glyph team's work)

**My role:**
Director of Internals + co-PM on Lumen. Mostly meant: keeping the club running while building alongside everyone else. Coordinating across teams, making sure things stayed on track, bridging communication when different technical systems had to sync. I was also hands-on with the build: CNC'ing, assembling structural pieces, problem-solving as things broke.

**The outcome:**
20–25 people built it. 100+ showed up to experience it. People didn't just walk through: they stayed, explored, went back to things, brought friends. They made it theirs.

**What surprised me:**
You don't need everything to work perfectly. Two robotic systems shipped (when we planned three). Some projection elements were makeshift. But people interacted with it with genuine excitement. They felt the team's energy in the build.

This is what I got excited about in Terra Labs: the community aspect. It only worked because people showed up for each other. Next semester as VP, that's what I'm building on.`,
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
    fullDesc: `Leading the UX redesign of gptfy.ai, a Salesforce-native agentic AI platform that lets enterprises automate complex workflows within their CRM.

**Scope:**
- Site audit across 68+ pages
- Navigation and information architecture redesign
- Homepage redesign
- Pricing page redesign
- AI-powered site chatbot as core navigation tool

**Key challenge:**
GPTfy solves a real Salesforce problem, but communicates like a generic AI company. The website needed to clearly show: "This is *for Salesforce*, and here's why that matters."

**What I'm doing:**

1. **Navigation rethink**
   - Old approach: product → pricing → contact
   - New approach: audience-first (Admins | Developers | Business Users), then use cases, then pricing
   - Proposed AI-powered chatbot as the primary navigation + lead capture mechanism
   - Chatbot understands visitor role and guides them to relevant information

2. **Homepage redesign**
   - Leading with problem (Salesforce teams waste time on manual workflows)
   - Show solution clarity (agentic AI handles this automatically)
   - Use cases organized by role, not feature
   - Integration with Salesforce ecosystem shown prominently

3. **Pricing page redesign**
   - Current: confusing tier structure
   - New: starts with a calculator ("How many workflows do you have?") → suggests tier
   - Shows ROI in Salesforce terms (time saved × hourly cost)

4. **Chatbot strategy**
   - Not a gimmick: actual navigation tool
   - Understands visitor journey ("Do you already use Salesforce?" → different info)
   - Captures leads naturally without aggressive CTAs
   - Stays in-brand while being genuinely useful

**Why this matters:**
Most SaaS redesigns focus on making things look better. This one is about making the value proposition clear to the right people, at the right time. GPTfy does something valuable: the website just needs to get out of the way and let that shine.`,
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
    fullDesc: `Designed complete brand identity and digital experience for Undercover Cookies, a specialty cookie company with a distinctive brand voice.

**Full scope:**
- Logo design and brand mark variations
- Color system and typography
- Product photography direction
- E-commerce website design in Figma
- Animated transitions and micro-interactions (Jitter)
- Squarespace implementation

**Design thinking:**
Undercover Cookies isn't just "good cookies": it's personality-driven. The brand needed to feel playful, slightly irreverent, but still premium. Design had to match that tone.

**Key elements:**
- Logo that works as illustration and icon
- Color palette: warm, unexpected (not typical bakery pastels)
- Typography pairing that feels both modern and approachable
- E-commerce flow optimized for impulse purchase + gift giving

**Animation approach:**
Used Jitter for product showcases and hero animations. Motion reinforced the playful brand voice without being distracting.

**Outcome:**
The website shipped on Squarespace and handled growth well. The brand identity was cohesive across social, packaging, and digital: which is hard to pull off as a one-person design + brand lead situation.`,
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