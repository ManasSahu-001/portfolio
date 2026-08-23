import { seedData } from "./seed";
import type { DBData } from "@/types";

export function migrate(data: DBData): DBData {
  const seeded = seedData();
  return {
    profile: { ...seeded.profile, ...data.profile },
    socials: { ...seeded.socials, ...data.socials, others: data.socials?.others ?? [] },
    competitive: { ...seeded.competitive, ...data.competitive },
    skills: data.skills ?? seeded.skills,
    achievements: data.achievements ?? [],
    communities: data.communities ?? seeded.communities,
    projects: data.projects ?? seeded.projects,
    knowledgeDocs: data.knowledgeDocs ?? [],
    syncMeta: data.syncMeta ?? { lastSync: null, docCount: 0 },
  };
}
