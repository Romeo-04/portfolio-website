// ============================================================
// PORTFOLIO DATA & CONFIGURATION
// ============================================================
// Replace placeholder values with your actual information.
// Search for "ADD_" prefixed strings to find all placeholders.
// ============================================================

// --- Site Configuration ---
export const siteConfig = {
  name: "Jhezra A. Tolentino",
  title: "Software & AI Engineer",
  description:
    "Jhezra A. Tolentino — Software and AI engineer building full-stack web platforms, on-device machine learning and agent-driven development workflows.",
  url: "https://jhez-cafe.vercel.app",
};

// --- Personal Information ---
export const personalInfo = {
  name: "Jhezra A. Tolentino",
  firstName: "Jhezra",
  role: "Software & AI Engineer",
  /** The résumé's headline; the chalkboard's subtitle. */
  headline: "Software Engineering · AI Engineering",
  tagline:
    "Building thoughtful systems across full-stack web, on-device machine learning, and agent-driven development.",
  subtitle:
    "Championing systems that blend logic, creativity, and impact.",
  school: "FEU Tech",
  program: "Computer Science",
  heroImage: "/Tolentino_Jhezra_1x1Photo.png",
  resumeUrl: "/resume.pdf", // Place your resume PDF in /public/resume.pdf
  email: "jhezraang@gmail.com", // e.g., "jhezra@example.com"
  github: "https://github.com/Romeo-04", // e.g., "https://github.com/jhezra"
  linkedin: "https://www.linkedin.com/in/jhezra-tolentino/", // e.g., "https://linkedin.com/in/jhezra"
};

// --- GitHub exclusions ---
// Repos hidden from the GitHub grid and the café's specials case: the
// profile config repo, this site, practice and coursework repos. Lower-case.
export const githubExclude: string[] = [
  "romeo-04",
  "portfolio-website",
  "learn-git",
  "my-first-repo",
  "webdev_practice",
  "github-copilot-practice",
  "neetcode-submissions",
  "leetcodesolutions",
  "star-sight", // duplicate push of STARSight; "datara" is the featured copy
];

// --- About Section ---
export const aboutData = {
  bio: [
    "I'm a software engineer and Computer Science student at FEU Institute of Technology, specializing in Software Engineering and graduating in 2027. I'm a DOST-SEI and University Elite Scholar with a 3.8 GPA, and my work sits where full-stack web development meets AI engineering.",
    "I'm a Software Engineering Intern at Ed3N Ventures, where I work AI-first: I direct coding agents across two production projects and put my own effort into harness design, agent workflows, guardrails and code review, so the output stays accountable.",
    "Before that I led the FEU Tech ACM Student Chapter's web development team and served as its Director for Academics. My thesis, KitaKo, is an image search that runs entirely on an Android phone and treats Taglish queries as fairly as English ones.",
  ],
  currently: {
    studying: "Computer Science at FEU Tech",
    building: "A fintech platform and an agent platform at Ed3N Ventures",
    exploring: "On-device multimodal retrieval & agent harness engineering",
    aimingFor: "Software engineering internships & research opportunities",
  },
};

// --- Skill Categories ---
export type CategoryColor =
  | "amber"
  | "blue"
  | "rose"
  | "orange"
  | "violet"
  | "slate";

// Semantic icon label kept in the data; no component maps it to an icon now.
export type CategoryIcon =
  | "code"
  | "layout"
  | "server"
  | "database"
  | "brain"
  | "wrench";

export type SkillTier = "house" | "seasonal" | "experimental";

export interface Skill {
  name: string;
  tier: SkillTier;
}

export const tierLabels: Record<SkillTier, string> = {
  house: "House Blend",
  seasonal: "Seasonal",
  experimental: "Experimental",
};

export interface SkillCategory {
  title: string;
  color: CategoryColor;
  icon: CategoryIcon;
  skills: Skill[];
}

