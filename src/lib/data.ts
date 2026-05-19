export const personalInfo = {
  name: "Ruchit Das",
  title: "AI Engineer & Vibe Coder",
  tagline: "Shipping production-grade AI systems at warp speed.",
  location: "Thane, Maharashtra",
  email: "ruchitdas36@gmail.com",
  github: "https://github.com/Rcidshacker",
  linkedin: "https://linkedin.com/in/ruchit-das-3b6a8a252",
  about: [
    "Computer Engineering student specializing in AIML, with a practical focus on building AI-powered systems — multi-agent pipelines, RAG architectures, and ML integrations that actually ship.",
    "I care more about how systems are designed than how they're described. Most of what I build starts from a real problem and ends with something running — locally, in Docker, or behind an API.",
    "Advanced to the Top 3 at IIT Bombay's eIPL with FarmAI, and reached national finalist stage at eYIC with Mitihar. Currently finishing B.Tech and looking for AI Engineer roles at teams building with LLMs in production.",
  ],
};

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  metrics?: string[];
  github?: string;
  featured?: boolean;
  category: "AI/ML" | "SaaS" | "Tooling" | "CV" | "Full-Stack";
  period: string;
};

export const projects: Project[] = [
  {
    title: "Mitihar",
    subtitle: "AI Health & Nutrition Platform",
    description:
      "Converted an IIT Bombay national finalist prototype into a production B2B SaaS platform. Engineered a Zero-DB middleware chain enforcing RBAC entirely via JWT claims — eliminating a dedicated auth database layer. Integrated Gemini 2.5 Flash as a multimodal LLM fallback with pgvector RAG pipeline.",
    stack: ["FastAPI", "React Native", "PostgreSQL", "pgvector", "Gemini 2.5 Flash", "Docker"],
    metrics: ["6 signed medical clinics", "Zero-DB JWT middleware", "National Finalist eYIC"],
    github: "https://github.com/Rcidshacker/Mitihar-backend",
    featured: true,
    category: "SaaS",
    period: "Jun 2025 – Present",
  },
  {
    title: "FarmAI",
    subtitle: "AI-Driven Pest Management System",
    description:
      "3-layer AI architecture: CNN for disease detection from field images, XGBoost forecaster for pest risk scoring, Q-Learning RL agent for spray scheduling. Integrates weather APIs and satellite data. Built on FastAPI + React, presented at Kisan Connect agriculture exhibition in Pune.",
    stack: ["CNN", "XGBoost", "Q-Learning RL", "FastAPI", "React", "Python"],
    metrics: ["Top 3 of 8 teams — eIPL IIT Bombay", "Kisan Connect Exhibition", "Satellite + weather data integration"],
    github: "https://github.com/Rcidshacker/FarmAI",
    featured: true,
    category: "AI/ML",
    period: "Jul 2025 – Jan 2026",
  },
  {
    title: "Local CLaRa Agent",
    subtitle: "Neuro-Symbolic RAG System",
    description:
      "Inspired by Apple's CLaRa research. Built with the '2026 Stack' — DSPy + LangGraph + Ollama. Features hybrid memory (vector + knowledge graph via NetworkX), HyDE retrieval, and self-correcting web search fallback. Five-node query state machine for adaptive routing.",
    stack: ["DSPy", "LangGraph", "ChromaDB", "NetworkX", "Ollama", "Python"],
    metrics: ["Hybrid Vector + Graph Memory", "HyDE retrieval", "Self-correcting fallback"],
    github: "https://github.com/Rcidshacker/local-clara-agent",
    featured: true,
    category: "AI/ML",
    period: "Dec 2025",
  },
  {
    title: "Tessera",
    subtitle: "AI-Powered Life Calendar",
    description:
      "Full-stack consumer app shipped in a single 48-hour AI-assisted development sprint. Engineered a client-side O(n) rendering engine for a 4,680-week interactive life grid, eliminating all server-side computation. Includes journaling, mood tracking, milestones, and an integrated Llama 3.3 AI coach.",
    stack: ["Next.js 16", "Supabase", "React 19", "OpenRouter", "Llama 3.3", "TypeScript"],
    metrics: ["48-hour sprint", "4,680-week grid in O(n)", "Real-time Supabase sync"],
    github: "https://github.com/Rcidshacker/tessera-life-calendar",
    featured: true,
    category: "Full-Stack",
    period: "Apr 2026 – May 2026",
  },
  {
    title: "Obsidian MCP Server",
    subtitle: "Autonomous Second Brain",
    description:
      "Production-grade custom MCP server connecting Claude Desktop directly to a local Obsidian vault. Enables autonomous read/write/index on a persistent markdown knowledge base. CLI hooks synthesize architectural decisions into a structured knowledge graph for token-efficient multi-agent context routing.",
    stack: ["Node.js", "Model Context Protocol", "Claude Code CLI", "Obsidian", "TypeScript"],
    metrics: ["Fully local — zero cloud", "Knowledge graph synthesis", "Multi-agent context routing"],
    github: "https://github.com/Rcidshacker/Obsidian-MCP-server",
    featured: false,
    category: "Tooling",
    period: "Jan 2026 – Present",
  },
  {
    title: "Multi-AI-Agent Blog System",
    subtitle: "LangGraph Agentic Orchestration",
    description:
      "Intelligent multi-agent system that automates tech blog creation. Four AI agents collaborate to research, write, review, and auto-publish to Dev.to. Features real-time workflow visualization in a Flutter UI. Showcases production-ready LangGraph orchestration with Llama 3.1.",
    stack: ["LangGraph", "Llama 3.1", "Flutter", "Python", "Dev.to API"],
    metrics: ["4-agent pipeline", "Auto-publish to Dev.to", "Real-time visualization"],
    github: "https://github.com/Rcidshacker/Multi-AI-Agent",
    featured: false,
    category: "AI/ML",
    period: "Dec 2025",
  },
  {
    title: "Symphony",
    subtitle: "AI-Powered Terminal Music Player",
    description:
      "Developer-focused terminal music player built in Rust. Features natural language control, YouTube/Spotify streaming, real-time ASCII visualizer, plugin system, and developer integrations. Zero-cloud, fully on-device.",
    stack: ["Rust", "NLP", "YouTube API", "Spotify API"],
    metrics: ["Natural language control", "Real-time visualizer", "Plugin system"],
    github: "https://github.com/Rcidshacker/Symphony",
    featured: false,
    category: "Tooling",
    period: "Feb 2026 – Present",
  },
  {
    title: "AirMouse",
    subtitle: "Gesture-Controlled Virtual Mouse",
    description:
      "Gesture-controlled virtual mouse for Windows using MediaPipe. Right hand moves cursor/clicks via thumb-pinch; left hand fires Windows shortcuts. Supports wrist-scroll, drag, zoom, snap, and screen lock. Zero cloud, no extra hardware — entirely on-device. Ties to Computer Vision patent filed 2023.",
    stack: ["Python", "MediaPipe", "OpenCV", "Computer Vision"],
    metrics: ["Dual-hand gesture mapping", "Zero hardware needed", "CV patent linked"],
    github: "https://github.com/Rcidshacker/airmouse",
    featured: false,
    category: "CV",
    period: "May 2026",
  },
];

