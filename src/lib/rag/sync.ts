import crypto from "crypto";
import { getStore } from "@/lib/storage";
import { embedTexts } from "@/lib/ai/embeddings";
import type { DBData, KnowledgeDoc, SourceType } from "@/types";

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function projectText(p: DBData["projects"][number]): string {
  const parts = [
    `Project: ${p.title}`,
    p.shortDescription && `Summary: ${p.shortDescription}`,
    p.status && `Status: ${p.status}`,
    p.category && `Category: ${p.category}`,
    p.technologies.length > 0 &&
      `Technologies: ${p.technologies.join(", ")}`,
    p.fullDescription && `Overview: ${p.fullDescription}`,
    p.problem && `Problem: ${p.problem}`,
    p.approach && `Approach: ${p.approach}`,
    p.architecture && `Architecture: ${p.architecture}`,
    p.implementation && `Implementation: ${p.implementation}`,
    p.challenges && `Challenges: ${p.challenges}`,
    p.learnings && `What he learned: ${p.learnings}`,
    p.githubUrl && `GitHub: ${p.githubUrl}`,
    p.liveUrl && `Live demo: ${p.liveUrl}`,
  ].filter(Boolean);
  return parts.join("\n");
}

function profileText(data: DBData): string {
  const pr = data.profile;
  const s = data.socials;
  return [
    `Name: ${pr.name}.`,
    `Tagline: ${pr.heroLine1} ${pr.heroLine2}`,
    `Focus areas: ${pr.heroSub}.`,
    `${pr.name} is an ${pr.branch} student at ${pr.college} (${pr.batch}).`,
    `About: ${pr.bio.join(" ")}`,
    `Currently: ${pr.statusNote}`,
    `Currently exploring: ${pr.currentFocus}.`,
    s.email && `Contact email: ${s.email}`,
    s.github && `GitHub profile: ${s.github}`,
    s.linkedin && `LinkedIn profile: ${s.linkedin}`,
    s.instagram && `Instagram profile: ${s.instagram}`,
    s.others.map((o) => `${o.label}: ${o.url}`).join(", "),
  ]
    .filter(Boolean)
    .join("\n");
}

function skillsText(data: DBData): string {
  const lines = data.skills.map(
    (c) => `${c.name}: ${c.skills.join(", ")}`
  );
  return [
    `Skills and technologies ${data.profile.name} works with.`,
    ...lines,
    `Currently exploring: ${data.profile.currentFocus}.`,
  ].join("\n");
}

function competitiveText(data: DBData): string {
  const c = data.competitive;
  return [
    `Competitive programming achievements of ${data.profile.name}:`,
    c.codechefStars && `CodeChef rating: ${c.codechefStars}.`,
    c.codeforcesRank && `Codeforces rank: ${c.codeforcesRank}.`,
    c.problemsSolved &&
      `Solved ${c.problemsSolved}+ problems on ${c.problemsNote ?? "LeetCode and Codeforces"}.`,
    c.streakLabel && `Achieved a ${c.streakLabel}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function communitiesText(data: DBData): string {
  const lines = data.communities.map((c) =>
    [`${c.name}`, c.institution && `(${c.institution})`, c.description]
      .filter(Boolean)
      .join(" ")
  );
  return [`Communities ${data.profile.name} is part of:`, ...lines].join("\n");
}

interface DocBuild {
  key: string;
  sourceType: SourceType;
  title: string;
  text: string;
}

export function buildDocs(data: DBData): DocBuild[] {
  const docs: DocBuild[] = [];

  docs.push({
    key: "profile",
    sourceType: "profile",
    title: "About Manas Sahu",
    text: profileText(data),
  });
  docs.push({
    key: "skills",
    sourceType: "skills",
    title: "Skills & Technologies",
    text: skillsText(data),
  });
  docs.push({
    key: "competitive",
    sourceType: "competitive",
    title: "Competitive Programming",
    text: competitiveText(data),
  });
  if (data.communities.length > 0) {
    docs.push({
      key: "communities",
      sourceType: "community",
      title: "Communities",
      text: communitiesText(data),
    });
  }
  for (const a of data.achievements.filter((a) => a.published)) {
    docs.push({
      key: `achievement:${a.id}`,
      sourceType: "achievement",
      title: a.title,
      text: [
        `Achievement: ${a.title}`,
        a.description,
        a.date && `Date: ${a.date}`,
        a.link && `Link: ${a.link}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }
  for (const p of data.projects.filter((p) => p.published)) {
    docs.push({
      key: `project:${p.slug}`,
      sourceType: "project",
      title: p.title,
      text: projectText(p),
    });
  }
  return docs;
}

/**
 * Synchronize the knowledge base with currently published content.
 * Only changed texts are re-embedded. Draft content is never indexed.
 */
export async function syncKnowledgeBase(force = false): Promise<{
  docCount: number;
  embedded: number;
}> {
  const store = getStore();
  const data = await store.read();
  const builds = buildDocs(data);

  const existing = new Map(data.knowledgeDocs.map((d) => [d.key, d]));
  const nextDocs: KnowledgeDoc[] = [];
  const toEmbed: DocBuild[] = [];

  for (const b of builds) {
    const hash = sha256(b.text);
    const prev = existing.get(b.key);
    if (!force && prev && prev.hash === hash) {
      nextDocs.push({ ...prev, updatedAt: new Date().toISOString() });
    } else {
      toEmbed.push(b);
      existing.delete(b.key);
      void hash;
    }
  }

  let embedded = 0;
  if (toEmbed.length > 0) {
    const vectors = await embedTexts(toEmbed.map((b) => b.text));
    const nowIso = new Date().toISOString();
    toEmbed.forEach((b, i) => {
      nextDocs.push({
        key: b.key,
        sourceType: b.sourceType,
        title: b.title,
        text: b.text,
        hash: sha256(b.text),
        embedding: vectors[i],
        updatedAt: nowIso,
      });
    });
    embedded = toEmbed.length;
  }

  data.knowledgeDocs = nextDocs;
  data.syncMeta = {
    lastSync: new Date().toISOString(),
    docCount: nextDocs.length,
  };
  await store.write(data);
  return { docCount: nextDocs.length, embedded };
}
