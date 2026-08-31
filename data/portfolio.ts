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
  url: "ADD_SITE_URL_HERE", // e.g., "https://jhezra.dev"
  ogImage: "/images/og-image.png", // Replace: recommended 1200×630 PNG
  favicon: "/favicon.ico", // Replace: place your favicon in /public/
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

// One of the semantic icon keys mapped to a lucide-react component in
// components/sections/skills.tsx.
export type CategoryIcon =
  | "code"
  | "layout"
  | "server"
  | "database"
  | "brain"
  | "wrench";

export interface Skill {
  name: string;
  level: number; // 0–100
}

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
      { name: "Python", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "JavaScript", level: 85 },
      { name: "C++", level: 75 },
      { name: "Java", level: 70 },
      { name: "SQL", level: 80 },
    ],
  },
  {
    title: "Frontend",
    color: "blue",
    icon: "layout",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 88 },
      { name: "Tailwind CSS", level: 92 },
      { name: "HTML / CSS", level: 95 },
    ],
  },
  {
    title: "Backend & API",
    color: "rose",
    icon: "server",
    skills: [
      { name: "Node.js", level: 82 },
      { name: "Prisma ORM", level: 80 },
    ],
  },
  {
    title: "Databases",
    color: "orange",
    icon: "database",
    skills: [
      { name: "PostgreSQL", level: 82 },
      { name: "MySQL", level: 78 },
      { name: "SQLite", level: 75 },
      { name: "Supabase", level: 80 },
    ],
  },
  {
    title: "Machine Learning",
    color: "violet",
    icon: "brain",
    skills: [
      { name: "PyTorch", level: 72 },
      { name: "Scikit-learn", level: 75 },
      { name: "NumPy", level: 82 },
      { name: "Pandas", level: 80 },
      { name: "Matplotlib", level: 75 },
    ],
  },
  {
    title: "Tools & Platforms",
    color: "slate",
    icon: "wrench",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Vercel", level: 85 },
      { name: "Jupyter Notebook", level: 80 },
      { name: "MATLAB", level: 60 },
    ],
  },
];

// --- Experience / Leadership ---
export interface Experience {
  title: string;
  organization: string;
  period: string;
  description: string[];
}

export const experienceData: Experience[] = [
  {
    title: "Software Engineering Intern",
    organization: "ED3N Ventures",
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
  image: string; // Replace: recommended 1200×675 screenshot
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
    image: "/city-sense.png",
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
    featured: true,
    demoUrl: "",
    repoUrl: "",
    image: "/merchandise-shop.png",
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
    featured: true,
    demoUrl: "https://smart-habit-tracker-fawn.vercel.app",
    repoUrl: "https://github.com/Romeo-04/smart-habit-tracker",
    image: "/trackhab.png",
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
    role: "Developer",
    featured: true,
    demoUrl: "",
    repoUrl: "https://github.com/kishiagaytano/archeon",
    image: "",
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
    featured: true,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/finhealth-saas",
    image: "",
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
    featured: true,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/arki-rev",
    image: "",
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
    featured: true,
    demoUrl: "https://romeo-04.github.io/Cha-Tsing/",
    repoUrl: "https://github.com/Romeo-04/Cha-Tsing",
    image: "",
  },
  {
    id: 8,
    title: "KitaKo",
    slug: "kitako",
    pitch:
      "Showcase website for an undergraduate thesis addressing linguistic and cultural gaps in artificial intelligence.",
    description: [
      "Contributed to the research behind KitaKo, a thesis project studying linguistic and cultural gaps in AI systems",
      "Website built by a teammate using React 19, Vite, Express, and a shadcn-style component system",
      "Presents the research, methodology, and team behind the project to a public audience",
    ],
    techStack: ["React", "Vite", "Express", "Tailwind CSS"],
    category: "Research",
    role: "Researcher",
    featured: false,
    demoUrl: "https://kitako-eight.vercel.app",
    repoUrl: "https://github.com/Emyol/Stochastic4-Website",
    image: "",
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
    featured: true,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/datara",
    image: "",
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
    image: "",
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

// --- Navigation Links ---
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Achievements", href: "#achievements" },
  // Uncomment once you add entries to certificationsData:
  // { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

// --- Category Color Map (for skill category cards) ---
// Shades tuned for readability on light card surfaces.
export const categoryColors: Record<
  CategoryColor,
  { bg: string; text: string }
> = {
  amber: { bg: "bg-amber-500/15", text: "text-amber-700" },
  blue: { bg: "bg-blue-500/15", text: "text-blue-700" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-700" },
  orange: { bg: "bg-orange-500/15", text: "text-orange-700" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-700" },
  slate: { bg: "bg-slate-500/15", text: "text-slate-600" },
};

// --- Skill Stats (for the hero snapshot bars) ---
export const skillStats = [
  { label: "Frontend", value: 82 },
  { label: "Backend", value: 85 },
  { label: "ML / AI", value: 86 },
  { label: "Leadership", value: 90 },
  { label: "Problem Solving", value: 95 },
];