// Categories and names follow the résumé's Technical Skills section.
export const skillsData: SkillCategory[] = [
  {
    title: "Languages",
    color: "amber",
    icon: "code",
    skills: [
      { name: "Python", tier: "house" },
      { name: "TypeScript", tier: "house" },
      { name: "JavaScript", tier: "house" },
      { name: "SQL", tier: "house" },
      { name: "C++", tier: "seasonal" },
      { name: "Dart", tier: "seasonal" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    color: "blue",
    icon: "layout",
    skills: [
      { name: "Next.js", tier: "house" },
      { name: "React", tier: "house" },
      { name: "Tailwind CSS", tier: "house" },
      { name: "Flutter", tier: "seasonal" },
      { name: "FastAPI", tier: "seasonal" },
    ],
  },
  {
    title: "AI / ML",
    color: "violet",
    icon: "brain",
    skills: [
      { name: "PyTorch", tier: "seasonal" },
      { name: "ONNX", tier: "seasonal" },
      { name: "Agentic development", tier: "experimental" },
      { name: "Prompt & harness engineering", tier: "experimental" },
      { name: "LoRA fine-tuning", tier: "experimental" },
      { name: "SigLIP-2", tier: "experimental" },
      { name: "ANN indexing", tier: "experimental" },
    ],
  },
  {
    title: "Databases & Tools",
    color: "orange",
    icon: "database",
    skills: [
      { name: "PostgreSQL", tier: "house" },
      { name: "Git", tier: "house" },
    ],
  },
];

// --- Experience / Leadership ---
/** Organisation logos in public/logos; aspect is width / height. */
export const ORG_LOGOS = {
  eden: { src: "/logos/eden.webp", alt: "EDEN", aspect: 200 / 66, dark: true },
  feu: { src: "/logos/feu.webp", alt: "FEU Institute of Technology", aspect: 262 / 320, dark: false },
  acm: { src: "/logos/acm.webp", alt: "ACM Student Chapter", aspect: 1, dark: false },
} as const;
export type OrgLogo = keyof typeof ORG_LOGOS;

export interface Experience {
  title: string;
  organization: string;
  period: string;
  description: string[];
  /** Logos shown on the roastery plaque and in the panel, left to right. */
  logos?: OrgLogo[];
}

export const experienceData: Experience[] = [
  {
    title: "Software Engineering Intern",
    organization: "Ed3N Ventures",
    logos: ["eden"],
    period: "July 2026 – Present",
    description: [
      "Drive AI-first development across two production projects by directing coding agents rather than writing code manually",
      "Focus engineering effort on harness design, agent workflows, guardrails and code review to keep the work accountable and high quality",
      "Lead delivery of a production fintech backend in Next.js 15, TypeScript and PostgreSQL for a creator revenue-financing platform",
      "Designed and shipped a channel-agnostic FastAPI backend that pairs Telegram and WhatsApp bots for an agent provisioning platform",
    ],
  },
  {
    title: "Lead Web Developer",
    organization: "FEU Tech ACM Student Chapter",
    logos: ["feu", "acm"],
    period: "August 2025 – August 2026",
    description: [
      "Led a web development team of beginner and junior developers, guiding system architecture design and skill-building for the chapter website",
      "Developed a full-featured Next.js 14 (App Router) and TypeScript e-commerce platform for official ACM merchandise, serving 400+ members",
      "Optimized the shop for mobile and desktop with a Tailwind CSS interface",
    ],
  },
  {
    title: "Director for Academics",
    organization: "FEU Tech ACM Student Chapter",
    logos: ["feu", "acm"],
    period: "August 2024 – August 2025",
    description: [
      "Led the academics committee, organizing review sessions and peer tutorials that addressed course-related challenges across cohorts",
      "Designed and implemented institute competitions while coordinating across multiple committees",
    ],
  },
];

// --- Projects ---
export interface Project {
  id: number;
  title: string;
  slug: string;
  pitch: string;
  description: string[];
  techStack: string[];
  category: string;
  role: string;
  featured: boolean;
  demoUrl: string; // Replace ADD_DEMO_URL_HERE
  repoUrl: string; // Replace ADD_REPO_URL_HERE
  /** Optional hand-picked drink. Otherwise derived from techStack. */
  drink?: {
    cup?: "glass" | "mug" | "cup";
    layers?: { name: string; color: string }[];
  };
}

export const projectsData: Project[] = [
  {
    id: 12,
    title: "Homestead",
    slug: "homestead",
    pitch:
      "Co-op space-mission game for the NASA Space Apps Challenge 2026: four astronauts scavenge parts, build a spacecraft, fly it and land on the Moon or Mars.",
    description: [
      "A ten-minute run in three phases: explore and build a spacecraft from scavenged parts, fly it with each player on their own station, then work Mission Control's list on the surface",
      "Owned the Pilot and Comms seat on a six-person team, covering two of the four flight stations and the flight events",
      "Plays solo or with up to four people online over WebRTC, host-authoritative, with seeded runs and no server of its own",
      "Part stats, hazards and the closing mission report are drawn from NASA sources, and each run ends by naming the real mission that made the same trade-off",
    ],
    techStack: ["TypeScript", "HTML5 Canvas", "Vite", "PeerJS", "Web Audio API"],
    category: "Game",
    role: "Pilot & Comms seat · team of 6",
    featured: true,
    demoUrl: "",
    repoUrl: "https://github.com/TadeyRuk/Homestead",
  },
  {
    id: 13,
    title: "CS Expo 2026 Website",
    slug: "cs-expo-2026",
    pitch:
      "Website and event platform for CS Expo 2026, the annual capstone showcase of the FEU Tech Computer Science Department.",
    description: [
      "Own the backend with the backend team: Supabase as the system of record, with Postgres row level security, Supabase Auth and a public media bucket",
      "Every CMS change is a Server Action with Zod validation and a server-side role check, and database triggers append it to an insert-only audit log",
      "Built guest accounts, registration with resume upload, a profile pass and venue check-in with attendance by day",
      "One of two maintainers who cut the staging-to-main release; a release gate keeps unreleased sections out of production",
    ],
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Zod"],
    category: "Event Platform",
    role: "Backend Developer · release maintainer",
    featured: true,
    demoUrl: "https://fit-cs-expo.vercel.app",
    repoUrl: "",
  },
  {
    id: 1,
    title: "CitySense Live Geo",
    slug: "citysense-live-geo",
    pitch:
      "Geospatial intelligence cockpit for urban planning with real-time Earth observation data and AI-powered planning guidance.",
    description: [
      "Built a geospatial intelligence web cockpit designed for urban planners and environmental analysts",
      "Streams Earth observation layers (heat, greenspace, flood, air quality, mobility, equity) into an interactive Leaflet map via WMTS/WMS protocols",
      "Integrated AI weather assistant with live Open-Meteo data and DeepSeek R1-backed planning guidance",
      "Implemented theme-based layer toggling and planning-focused environmental indicators",
    ],
    techStack: [
      "TypeScript",
      "Vite",
      "Leaflet",
      "WMTS/WMS",
      "Tailwind CSS",
      "Node.js",
    ],
    category: "Web App",
    role: "Full-Stack Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/citysense-live-geo",
  },
  {
    id: 2,
    title: "ACMX Merchandise Shop",
    slug: "acmx-merch-shop",
    pitch:
      "Modern e-commerce platform for a 400+ member student organization with cart management, payment verification, and admin workflows.",
    description: [
      "Developed a full-featured e-commerce web application for the ACM student chapter",
      "Built responsive product catalog with size-aware cart system and pickup scheduling",
      "Implemented manual payment verification flow for GCash/Maya with admin review dashboard",
      "Created admin panel with audit trail, payment review queue, and reservation expiry handling",
    ],
    techStack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "Supabase",
      "Zustand",
      "Zod",
      "GSAP",
    ],
    category: "E-Commerce",
    role: "Lead Web Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "",
  },
  {
    id: 3,
    title: "TrackHab",
    slug: "trackhab",
    pitch:
      "Smart habit tracking application with intelligent streaks, analytics dashboard, and GitHub-style heatmaps for personal productivity.",
    description: [
      "Built a full-stack habit tracking web application with daily and weekly habit management",
      "Implemented intelligent streak calculation engine and comprehensive analytics dashboard",
      "Created GitHub-style contribution heatmap for visual habit tracking progress",
      "Integrated secure authentication, server actions, and optimistic UI updates with dark/light theme support",
    ],
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "NextAuth",
      "Zod",
    ],
    category: "Productivity",
    role: "Full-Stack Developer",
    featured: false,
    demoUrl: "https://smart-habit-tracker-fawn.vercel.app",
    repoUrl: "https://github.com/Romeo-04/smart-habit-tracker",
  },
  {
    id: 4,
    title: "Archeon",
    slug: "archeon",
    pitch:
      "AI-powered architectural memory that reconstructs the reasoning behind engineering decisions — answering not just what changed, but why.",
    description: [
      "Built an ingestion pipeline that extracts decision context from git commits, PRs, issues, READMEs, and architectural decision records",
      "Engineered a two-pass query engine combining graph completion with semantic search to answer questions with source attribution",
      "Implemented confidence scoring that tags results as cited, inferred, or unknown to surface evidence gaps",
      "Added lifecycle management with orphan detection, ADR recovery, forget-on-delete, and a keyless extraction mode",
    ],
    techStack: [
      "Python",
      "Cognee",
      "Knowledge Graphs",
      "GitHub API",
      "LLM",
    ],
    category: "Developer Tool",
    role: "Lead Developer · Cognee hackathon team of 4",
    featured: false,
    demoUrl: "https://kishiagaytano.github.io/archeon/",
    repoUrl: "https://github.com/kishiagaytano/archeon",
  },
  {
    id: 5,
    title: "FinHealth Platform",
    slug: "finhealth-platform",
    pitch:
      "Explainable financial-health and micro-insurance recommendation engine for rural banks and microfinance institutions in the Philippines.",
    description: [
      "Built a 3-layer decision-support system: data ingestion & standardization, an explainable financial health scoring engine, and a risk-informed micro-insurance recommendation layer",
      "Designed four transparent scoring dimensions (income stability, savings/liquidity, debt burden, resilience & protection) with an optional labelled ML sub-component — never a black-box top-level model",
      "Implemented affordability and anti-mis-selling guardrails so recommendations never exceed what a client can sustainably afford",
      "Built a documented REST API with a longitudinal shock-simulation endpoint modeling a 4-quarter typhoon scenario across protected vs. unprotected clients",
    ],
    techStack: ["Python", "FastAPI", "React", "scikit-learn", "SQLite", "Pydantic"],
    category: "FinTech",
    role: "Full-Stack Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/finhealth-saas",
  },
  {
    id: 6,
    title: "ArkiRev",
    slug: "arkirev",
    pitch:
      "Construction-tech tool that turns a marked-up floor plan revision into a field brief, per-trade budget exposure, and a critical-path construction sequence.",
    description: [
      "Built a Streamlit application that compares an approved floor plan against a revised version and auto-generates an annotated change register",
      "Computed budget and schedule impact analysis per construction trade from detected plan changes",
      "Produced a critical-path construction sequence reflecting the revised scope",
      "Prepared sample pitch data and a demo script for a hackathon presentation",
    ],
    techStack: ["Python", "Streamlit"],
    category: "Construction Tech",
    role: "Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/arki-rev",
  },
  {
    id: 7,
    title: "Cha-Tsing",
    slug: "cha-tsing",
    pitch:
      "Personal finance PWA for Filipinos, guided by an animated monkey mascot who reacts to your spending and savings in real time.",
    description: [
      "Built a fully offline-capable PWA with zero backend — all state lives in localStorage on-device",
      "Designed a parametric SVG mascot with 5 emotional states and gaze-tracking eyes that react live to budgeting behavior",
      "Implemented drag-and-drop expense budgeting, dream/goal tracking with timelines, and category-based burn-down tracking",
      "Set up auto-deploy to GitHub Pages via GitHub Actions on every push to main",
    ],
    techStack: ["React", "Vite", "vite-plugin-pwa"],
    category: "FinTech",
    role: "Developer",
    featured: false,
    demoUrl: "https://romeo-04.github.io/Cha-Tsing/",
    repoUrl: "https://github.com/Romeo-04/Cha-Tsing",
  },
  {
    id: 8,
    title: "KitaKo",
    slug: "kitako",
    pitch:
      "Undergraduate thesis: an image search that runs entirely on an Android phone and answers Taglish queries as fairly as English ones.",
    description: [
      "Fine-tuned SigLIP-2 via LoRA (0.32% trainable parameters) on a 109K-image Taglish dataset, improving Filipino-query fairness (DPR 0.43 to 0.86) and cutting cross-language bias by 60% (TVD)",
      "Built a fully on-device multimodal image retrieval system for Android: dataset construction, ONNX INT8 quantization, HNSW / IVF-PQ ANN indexing, and Flutter with C++ FFI inference, with no cloud dependency",
      "Designed a Taglish (Tagalog–English code-switching) retrieval pipeline with near-complete language parity between Taglish and English queries (mAP: p = .920, d = −0.01) on a structured IR benchmark",
      "Product Manager for Team Stochastic 4, since December 2025",
    ],
    techStack: ["PyTorch", "Flutter", "ONNX", "C++", "SigLIP-2", "LoRA"],
    category: "Research",
    role: "Product Manager · Team Stochastic 4",
    featured: true,
    demoUrl: "https://kitako-eight.vercel.app",
    repoUrl: "https://github.com/Emyol/Stochastic4-Website",
  },
  {
    id: 9,
    title: "STARSight",
    slug: "starsight",
    pitch:
      "Regional intelligence platform that turns fragmented teacher and school records into a transparent, ranked national capacity-building plan for DOST-SEI's STAR program.",
    description: [
      "Built the Python data pipeline: ingestion, per-teacher profiling, regional aggregation, and a transparent weighted Underserved Area Index scoring engine",
      "Implemented the FastAPI backend exposing REST endpoints, including a CSV upload flow that re-runs the full pipeline with no server restart",
      "Designed a privacy-by-design boundary so no per-teacher data ever leaves the pipeline — only division-level aggregates reach the API",
      "Built for the START a Ton Challenge, a national datathon hosted by the DOST Science Education Institute's STAR Program",
    ],
    techStack: ["Python", "FastAPI", "pandas", "Nuxt 3", "Vue 3", "Leaflet", "Chart.js"],
    category: "Civic Tech",
    role: "Backend Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/datara",
  },
  {
    id: 10,
    title: "Codex Fuel",
    slug: "codex-fuel",
    pitch:
      "VS Code sidebar extension that visualizes Codex CLI usage limits, built with a privacy-conscious, read-only design.",
    description: [
      "Built a VS Code sidebar extension that reads Codex's local session rollout files and renders usage-window bars (5-hour, weekly/monthly) with reset timing on hover",
      "Designed the default mode to avoid touching credentials, account, or billing data — usage is inferred entirely from local session files",
      "Added an opt-in experimental mode that reads a local auth token to call the ChatGPT usage endpoint, clearly gated behind a settings flag",
      "Shipped as an installable VS Code extension with a configurable refresh interval and lookback window",
    ],
    techStack: ["TypeScript", "VS Code Extension API"],
    category: "Developer Tool",
    role: "Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/codex-fuel",
  },
  {
    id: 11,
    title: "Kislap",
    slug: "kislap",
    pitch:
      "Free reading game for Filipino children in Grades 1–3. A speech model runs on the child's own device and checks each word they read aloud.",
    description: [
      "Built a read-aloud game where children read a short story sentence by sentence while Ningning the firefly reacts and awards stars and stickers",
      "Runs speech recognition in the browser with Transformers.js, so no audio leaves the device and it works on a family phone",
      "Saves missed words for practice and shows them in syllables, aimed at the 91% of Filipino ten-year-olds who cannot read a simple text (World Bank, 2026)",
      "Ships as an installable PWA for Chrome on laptops and Android phones",
    ],
    techStack: ["React", "TypeScript", "Vite", "Transformers.js", "PWA"],
    category: "EdTech",
    role: "Lead Developer · team of 4",
    featured: true,
    demoUrl: "https://romeo-04.github.io/kislap/",
    repoUrl: "https://github.com/Romeo-04/kislap",
  },
  {
    id: 14,
    title: "Creator Revenue-Financing Platform",
    slug: "creator-revenue-financing",
    pitch:
      "Production fintech backend for a creator revenue-financing platform at Ed3N Ventures, delivered by directing AI coding agents.",
    description: [
      "Led delivery of a production fintech backend in Next.js 15, TypeScript and PostgreSQL by directing AI coding agents, owning the architecture, reviewing every change and carrying technical decisions end to end",
      "Engineered the agent operating environment by mapping six domain-specific instruction sets to the code they govern, so conventions applied automatically instead of being restated each session",
      "Hardened project non-negotiables into durable guardrails for credential handling, version-control policy and regulated-language rules, keeping output consistent across long-running work",
    ],
    techStack: ["Next.js", "TypeScript", "PostgreSQL"],
    category: "FinTech",
    role: "Full-Stack Developer · Ed3N Ventures",
    featured: false,
    demoUrl: "",
    repoUrl: "",
  },
  {
    id: 15,
    title: "Agent Provisioning Platform",
    slug: "agent-provisioning",
    pitch:
      "Channel-agnostic backend at Ed3N Ventures that pairs Telegram and WhatsApp bots through real QR onboarding.",
    description: [
      "Reverse-engineered an undocumented third-party agent API, including its session-token auth scheme and multi-stage pairing lifecycle, enabling real Telegram and WhatsApp QR onboarding with zero frontend changes",
      "Designed and shipped a channel-agnostic FastAPI backend integrating Telegram and WhatsApp bot pairing, replacing a mocked onboarding flow with a production API",
      "Grew backend test coverage from 23 to 40 tests",
    ],
    techStack: ["Python", "FastAPI"],
    category: "Developer Platform",
    role: "Backend Engineer · Ed3N Ventures",
    featured: false,
    demoUrl: "",
    repoUrl: "",
  },
];

