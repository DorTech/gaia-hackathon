import "dotenv/config";
import { db, domaine, domaineSol, parcelle, zone } from "../src";
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
		files: ["domaine.csv", "domaine_sol.csv", "parcelle.csv", "zone.csv"],
		handlers: {
			"domaine.csv": importDomaines,
			"domaine_sol.csv": importDomaineSol,
			"parcelle.csv": importParcelles,
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

async function importDomaines(records: any[]) {
	console.log(`Importing ${records.length} domaines...`);

	const parseIntOrNull = (val: string) => {
		const parsed = parseInt(val, 10);
		return isNaN(parsed) ? null : parsed;
	};

	const parseFloatOrNull = (val: string) => {
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			code: record.code,
			campagne: parseInt(record.campagne, 10),
			typeFerme: record.type_ferme,
			departement: record.departement,
			commune: record.commune,
			petiteRegionAgricole: record.petite_region_agricole,
			communeId: record.commune_id,
			zonage: record.zonage,
			stationMeteoDefaut: record.station_meteo_defaut,
			pctSauZoneVulnerable: parseFloatOrNull(record.pct_sau_zone_vulnerable),
			pctSauZoneActionsComplementaires: parseFloatOrNull(record.pct_sau_zone_actions_complementaires),
			pctSauZoneNatura2000: parseFloatOrNull(record.pct_sau_zone_natura_2000),
			pctSauZoneErosion: parseFloatOrNull(record.pct_sau_zone_erosion),
			pctSauZoneExcedentStructurel: parseFloatOrNull(record.pct_sau_zone_excedent_structurel),
			pctSauPerimetreProtectionCaptage: parseFloatOrNull(record.pct_sau_perimetre_protection_captage),
			description: record.description,
			statutJuridiqueNom: record.statut_juridique_nom,
			statutJuridiqueCommentaire: record.statut_juridique_commentaire,
			sauTotale: parseFloatOrNull(record.sau_totale),
			culturesCommentaire: record.cultures_commentaire,
			autresActivitesCommentaire: record.autres_activites_commentaire,
			moCommentaire: record.mo_commentaire,
			nombreAssocies: parseIntOrNull(record.nombre_associes),
			moFamilialeEtAssocies: parseFloatOrNull(record.mo_familiale_et_associes),
			moPermanente: parseFloatOrNull(record.mo_permanente),
			moTemporaire: parseFloatOrNull(record.mo_temporaire),
			moFamilialeRemuneration: parseFloatOrNull(record.mo_familiale_remuneration),
			chargesSalariales: parseFloatOrNull(record.charges_salariales),
			moConduiteCulturesDansDomaine: parseFloatOrNull(record.mo_conduite_cultures_dans_domaine_expe),
			cotisationMsa: parseFloatOrNull(record.cotisation_msa),
			fermagesMoyen: parseFloatOrNull(record.fermage_moyen),
			aidesDecouplees: parseFloatOrNull(record.aides_decouplees),
			otex18Nom: record.otex_18_nom,
			otex70Nom: record.otex_70_nom,
			otexCommentaire: record.otex_commentaire,
			nombreParcelles: parseIntOrNull(record.nombre_parcelles),
			distanceSiegeParcellMax: parseFloatOrNull(record.distance_siege_parcelle_max),
			surfaceAutourSiegeExploitation: parseFloatOrNull(record.surface_autour_siege_exploitation),
			parcellesGroupees: record.parcelles_groupees === "t",
			parcellesPluTotGroupees: record.parcelles_plutot_groupees === "t",
			parcellesPluTotDispersees: record.parcelles_plutot_dispersees === "t",
			parcellesDispersees: record.parcelles_dispersees === "t",
			parcellesGroupeesDistinctes: record.parcelles_groupees_distinctes === "t",
			objectifs: record.objectifs,
			atusDomaine: record.atouts_domaine,
			contraintesDomaine: record.contraintes_domaine,
			perspectiveEvolutionDomaine: record.perspective_evolution_domaine,
			membreCooperative: record.membre_cooperative === "t",
			membreGroupeDeveloppement: record.membre_groupe_developpement === "t",
			membreCumul: record.membre_cum === "t",
		}));

		await db.insert(domaine).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

async function importDomaineSol(records: any[]) {
	console.log(`Importing ${records.length} domaine_sol records...`);

	const parseFloatOrNull = (val: string) => {
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			nomLocal: record.nom_local,
			domaineId: record.domaine_id,
			commentaire: record.commentaire,
			sauConcerneePct: parseFloatOrNull(record.sau_concernee_pct),
			solArvalisId: record.sol_arvalis_id,
		}));

		await db.insert(domaineSol).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

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

async function importParcelles(records: any[]) {
	console.log(`Importing ${records.length} parcelles...`);

	const parseIntOrNull = (val: string) => {
		const parsed = parseInt(val, 10);
		return isNaN(parsed) ? null : parsed;
	};

	const parseFloatOrNull = (val: string) => {
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			code: record.code,
			campagne: parseInt(record.campagne, 10),
			pacilotnumber: parseIntOrNull(record.pacilotnumber),
			commentaire: record.commentaire,
			nombreDeZones: parseIntOrNull(record.nombre_de_zones),
			equipCommentaire: record.equip_commentaire,
			surface: parseFloatOrNull(record.surface),
			pente: record.pente,
			distanceCoursEau: record.distance_cours_eau,
			bandeEnherbee: record.bande_enherbee,
			dansZonage: record.dans_zonage,
			commentaireZonage: record.commentaire_zonage,
			systemeIrrigation: record.systeme_irrigation === "true",
			systemeIrrigationType: record.systeme_irrigation_type,
			pompeType: record.pompe_type,
			positionnementTuyauxArrosage: record.positionnement_tuyaux_arrosage,
			systemeFertirrigation: record.systeme_fertirrigation === "true",
			eauOrigine: record.eau_origine,
			drainage: record.drainage === "true",
			drainageAnneeRealisation: parseIntOrNull(record.drainage_annee_realisation),
			protectionAntigel: record.protection_antigel === "true",
			protectionAntigrele: record.protection_antigrele === "true",
			protectionAntipluie: record.protection_antipluie === "true",
			protectionAntigelType: record.protection_antigel_type,
			protectionAntiinsecte: record.protection_antiinsecte === "true",
			equipAutre: record.equip_autre,
			commentaireSol: record.commentaire_sol,
			textureSurface: record.texture_surface,
			textureSousSol: record.texture_sous_sol,
			solNomRef: record.sol_nom_ref,
			solPh: parseFloatOrNull(record.sol_ph),
			solPierrositeMoyenne: parseFloatOrNull(record.sol_pierrosite_moyenne),
			solProfondeurMaxEnracinementClasse: record.sol_profondeur_max_enracinement_classe,
			solProfondeurMaxEnracinement: parseFloatOrNull(record.sol_profondeur_max_enracinement),
			teneurMoPct: parseFloatOrNull(record.teneur_mo_pct),
			hydromorphie: record.hydromorphie === "true",
			calcaire: record.calcaire === "true",
			proportionCalcaireTotal: parseFloatOrNull(record.proportion_calcaire_total),
			proportionCalcaireActif: parseFloatOrNull(record.proportion_calcaire_actif),
			battance: record.battance === "true",
			domaineId: record.domaine_id,
			sdcId: record.sdc_id,
			domaineSolId: record.domaine_sol_id,
		}));

		await db.insert(parcelle).values(values);
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
