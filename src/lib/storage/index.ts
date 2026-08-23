import fs from "fs";
import path from "path";
import crypto from "crypto";
import { seedData } from "./seed";
import { migrate } from "./migrate";
import { createPostgresStore } from "./postgres";
import type { DBData } from "@/types";

/**
 * Storage layer.
 *
 * Default driver: JSON file store (no database required).
 * Set DATABASE_URL to use PostgreSQL instead — required for
 * production deployments where the filesystem is ephemeral.
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

let store: ContentStore | null = null;

export function getStore(): ContentStore {
  if (!store) {
    const connectionString = process.env.DATABASE_URL;
    store = connectionString
      ? createPostgresStore(connectionString)
      : new FileStore();
  }
  return store;
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}
