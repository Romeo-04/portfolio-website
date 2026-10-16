// ============================================================
// PORTFOLIO DATA & CONFIGURATION
// ============================================================
// Replace placeholder values with your actual information.
// Search for "ADD_" prefixed strings to find all placeholders.
// ============================================================

// --- Site Configuration ---
export const siteConfig = {
  name: "Jhezra A. Tolentino",
  title: "Software Engineer",
  description:
    "Jhezra A. Tolentino — Software Engineer specializing in Web Development, Machine Learning, and Full-Stack Projects.",
  url: "https://jhez-cafe.vercel.app",
};

// --- Personal Information ---
export const personalInfo = {
  name: "Jhezra A. Tolentino",
  firstName: "Jhezra",
  role: "Software Engineer",
  tagline:
    "Building thoughtful systems across web development, machine learning, and interactive experiences.",
  subtitle:
    "Championing systems that blend logic, creativity, and impact.",
  school: "FEU Tech",
  program: "Computer Science",
  heroImage: "/Tolentino_Jhezra_1x1Photo.png",
  resumeUrl: "/resume.pdf", // Place your resume PDF in /public/resume.pdf
  email: "jhezraang@gmail.com", // e.g., "jhezra@example.com"
  github: "https://github.com/Romeo-04", // e.g., "https://github.com/jhezra"
  linkedin: "https://www.linkedin.com/in/jhezra-tolentino-513780287/", // e.g., "https://linkedin.com/in/jhezra"
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
    "I'm a dedicated software engineer and Computer Science student at FEU Tech with a strong focus on machine learning and web development. I'm committed to continuous growth and building impactful technology solutions that solve real problems.",
    "Beyond code, I lead with purpose — serving as Lead Developer for the FEU Tech ACM Student Chapter's web development team and formerly as Director for Academics. I believe the best engineers are those who can build systems and build people.",
    "I'm driven by the intersection of intelligent systems and elegant user experiences. Whether it's training models, crafting full-stack applications, or mentoring fellow developers, I bring precision, creativity, and relentless ambition to everything I build.",
  ],
  currently: {
    studying: "Computer Science at FEU Tech",
    building: "Full-stack web applications & ML pipelines",
    exploring: "Deep learning architectures & cloud deployment",
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

export const skillsData: SkillCategory[] = [
  {
    title: "Languages",
    color: "amber",
    icon: "code",
    skills: [
      { name: "Python", tier: "house" },
      { name: "TypeScript", tier: "house" },
      { name: "JavaScript", tier: "house" },
      { name: "C++", tier: "seasonal" },
      { name: "Java", tier: "seasonal" },
      { name: "SQL", tier: "house" },
    ],
  },
  {
    title: "Frontend",
    color: "blue",
    icon: "layout",
    skills: [
      { name: "React.js", tier: "house" },
      { name: "Next.js", tier: "house" },
      { name: "Tailwind CSS", tier: "house" },
      { name: "HTML / CSS", tier: "house" },
    ],
  },
  {
    title: "Backend & API",
    color: "rose",
    icon: "server",
    skills: [
      { name: "Node.js", tier: "seasonal" },
      { name: "Prisma ORM", tier: "seasonal" },
    ],
  },
  {
    title: "Databases",
    color: "orange",
    icon: "database",
    skills: [
      { name: "PostgreSQL", tier: "house" },
      { name: "MySQL", tier: "seasonal" },
      { name: "SQLite", tier: "seasonal" },
      { name: "Supabase", tier: "seasonal" },
    ],
  },
  {
    title: "Machine Learning",
    color: "violet",
    icon: "brain",
    skills: [
      { name: "PyTorch", tier: "experimental" },
      { name: "Scikit-learn", tier: "experimental" },
      { name: "NumPy", tier: "seasonal" },
      { name: "Pandas", tier: "seasonal" },
      { name: "Matplotlib", tier: "experimental" },
    ],
  },
  {
    title: "Tools & Platforms",
    color: "slate",
    icon: "wrench",
    skills: [
      { name: "Git / GitHub", tier: "house" },
      { name: "Vercel", tier: "house" },
      { name: "Jupyter Notebook", tier: "seasonal" },
      { name: "MATLAB", tier: "experimental" },
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
    organization: "ED3N Ventures",
    logos: ["eden"],
    period: "June 2026 – August 2026", // e.g., "June 2026 – August 2026" — placed first, reorder if not most recent
    description: [
      "Contributed to the design and development of full-stack features using Next.js, TypeScript, and PostgreSQL under the guidance of senior engineers",
      "Collaborated with product and design stakeholders to scope, build, and ship new functionality in an agile sprint cycle",
      "Wrote automated tests and technical documentation to support code quality and long-term maintainability",
      "Participated in code reviews and deployment workflows, gaining hands-on exposure to production engineering practices",
    ],
  },
  {
    title: "Lead Developer — ACMX Web Dev Team",
    organization: "FEU Tech ACM Student Chapter",
    logos: ["feu", "acm"],
    period: "August 2025 – Present",
    description: [
      "Lead a team of 7 developers building and maintaining the organization's web platform",
      "Architect and implement features serving 400+ organization members",
      "Mentor team members on modern web development practices and collaborative workflows",
      "Drive technical decisions on stack selection, code quality, and deployment strategy",
    ],
  },
  {
    title: "Director for Academics",
    organization: "FEU Tech ACM Student Chapter",
    logos: ["feu", "acm"],
    period: "August 2024 – August 2025",
    description: [
      "Led the academics committee overseeing all academic-related events and initiatives",
      "Developed review sessions and facilitated peer tutorials to support student learning",
      "Designed and implemented technical competitions within the institute",
      "Addressed student concerns in courses and fostered engagement and academic performance",
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
    featured: true,
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
    role: "Lead Full-Stack Developer",
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
    featured: true,
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
      "Undergraduate thesis research on the linguistic and cultural gaps in artificial intelligence, presented through a public showcase site.",
    description: [
      "Thesis research on linguistic and cultural gaps in AI systems, carried out with an undergraduate research team",
      "Contributed to the research behind the study, which the team presents to a public audience",
      "The showcase website was built by a teammate with React 19, Vite, Express, and a shadcn-style component system",
    ],
    techStack: ["React", "Vite", "Express", "Tailwind CSS"],
    category: "Research",
    role: "Researcher",
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
];

// --- Achievements ---
export interface Achievement {
  title: string;
  year: string;
  description: string;
  tier: "gold" | "silver" | "bronze" | "special";
}

export const achievementsData: Achievement[] = [
  {
    title: "Rank 2 Top Performing Student",
    year: "A.Y. 2023–2024",
    description: "Ranked 2nd among all students in the academic year",
    tier: "gold",
  },
  {
    title: "Algolympics 2025 Finalist",
    year: "2025",
    description:
      "Qualified as a finalist in the national competitive programming competition",
    tier: "gold",
  },
  {
    title: "DOST Scholar",
    year: "Ongoing",
    description:
      "Recipient of the Department of Science and Technology scholarship for academic excellence",
    tier: "special",
  },
  {
    title: "Rank 8 Top Performing Student",
    year: "A.Y. 2024–2025",
    description: "Ranked 8th among all students in the academic year",
    tier: "gold",
  },
  {
    title: "DataCamp Scholar",
    year: "2024",
    description:
      "Selected as a DataCamp Scholar for demonstrating data science aptitude",
    tier: "special",
  },
  {
    title: "Consistent Dean's Lister",
    year: "Ongoing",
    description:
      "Maintained Dean's List standing across multiple academic terms",
    tier: "gold",
  },
  {
    title: "TOPCIT 2025 — Level 3",
    year: "2025",
    description:
      "Achieved Level 3 in the 13th Test of Practical Competency in Information Technology",
    tier: "silver",
  },
  {
    title: "3rd Placer — Kode Kombat Subservience",
    year: "2023",
    description:
      "Secured 3rd place in the Kode Kombat Subservience programming competition",
    tier: "bronze",
  },
  {
    title: "3rd Runner-up — First Gen Code Green",
    year: "2024",
    description:
      "Achieved 3rd runner-up position in First Gen Code Green hackathon",
    tier: "bronze",
  },
  {
    title: "3rd Place — OpenAI Campus Hackathon 2026",
    year: "2026",
    description:
      "Secured 3rd place in the Campus Hackathon, a collaboration between FEU Tech and OpenAI",
    tier: "bronze",
  },
  {
    title: "Champion — Cyber Xploit 2026",
    year: "2026",
    description:
      "Won 1st place in the Cyber Xploit Capture the Flag (CTF) competition",
    tier: "gold",
  },
];

// --- Certifications (from LinkedIn) ---
// LinkedIn cannot be scraped programmatically (login wall + anti-bot 999
// responses + ToS), so paste your certifications here manually. Copy each
// one from LinkedIn → "Licenses & certifications". credentialUrl is optional
// (the "Show credential" link). Once you add entries, the Certifications
// section renders automatically; while this is empty it stays hidden.
export interface Certification {
  title: string;
  issuer: string;
  issued: string; // e.g. "Mar 2025"
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
}

export const certificationsData: Certification[] = [
  // Example (delete and replace with your real LinkedIn certifications):
  // {
  //   title: "Machine Learning Specialization",
  //   issuer: "DeepLearning.AI",
  //   issued: "Aug 2024",
  //   credentialId: "ABCD-1234",
  //   credentialUrl: "https://coursera.org/verify/...",
  //   skills: ["Supervised Learning", "TensorFlow"],
  // },
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
