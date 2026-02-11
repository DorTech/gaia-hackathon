import "dotenv/config";
import { db, zone } from "../src";
import { parse } from "csv-parse/sync";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

type DataCategory = "contexte" | "intervention" | "intrant_et_culture";

interface ImportConfig {
	category: DataCategory;
	files: string[];
	handlers: {
		[file: string]: (records: any[]) => Promise<void>;
	};
}

const importConfigs: ImportConfig[] = [
	{
		category: "contexte",
		files: ["zone.csv"],
		handlers: {
			"zone.csv": importZones,
		},
	},
	{
		category: "intervention",
		files: [],
		handlers: {},
	},
	{
		category: "intrant_et_culture",
		files: [],
		handlers: {},
	},
];

async function importZones(records: any[]) {
	console.log(`Importing ${records.length} zones...`);

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			code: record.code,
			campagne: parseInt(record.campagne, 10),
			surface: parseFloat(record.surface),
			parcelleId: record.parcelle_id,
			type: record.type,
		}));

		await db.insert(zone).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

async function importCategory(category: DataCategory) {
	const config = importConfigs.find((c) => c.category === category);

	if (!config) {
		throw new Error(`Unknown category: ${category}`);
	}

	console.log(`\nImporting ${category}...`);

	for (const file of config.files) {
		const filePath = join(
			__dirname,
			`../export/${category}/${file}`,
		);

		if (!existsSync(filePath)) {
			console.log(`  ⚠️  ${file} not found at ${filePath}`);
			continue;
		}

		console.log(`  📂 Processing ${file}...`);
		const csvContent = readFileSync(filePath, "utf-8");
		const records = parse(csvContent, {
			columns: true,
			skip_empty_lines: true,
		});

		const handler = config.handlers[file];
		if (handler) {
			await handler(records);
			console.log(`  ✅ ${file} imported successfully`);
		} else {
			console.log(`  ⚠️  No handler for ${file}`);
		}
	}
}

async function importAll() {
	for (const config of importConfigs) {
		if (config.files.length > 0) {
			try {
				await importCategory(config.category);
			} catch (error) {
				console.error(
					`❌ Error importing ${config.category}:`,
					error,
				);
			}
		}
	}
}

async function main() {
	try {
		const args = process.argv.slice(2);

		if (args.length === 0) {
			console.log("🚀 Starting full data import...\n");
			await importAll();
			console.log("\n✅ All imports completed successfully!");
		} else {
			const category = args[0] as DataCategory;
			console.log(`🚀 Starting import for category: ${category}\n`);
			await importCategory(category);
			console.log(`\n✅ ${category} import completed successfully!`);
		}
	} catch (error) {
		console.error("❌ Error during import:", error);
		process.exit(1);
	}

	process.exit(0);
}

main();
