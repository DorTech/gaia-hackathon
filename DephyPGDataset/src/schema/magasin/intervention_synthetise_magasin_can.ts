import { pgTable, text, doublePrecision, integer, serial } from "drizzle-orm/pg-core";

export const interventionSynthetiseMagasinCan = pgTable("intervention_synthetise_magasin_can", {
  id: serial("id").primaryKey(),

  // Domaine metadata
  domaineId: text("domaine_id"),
  domaineNom: text("domaine_nom"),
  domaineCampagne: integer("domaine_campagne"),
  domaineCode: text("domaine_code"),

  // SDC
  sdcId: text("sdc_id"),
  sdcCode: text("sdc_code"),
  sdcNom: text("sdc_nom"),

  // Système synthétisé
  systemeSynthetiseId: text("systeme_synthetise_id"),
  systemeSynthetiseNom: text("systeme_synthetise_nom"),
  systemeSynthetiseValidation: text("systeme_synthetise_validation"),
  systemeSynthetiseCampagnes: text("systeme_synthetise_campagnes"),

  // Culture / précédent
  culturePrecedentRangId: text("culture_precedent_rang_id"),
  phaseId: text("phase_id"),
  phase: text("phase"),
  cultureCode: text("culture_code"),
  cultureNom: text("culture_nom"),
  ciCode: text("ci_code"),
  ciNom: text("ci_nom"),
  concerneLaCi: text("concerne_la_ci"),
  especesDeLIntervention: text("especes_de_l_intervention"),
  precedentCode: text("precedent_code"),
  precedentNom: text("precedent_nom"),
  precedentEspecesEdi: text("precedent_especes_edi"),
  cultureRang: integer("culture_rang"),

  // Intervention
  interventionId: text("intervention_id"),
  interventionType: text("intervention_type"),
  interventionsActions: text("interventions_actions"),
  interventionNom: text("intervention_nom"),
  interventionComment: text("intervention_comment"),
  combinaisonOutilsCode: text("combinaison_outils_code"),
  combinaisonOutilsNom: text("combinaison_outils_nom"),
  tracteurOuAutomoteur: text("tracteur_ou_automoteur"),
  rangIntervention: integer("rang_intervention"),
  outils: text("outils"),

  // Dates
  dateDebut: text("date_debut"),
  dateFin: text("date_fin"),

  // Fréquences et surfaces traitées
  freqSpatiale: doublePrecision("freq_spatiale"),
  freqTemporelle: doublePrecision("freq_temporelle"),
  psci: doublePrecision("psci"),
  proportionSurfaceTraiteePhyto: doublePrecision("proportion_surface_traitee_phyto"),
  psciPhyto: doublePrecision("psci_phyto"),
  proportionSurfaceTraiteeLutteBio: doublePrecision("proportion_surface_traitee_lutte_bio"),
  psciLutteBio: doublePrecision("psci_lutte_bio"),

  // Débit de chantier
  debitDeChantier: doublePrecision("debit_de_chantier"),
  debitDeChantierUnite: text("debit_de_chantier_unite"),
  nbPersonneMobili: doublePrecision("nb_personne_mobili"),
  quantiteEauMm: doublePrecision("quantite_eau_mm"),

  // Semis
  especesSemees: text("especes_semees"),
  densiteSemis: text("densite_semis"),
  uniteSemis: text("unite_semis"),
  traitementChimiqueSemis: text("traitement_chimique_semis"),
  inoculationBiologiqueSemis: text("inoculation_biologique_semis"),
  typeSemence: text("type_semence"),
});

export type InterventionSynthetiseMagasinCan = typeof interventionSynthetiseMagasinCan.$inferSelect;
export type NewInterventionSynthetiseMagasinCan = typeof interventionSynthetiseMagasinCan.$inferInsert;
