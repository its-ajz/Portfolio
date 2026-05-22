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
    title: 'XR Mural Experience',
    shortDesc: 'Apple Vision Pro spatial interaction system — mixed-reality scavenger hunt.',
    fullDesc: `A spatial computing experience built for Apple Vision Pro that transforms a physical mural and surrounding architecture into a playable mixed-reality system.

Designed as a world-anchored scavenger hunt with gesture-based interaction, users navigate the space to discover objects, complete interaction loops, and leave persistent messages. The project focuses on embodied interaction — replacing UI with hand tracking, movement, and spatial awareness.

Built a pinch-based projectile mechanic using hand tracking + anchors. Users physically aim and interact with virtual objects in space. Implemented collision detection, object state tracking, and completion logic.

Users place messages anchored in real-world space. Messages persist across sessions, creating layered interaction over time.`,
    category: 'xr',
    images: ['https://i.imgur.com/GYQUbgI.jpeg'],
    videoLink: 'https://drive.google.com/file/d/1hY-z30uIEjuqdQ2V7aYT0V1oX2xZMI0o/view?usp=sharing',
    tags: ['XR', 'visionOS', 'RealityKit', 'Spatial Computing'],
    link: 'https://drive.google.com/file/d/1hY-z30uIEjuqdQ2V7aYT0V1oX2xZMI0o/view?usp=sharing',
    position: [20, 3, -22],
  },
  {
    id: 'project-atlas',
    title: 'Project Atlas',
    shortDesc: 'VR horror experience built in a hackathon — environmental storytelling through lighting and space.',
    fullDesc: `A VR horror experience built in a team of three during the Viverse Spark Hackathon. Focused on environmental storytelling and psychological tension, using lighting, spatial design, and interaction triggers to control pacing.

Modeled cityscape and environmental assets in Maya. Designed spaces to feel constrained and disorienting. Created assets optimized for real-time rendering.

Trigger-based events using proximity triggers and timed environmental changes. Designed pacing through controlled reveals. Low visibility environments with directional lighting guiding player movement.`,
    category: 'xr',
    images: ['https://i.imgur.com/JqIccUl.jpeg'],
    videoLink: 'https://worlds.viverse.com/GhMiNtd',
    tags: ['VR', 'Unity', 'Hackathon', '3D Modeling'],
    link: 'https://worlds.viverse.com/GhMiNtd',
    position: [14, -2, -30],
  },
  {
    id: 'color-maze',
    title: 'Color Maze',
    shortDesc: 'Interactive 3D game built in Unity with color-based puzzle mechanics.',
    fullDesc: 'An interactive maze experience where color is the primary mechanic. Players navigate through shifting color environments where the rules of visibility and movement are defined by hue and saturation.',
    category: 'xr',
    images: ['https://i.imgur.com/7lqwjjK.jpeg'],
    tags: ['Game Design', 'Unity', 'Interactive'],
    link: 'https://drive.google.com/file/d/1NS1wLBfdPMGafjFvOSqt7nMng-DEZLhT/view?resourcekey',
    position: [22, 5, -34],
  },
  {
    id: 'unicorp',
    title: 'UniCorp',
    shortDesc: 'Narrative-driven entrepreneurship adventure game.',
    fullDesc: 'A narrative-driven game where players rebuild a startup through interactive decisions. Combines storytelling, humor, and real-world business mechanics into a playable experience. Designed to make abstract business concepts tangible through gameplay.',
    category: 'xr',
    images: ['https://i.imgur.com/lqXtzj2.jpeg'],
    tags: ['Game Design', 'Narrative', 'Interactive'],
    link: 'https://www.canva.com/design/DAG3O-Ujew4/qnL2kySkSDBczT5YoumxiA/view',
    position: [16, 1, -40],
  },
  {
    id: 'nike-rage',
    title: 'Nike Rage Room',
    shortDesc: 'Immersive mental health experience pitch — controlled environment for emotional expression.',
    fullDesc: 'Designed an immersive rage room concept focused on stress release through physical interaction. Developed the experience flow, spatial layout, and interaction design to create a controlled environment for emotional expression through movement. Concept pitched to Nike as a branded wellness activation.',
    category: 'xr',
    images: ['https://i.imgur.com/dcALKBj.jpeg'],
    tags: ['Experience Design', 'Concept', 'Mental Health', 'Pitch'],
    link: 'https://drive.google.com/file/d/12PcbZKZgxNsUv1tqCwu-azp_q37XDrrM/view?usp=sharing',
    position: [24, -4, -26],
  },

  // ── INSTALLATIONS ─────────────────────────────────────────────
  {
    id: 'band-together',
    title: 'Band Together',
    shortDesc: 'Large-scale interactive music installation — walk through a song.',
    fullDesc: `A large-scale immersive installation that turns a song into a physical, walkable experience. Built as a guitar-shaped structure from bent steel wire, where each section represents a different instrument.

As users move through the structure, sensors trigger corresponding audio and lighting, allowing them to reconstruct the full composition through movement.

Five instrument sections mapped to physical zones. Photoelectric sensors detect user movement. Each sensor triggers individual instrument audio layers and corresponding lighting. Multiple users can collaborate simultaneously.`,
    category: 'installation',
    images: ['https://i.imgur.com/kgRnBWR.jpeg'],
    videoLink: 'https://drive.google.com/file/d/1NAw_HMRQjRLfuD89z_nzBgQzkhCOCjVS/view?usp=sharing',
    tags: ['Installation', 'Physical Computing', 'Audio', 'Sensors'],
    link: 'https://drive.google.com/file/d/1NAw_HMRQjRLfuD89z_nzBgQzkhCOCjVS/view?usp=sharing',
    position: [-16, 2, -24],
  },
  {
    id: 'synesthesia',
    title: 'Synesthesia',
    shortDesc: 'Interactive audio-visual installation — sound controls real-time generative visuals.',
    fullDesc: `An immersive installation where users manipulate sound to directly control real-time visuals. Built interactive stations that allow multiple users to shape audio inputs, which drive generative projection systems.

Audio mapped to color (frequency → palette), motion (amplitude → speed), and form (rhythm → pattern behavior). Generative visuals continuously evolve based on user input. Large-scale projection system with lighting synced to audio and visuals.`,
    category: 'installation',
    images: ['https://i.imgur.com/3pb21td.jpeg'],
    tags: ['TouchDesigner', 'Audio-Visual', 'Installation', 'Interactive Art'],
    link: 'https://www.canva.com/design/DAG3-GsJSmM/Kr-AhlUcaQyIfKWi4vpRWg/view',
    position: [-20, -3, -32],
  },
  {
    id: 'alexa',
    title: 'Alexa Echo Dot',
    shortDesc: 'High-fidelity 3D model of the Amazon Echo Dot in Autodesk Maya.',
    fullDesc: 'A detailed 3D model of the Amazon Alexa Echo Dot created in Autodesk Maya. Focused on accurate surface modeling, material properties, and lighting to achieve a photorealistic result. Includes full UV unwrapping and shader work.',
    category: 'installation',
    images: ['https://i.imgur.com/LHdLRm7.jpeg'],
    tags: ['3D Modeling', 'Maya', 'Product Design'],
    link: 'https://drive.google.com/file/d/1mj_OvzTT6_wMZWylfk78h7jB62xsKDp9/view?resourcekey',
    position: [-12, 5, -26],
  },

  // ── UI/UX ──────────────────────────────────────────────────────
  {
    id: 'healmed',
    title: 'HealMed Website Design',
    shortDesc: 'Full website design for a healthcare platform in Figma.',
    fullDesc: 'A comprehensive website design for HealMed, a healthcare platform connecting patients with providers. Designed in Figma with a focus on accessibility, trust, and clarity. Covers onboarding flows, dashboard design, appointment booking, and mobile responsiveness.',
    category: 'uiux',
    images: ['https://i.imgur.com/leO1e71.jpeg'],
    tags: ['Figma', 'UI/UX', 'Healthcare', 'Web Design'],
    link: 'https://docs.google.com/presentation/d/163QLYaCWrJKHXHl1fen40gfUfXLP39G7IZb9SPbYarw/edit',
    position: [16, 4, -46],
  },
  {
    id: 'undercover-cookies',
    title: 'Undercover Cookies',
    shortDesc: 'Brand identity, web design, and animation for a cookie business.',
    fullDesc: 'Full brand identity and digital design for Undercover Cookies — a specialty cookie brand. Designed in Figma with animations in Jitter, then implemented in Squarespace. Covers logo, color system, typography, product photography direction, and e-commerce flow.',
    category: 'uiux',
    images: ['https://i.imgur.com/PZscfOj.jpeg'],
    tags: ['Figma', 'Jitter', 'SquareSpace', 'Brand Identity'],
    link: 'https://docs.google.com/presentation/d/1MJrWlrDKEGeoPm6bwB2g40yi4fSZvliBk_iZwXMU4Qk/edit?usp=sharing',
    position: [12, 0, -52],
  },

  // ── TRADITIONAL ART ───────────────────────────────────────────
  {
    id: 'chameleon',
    title: 'Chameleon Portrait',
    shortDesc: 'Digital art — expressive portrait study.',
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
    shortDesc: 'Mixed media — graphite and string.',
    fullDesc: 'A mixed media work combining graphite drawing with physical string elements. The piece explores themes of connection, relationship, and the tension between two-dimensional mark-making and three-dimensional materiality.',
    category: 'art',
    images: ['https://i.imgur.com/nQU6RnZ.jpeg'],
    tags: ['Mixed Media', 'Graphite', 'String'],
    position: [-18, 6, -52],
  },
  {
    id: 'northern-lights',
    title: 'Northern Lights',
    shortDesc: 'Linocut print — atmospheric abstraction.',
    fullDesc: 'A linocut print capturing the abstract, layered quality of the aurora borealis. Relief printing technique used to build up translucent color layers that mimic the movement of light across a night sky.',
    category: 'art',
    images: ['https://i.imgur.com/C41fLzj.jpeg'],
    tags: ['Linocut', 'Printmaking', 'Traditional'],
    position: [-12, -3, -48],
  },
  {
    id: 'collisions',
    title: 'Collisions',
    shortDesc: 'Digital art — abstract composition.',
    fullDesc: 'A digital artwork exploring the visual language of collision — the moment two forces meet and transform each other. Uses sharp geometric forms against organic marks to create dynamic tension.',
    category: 'art',
    images: ['https://i.imgur.com/k7PVfxd.jpeg'],
    tags: ['Digital Art', 'Abstract'],
    position: [-20, 2, -56],
  },

  // ── RESEARCH & OTHER ──────────────────────────────────────────
  {
    id: 'accessibility',
    title: 'Digital Accessibility Research',
    shortDesc: '6-month research project on accessibility in video games.',
    fullDesc: 'A 6-month research project analyzing how accessibility features in video games impact user understanding and inclusion. Focused on how design decisions influence perception of sensory impairments, exploring systems like subtitles, haptics, and adaptive controls. Produced original research findings with design recommendations.',
    category: 'research',
    images: ['https://i.imgur.com/dOTkJlm.jpeg'],
    tags: ['Research', 'Accessibility', 'Game Design'],
    link: 'https://drive.google.com/file/d/1jOhy8WOHaHyfSanqxFAoCtetOFnOJ80W/view?usp=sharing',
    position: [4, -2, -56],
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