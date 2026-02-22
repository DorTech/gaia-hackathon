import "dotenv/config";
import { db, dispositif, domaine, domaineSol, parcelle, parcelleType, sdc, sdcRealisePerfMagasinCan, synthetisePerfMagasinCan, synthetise, zone } from "../src";
import { parse } from "csv-parse/sync";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

type DataCategory = "contexte" | "intervention" | "intrant_et_culture" | "magasin";

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
		files: ["domaine.csv", "dispositif.csv", "domaine_sol.csv", "parcelle.csv", "parcelle_type.csv", "sdc.csv", "synthetise.csv", "zone.csv"],
		handlers: {
			"domaine.csv": importDomaines,
			"dispositif.csv": importDispositifs,
			"domaine_sol.csv": importDomaineSol,
			"parcelle.csv": importParcelles,
			"parcelle_type.csv": importParcelleTypes,
			"sdc.csv": importSdc,
			"synthetise.csv": importSynthetise,
			"zone.csv": importZones,
		},
	},
	{
		category: "intervention",
		files: [],
		handlers: {},
	},
	{
		category: "magasin",
		files: ["sdc_realise_performance_magasin_can.csv", "synthetise_performance_magasin_can.csv"],
		handlers: {
			"sdc_realise_performance_magasin_can.csv": importSdcRealisePerfMagasinCan,
			"synthetise_performance_magasin_can.csv": importSynthetisePerfMagasinCan,
		},
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

async function importDispositifs(records: any[]) {
	console.log(`Importing ${records.length} dispositifs...`);

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			code: record.code,
			type: record.type,
			campagne: parseInt(record.campagne, 10),
			domaineId: record.domaine_id,
		}));

		await db.insert(dispositif).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

async function importSynthetise(records: any[]) {
	console.log(`Importing ${records.length} synthetise records...`);

	// Fetch existing IDs to validate foreign keys
	const existingParcelleTypeIds = new Set(
		(await db.select({ id: parcelleType.id }).from(parcelleType)).map(p => p.id)
	);
	const existingSdcIds = new Set(
		(await db.select({ id: sdc.id }).from(sdc)).map(s => s.id)
	);

	const parseBoolOrNull = (val: string) => {
		if (!val || val === "") return null;
		return val === "t" || val === "true" || val === "1";
	};

	const parseStringOrNull = (val: string) => {
		return (!val || val === "") ? null : val;
	};

	const erasedParcelleTypeIds = new Set<string>();
	const erasedSdcIds = new Set<string>();

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => {
			let parcelleTypeId = parseStringOrNull(record.parcelle_type_id);
			let sdcId = parseStringOrNull(record.sdc_id);

			// Check if foreign key values exist
			if (parcelleTypeId && !existingParcelleTypeIds.has(parcelleTypeId)) {
				erasedParcelleTypeIds.add(parcelleTypeId);
				parcelleTypeId = null;
			}
			if (sdcId && !existingSdcIds.has(sdcId)) {
				erasedSdcIds.add(sdcId);
				sdcId = null;
			}

			return {
				id: record.id,
				campagnes: record.campagnes,
				source: record.source,
				valide: parseBoolOrNull(record.valide),
				commentaire: record.commentaire,
				parcelleTypeId,
				sdcId,
			};
		});

		await db.insert(synthetise).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}

	// Log erased values
	if (erasedParcelleTypeIds.size > 0) {
		console.log(`  ⚠️  Replaced ${erasedParcelleTypeIds.size} non-existent parcelle_type_id values with NULL:`);
		Array.from(erasedParcelleTypeIds).slice(0, 10).forEach(id => console.log(`    - ${id}`));
		if (erasedParcelleTypeIds.size > 10) {
			console.log(`    ... and ${erasedParcelleTypeIds.size - 10} more`);
		}
	}
	if (erasedSdcIds.size > 0) {
		console.log(`  ⚠️  Replaced ${erasedSdcIds.size} non-existent sdc_id values with NULL:`);
		Array.from(erasedSdcIds).slice(0, 10).forEach(id => console.log(`    - ${id}`));
		if (erasedSdcIds.size > 10) {
			console.log(`    ... and ${erasedSdcIds.size - 10} more`);
		}
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

async function importParcelleTypes(records: any[]) {
	console.log(`Importing ${records.length} parcelle_type records...`);

	const parseIntOrNull = (val: string) => {
		const parsed = parseInt(val, 10);
		return isNaN(parsed) ? null : parsed;
	};

	const parseFloatOrNull = (val: string) => {
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const parseBoolOrNull = (val: string) => {
		if (!val || val === "") return null;
		return val === "t" || val === "true" || val === "1";
	};

	const batchSize = 1000;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			communeId: record.commune_id,
			surface: parseFloatOrNull(record.surface),
			numIlotPac: parseIntOrNull(record.num_ilot_pac),
			latitude: parseFloatOrNull(record.latitude),
			longitude: parseFloatOrNull(record.longitude),
			commentaire: record.commentaire,
			penteMax: record.pente_max,
			distanceCoursEau: record.distance_cours_eau,
			bandeEnherbee: record.bande_enherbee,
			motifFinUtilisation: record.motif_fin_utilisation,
			dansZonage: record.dans_zonage,
			commentaireZonage: record.commentaire_zonage,
			equipementCommentaire: record.equipement_commentaire,
			systemeIrrigation: parseBoolOrNull(record.systeme_irrigation),
			systemeIrrigationType: record.systeme_irrigation_type,
			pompeType: record.pompe_type,
			positionnementTuyauxArrosage: record.positionnement_tuyaux_arrosage,
			eauOrigine: record.eau_origine,
			systemeFertirrigation: parseBoolOrNull(record.systeme_fertirrigation),
			drainage: parseBoolOrNull(record.drainage),
			drainageAnneeRealisation: parseIntOrNull(record.drainage_annee_realisation),
			protectionAntigel: parseBoolOrNull(record.protection_antigel),
			protectionAntigelType: record.protection_antigel_type,
			protectionAntigrele: parseBoolOrNull(record.protection_antigrele),
			protectionAntiinsecte: parseBoolOrNull(record.protection_antiinsecte),
			protectionAntipluie: parseBoolOrNull(record.protection_antipluie),
			equipementAutre: record.equipement_autre,
			commentaireSol: record.commentaire_sol,
			textureSurfaceId: record.texture_surface_id,
			textureSousSolId: record.texture_sous_sol_id,
			pierrositeMoyenne: parseFloatOrNull(record.pierrosite_moyenne),
			solProfondeurMaxEnracinement: parseFloatOrNull(record.sol_profondeur_max_enracinement),
			solProfondeurMaxEnracinementClasse: record.sol_profondeur_max_enracinement_classe,
			teneurMoPct: parseFloatOrNull(record.teneur_mo_pct),
			battance: parseBoolOrNull(record.battance),
			ph: parseFloatOrNull(record.ph),
			hydromorphie: parseBoolOrNull(record.hydromorphie),
			calcaire: parseBoolOrNull(record.calcaire),
			proportionCalcaireTotal: parseFloatOrNull(record.proportion_calcaire_total),
		}));

		await db.insert(parcelleType).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

