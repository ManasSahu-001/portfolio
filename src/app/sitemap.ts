import type { MetadataRoute } from "next";
import { getData, publishedProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const data = await getData();

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/ask`, changeFrequency: "monthly", priority: 0.8 },
    ...publishedProjects(data).map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