// --- Achievements ---
export interface Achievement {
  /** The headline on the certificate: a placement or an honour. */
  title: string;
  /** The competition or body behind a placement. */
  event?: string;
  year: string;
  description: string;
  tier: "gold" | "silver" | "bronze" | "special";
}

/** An achievement on one line, for lists: "Champion — CyberXploit". */
export function achievementName(a: Achievement): string {
  return a.event ? `${a.title} — ${a.event}` : a.title;
}

/** How many achievements hang on the café wall: the first ones listed. */
export const WALL_FRAMES = 12;

// Awards and honours from the résumé, strongest first. The wall has room for
// the first WALL_FRAMES; the panel and the Quick Order menu list them all.
export const achievementsData: Achievement[] = [
  {
    title: "Champion",
    event: "National IT Skills Olympics",
    year: "2026",
    description: "Won the Quiz Bee at the National IT Skills Olympics",
    tier: "gold",
  },
  {
    title: "Champion",
    event: "CyberXploit",
    year: "2026",
    description: "Won FEU Tech's CyberXploit Capture-the-Flag competition",
    tier: "gold",
  },
  {
    title: "1st Runner-Up",
    event: "GDG PUP SEEN",
    year: "2026",
    description: "Placed second in the GDG PUP SEEN Capture-the-Flag",
    tier: "silver",
  },
  {
    title: "3rd Place",
    event: "P&G Next AIdeathon",
    year: "2026",
    description: "Placed third in the P&G Next AIdeathon Business Case Challenge",
    tier: "bronze",
  },
  {
    title: "3rd Place",
    event: "OpenAI Campus Hackathon",
    year: "2026",
    description: "Placed third in the FEU Tech OpenAI Campus Hackathon",
    tier: "bronze",
  },
  {
    title: "Rank 2 Top Performing Student",
    year: "A.Y. 2023–2024",
    description: "Ranked 2nd among top performing students for the academic year",
    tier: "gold",
  },
  {
    title: "DOST-SEI Scholar",
    year: "Ongoing",
    description: "Scholar of the Department of Science and Technology's Science Education Institute",
    tier: "special",
  },
  {
    title: "University Elite Scholar",
    year: "Ongoing",
    description: "University Elite Scholar at FEU Institute of Technology",
    tier: "special",
  },
  {
    title: "Top 10 Finalist",
    event: "Philippine Junior Data Science Challenge",
    year: "2026",
    description: "Top 10 finalist in the Philippine Junior Data Science Challenge (PJDSC)",
    tier: "silver",
  },
  {
    title: "Top 10 Finalist",
    event: "CSSprint Hackathon",
    year: "2026",
    description: "Top 10 finalist in the CSSprint Hackathon at the University of Santo Tomas",
    tier: "silver",
  },
  {
    title: "Finalist",
    event: "Start-A-Ton Datathon",
    year: "2026",
    description: "Finalist in Start-A-Ton, the START-DOST Datathon",
    tier: "silver",
  },
  {
    title: "Finalist",
    event: "Algolympics",
    year: "2025",
    description: "Finalist in Algolympics, the national competitive programming contest",
    tier: "silver",
  },
  {
    title: "Consistent Gold Dean's Lister",
    year: "Ongoing",
    description: "Gold Dean's List standing every term, with a 3.8 / 4.00 GPA",
    tier: "gold",
  },
  {
    title: "Rank 3 Top Performing Student",
    year: "A.Y. 2025–2026",
    description: "Ranked 3rd among top performing students for the academic year",
    tier: "gold",
  },
  {
    title: "Rank 8 Top Performing Student",
    year: "A.Y. 2024–2025",
    description: "Ranked 8th among top performing students for the academic year",
    tier: "gold",
  },
  {
    title: "TOPCIT Level 3 (Competent)",
    year: "2025",
    description: "Level 3 in the 13th national Test of Practical Competency in IT",
    tier: "silver",
  },
  {
    title: "3rd Runner-Up",
    event: "First Gen Code Green",
    year: "2024",
    description: "Third runner-up in First Gen Code Green, a national pitching competition",
    tier: "bronze",
  },
  // Not on the current résumé; kept from the earlier list.
  {
    title: "DataCamp Scholar",
    year: "2024",
    description: "Selected as a DataCamp Scholar for demonstrating data science aptitude",
    tier: "special",
  },
  {
    title: "3rd Placer",
    event: "Kode Kombat Subservience",
    year: "2023",
    description: "Placed third in the Kode Kombat Subservience programming competition",
    tier: "bronze",
  },
];