async function importSdc(records: any[]) {
	console.log(`Importing ${records.length} sdc records...`);

	const parseFloatOrNull = (val: string) => {
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const parseBoolOrNull = (val: string) => {
		if (!val || val === "") return null;
		return val === "t" || val === "true" || val === "1";
	};

	const batchSize = 100; // 80+ fields, so smaller batch size to failures on input queries
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			id: record.id,
			filiere: record.filiere,
			typeAgriculture: record.type_agriculture,
			partSauDomaine: parseFloatOrNull(record.part_sau_domaine),
			partMoDomaine: parseFloatOrNull(record.part_mo_domaine),
			partMaterielDomaine: parseFloatOrNull(record.part_materiel_domaine),
			cipan: parseBoolOrNull(record.cipan),
			varPeuSensiblesMaladies: parseBoolOrNull(record.var_peu_sensibles_maladies),
			broyageBordure: parseBoolOrNull(record.broyage_bordure),
			gestionBordureDeBois: parseBoolOrNull(record.gestion_bordure_de_bois),
			codeDephy: record.code_dephy,
			codesConventionDephy: record.codes_convention_dephy,
			commentaire: record.commentaire,
			couvertsAssocies: parseBoolOrNull(record.couverts_associes),
			culturesPieges: parseBoolOrNull(record.cultures_pieges),
			decompactageFrequent: parseBoolOrNull(record.decompactage_frequent),
			decompactageOccasionnel: parseBoolOrNull(record.decompactage_occasionnel),
			desherbageAutreForm: parseBoolOrNull(record.desherbage_autre_forme),
			desherbageMecaFrequent: parseBoolOrNull(record.desherbage_meca_frequent),
			desherbageMecaOccasionnel: parseBoolOrNull(record.desherbage_meca_occasionnel),
			desherbageThermique: parseBoolOrNull(record.desherbage_thermique),
			destructionLitiere: parseBoolOrNull(record.destruction_litiere),
			doseAdapteeSurfFoliaire: parseBoolOrNull(record.dose_adaptee_surf_foliaire),
			enherbementNaturel: parseBoolOrNull(record.enherbement_naturel),
			enherbementSeme: parseBoolOrNull(record.enherbement_seme),
			exportationMenuPailles: parseBoolOrNull(record.exportation_menu_pailles),
			faibleDensite: parseBoolOrNull(record.faible_densite),
			faibleEcartement: parseBoolOrNull(record.faible_ecartement),
			fauxSemisIntensifs: parseBoolOrNull(record.faux_semis_intensifs),
			fauxSemisPonctuels: parseBoolOrNull(record.faux_semis_ponctuels),
			filetAntiInsectes: parseBoolOrNull(record.filet_anti_insectes),
			fortEcartement: parseBoolOrNull(record.fort_ecartement),
			forteDensite: parseBoolOrNull(record.forte_densite),
			gestionResidus: parseBoolOrNull(record.gestion_residus),
			haiesAnciennes: parseBoolOrNull(record.haies_anciennes),
			haiesJeunes: parseBoolOrNull(record.haies_jeunes),
			labourFrequent: parseBoolOrNull(record.labour_frequent),
			labourOccasionnel: parseBoolOrNull(record.labour_occasionnel),
			labourSystematique: parseBoolOrNull(record.labour_systematique),
			lutteBioAutre: parseBoolOrNull(record.lutte_bio_autre),
			lutteBioConfuSexuelle: parseBoolOrNull(record.lutte_bio_confu_sexuelle),
			melange: parseBoolOrNull(record.melange),
			modaliteSuiviDephy: record.modalite_suivi_dephy,
			modesCommercialisation: record.modes_commercialisation,
			monocultureRotationCourte: parseBoolOrNull(record.monoculture_rotation_courte),
			optimConditionsApplication: parseBoolOrNull(record.optim_conditions_application),
			reductionDoseAutresPhyto: parseBoolOrNull(record.reduction_dose_autres_phyto),
			reductionDoseFongi: parseBoolOrNull(record.reduction_dose_fongi),
			reductionDoseHerbi: parseBoolOrNull(record.reduction_dose_herbi),
			reductionDoseInsec: parseBoolOrNull(record.reduction_dose_insec),
			rotationCulturesRustiques: parseBoolOrNull(record.rotation_cultures_rustiques),
			rotationDiversifieAvecPt: parseBoolOrNull(record.rotation_diversifiee_avec_pt),
			rotationDiversifieeIntroUneCulture: parseBoolOrNull(record.rotation_diversifiee_intro_une_culture),
			rotationDiversifieeSansPt: parseBoolOrNull(record.rotation_diversifiee_sans_pt),
			adaptationLutteALaParcelle: parseBoolOrNull(record.adaptation_lutte_a_la_parcelle),
			semiDirectSystematique: parseBoolOrNull(record.semis_direct_systematique),
			semisPrecoce: parseBoolOrNull(record.semis_precoce),
			semisTardif: parseBoolOrNull(record.semis_tardif),
			strategieCategorie: record.strategie_categorie,
			stripTillFrequent: parseBoolOrNull(record.strip_till_frequent),
			stripTillOccasionnel: parseBoolOrNull(record.strip_till_occasionnel),
			tailleLimitantRisquesSanitaires: parseBoolOrNull(record.taille_limitant_risques_sanitaires),
			tailleOrganesContamines: parseBoolOrNull(record.taille_organes_contamines),
			tcs: parseBoolOrNull(record.tcs),
			traitementLocalise: parseBoolOrNull(record.traitement_localise),
			typeProduction: record.type_production,
			varPeuSensiblesVerse: parseBoolOrNull(record.var_peu_sensibles_verse),
			utilisationAdjuvants: parseBoolOrNull(record.utilisation_adjuvants),
			utilisationOad: parseBoolOrNull(record.utilisation_oad),
			utilisationSeuils: parseBoolOrNull(record.utilisation_seuils),
			utilisationStimDefense: parseBoolOrNull(record.utilisation_stim_defense),
			validite: parseBoolOrNull(record.validite),
			varCompetitivesAdventic: parseBoolOrNull(record.var_competitives_adventice),
			varPeuSensiblesRavageurs: parseBoolOrNull(record.var_peu_sensibles_ravageurs),
			semiDirectOccasionnel: parseBoolOrNull(record.semis_direct_occasionnel),
			agroforesterie: parseBoolOrNull(record.agroforesterie),
			ajustementFertilisation: parseBoolOrNull(record.ajustement_fertilisation),
			ajustementIrrigation: parseBoolOrNull(record.ajustement_irrigation),
			arbresBordureParcelle: parseBoolOrNull(record.arbres_bordure_parcelle),
			bandesEnherbees: parseBoolOrNull(record.bandes_enherbees),
			bandesFleuries: parseBoolOrNull(record.bandes_fleuries),
			boisBosquet: parseBoolOrNull(record.bois_bosquet),
			campagne: parseInt(record.campagne, 10),
			ciAttractivesPourAuxiliaires: parseBoolOrNull(record.ci_attractives_pour_auxiliaires),
			ciEffetAlleloOuBiocide: parseBoolOrNull(record.ci_effet_allelo_ou_biocide),
			code: record.code,
			dispositifId: record.dispositif_id,
		}));

		await db.insert(sdc).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

