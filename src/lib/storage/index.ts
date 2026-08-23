import fs from "fs";
import path from "path";
import crypto from "crypto";
import { seedData } from "./seed";
import type { DBData } from "@/types";

/**
 * Storage layer.
 *
 * Default driver: JSON file store (no database required).
 * The interface below is intentionally narrow so a PostgreSQL driver
 * can replace it later without touching callers.
 */

export interface ContentStore {
  read(): Promise<DBData>;
  write(data: DBData): Promise<void>;
}

class FileStore implements ContentStore {
  private filePath: string;
  private cache: DBData | null = null;

  constructor() {
    const dir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
    this.filePath = path.join(dir, "db.json");
  }

  private ensure(): void {
    if (this.cache) return;
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf8");
        this.cache = migrate(JSON.parse(raw) as DBData);
        return;
      }
    } catch {
      // corrupted file: fall through and reseed
    }
    this.cache = seedData();
    this.persist(this.cache);
  }

  private persist(data: DBData): void {
    const dir = path.dirname(this.filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  async read(): Promise<DBData> {
    this.ensure();
    return structuredClone(this.cache!);
  }

  async write(data: DBData): Promise<void> {
    this.cache = data;
    this.persist(data);
  }
}

function migrate(data: DBData): DBData {
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

let store: ContentStore | null = null;

export function getStore(): ContentStore {
  if (!store) store = new FileStore();
  return store;
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}