// --- Certifications ---
// From the résumé. `issued` is the month and year when known, or a status
// such as "In progress"; credentialUrl is the "Show credential" link.
export interface Certification {
  title: string;
  issuer: string;
  issued?: string; // e.g. "Mar 2025"
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
}

export const certificationsData: Certification[] = [
  { title: "AI Engineer for Data Scientists", issuer: "DataCamp" },
  { title: "Associate Data Analyst", issuer: "DataCamp" },
  { title: "IT Specialist – Python", issuer: "Certiport" },
  { title: "Project Management Ready", issuer: "PMI" },
  { title: "Certified Cybersecurity Practitioner", issuer: "Palo Alto Networks", issued: "In progress" },
];

// --- Off the Clock (the café's secret drink) ---
// Unlocked when a visitor fills the loyalty card. Fill this in with your
// real coffee order, a few hobbies and a fun fact; while it is null the
// card says the barista is still writing it.
export interface OffTheClock {
  coffeeOrder: string;
  hobbies: string[];
  funFact: string;
}

export const offTheClock: OffTheClock | null = null;

// --- Testimonials ---
// People who've worked with Jhezra. Each one stands outside the café with a
// coffee; clicking them opens their card. Replace the placeholders with real
// testimonials (and set placeholder: false): name, role, organisation, how
// you worked together, their words, a photo in public/testimonials, and
// links to their portfolio or LinkedIn. `look` dresses their 3D figure.
export interface Testimonial {
  name: string;
  role: string;
  organization: string;
  /** How they know Jhezra, e.g. "Worked together on the ACMX web team". */
  relationship: string;
  quote: string;
  /** Square photo in public/testimonials, e.g. "/testimonials/jane.webp". */
  photo?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  /** Their usual order, shown on the cup they're holding. */
  order: string;
  look: {
    skin: string;
    hair: string;
    shirt: string;
    pants: string;
    style: "short" | "bun" | "long" | "cap";
  };
  /** True until a real testimonial replaces this entry. */
  placeholder?: boolean;
}

