import { getStore } from "@/lib/storage";
import type { DBData } from "@/types";

export async function getData(): Promise<DBData> {
  return getStore().read();
}

export function publishedProjects(data: DBData) {
  return data.projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function buildingProjects(data: DBData) {
  return publishedProjects(data).filter(
    (p) => p.status && /building/i.test(p.status)
  );
}

export function sortedAchievements(data: DBData) {
  return data.achievements
    .filter((a) => a.published)
    .sort((a, b) => a.order - b.order);
}

export function sortedCommunities(data: DBData) {
  return [...data.communities].sort((a, b) => a.order - b.order);
}
