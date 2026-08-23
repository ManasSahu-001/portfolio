import fs from "node:fs";
import path from "node:path";
import pg from "pg";

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const match = fs
      .readFileSync(envPath, "utf8")
      .match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m);
    if (match) return match[1];
  }
  return null;
}

const url = loadDatabaseUrl();
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env or the environment.");
  process.exit(1);
}

const dbJsonPath = path.join(process.cwd(), "data", "db.json");
if (!fs.existsSync(dbJsonPath)) {
  console.error(`No local database found at ${dbJsonPath}. Nothing to push.`);
  process.exit(1);
}

const { hostname } = new URL(url);
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(hostname);

const pool = new pg.Pool({
  connectionString: url,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
});

try {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS app_data (
       id TEXT PRIMARY KEY,
       data JSONB NOT NULL,
       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`
  );

  const data = JSON.parse(fs.readFileSync(dbJsonPath, "utf8"));
  const docCount = Array.isArray(data.knowledgeDocs)
    ? data.knowledgeDocs.length
    : 0;

  await pool.query(
    `INSERT INTO app_data (id, data, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (id) DO UPDATE
       SET data = EXCLUDED.data, updated_at = now()`,
    ["db", JSON.stringify(data)]
  );

  console.log(
    `Pushed local db.json to Postgres (${docCount} knowledge docs included).`
  );
} finally {
  await pool.end();
}