export const testimonialsData: Testimonial[] = [
  {
    name: "Testimonial coming soon",
    role: "Teammate",
    organization: "FEU Tech ACM Student Chapter",
    relationship: "Reserved for someone from the ACMX web team",
    quote: "This spot is saved for a teammate's words. The barista is collecting testimonials and this one is still brewing.",
    order: "Caramel latte",
    look: { skin: "#c68863", hair: "#2a1d17", shirt: "#669bbc", pants: "#2b2b2e", style: "bun" },
    placeholder: true,
  },
  {
    name: "Testimonial coming soon",
    role: "Mentor",
    organization: "ED3N Ventures",
    relationship: "Reserved for a mentor from the internship",
    quote: "This spot is saved for a mentor's words. The barista is collecting testimonials and this one is still brewing.",
    order: "Flat white",
    look: { skin: "#f1c7a5", hair: "#5a3a22", shirt: "#8cb369", pants: "#3d405b", style: "short" },
    placeholder: true,
  },
  {
    name: "Testimonial coming soon",
    role: "Collaborator",
    organization: "Hackathon team",
    relationship: "Reserved for a hackathon teammate",
    quote: "This spot is saved for a collaborator's words. The barista is collecting testimonials and this one is still brewing.",
    order: "Iced matcha",
    look: { skin: "#8d5a3b", hair: "#111111", shirt: "#e4572e", pants: "#29335c", style: "cap" },
    placeholder: true,
  },
];
