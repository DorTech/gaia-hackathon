import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const host = process.env.DB_HOST ?? "localhost";

const config = defineConfig({
	out: "./migration",
	schema: "./src/schema",
	dialect: "postgresql",
	dbCredentials: process.env.DB_CONNECTION_STRING
		? { url: process.env.DB_CONNECTION_STRING }
		: {
				host,
				user: process.env.DB_USER ?? "postgres",
				password: process.env.DB_PASSWORD ?? "postgres",
				port: Number(process.env.DB_PORT ?? 5433),
				database: process.env.DB_DATABASE ?? "dephy",
				ssl: host === "localhost" ? false : { rejectUnauthorized: false },
			},
	verbose: true,
	casing: "snake_case",
	tablesFilter: [],
	schemaFilter: "public",
	migrations: {
		table: "journal",
		schema: "public",
	},
});

export default config;