async function importSdcRealisePerfMagasinCan(records: any[]) {
	console.log(`Importing ${records.length} sdc_realise_performance_magasin_can records...`);

	const parseFloatOrNull = (val: string) => {
		if (!val || val === "") return null;
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const batchSize = 20;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			sdcId: record.sdc_id,
			iftHistoChimiqueTot: parseFloatOrNull(record.ift_histo_chimique_tot),
			iftHistoChimTotHts: parseFloatOrNull(record.ift_histo_chim_tot_hts),
			iftHistoH: parseFloatOrNull(record.ift_histo_h),
			iftHistoF: parseFloatOrNull(record.ift_histo_f),
			iftHistoI: parseFloatOrNull(record.ift_histo_i),
			iftHistoTs: parseFloatOrNull(record.ift_histo_ts),
			tpsUtilisationMaterielJanvier: parseFloatOrNull(record.tps_utilisation_materiel_janvier),
			tpsUtilisationMaterielFevrier: parseFloatOrNull(record.tps_utilisation_materiel_fevrier),
			iftHistoA: parseFloatOrNull(record.ift_histo_a),
			iftHistoHh: parseFloatOrNull(record.ift_histo_hh),
			tpsUtilisationMaterielMars: parseFloatOrNull(record.tps_utilisation_materiel_mars),
			tpsUtilisationMaterielAvril: parseFloatOrNull(record.tps_utilisation_materiel_avril),
			iftHistoBiocontrole: parseFloatOrNull(record.ift_histo_biocontrole),
			iftHistoTxComp: parseFloatOrNull(record.ift_histo_tx_comp),
			tpsUtilisationMaterielMai: parseFloatOrNull(record.tps_utilisation_materiel_mai),
			tpsUtilisationMaterielJuin: parseFloatOrNull(record.tps_utilisation_materiel_juin),
			tpsUtilisationMaterielJuillet: parseFloatOrNull(record.tps_utilisation_materiel_juillet),
			tpsUtilisationMaterielAout: parseFloatOrNull(record.tps_utilisation_materiel_aout),
			iftCibleNonMilChimiqueTot: parseFloatOrNull(record.ift_cible_non_mil_chimique_tot),
			tpsUtilisationMaterielSept: parseFloatOrNull(record.tps_utilisation_materiel_sept),
			tpsUtilisationMaterielOct: parseFloatOrNull(record.tps_utilisation_materiel_oct),
			iftCibleNonMilChimTotHts: parseFloatOrNull(record.ift_cible_non_mil_chim_tot_hts),
			iftCibleNonMilH: parseFloatOrNull(record.ift_cible_non_mil_h),
			tpsUtilisationMaterielNov: parseFloatOrNull(record.tps_utilisation_materiel_nov),
			iftCibleNonMilF: parseFloatOrNull(record.ift_cible_non_mil_f),
			tpsUtilisationMaterielDec: parseFloatOrNull(record.tps_utilisation_materiel_dec),
			tpsUtilisationMateriel: parseFloatOrNull(record.tps_utilisation_materiel),
			iftCibleNonMilI: parseFloatOrNull(record.ift_cible_non_mil_i),
			iftCibleNonMilTs: parseFloatOrNull(record.ift_cible_non_mil_ts),
			iftCibleNonMilTxComp: parseFloatOrNull(record.ift_cible_non_mil_tx_comp),
			iftCibleNonMilA: parseFloatOrNull(record.ift_cible_non_mil_a),
			tpsLecTravailManuelJanvier: parseFloatOrNull(record.tps_travail_manuel_janvier),
			iftCibleNonMilHh: parseFloatOrNull(record.ift_cible_non_mil_hh),
			tpsTravailManuelFevrier: parseFloatOrNull(record.tps_travail_manuel_fevrier),
			iftCibleNonMilBiocontrole: parseFloatOrNull(record.ift_cible_non_mil_biocontrole),
			tpsTravailManuelMars: parseFloatOrNull(record.tps_travail_manuel_mars),
			tpsTravailManuelAvril: parseFloatOrNull(record.tps_travail_manuel_avril),
			iftCibleNonMilTxComp2: parseFloatOrNull(record.ift_cible_non_mil_tx_comp),
			tpsTravailManuelMai: parseFloatOrNull(record.tps_travail_manuel_mai),
			tpsTravailManuelJuin: parseFloatOrNull(record.tps_travail_manuel_juin),
			tpsTravailManuelJuillet: parseFloatOrNull(record.tps_travail_manuel_juillet),
			iftCibleMilChimiqueTot: parseFloatOrNull(record.ift_cible_mil_chimique_tot),
			tpsTravailManuelAout: parseFloatOrNull(record.tps_travail_manuel_aout),
			iftCibleMilChimTotHts: parseFloatOrNull(record.ift_cible_mil_chim_tot_hts),
			tpsTravailManuelSeptembre: parseFloatOrNull(record.tps_travail_manuel_septembre),
			tpsTravailManuelOctobre: parseFloatOrNull(record.tps_travail_manuel_octobre),
			iftCibleMilH: parseFloatOrNull(record.ift_cible_mil_h),
			iftCibleMilF: parseFloatOrNull(record.ift_cible_mil_f),
			tpsTravailManuelNovembre: parseFloatOrNull(record.tps_travail_manuel_novembre),
			tpsTravailManuelDecembre: parseFloatOrNull(record.tps_travail_manuel_decembre),
			iftCibleMilI: parseFloatOrNull(record.ift_cible_mil_i),
			iftCibleMilTs: parseFloatOrNull(record.ift_cible_mil_ts),
			tpsTravailManuel: parseFloatOrNull(record.tps_travail_manuel),
			iftCibleMilA: parseFloatOrNull(record.ift_cible_mil_a),
			tpsTravailManuelTxComp: parseFloatOrNull(record.tps_travail_manuel_tx_comp),
			tpsTravailMecaniseJanvier: parseFloatOrNull(record.tps_travail_mecanise_janvier),
			iftCibleMilHh: parseFloatOrNull(record.ift_cible_mil_hh),
			iftCibleMilBiocontrole: parseFloatOrNull(record.ift_cible_mil_biocontrole),
			tpsTravailMecaniseFevrier: parseFloatOrNull(record.tps_travail_mecanise_fevrier),
			tpsTravailMecaniseMars: parseFloatOrNull(record.tps_travail_mecanise_mars),
			iftCibleMilTxComp: parseFloatOrNull(record.ift_cible_mil_tx_comp),
			tpsTravailMecaniseAvril: parseFloatOrNull(record.tps_travail_mecanise_avril),
			tpsTravailMecaniseMai: parseFloatOrNull(record.tps_travail_mecanise_mai),
			tpsTravailMecaniseJuin: parseFloatOrNull(record.tps_travail_mecanise_juin),
			tpsTravailMecaniseJuillet: parseFloatOrNull(record.tps_travail_mecanise_juillet),
			iftCultureNonMilChimiqueTot: parseFloatOrNull(record.ift_culture_non_mil_chimique_tot),
			iftCultureNonMilChimTotHts: parseFloatOrNull(record.ift_culture_non_mil_chim_tot_hts),
			tpsTravailMecaniseAout: parseFloatOrNull(record.tps_travail_mecanise_aout),
			tpsTravailMecaniseSeptembre: parseFloatOrNull(record.tps_travail_mecanise_septembre),
			iftCultureNonMilH: parseFloatOrNull(record.ift_culture_non_mil_h),
			tpsTravailMecaniseOctobre: parseFloatOrNull(record.tps_travail_mecanise_octobre),
			iftCultureNonMilF: parseFloatOrNull(record.ift_culture_non_mil_f),
			tpsTravailMecaniseNovembre: parseFloatOrNull(record.tps_travail_mecanise_novembre),
			iftCultureNonMilI: parseFloatOrNull(record.ift_culture_non_mil_i),
			tpsTravailMecaniseDecembre: parseFloatOrNull(record.tps_travail_mecanise_decembre),
			iftCultureNonMilTs: parseFloatOrNull(record.ift_culture_non_mil_ts),
			iftCultureNonMilA: parseFloatOrNull(record.ift_culture_non_mil_a),
			tpsTravailMecanise: parseFloatOrNull(record.tps_travail_mecanise),
			tpsTravailMecaniseTxComp: parseFloatOrNull(record.tps_travail_mecanise_tx_comp),
			iftCultureNonMilHh: parseFloatOrNull(record.ift_culture_non_mil_hh),
			tpsTravailTotalJanvier: parseFloatOrNull(record.tps_travail_total_janvier),
			iftCultureNonMilBiocontrole: parseFloatOrNull(record.ift_culture_non_mil_biocontrole),
			tpsTravailTotalFevrier: parseFloatOrNull(record.tps_travail_total_fevrier),
			iftCultureNonMilTxComp: parseFloatOrNull(record.ift_culture_non_mil_tx_comp),
			tpsTravailTotalMars: parseFloatOrNull(record.tps_travail_total_mars),
			tpsTravailTotalAvril: parseFloatOrNull(record.tps_travail_total_avril),
			tpsTravailTotalMai: parseFloatOrNull(record.tps_travail_total_mai),
			tpsTravailTotalJuin: parseFloatOrNull(record.tps_travail_total_juin),
			iftCultureMilChimiqueTot: parseFloatOrNull(record.ift_culture_mil_chimique_tot),
			iftCultureMilChimTotHts: parseFloatOrNull(record.ift_culture_mil_chim_tot_hts),
			tpsTravailTotalJuillet: parseFloatOrNull(record.tps_travail_total_juillet),
			iftCultureMilH: parseFloatOrNull(record.ift_culture_mil_h),
			tpsTravailTotalAout: parseFloatOrNull(record.tps_travail_total_aout),
			tpsTravailTotalSeptembre: parseFloatOrNull(record.tps_travail_total_septembre),
			iftCultureMilF: parseFloatOrNull(record.ift_culture_mil_f),
			tpsTravailTotalOctobre: parseFloatOrNull(record.tps_travail_total_octobre),
			iftCultureMilI: parseFloatOrNull(record.ift_culture_mil_i),
			iftCultureMilTs: parseFloatOrNull(record.ift_culture_mil_ts),
			tpsTravailTotalNovembre: parseFloatOrNull(record.tps_travail_total_novembre),
			tpsTravailTotalDecembre: parseFloatOrNull(record.tps_travail_total_decembre),
			iftCultureMilA: parseFloatOrNull(record.ift_culture_mil_a),
			tpsTravailTotal: parseFloatOrNull(record.tps_travail_total),
			tpsTravailTotalTxComp: parseFloatOrNull(record.tps_travail_total_tx_comp),
			iftCultureMilHh: parseFloatOrNull(record.ift_culture_mil_hh),
			nbreDePassagesJanvier: parseFloatOrNull(record.nbre_de_passages_janvier),
			iftCultureMilBiocontrole: parseFloatOrNull(record.ift_culture_mil_biocontrole),
			nbreDePassagesFevrier: parseFloatOrNull(record.nbre_de_passages_fevrier),
			nbreDePassagesMars: parseFloatOrNull(record.nbre_de_passages_mars),
			nbreDePassagesAvril: parseFloatOrNull(record.nbre_de_passages_avril),
			nbreDePassagesMai: parseFloatOrNull(record.nbre_de_passages_mai),
			recoursAuxMoyensBiologiques: parseFloatOrNull(record.recours_aux_moyens_biologiques),
			recoursMacroorganismes: parseFloatOrNull(record.recours_macroorganismes),
			nbreDePassagesJuin: parseFloatOrNull(record.nbre_de_passages_juin),
			nbreDePassagesJuillet: parseFloatOrNull(record.nbre_de_passages_juillet),
			recoursProduitsBlotiquesRansamm: parseFloatOrNull(record.recours_produits_biotiques_sansamm),
			nbreDePassagesAout: parseFloatOrNull(record.nbre_de_passages_aout),
			recoursProduitsAbiotiquesRansamm: parseFloatOrNull(record.recours_produits_abiotiques_sansamm),
			nbredePassagesSeptembre: parseFloatOrNull(record.nbre_de_passages_septembre),
			coTotReelles: parseFloatOrNull(record.co_tot_reelles),
			coTotReellesTxComp: parseFloatOrNull(record.co_tot_reelles_tx_comp),
			nbreDePassagesOctobre: parseFloatOrNull(record.nbre_de_passages_octobre),
			nbreDePassagesNovembre: parseFloatOrNull(record.nbre_de_passages_novembre),
			coTotStdMil: parseFloatOrNull(record.co_tot_std_mil),
			nbreDePassagesDecembre: parseFloatOrNull(record.nbre_de_passages_decembre),
			nbreDePassages: parseFloatOrNull(record.nbre_de_passages),
			coTotStdMilTxComp: parseFloatOrNull(record.co_tot_std_mil_tx_comp),
			nbreDePassagesTxComp: parseFloatOrNull(record.nbre_de_passages_tx_comp),
			nbreDePassagesLabour: parseFloatOrNull(record.nbre_de_passages_labour),
			coSemisReel: parseFloatOrNull(record.co_semis_reel),
			nombreUthNecessaires: parseFloatOrNull(record.nombre_uth_necessaires),
			nbreDePassagesLabourTxComp: parseFloatOrNull(record.nbre_de_passages_labour_tx_comp),
			coSemisStdMil: parseFloatOrNull(record.co_semis_std_mil),
			coFertimninReel: parseFloatOrNull(record.co_fertimin_reel),
			nbreDePassagesTcs: parseFloatOrNull(record.nbre_de_passages_tcs),
			nbreDePassagesTcsTxComp: parseFloatOrNull(record.nbre_de_passages_tcs_tx_comp),
			coFertimninStdMil: parseFloatOrNull(record.co_fertimin_std_mil),
			coEpandageOrgaReelles: parseFloatOrNull(record.co_epandage_orga_reelles),
			nbreDePassagesDesherbageMeca: parseFloatOrNull(record.nbre_de_passages_desherbage_meca),
			nbreDePassagesDesherbageMecaTxComp: parseFloatOrNull(record.nbre_de_passages_desherbage_meca_tx_comp),
			coEpandageOrgaStdMil: parseFloatOrNull(record.co_epandage_orga_std_mil),
			coPhytoSansAmmReelles: parseFloatOrNull(record.co_phyto_sans_amm_reelles),
			utilisationDesherbageMeca: parseFloatOrNull(record.utili_desherbage_meca),
			utilisationDesherbageMecaTxComp: parseFloatOrNull(record.utili_desherbage_meca_tx_comp),
			coPhytoSansAmmStdMil: parseFloatOrNull(record.co_phyto_sans_amm_std_mil),
			typeDeTravailDuSol: record.type_de_travail_du_sol,
			especes: record.especes,
			coPhytoAvecAmmReelles: parseFloatOrNull(record.co_phyto_avec_amm_reelles),
			varietes: record.varietes,
			typeDeTravailDuSolTxComp: parseFloatOrNull(record.type_de_travail_du_sol_tx_comp),
			coPhytoAvecAmmStdMil: parseFloatOrNull(record.co_phyto_avec_amm_std_mil),
			cmReelles: parseFloatOrNull(record.cm_reelles),
			coTraitSemenceReelles: parseFloatOrNull(record.co_trait_semence_reelles),
			cmReellesTxComp: parseFloatOrNull(record.cm_reelles_tx_comp),
			coTraitSemenceStdMil: parseFloatOrNull(record.co_trait_semence_std_mil),
			cmStdMil: parseFloatOrNull(record.cm_std_mil),
			coIrrigationReelles: parseFloatOrNull(record.co_irrigation_reelles),
			cmStdMilTxComp: parseFloatOrNull(record.cm_std_mil_tx_comp),
			coIrrigationStdMil: parseFloatOrNull(record.co_irrigation_std_mil),
			coSubstratsReelles: parseFloatOrNull(record.co_substrats_reelles),
			cMainOeuvre_totReelle: parseFloatOrNull(record.c_main_oeuvre_tot_reelle),
			coSubstratsStdMil: parseFloatOrNull(record.co_substrats_std_mil),
			cMainOeuvreTotReelleTxComp: parseFloatOrNull(record.c_main_oeuvre_tot_reelle_tx_comp),
			coPotsReelles: parseFloatOrNull(record.co_pots_reelles),
			cMainOeuvreTotStdMil: parseFloatOrNull(record.c_main_oeuvre_tot_std_mil),
			cMainOeuvreTotStdMilTxComp: parseFloatOrNull(record.c_main_oeuvre_tot_std_mil_tx_comp),
			coPotsStdMil: parseFloatOrNull(record.co_pots_std_mil),
			cMainOeuvreTractoristeReelle: parseFloatOrNull(record.c_main_oeuvre_tractoriste_reelle),
			coIntrantsAutresReelles: parseFloatOrNull(record.co_intrants_autres_reelles),
			coIntrantsAutresStdMil: parseFloatOrNull(record.co_intrants_autres_std_mil),
			cMainOeuvreTractoristeReelleTxComp: parseFloatOrNull(record.c_main_oeuvre_tractoriste_reelle_tx_comp),
			coDecomposeeReelTxComp: parseFloatOrNull(record.co_decomposees_reel_tx_comp),
			cMainOeuvreTractoristeStdMil: parseFloatOrNull(record.c_main_oeuvre_tractoriste_std_mil),
			coDecomposeeStdMilTxComp: parseFloatOrNull(record.co_decomposees_std_mil_tx_comp),
			cMainOeuvreTractoristeStdMilTxComp: parseFloatOrNull(record.c_main_oeuvre_tractoriste_std_mil_tx_comp),
			cMainOeuvreManuelleReelle: parseFloatOrNull(record.c_main_oeuvre_manuelle_reelle),
			cMainOeuvreManuelleReelleTxComp: parseFloatOrNull(record.c_main_oeuvre_manuelle_reelle_tx_comp),
			fertiNTot: parseFloatOrNull(record.ferti_n_tot),
			cMainOeuvreManuelleStdMil: parseFloatOrNull(record.c_main_oeuvre_manuelle_std_mil),
			fertiNMineral: parseFloatOrNull(record.ferti_n_mineral),
			cMainOeuvreManuelleStdMilTxComp: parseFloatOrNull(record.c_main_oeuvre_manuelle_std_mil_tx_comp),
			pbReelSansAutoconso: parseFloatOrNull(record.pb_reel_sans_autoconso),
			fertiNOrganique: parseFloatOrNull(record.ferti_n_organique),
			fertiP2o5Tot: parseFloatOrNull(record.ferti_p2o5_tot),
			pbReelAvecAutoconso: parseFloatOrNull(record.pb_reel_avec_autoconso),
			pbReelTxComp: parseFloatOrNull(record.pb_reel_tx_comp),
			fertiP2o5Mineral: parseFloatOrNull(record.ferti_p2o5_mineral),
			fertiP2o5Organique: parseFloatOrNull(record.ferti_p2o5_organique),
			pbStdMilAvecAutoconso: parseFloatOrNull(record.pb_std_mil_avec_autoconso),
			pbStdMilSansAutoconso: parseFloatOrNull(record.pb_std_mil_sans_autoconso),
			fertiK2oTot: parseFloatOrNull(record.ferti_k2o_tot),
			pbStdMilTxComp: parseFloatOrNull(record.pb_std_mil_tx_comp),
			fertiK2oMineral: parseFloatOrNull(record.ferti_k2o_mineral),
			mbReelleSansAutoconso: parseFloatOrNull(record.mb_reelle_sans_autoconso),
			fertiK2oOrganique: parseFloatOrNull(record.ferti_k2o_organique),
			fertiCaMineral: parseFloatOrNull(record.ferti_ca_mineral),
			mbReelleAvecAutoconso: parseFloatOrNull(record.mb_reelle_avec_autoconso),
			fertiCaoOrganique: parseFloatOrNull(record.ferti_cao_organique),
			mbReelleTxComp: parseFloatOrNull(record.mb_reelle_tx_comp),
			fertiMgoMineral: parseFloatOrNull(record.ferti_mgo_mineral),
			fertiMgoOrganique: parseFloatOrNull(record.ferti_mgo_organique),
			mbStdMilAvecAutoconso: parseFloatOrNull(record.mb_std_mil_avec_autoconso),
			mbStdMilSansAutoconso: parseFloatOrNull(record.mb_std_mil_sans_autoconso),
			mbStdMilTxComp: parseFloatOrNull(record.mb_std_mil_tx_comp),
			fertiSo3Mineral: parseFloatOrNull(record.ferti_so3_mineral),
			msnReelleSansAutoconso: parseFloatOrNull(record.msn_reelle_sans_autoconso),
			fertiSOrganique: parseFloatOrNull(record.ferti_s_organique),
			fertiBMineral: parseFloatOrNull(record.ferti_b_mineral),
			msnReelleAvecAutoconso: parseFloatOrNull(record.msn_reelle_avec_autoconso),
			fertiCuMineral: parseFloatOrNull(record.ferti_cu_mineral),
			msnReelleTxComp: parseFloatOrNull(record.msn_reelle_tx_comp),
			msnStdMilSansAutoconso: parseFloatOrNull(record.msn_std_mil_sans_autoconso),
			fertiFeMineral: parseFloatOrNull(record.ferti_fe_mineral),
			msnStdMilAvecAutoconso: parseFloatOrNull(record.msn_std_mil_avec_autoconso),
			fertiMnMineral: parseFloatOrNull(record.ferti_mn_mineral),
			msnStdMilTxComp: parseFloatOrNull(record.msn_std_mil_tx_comp),
			fertiMoMineral: parseFloatOrNull(record.ferti_mo_mineral),
			mdReelleSansAutoconso: parseFloatOrNull(record.md_reelle_sans_autoconso),
			fertiNa2oMineral: parseFloatOrNull(record.ferti_na2o_mineral),
			fertiZnMineral: parseFloatOrNull(record.ferti_zn_mineral),
			mdReelleAvecAutoconso: parseFloatOrNull(record.md_reelle_avec_autoconso),
			hri1Tot: parseFloatOrNull(record.hri1_tot),
			mdReelleTxComp: parseFloatOrNull(record.md_reelle_tx_comp),
			hri1Hts: parseFloatOrNull(record.hri1_hts),
			mdStdMilSansAutoconso: parseFloatOrNull(record.md_std_mil_sans_autoconso),
			mdStdMilAvecAutoconso: parseFloatOrNull(record.md_std_mil_avec_autoconso),
			hri1TotTauxDeCompletion: parseFloatOrNull(record.hri1_tot_taux_de_completion),
			mdStdMilTxComp: parseFloatOrNull(record.md_std_mil_tx_comp),
			hri1G1Tot: parseFloatOrNull(record.hri1_g1_tot),
			surfUniteDeWHumain: parseFloatOrNull(record.surf_unite_de_w_humain),
			hri1G1Hts: parseFloatOrNull(record.hri1_g1_hts),
			surfUniteDeWHumainTxComp: parseFloatOrNull(record.surf_unite_de_w_humain_tx_comp),
			hri1G1TotTauxDeCompletion: parseFloatOrNull(record.hri1_g1_tot_taux_de_completion),
			consoCarburant: parseFloatOrNull(record.conso_carburant),
			hri1G2Tot: parseFloatOrNull(record.hri1_g2_tot),
			consoCarburantTxComp: parseFloatOrNull(record.conso_carburant_tx_comp),
			consoEau: parseFloatOrNull(record.conso_eau),
			hri1G2Hts: parseFloatOrNull(record.hri1_g2_hts),
			consoEauTxComp: parseFloatOrNull(record.conso_eau_tx_comp),
			hri1G2TotTauxDeCompletion: parseFloatOrNull(record.hri1_g2_tot_taux_de_completion),
			hri1G3Tot: parseFloatOrNull(record.hri1_g3_tot),
			hri1G3Hts: parseFloatOrNull(record.hri1_g3_hts),
			hri1G3TotTauxDeCompletion: parseFloatOrNull(record.hri1_g3_tot_taux_de_completion),
			hri1G4Tot: parseFloatOrNull(record.hri1_g4_tot),
			hri1G4Hts: parseFloatOrNull(record.hri1_g4_hts),
			hri1G4TotTauxDeCompletion: parseFloatOrNull(record.hri1_g4_tot_taux_de_completion),
			qsaTot: parseFloatOrNull(record.qsa_tot),
			qsaTotHts: parseFloatOrNull(record.qsa_tot_hts),
			qsaTotTauxDeCompletion: parseFloatOrNull(record.qsa_tot_taux_de_completion),
			qsaDangerEnvironnement: parseFloatOrNull(record.qsa_danger_environnement),
			qsaDangerEnvironnementHts: parseFloatOrNull(record.qsa_danger_environnement_hts),
			qsaToxiqueUtilisateur: parseFloatOrNull(record.qsa_toxique_utilisateur),
			qsaToxiqueUtilisateurHts: parseFloatOrNull(record.qsa_toxique_utilisateur_hts),
			qsaCmr: parseFloatOrNull(record.qsa_cmr),
			qsaCmrHts: parseFloatOrNull(record.qsa_cmr_hts),
			qsaSubstancesCandidatsSubstitution: parseFloatOrNull(record.qsa_substances_candidates_substitution),
			qsaSubstancesCandidatsSubstitutionHts: parseFloatOrNull(record.qsa_substances_candidates_substitution_hts),
			qsaSubstancesFaibleRisque: parseFloatOrNull(record.qsa_substances_faible_risque),
			qsaSubstancesFaibleRisqueHts: parseFloatOrNull(record.qsa_substances_faible_risque_hts),
			qsaGlyphosate: parseFloatOrNull(record.qsa_glyphosate),
			qsaGlyphosateHts: parseFloatOrNull(record.qsa_glyphosate_hts),
			qsaChltoluron: parseFloatOrNull(record.qsa_chlortoluron),
			qsaChltoluronHts: parseFloatOrNull(record.qsa_chlortoluron_hts),
			qsaDiflufenican: parseFloatOrNull(record.qsa_diflufenican),
			qsaDiflufenicanHts: parseFloatOrNull(record.qsa_diflufenican_hts),
			qsaProsulfocarbe: parseFloatOrNull(record.qsa_prosulfocarbe),
			qsaProsulfocarbeHts: parseFloatOrNull(record.qsa_prosulfocarbe_hts),
			qsaSmetolachlore: parseFloatOrNull(record.qsa_smetolachlore),
			qsaSmetolachloreHts: parseFloatOrNull(record.qsa_smetolachlore_hts),
			qsaBoscalid: parseFloatOrNull(record.qsa_boscalid),
			qsaBoscalidHts: parseFloatOrNull(record.qsa_boscalid_hts),
			qsaFluopyram: parseFloatOrNull(record.qsa_fluopyram),
			qsaFluopyramHts: parseFloatOrNull(record.qsa_fluopyram_hts),
			qsaLambdaCyhalothrine: parseFloatOrNull(record.qsa_lambda_cyhalothrine),
			qsaLambdaCyhalothrineHts: parseFloatOrNull(record.qsa_lambda_cyhalothrine_hts),
			qsaCuivreTot: parseFloatOrNull(record.qsa_cuivre_tot),
			qsaCuivreTotHts: parseFloatOrNull(record.qsa_cuivre_tot_hts),
			qsaCuivrePhyto: parseFloatOrNull(record.qsa_cuivre_phyto),
			qsaCuivrePhytoHts: parseFloatOrNull(record.qsa_cuivre_phyto_hts),
			qsaCuivreFerti: parseFloatOrNull(record.qsa_cuivre_ferti),
			qsaSoufreTot: parseFloatOrNull(record.qsa_soufre_tot),
			qsaSoufreTotHts: parseFloatOrNull(record.qsa_soufre_tot_hts),
			qsaSouffrePhyto: parseFloatOrNull(record.qsa_soufre_phyto),
			qsaSouffirePhytoHts: parseFloatOrNull(record.qsa_soufre_phyto_hts),
			qsaSouffireFerti: parseFloatOrNull(record.qsa_soufre_ferti),
			domaineNom: record.domaine_nom,
			domaineId: record.domaine_id,
			domaineCampagne: record.domaine_campagne,
			domaineType: record.domaine_type,
			departement: record.departement,
			dispositifId: record.dispositif_id,
			dispositifType: record.dispositif_type,
			nomReseauIt: record.nom_reseau_it,
			nomReseauIr: record.nom_reseau_ir,
			sdcFiliere: record.sdc_filiere,
			sdcNom: record.sdc_nom,
			sdcCodeDephy: record.sdc_code_dephy,
			sdcTypeAgriculture: record.sdc_type_agriculture,
			sdcValide: record.sdc_valide == "oui" ? true : false,
		}));
		console.log(`  Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}...`);
		await db.insert(sdcRealisePerfMagasinCan).values(values);
		console.log(
			`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} ✓`,
		);
	}
}

