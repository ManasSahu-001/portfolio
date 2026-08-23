import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/storage";
import { syncKnowledgeBase } from "@/lib/rag/sync";
import type {
  Achievement,
  Community,
  DBData,
  Profile,
  Project,
  SkillCategory,
  SocialLinks,
} from "@/types";

export const dynamic = "force-dynamic";

type Entity =
  | "profile"
  | "socials"
  | "competitive"
  | "skills"
  | "achievements"
  | "communities"
  | "projects";

const ENTITIES: Entity[] = [
  "profile",
  "socials",
  "competitive",
  "skills",
  "achievements",
  "communities",
  "projects",
];

function parseEntity(raw: string): Entity | null {
  return ENTITIES.includes(raw as Entity) ? (raw as Entity) : null;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function validateProject(p: Project): string | null {
  if (!p.title?.trim()) return "Title is required";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) {
    return "Slug must be lowercase letters, numbers and hyphens";
  }
  if (!p.id) return "Project is missing an id";
  if (!Array.isArray(p.technologies)) p.technologies = [];
  return null;
}

function sanitizeProject(input: Partial<Project>, existing?: Project): Project {
  const nowIso = new Date().toISOString();
  const base: Project = existing ?? {
    id: `prj-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
    title: "",
    slug: "",
    shortDescription: "",
    technologies: [],
    featured: false,
    order: 999,
    published: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  return {
    ...base,
    ...input,
    id: input.id ?? base.id,
    title: input.title?.trim() || base.title,
    slug:
      input.slug?.trim() ||
      (input.title ?? base.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    technologies: Array.isArray(input.technologies)
      ? input.technologies.map((t) => t.trim()).filter(Boolean)
      : [],
    featured: Boolean(input.featured),
    published: Boolean(input.published),
    order: Number.isFinite(input.order) ? Number(input.order) : base.order,
    fullDescription: input.fullDescription || undefined,
    status: input.status || undefined,
    category: input.category || undefined,
    githubUrl: input.githubUrl || undefined,
    liveUrl: input.liveUrl || undefined,
    coverImage: input.coverImage || undefined,
    problem: input.problem || undefined,
    approach: input.approach || undefined,
    architecture: input.architecture || undefined,
    implementation: input.implementation || undefined,
    challenges: input.challenges || undefined,
    learnings: input.learnings || undefined,
    createdAt: existing?.createdAt ?? base.createdAt,
    updatedAt: nowIso,
  };
}

function applyUpdate(
  data: DBData,
  entity: Entity,
  body: unknown
): { ok: true } | { ok: false; error: string } {
  switch (entity) {
    case "profile":
      data.profile = { ...data.profile, ...(body as Partial<Profile>) };
      if (!data.profile.name?.trim()) {
        return { ok: false, error: "Name is required" };
      }
      if (!Array.isArray(data.profile.bio)) data.profile.bio = [];
      return { ok: true };
    case "socials": {
      const s = body as SocialLinks;
      data.socials = {
        github: asString(s.github),
        linkedin: asString(s.linkedin),
        instagram: asString(s.instagram),
        email: asString(s.email),
        others: Array.isArray(s.others)
          ? s.others
              .filter((o) => o.label?.trim() && o.url?.trim())
              .map((o) => ({ label: o.label.trim(), url: o.url.trim() }))
          : [],
      };
      return { ok: true };
    }
    case "competitive":
      data.competitive = { ...data.competitive, ...(body as Record<string, unknown>) };
      return { ok: true };
    case "skills": {
      if (!Array.isArray(body)) return { ok: false, error: "Expected an array of categories" };
      data.skills = (body as SkillCategory[]).map((c, i) => ({
        id: c.id?.trim() || `cat-${i + 1}`,
        name: c.name?.trim() || `Category ${i + 1}`,
        skills: Array.isArray(c.skills)
          ? c.skills.map((s) => String(s).trim()).filter(Boolean)
          : [],
      }));
      return { ok: true };
    }
    case "achievements": {
      if (!Array.isArray(body)) return { ok: false, error: "Expected an array" };
      data.achievements = (body as Achievement[]).map((a, i) => ({
        id: a.id?.trim() || `ach-${i + 1}-${Date.now().toString(36)}`,
        title: a.title?.trim() || "",
        description: a.description || undefined,
        date: a.date || undefined,
        link: a.link || undefined,
        order: Number.isFinite(a.order) ? a.order : i,
        published: Boolean(a.published),
      })).filter((a) => a.title);
      return { ok: true };
    }
    case "communities": {
      if (!Array.isArray(body)) return { ok: false, error: "Expected an array" };
      data.communities = (body as Community[]).map((c, i) => ({
        id: c.id?.trim() || `com-${i + 1}`,
        name: c.name?.trim() || "",
        institution: c.institution?.trim() || "",
        description: c.description || undefined,
        order: Number.isFinite(c.order) ? c.order : i,
      })).filter((c) => c.name);
      return { ok: true };
    }
    case "projects": {
      if (!Array.isArray(body)) return { ok: false, error: "Expected an array" };
      const byId = new Map(data.projects.map((p) => [p.id, p]));
      const next: Project[] = [];
      for (let i = 0; i < body.length; i++) {
        const raw = body[i] as Partial<Project>;
        const project = sanitizeProject(raw, raw.id ? byId.get(raw.id) : undefined);
        project.order = i;
        const err = validateProject(project);
        if (err) return { ok: false, error: `${project.title || "Project"}: ${err}` };
        next.push(project);
      }
      const slugs = new Set<string>();
      for (const p of next) {
        if (slugs.has(p.slug)) {
          return { ok: false, error: `Duplicate slug: ${p.slug}` };
        }
        slugs.add(p.slug);
      }
      data.projects = next;
      return { ok: true };
    }
  }
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ entity: string }> }
) {
  const { entity: rawEntity } = await ctx.params;
  const entity = parseEntity(rawEntity);
  if (!entity) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  const data = await getStore().read();
  return NextResponse.json({ data: data[entity] });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ entity: string }> }
) {
  const { entity: rawEntity } = await ctx.params;
  const entity = parseEntity(rawEntity);
  if (!entity) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const store = getStore();
  const data = await store.read();
  const result = applyUpdate(data, entity, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await store.write(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to persist content" },
      { status: 500 }
    );
  }

  let rag = { docCount: 0, embedded: 0 };
  try {
    rag = await syncKnowledgeBase();
  } catch {
    // content is saved; knowledge sync can be retried via Rebuild
  }

  return NextResponse.json({ ok: true, rag });
}
