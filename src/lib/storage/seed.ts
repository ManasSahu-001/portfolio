import type {
  Achievement,
  Community,
  DBData,
  Profile,
  Project,
  SkillCategory,
  SocialLinks,
  Competitive,
} from "@/types";

const now = new Date().toISOString();

export const seedProfile: Profile = {
  name: "Manas Sahu",
  heroLine1: "Building software.",
  heroLine2: "Exploring intelligence.",
  heroSub: "Full Stack • GenAI • Agentic AI • DSA",
  affiliation: "Electrical Engineering @ NIT Rourkela",
  statusNote: "Currently building AI systems & intelligent applications.",
  bio: [
    "I'm Manas, an Electrical Engineering student at NIT Rourkela who enjoys building software and exploring intelligent systems.",
    "My interests span full-stack development, generative AI, agentic systems, machine learning, deep learning and problem solving. I enjoy taking an idea from a problem statement to a working product.",
  ],
  college: "National Institute of Technology, Rourkela",
  collegeShort: "NIT Rourkela",
  branch: "Electrical Engineering",
  batch: "EE '29",
  currentFocus: "Full Stack • GenAI • Agentic AI • ML • DL",
  photo: "/images/profile.jpg",
};

export const seedSocials: SocialLinks = {
  github: "https://github.com/ManasSahu-001",
  linkedin: "https://www.linkedin.com/in/manas-sahu-635007350/",
  instagram: "https://www.instagram.com/_sahulegend_/",
  email: "sahumanassssss@gmail.com",
  others: [],
};

export const seedCompetitive: Competitive = {
  codechefStars: "2★",
  codechefUrl: "",
  codeforcesRank: "Pupil",
  codeforcesUrl: "",
  problemsSolved: 400,
  problemsNote: "LeetCode + Codeforces",
  leetcodeUrl: "",
  streakImage: "/images/100days.jpeg",
  streakLabel: "Codeforces 100 Days Streak",
};

export const seedSkills: SkillCategory[] = [
  { id: "cat-languages", name: "Languages", skills: ["C++", "Python", "JavaScript", "SQL"] },
  {
    id: "cat-fullstack",
    name: "Full Stack",
    skills: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "APIs", "Databases"],
  },
  {
    id: "cat-genai",
    name: "Generative AI",
    skills: ["RAG", "LangChain", "LangGraph", "LLMs", "Embeddings", "Vector Search"],
  },
  { id: "cat-aiml", name: "AI / ML", skills: ["Machine Learning", "Deep Learning"] },
  { id: "cat-tools", name: "Tools", skills: ["Git", "GitHub", "Docker", "Postman", "MCP"] },
];

export const seedAchievements: Achievement[] = [];

export const seedCommunities: Community[] = [
  {
    id: "com-ml4e",
    name: "ML4E",
    institution: "NIT Rourkela",
    description: "Machine learning community at NIT Rourkela.",
    order: 1,
  },
  {
    id: "com-aps",
    name: "APS Club",
    institution: "NIT Rourkela",
    description: "Algorithms and problem solving community at NIT Rourkela.",
    order: 2,
  },
];

export function seedProjects(): Project[] {
  return [
    {
      id: "prj-ai-timetable-maker",
      title: "AI Timetable Maker",
      slug: "ai-timetable-maker",
      shortDescription:
        "Building an intelligent timetable generation system for academic scheduling.",
      status: "Currently Building",
      technologies: [],
      category: "Generative AI",
      featured: true,
      order: 1,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prj-orbital-guardian",
      title: "Orbital Guardian",
      slug: "orbital-guardian",
      shortDescription:
        "Building a satellite intelligence platform involving orbital propagation, trajectory analysis and conjunction detection.",
      status: "Currently Building",
      technologies: ["SGP4", "Python", "Cesium", "AI"],
      category: "AI / Space Tech",
      featured: true,
      order: 2,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function seedData(): DBData {
  return {
    profile: seedProfile,
    socials: seedSocials,
    competitive: seedCompetitive,
    skills: seedSkills,
    achievements: seedAchievements,
    communities: seedCommunities,
    projects: seedProjects(),
    knowledgeDocs: [],
    syncMeta: { lastSync: null, docCount: 0 },
  };
}