async function importSynthetisePerfMagasinCan(records: any[]) {
	console.log(`Importing ${records.length} synthetise_performance_magasin_can records...`);

	const parseFloatOrNull = (val: string) => {
		if (!val || val === "") return null;
		const parsed = parseFloat(val);
		return isNaN(parsed) ? null : parsed;
	};

	const batchSize = 20;
	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const values = batch.map((record: any) => ({
			systemeSynthetiseId: record.systeme_synthetise_id,

			synthetiseValide: record.synthetise_valide === "oui" ? true : false,
			synthetiseCampagnes: record.synthetise_campagnes,

			// IFT historique
			iftHistoChimiqueTot: parseFloatOrNull(record.ift_histo_chimique_tot),
			iftHistoChimTotHts: parseFloatOrNull(record.ift_histo_chim_tot_hts),
			iftHistoH: parseFloatOrNull(record.ift_histo_h),
			iftHistoF: parseFloatOrNull(record.ift_histo_f),
			iftHistoI: parseFloatOrNull(record.ift_histo_i),
			iftHistoTs: parseFloatOrNull(record.ift_histo_ts),
			iftHistoA: parseFloatOrNull(record.ift_histo_a),
			iftHistoHh: parseFloatOrNull(record.ift_histo_hh),
			iftHistoBiocontrole: parseFloatOrNull(record.ift_histo_biocontrole),
			iftHistoTxComp: parseFloatOrNull(record.ift_histo_tx_comp),

			// Temps utilisation matériel
			tpsUtilisationMaterielJanvier: parseFloatOrNull(record.tps_utilisation_materiel_janvier),
			tpsUtilisationMaterielFevrier: parseFloatOrNull(record.tps_utilisation_materiel_fevrier),
			tpsUtilisationMaterielMars: parseFloatOrNull(record.tps_utilisation_materiel_mars),
			tpsUtilisationMaterielAvril: parseFloatOrNull(record.tps_utilisation_materiel_avril),
			tpsUtilisationMaterielMai: parseFloatOrNull(record.tps_utilisation_materiel_mai),
			tpsUtilisationMaterielJuin: parseFloatOrNull(record.tps_utilisation_materiel_juin),
			tpsUtilisationMaterielJuillet: parseFloatOrNull(record.tps_utilisation_materiel_juillet),
			tpsUtilisationMaterielAout: parseFloatOrNull(record.tps_utilisation_materiel_aout),
			tpsUtilisationMaterielSept: parseFloatOrNull(record.tps_utilisation_materiel_sept),
			tpsUtilisationMaterielOct: parseFloatOrNull(record.tps_utilisation_materiel_oct),
			tpsUtilisationMaterielNov: parseFloatOrNull(record.tps_utilisation_materiel_nov),
			tpsUtilisationMaterielDec: parseFloatOrNull(record.tps_utilisation_materiel_dec),
			tpsUtilisationMateriel: parseFloatOrNull(record.tps_utilisation_materiel),
			tpsUtilisationMaterielTxComp: parseFloatOrNull(record.tps_utilisation_materiel_tx_comp),

			// IFT cible non mil
			iftCibleNonMilChimiqueTot: parseFloatOrNull(record.ift_cible_non_mil_chimique_tot),
			iftCibleNonMilChimTotHts: parseFloatOrNull(record.ift_cible_non_mil_chim_tot_hts),
			iftCibleNonMilH: parseFloatOrNull(record.ift_cible_non_mil_h),
			iftCibleNonMilF: parseFloatOrNull(record.ift_cible_non_mil_f),
			iftCibleNonMilI: parseFloatOrNull(record.ift_cible_non_mil_i),
			iftCibleNonMilTs: parseFloatOrNull(record.ift_cible_non_mil_ts),
			iftCibleNonMilA: parseFloatOrNull(record.ift_cible_non_mil_a),
			iftCibleNonMilHh: parseFloatOrNull(record.ift_cible_non_mil_hh),
			iftCibleNonMilBiocontrole: parseFloatOrNull(record.ift_cible_non_mil_biocontrole),
			iftCibleNonMilTxComp: parseFloatOrNull(record.ift_cible_non_mil_tx_comp),

			// Temps travail manuel
			tpsTravailManuelJanvier: parseFloatOrNull(record.tps_travail_manuel_janvier),
			tpsTravailManuelFevrier: parseFloatOrNull(record.tps_travail_manuel_fevrier),
			tpsTravailManuelMars: parseFloatOrNull(record.tps_travail_manuel_mars),
			tpsTravailManuelAvril: parseFloatOrNull(record.tps_travail_manuel_avril),
			tpsTravailManuelMai: parseFloatOrNull(record.tps_travail_manuel_mai),
			tpsTravailManuelJuin: parseFloatOrNull(record.tps_travail_manuel_juin),
			tpsTravailManuelJuillet: parseFloatOrNull(record.tps_travail_manuel_juillet),
			tpsTravailManuelAout: parseFloatOrNull(record.tps_travail_manuel_aout),
			tpsTravailManuelSeptembre: parseFloatOrNull(record.tps_travail_manuel_septembre),
			tpsTravailManuelOctobre: parseFloatOrNull(record.tps_travail_manuel_octobre),
			tpsTravailManuelNovembre: parseFloatOrNull(record.tps_travail_manuel_novembre),
			tpsTravailManuelDecembre: parseFloatOrNull(record.tps_travail_manuel_decembre),
			tpsTravailManuel: parseFloatOrNull(record.tps_travail_manuel),
			tpsTravailManuelTxComp: parseFloatOrNull(record.tps_travail_manuel_tx_comp),

			// IFT cible mil
			iftCibleMilChimiqueTot: parseFloatOrNull(record.ift_cible_mil_chimique_tot),
			iftCibleMilChimTotHts: parseFloatOrNull(record.ift_cible_mil_chim_tot_hts),
			iftCibleMilH: parseFloatOrNull(record.ift_cible_mil_h),
			iftCibleMilF: parseFloatOrNull(record.ift_cible_mil_f),
			iftCibleMilI: parseFloatOrNull(record.ift_cible_mil_i),
			iftCibleMilTs: parseFloatOrNull(record.ift_cible_mil_ts),
			iftCibleMilA: parseFloatOrNull(record.ift_cible_mil_a),
			iftCibleMilHh: parseFloatOrNull(record.ift_cible_mil_hh),
			iftCibleMilBiocontrole: parseFloatOrNull(record.ift_cible_mil_biocontrole),
			iftCibleMilTxComp: parseFloatOrNull(record.ift_cible_mil_tx_comp),

			// Temps travail mécanisé
			tpsTravailMecaniseJanvier: parseFloatOrNull(record.tps_travail_mecanise_janvier),
			tpsTravailMecaniseFevrier: parseFloatOrNull(record.tps_travail_mecanise_fevrier),
			tpsTravailMecaniseMars: parseFloatOrNull(record.tps_travail_mecanise_mars),
			tpsTravailMecaniseAvril: parseFloatOrNull(record.tps_travail_mecanise_avril),
			tpsTravailMecaniseMai: parseFloatOrNull(record.tps_travail_mecanise_mai),
			tpsTravailMecaniseJuin: parseFloatOrNull(record.tps_travail_mecanise_juin),
			tpsTravailMecaniseJuillet: parseFloatOrNull(record.tps_travail_mecanise_juillet),
			tpsTravailMecaniseAout: parseFloatOrNull(record.tps_travail_mecanise_aout),
			tpsTravailMecaniseSeptembre: parseFloatOrNull(record.tps_travail_mecanise_septembre),
			tpsTravailMecaniseOctobre: parseFloatOrNull(record.tps_travail_mecanise_octobre),
			tpsTravailMecaniseNovembre: parseFloatOrNull(record.tps_travail_mecanise_novembre),
			tpsTravailMecaniseDecembre: parseFloatOrNull(record.tps_travail_mecanise_decembre),
			tpsTravailMecanise: parseFloatOrNull(record.tps_travail_mecanise),
			tpsTravailMecaniseTxComp: parseFloatOrNull(record.tps_travail_mecanise_tx_comp),

			// IFT culture non mil
			iftCultureNonMilChimiqueTot: parseFloatOrNull(record.ift_culture_non_mil_chimique_tot),
			iftCultureNonMilChimTotHts: parseFloatOrNull(record.ift_culture_non_mil_chim_tot_hts),
			iftCultureNonMilH: parseFloatOrNull(record.ift_culture_non_mil_h),
			iftCultureNonMilF: parseFloatOrNull(record.ift_culture_non_mil_f),
			iftCultureNonMilI: parseFloatOrNull(record.ift_culture_non_mil_i),
			iftCultureNonMilTs: parseFloatOrNull(record.ift_culture_non_mil_ts),
			iftCultureNonMilA: parseFloatOrNull(record.ift_culture_non_mil_a),
			iftCultureNonMilHh: parseFloatOrNull(record.ift_culture_non_mil_hh),
			iftCultureNonMilBiocontrole: parseFloatOrNull(record.ift_culture_non_mil_biocontrole),
			iftCultureNonMilTxComp: parseFloatOrNull(record.ift_culture_non_mil_tx_comp),

			// Temps travail total
			tpsTravailTotalJanvier: parseFloatOrNull(record.tps_travail_total_janvier),
			tpsTravailTotalFevrier: parseFloatOrNull(record.tps_travail_total_fevrier),
			tpsTravailTotalMars: parseFloatOrNull(record.tps_travail_total_mars),
			tpsTravailTotalAvril: parseFloatOrNull(record.tps_travail_total_avril),
			tpsTravailTotalMai: parseFloatOrNull(record.tps_travail_total_mai),
			tpsTravailTotalJuin: parseFloatOrNull(record.tps_travail_total_juin),
			tpsTravailTotalJuillet: parseFloatOrNull(record.tps_travail_total_juillet),
			tpsTravailTotalAout: parseFloatOrNull(record.tps_travail_total_aout),
			tpsTravailTotalSeptembre: parseFloatOrNull(record.tps_travail_total_septembre),
			tpsTravailTotalOctobre: parseFloatOrNull(record.tps_travail_total_octobre),
			tpsTravailTotalNovembre: parseFloatOrNull(record.tps_travail_total_novembre),
			tpsTravailTotalDecembre: parseFloatOrNull(record.tps_travail_total_decembre),
			tpsTravailTotal: parseFloatOrNull(record.tps_travail_total),
			tpsTravailTotalTxComp: parseFloatOrNull(record.tps_travail_total_tx_comp),

			// IFT culture mil
			iftCultureMilChimiqueTot: parseFloatOrNull(record.ift_culture_mil_chimique_tot),
			iftCultureMilChimTotHts: parseFloatOrNull(record.ift_culture_mil_chim_tot_hts),
			iftCultureMilH: parseFloatOrNull(record.ift_culture_mil_h),
			iftCultureMilF: parseFloatOrNull(record.ift_culture_mil_f),
			iftCultureMilI: parseFloatOrNull(record.ift_culture_mil_i),
			iftCultureMilTs: parseFloatOrNull(record.ift_culture_mil_ts),
			iftCultureMilA: parseFloatOrNull(record.ift_culture_mil_a),
			iftCultureMilHh: parseFloatOrNull(record.ift_culture_mil_hh),
			iftCultureMilBiocontrole: parseFloatOrNull(record.ift_culture_mil_biocontrole),
			iftCultureMilTxComp: parseFloatOrNull(record.ift_culture_mil_tx_comp),

			// Nombre de passages
			nbreDePassagesJanvier: parseFloatOrNull(record.nbre_de_passages_janvier),
			nbreDePassagesFevrier: parseFloatOrNull(record.nbre_de_passages_fevrier),
			nbreDePassagesMars: parseFloatOrNull(record.nbre_de_passages_mars),
			nbreDePassagesAvril: parseFloatOrNull(record.nbre_de_passages_avril),
			nbreDePassagesMai: parseFloatOrNull(record.nbre_de_passages_mai),
			nbreDePassagesJuin: parseFloatOrNull(record.nbre_de_passages_juin),
			nbreDePassagesJuillet: parseFloatOrNull(record.nbre_de_passages_juillet),
			nbreDePassagesAout: parseFloatOrNull(record.nbre_de_passages_aout),
			nbreDePassagesSeptembre: parseFloatOrNull(record.nbre_de_passages_septembre),
			nbreDePassagesOctobre: parseFloatOrNull(record.nbre_de_passages_octobre),
			nbreDePassagesNovembre: parseFloatOrNull(record.nbre_de_passages_novembre),
			nbreDePassagesDecembre: parseFloatOrNull(record.nbre_de_passages_decembre),
			nbreDePassages: parseFloatOrNull(record.nbre_de_passages),
			nbreDePassagesTxComp: parseFloatOrNull(record.nbre_de_passages_tx_comp),
			nbreDePassagesLabour: parseFloatOrNull(record.nbre_de_passages_labour),
			nbreDePassagesLabourTxComp: parseFloatOrNull(record.nbre_de_passages_labour_tx_comp),
			nbreDePassagesTcs: parseFloatOrNull(record.nbre_de_passages_tcs),
			nbreDePassagesTcsTxComp: parseFloatOrNull(record.nbre_de_passages_tcs_tx_comp),
			nbreDePassagesDesherbage_meca: parseFloatOrNull(record.nbre_de_passages_desherbage_meca),
			nbreDePassagesDesherbageMecaTxComp: parseFloatOrNull(record.nbre_de_passages_desherbage_meca_tx_comp),

			// Recours biologiques
			recoursAuxMoyensBiologiques: parseFloatOrNull(record.recours_aux_moyens_biologiques),
			recoursMacroorganismes: parseFloatOrNull(record.recours_macroorganismes),
			recoursProduitsBiotiquesSansamm: parseFloatOrNull(record.recours_produits_biotiques_sansamm),
			recoursProduitsAbiotiquesSansamm: parseFloatOrNull(record.recours_produits_abiotiques_sansamm),

			// Coûts totaux réels
			coTotReelles: parseFloatOrNull(record.co_tot_reelles),
			coTotReellesTxComp: parseFloatOrNull(record.co_tot_reelles_tx_comp),
			coTotStdMil: parseFloatOrNull(record.co_tot_std_mil),
			coTotStdMilTxComp: parseFloatOrNull(record.co_tot_std_mil_tx_comp),

			// Décomposition des coûts
			coSemisReel: parseFloatOrNull(record.co_semis_reel),
			coSemisStdMil: parseFloatOrNull(record.co_semis_std_mil),
			coFertaminReel: parseFloatOrNull(record.co_fertimin_reel),
			coFertaminStdMil: parseFloatOrNull(record.co_fertimin_std_mil),
			coEpandageOrgaReelles: parseFloatOrNull(record.co_epandage_orga_reelles),
			coEpandageOrgaStdMil: parseFloatOrNull(record.co_epandage_orga_std_mil),
			coPhytoSansAmmReelles: parseFloatOrNull(record.co_phyto_sans_amm_reelles),
			coPhytoSansAmmStdMil: parseFloatOrNull(record.co_phyto_sans_amm_std_mil),
			coPhytoAvecAmmReelles: parseFloatOrNull(record.co_phyto_avec_amm_reelles),
			coPhytoAvecAmmStdMil: parseFloatOrNull(record.co_phyto_avec_amm_std_mil),
			coTraitSemenceReelles: parseFloatOrNull(record.co_trait_semence_reelles),
			coTraitSemenceStdMil: parseFloatOrNull(record.co_trait_semence_std_mil),
			coIrrigationReelles: parseFloatOrNull(record.co_irrigation_reelles),
			coIrrigationStdMil: parseFloatOrNull(record.co_irrigation_std_mil),
			coSubstratsReelles: parseFloatOrNull(record.co_substrats_reelles),
			coSubstratsStdMil: parseFloatOrNull(record.co_substrats_std_mil),
			coPotsReelles: parseFloatOrNull(record.co_pots_reelles),
			coPotsStdMil: parseFloatOrNull(record.co_pots_std_mil),
			coIntrantsAutresReelles: parseFloatOrNull(record.co_intrants_autres_reelles),
			coIntrantsAutresStdMil: parseFloatOrNull(record.co_intrants_autres_std_mil),
			coDecomposeeReelTxComp: parseFloatOrNull(record.co_decomposees_reel_tx_comp),
			coDecomposeeStdMilTxComp: parseFloatOrNull(record.co_decomposees_std_mil_tx_comp),

			// Utilisation désherbage méca
			utiliDesherbageMeca: parseFloatOrNull(record.utili_desherbage_meca),
			utiliDesherbageMecaTxComp: parseFloatOrNull(record.utili_desherbage_meca_tx_comp),

			// Type de travail du sol
			typeDeTravailDuSol: record.type_de_travail_du_sol,
			typeDeTravailDuSolTxComp: parseFloatOrNull(record.type_de_travail_du_sol_tx_comp),

			// Charges matériel
			cmReelles: parseFloatOrNull(record.cm_reelles),
			cmReellesTxComp: parseFloatOrNull(record.cm_reelles_tx_comp),
			cmStdMil: parseFloatOrNull(record.cm_std_mil),
			cmStdMilTxComp: parseFloatOrNull(record.cm_std_mil_tx_comp),

			// Main d'oeuvre
			cMainOeuvreTotReelle: parseFloatOrNull(record.c_main_oeuvre_tot_reelle),
			cMainOeuvreTotReelleTxComp: parseFloatOrNull(record.c_main_oeuvre_tot_reelle_tx_comp),
			cMainOeuvreTotStdMil: parseFloatOrNull(record.c_main_oeuvre_tot_std_mil),
			cMainOeuvreTotStdMilTxComp: parseFloatOrNull(record.c_main_oeuvre_tot_std_mil_tx_comp),
			cMainOeuvreTractoristeReelle: parseFloatOrNull(record.c_main_oeuvre_tractoriste_reelle),
			cMainOeuvreTractoristeReelleTxComp: parseFloatOrNull(record.c_main_oeuvre_tractoriste_reelle_tx_comp),
			cMainOeuvreTractoristeStdMil: parseFloatOrNull(record.c_main_oeuvre_tractoriste_std_mil),
			cMainOeuvreTractoristeStdMilTxComp: parseFloatOrNull(record.c_main_oeuvre_tractoriste_std_mil_tx_comp),
			cMainOeuvreManuelleReelle: parseFloatOrNull(record.c_main_oeuvre_manuelle_reelle),
			cMainOeuvreManuelleReelleTxComp: parseFloatOrNull(record.c_main_oeuvre_manuelle_reelle_tx_comp),
			cMainOeuvreManuelleStdMil: parseFloatOrNull(record.c_main_oeuvre_manuelle_std_mil),
			cMainOeuvreManuelleStdMilTxComp: parseFloatOrNull(record.c_main_oeuvre_manuelle_std_mil_tx_comp),

			// Fertilisation
			fertiNTot: parseFloatOrNull(record.ferti_n_tot),
			fertiNMineral: parseFloatOrNull(record.ferti_n_mineral),
			fertiNOrganique: parseFloatOrNull(record.ferti_n_organique),
			fertiP2o5Tot: parseFloatOrNull(record.ferti_p2o5_tot),
			fertiP2o5Mineral: parseFloatOrNull(record.ferti_p2o5_mineral),
			fertiP2o5Organique: parseFloatOrNull(record.ferti_p2o5_organique),
			fertiK2oTot: parseFloatOrNull(record.ferti_k2o_tot),
			fertiK2oMineral: parseFloatOrNull(record.ferti_k2o_mineral),
			fertiK2oOrganique: parseFloatOrNull(record.ferti_k2o_organique),
			fertiCaMineral: parseFloatOrNull(record.ferti_ca_mineral),
			fertiCaoOrganique: parseFloatOrNull(record.ferti_cao_organique),
			fertiMgoMineral: parseFloatOrNull(record.ferti_mgo_mineral),
			fertiMgoOrganique: parseFloatOrNull(record.ferti_mgo_organique),
			fertiSo3Mineral: parseFloatOrNull(record.ferti_so3_mineral),
			fertiSOrganique: parseFloatOrNull(record.ferti_s_organique),
			fertiBMineral: parseFloatOrNull(record.ferti_b_mineral),
			fertiCuMineral: parseFloatOrNull(record.ferti_cu_mineral),
			fertiFeMineral: parseFloatOrNull(record.ferti_fe_mineral),
			fertiMnMineral: parseFloatOrNull(record.ferti_mn_mineral),
			fertiMoMineral: parseFloatOrNull(record.ferti_mo_mineral),
			fertiNa2oMineral: parseFloatOrNull(record.ferti_na2o_mineral),
			fertiZnMineral: parseFloatOrNull(record.ferti_zn_mineral),

			// Produit brut
			pbReelSansAutoconso: parseFloatOrNull(record.pb_reel_sans_autoconso),
			pbReelAvecAutoconso: parseFloatOrNull(record.pb_reel_avec_autoconso),
			pbReelTxComp: parseFloatOrNull(record.pb_reel_tx_comp),
			pbStdMilAvecAutoconso: parseFloatOrNull(record.pb_std_mil_avec_autoconso),
			pbStdMilSansAutoconso: parseFloatOrNull(record.pb_std_mil_sans_autoconso),
			pbStdMilTxComp: parseFloatOrNull(record.pb_std_mil_tx_comp),

			// Marge brute
			mbReelleSansAutoconso: parseFloatOrNull(record.mb_reelle_sans_autoconso),
			mbReelleAvecAutoconso: parseFloatOrNull(record.mb_reelle_avec_autoconso),
			mbReelleTxComp: parseFloatOrNull(record.mb_reelle_tx_comp),
			mbStdMilAvecAutoconso: parseFloatOrNull(record.mb_std_mil_avec_autoconso),
			mbStdMilSansAutoconso: parseFloatOrNull(record.mb_std_mil_sans_autoconso),
			mbStdMilTxComp: parseFloatOrNull(record.mb_std_mil_tx_comp),

			// Marge semi-nette
			msnReelleSansAutoconso: parseFloatOrNull(record.msn_reelle_sans_autoconso),
			msnReelleAvecAutoconso: parseFloatOrNull(record.msn_reelle_avec_autoconso),
			msnReelleTxComp: parseFloatOrNull(record.msn_reelle_tx_comp),
			msnStdMilSansAutoconso: parseFloatOrNull(record.msn_std_mil_sans_autoconso),
			msnStdMilAvecAutoconso: parseFloatOrNull(record.msn_std_mil_avec_autoconso),
			msnStdMilTxComp: parseFloatOrNull(record.msn_std_mil_tx_comp),

			// Marge directe
			mdReelleSansAutoconso: parseFloatOrNull(record.md_reelle_sans_autoconso),
			mdReelleAvecAutoconso: parseFloatOrNull(record.md_reelle_avec_autoconso),
			mdReelleTxComp: parseFloatOrNull(record.md_reelle_tx_comp),
			mdStdMilSansAutoconso: parseFloatOrNull(record.md_std_mil_sans_autoconso),
			mdStdMilAvecAutoconso: parseFloatOrNull(record.md_std_mil_avec_autoconso),
			mdStdMilTxComp: parseFloatOrNull(record.md_std_mil_tx_comp),

			// HRI1
			hri1Tot: parseFloatOrNull(record.hri1_tot),
			hri1Hts: parseFloatOrNull(record.hri1_hts),
			hri1TotTauxDeCompletion: parseFloatOrNull(record.hri1_tot_taux_de_completion),
			hri1G1Tot: parseFloatOrNull(record.hri1_g1_tot),
			hri1G1Hts: parseFloatOrNull(record.hri1_g1_hts),
			hri1G1TotTauxDeCompletion: parseFloatOrNull(record.hri1_g1_tot_taux_de_completion),
			hri1G2Tot: parseFloatOrNull(record.hri1_g2_tot),
			hri1G2Hts: parseFloatOrNull(record.hri1_g2_hts),
			hri1G2TotTauxDeCompletion: parseFloatOrNull(record.hri1_g2_tot_taux_de_completion),
			hri1G3Tot: parseFloatOrNull(record.hri1_g3_tot),
			hri1G3Hts: parseFloatOrNull(record.hri1_g3_hts),
			hri1G3TotTauxDeCompletion: parseFloatOrNull(record.hri1_g3_tot_taux_de_completion),
			hri1G4Tot: parseFloatOrNull(record.hri1_g4_tot),
			hri1G4Hts: parseFloatOrNull(record.hri1_g4_hts),
			hri1G4TotTauxDeCompletion: parseFloatOrNull(record.hri1_g4_tot_taux_de_completion),

			// QSA
			qsaTot: parseFloatOrNull(record.qsa_tot),
			qsaTotHts: parseFloatOrNull(record.qsa_tot_hts),
			qsaTotTauxDeCompletion: parseFloatOrNull(record.qsa_tot_taux_de_completion),
			qsaDangerEnvironnement: parseFloatOrNull(record.qsa_danger_environnement),
			qsaDangerEnvironnementHts: parseFloatOrNull(record.qsa_danger_environnement_hts),
			qsaToxiqueUtilisateur: parseFloatOrNull(record.qsa_toxique_utilisateur),
			qsaToxiqueUtilisateurHts: parseFloatOrNull(record.qsa_toxique_utilisateur_hts),
			qsaCmr: parseFloatOrNull(record.qsa_cmr),
			qsaCmrHts: parseFloatOrNull(record.qsa_cmr_hts),
			qsaSubstancesCandidatesSubstitution: parseFloatOrNull(record.qsa_substances_candidates_substitution),
			qsaSubstancesCandidatesSubstitutionHts: parseFloatOrNull(record.qsa_substances_candidates_substitution_hts),
			qsaSubstancesFaibleRisque: parseFloatOrNull(record.qsa_substances_faible_risque),
			qsaSubstancesFaibleRisqueHts: parseFloatOrNull(record.qsa_substances_faible_risque_hts),
			qsaGlyphosate: parseFloatOrNull(record.qsa_glyphosate),
			qsaGlyphosateHts: parseFloatOrNull(record.qsa_glyphosate_hts),
			qsaChlortoluron: parseFloatOrNull(record.qsa_chlortoluron),
			qsaChlortoluronHts: parseFloatOrNull(record.qsa_chlortoluron_hts),
			qsaDiflufenican: parseFloatOrNull(record.qsa_diflufenican),
			qsaDiflufenicanHts: parseFloatOrNull(record.qsa_diflufenican_hts),
			qsaProsulfocarbe: parseFloatOrNull(record.qsa_prosulfocarbe),
			qsaProsulfocarbeHts: parseFloatOrNull(record.qsa_prosulfocarbe_hts),
			qsaSmetolachlore: parseFloatOrNull(record.qsa_smetolachlore),
			qsaSmetolachloreHts: parseFloatOrNull(record.qsa_smetolachlore_hts),
			qsaBoscalid: parseFloatOrNull(record.qsa_boscalid),
			qsaBoscalidHts: parseFloatOrNull(record.qsa_boscalid_hts),
			qsaFluopyram: parseFloatOrNull(record.qsa_fluopyram),
			qsaFluopyramHts: parseFloatOrNull(record.qsa_fluopyram_hts),
			qsaLambdaCyhalothrine: parseFloatOrNull(record.qsa_lambda_cyhalothrine),
			qsaLambdaCyhalothrineHts: parseFloatOrNull(record.qsa_lambda_cyhalothrine_hts),
			qsaCuivreTot: parseFloatOrNull(record.qsa_cuivre_tot),
			qsaCuivreTotHts: parseFloatOrNull(record.qsa_cuivre_tot_hts),
			qsaCuivrePhyto: parseFloatOrNull(record.qsa_cuivre_phyto),
			qsaCuivrePhytoHts: parseFloatOrNull(record.qsa_cuivre_phyto_hts),
			qsaCuivreFerti: parseFloatOrNull(record.qsa_cuivre_ferti),
			qsaSoufreTot: parseFloatOrNull(record.qsa_soufre_tot),
			qsaSoufreTotHts: parseFloatOrNull(record.qsa_soufre_tot_hts),
			qsaSoufrePhyto: parseFloatOrNull(record.qsa_soufre_phyto),
			qsaSoufrePhytoHts: parseFloatOrNull(record.qsa_soufre_phyto_hts),
			qsaSoufreFerti: parseFloatOrNull(record.qsa_soufre_ferti),

			// Surface, carburant, eau
			surfUniteDeWHumain: parseFloatOrNull(record.surf_unite_de_w_humain),
			surfUniteDeWHumainTxComp: parseFloatOrNull(record.surf_unite_de_w_humain_tx_comp),
			consoCarburant: parseFloatOrNull(record.conso_carburant),
			consoCarburantTxComp: parseFloatOrNull(record.conso_carburant_tx_comp),
			consoEau: parseFloatOrNull(record.conso_eau),
			consoEauTxComp: parseFloatOrNull(record.conso_eau_tx_comp),
			nombreUthNecessaires: parseFloatOrNull(record.nombre_uth_necessaires),

			// Metadata - Domaine / Dispositif
			domaineNom: record.domaine_nom,
			domaineId: record.domaine_id,
			domaineCampagne: record.domaine_campagne,
			domaineType: record.domaine_type,
			departement: record.departement,
			dispositifId: record.dispositif_id,
			dispositifType: record.dispositif_type,
			sdcFiliere: record.sdc_filiere,
			sdcNom: record.sdc_nom,
			sdcCodeDephy: record.sdc_code_dephy,
			sdcTypeAgriculture: record.sdc_type_agriculture,
			sdcValide: record.sdc_valide === "oui" ? true : false,
			sdcId: record.sdc_id,
		}));
		console.log(`  Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}...`);
		await db.insert(synthetisePerfMagasinCan).values(values);
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