export const skills = {
  "AI & LLM": ["Model Context Protocol (MCP)", "Claude Code CLI", "LangGraph", "DSPy", "LangChain", "ChromaDB", "Ollama", "Gemini API", "pgvector"],
  "Frontend & Mobile": ["Next.js 16", "React 19", "React Native (Expo)", "Tailwind CSS v4", "TypeScript"],
  "Backend & Infra": ["FastAPI", "Node.js", "PostgreSQL", "Redis", "Docker"],
  "ML & Research": ["CNN", "XGBoost", "Q-Learning RL", "MediaPipe", "OpenCV", "NetworkX"],
  "Languages": ["Python", "TypeScript", "JavaScript", "Rust"],
};

export const achievements = [
  {
    title: "eIPL 2025-26 — Top 3 National Finalist",
    org: "IIT Bombay",
    description: "Advanced to the final 3 of 8 teams in eIPL — an exclusive accelerator for eYIC finalists — with FarmAI.",
    year: "Jan 2026",
  },
  {
    title: "eYIC 2024-25 — National Finalist",
    org: "IIT Bombay",
    description: "Built and pitched Mitihar Health App, advancing to national finals out of thousands of competing teams.",
    year: "Mar 2025",
  },
  {
    title: "Patent Filed — Computer Vision",
    org: "Co-inventor",
    description: "Filed patent for \"A System for AI-Enhanced Gesture-Controlled Digital Canvas\" in Computer Vision.",
    year: "Apr 2023",
  },
];

export const certifications = [
  { name: "Google Gen AI Academy", detail: "Vertex AI, Gemini APIs, Imagen, Multimodal RAG" },
  { name: "Oracle Cloud Infrastructure 2025", detail: "AI Foundations Certified" },
  { name: "IBM Certified", detail: "Prompt Engineering" },
  { name: "AWS Academy Graduate", detail: "Machine Learning Foundations" },
];
