import "dotenv/config";
import { db, zone } from "../../src";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";

async function importZones() {
	try {
		console.log("Reading zone.csv file...");
		const csvContent = readFileSync(join(__dirname, "../../export/contexte/zone.csv"), "utf-8");

		console.log("Parsing CSV...");
		const records = parse(csvContent, {
			columns: true,
			skip_empty_lines: true,
		});

		console.log(`Found ${records.length} zones to import`);

		// Import in batches of 1000
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
				`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`,
			);
		}

		console.log("✅ Import completed successfully!");
	} catch (error) {
		console.error("❌ Error importing zones:", error);
		process.exit(1);
	}

	process.exit(0);
}

importZones();
