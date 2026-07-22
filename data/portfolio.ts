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
  // Pokemon-inspired flavor
  trainerClass: "Elite Developer",
  trainerId: "2024-JT",
  heroImage: "/images/profile-placeholder.jpg", // Replace: recommended 400×400 JPG/PNG
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

// --- Skill Type System (Pokemon-inspired categorization) ---
export type SkillType =
  | "electric"
  | "water"
  | "fire"
  | "ground"
  | "psychic"
  | "steel";

export interface Skill {
  name: string;
  level: number; // 0–100
}

export interface SkillCategory {
  title: string;
  type: SkillType;
  icon: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    title: "Languages",
    type: "electric",
    icon: "⚡",
    skills: [
      { name: "Python", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "JavaScript", level: 85 },
      { name: "C++", level: 75 },
      { name: "Java", level: 70 },
      { name: "PHP", level: 70 },
      { name: "SQL", level: 80 },
      { name: "Assembly (x86)", level: 50 },
    ],
  },
  {
    title: "Frontend",
    type: "water",
    icon: "💧",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 88 },
      { name: "Tailwind CSS", level: 92 },
      { name: "HTML / CSS", level: 95 },
    ],
  },
  {
    title: "Backend & API",
    type: "fire",
    icon: "🔥",
    skills: [
      { name: "Node.js", level: 82 },
      { name: "Laravel", level: 75 },
      { name: "Prisma ORM", level: 80 },
    ],
  },
  {
    title: "Databases",
    type: "ground",
    icon: "🪨",
    skills: [
      { name: "PostgreSQL", level: 82 },
      { name: "MySQL", level: 78 },
      { name: "SQLite", level: 75 },
      { name: "Supabase", level: 80 },
    ],
  },
  {
    title: "Machine Learning",
    type: "psychic",
    icon: "🔮",
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
    type: "steel",
    icon: "⚙️",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Vercel", level: 85 },
      { name: "WSL", level: 75 },
      { name: "NVIDIA HPC SDK", level: 55 },
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
  badge: string; // Pokemon badge flavor
}

export const experienceData: Experience[] = [
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
    badge: "Thunder Badge",
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
    badge: "Knowledge Badge",
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
    title: "iJOIN",
    slug: "ijoin",
    pitch:
      "Event registration system with role-based access control, capacity management, and automated confirmation workflows.",
    description: [
      "Built an event registration web application with role-based access (student/admin)",
      "Implemented event browsing, registration flow, and automated confirmation/ticket generation",
      "Created admin CRUD event management with capacity limits and registration status tracking",
      "Developed robust backend with route controllers, database persistence, validation, and error handling",
    ],
    techStack: ["Laravel", "PHP", "MySQL"],
    category: "Web App",
    role: "Backend Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/iJoin",
    image: "",
  },
  {
    id: 5,
    title: "Chichen Itza 3D",
    slug: "chichen-itza-3d",
    pitch:
      "3D replica of Mexico's Chichen Itza rendered in OpenGL with dual-scene visualization showing before and after discovery.",
    description: [
      "Created a detailed 3D replica of Chichen Itza using C++ and OpenGL rendering pipeline",
      "Implemented two distinct scenes: the structure before and after historical discovery",
      "Built as a structured Visual Studio solution with runtime dependencies via FreeGLUT and GLEW",
      "Demonstrated proficiency in computer graphics fundamentals including lighting, texturing, and scene management",
    ],
    techStack: ["C++", "OpenGL", "FreeGLUT", "GLEW"],
    category: "Graphics",
    role: "Developer",
    featured: false,
    demoUrl: "",
    repoUrl: "https://github.com/Romeo-04/chichen-itza",
    image: "/chichen-itza.png",
  },
  {
    id: 6,
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

// --- Type Color Map (for themed UI elements) ---
// Shades tuned for readability on light card surfaces.
export const typeColors: Record<
  SkillType,
  { bg: string; text: string; border: string; glow: string; bar: string }
> = {
  electric: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-700",
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/20",
    bar: "bg-yellow-500",
  },
  water: {
    bg: "bg-blue-500/15",
    text: "text-blue-700",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    bar: "bg-blue-500",
  },
  fire: {
    bg: "bg-red-500/15",
    text: "text-red-700",
    border: "border-red-500/30",
    glow: "shadow-red-500/20",
    bar: "bg-red-500",
  },
  ground: {
    bg: "bg-amber-500/15",
    text: "text-amber-700",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    bar: "bg-amber-500",
  },
  psychic: {
    bg: "bg-purple-500/15",
    text: "text-purple-700",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
    bar: "bg-purple-500",
  },
  steel: {
    bg: "bg-slate-500/15",
    text: "text-slate-600",
    border: "border-slate-500/30",
    glow: "shadow-slate-500/20",
    bar: "bg-slate-500",
  },
};

// --- Trainer Stats (for hero card radar/bars) ---
export const trainerStats = [
  { label: "Frontend", value: 88 },
  { label: "Backend", value: 78 },
  { label: "ML / AI", value: 72 },
  { label: "Leadership", value: 85 },
  { label: "Problem Solving", value: 82 },
];
