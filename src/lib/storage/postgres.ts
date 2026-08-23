import { Pool, type PoolConfig } from "pg";
import { seedData } from "./seed";
import { migrate } from "./migrate";
import type { DBData } from "@/types";

const ROW_ID = "db";
const CACHE_TTL_MS = 5000;

class PostgresStore {
  private pool: Pool;
  private ready: Promise<void> | null = null;
  private cache: DBData | null = null;
  private cacheAt = 0;

  constructor(connectionString: string) {
    const config: PoolConfig = { connectionString, max: 3 };
    try {
      const { hostname } = new URL(connectionString);
      const isLocal = ["localhost", "127.0.0.1", "::1"].includes(hostname);
      if (!isLocal) {
        config.ssl = { rejectUnauthorized: false };
      }
    } catch {
      // let pg surface the invalid URL error itself
    }
    this.pool = new Pool(config);
  }

  private ensure(): Promise<void> {
    if (!this.ready) {
      this.ready = this.pool
        .query(
          `CREATE TABLE IF NOT EXISTS app_data (
             id TEXT PRIMARY KEY,
             data JSONB NOT NULL,
             updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
           )`
        )
        .then(() => undefined);
    }
    return this.ready;
  }

  private fresh(): boolean {
    return this.cache !== null && Date.now() - this.cacheAt < CACHE_TTL_MS;
  }

  async read(): Promise<DBData> {
    await this.ensure();
    if (this.fresh()) return structuredClone(this.cache!);

    const res = await this.pool.query(
      "SELECT data FROM app_data WHERE id = $1",
      [ROW_ID]
    );

    let data: DBData;
    if (res.rows.length === 0) {
      data = seedData();
      await this.write(data);
    } else {
      data = migrate(res.rows[0].data as DBData);
    }

    this.cache = data;
    this.cacheAt = Date.now();
    return structuredClone(data);
  }

  async write(data: DBData): Promise<void> {
    await this.ensure();
    await this.pool.query(
      `INSERT INTO app_data (id, data, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (id) DO UPDATE
         SET data = EXCLUDED.data, updated_at = now()`,
      [ROW_ID, JSON.stringify(data)]
    );
    this.cache = data;
    this.cacheAt = Date.now();
  }
}

export function createPostgresStore(connectionString: string): PostgresStore {
  return new PostgresStore(connectionString);
}
