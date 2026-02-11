import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/gaia";

async function init() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  console.log("Database initialized: items table created.");
  await pool.end();
}

init().catch((err) => {
  console.error("DB init failed:", err);
  process.exit(1);
});
