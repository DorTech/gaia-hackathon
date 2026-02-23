import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";

export const successionAssoleeSynthetiseMagasinCan = pgTable(
  "succession_assolee_synthetise_magasin_can",
  {
    culturePrecedentRangId: text("culture_precedent_rang_id").primaryKey(),
    domaineCode: text("domaine_code"),
    domaineId: text("domaine_id"),
    domaineNom: text("domaine_nom"),
    domaineCampagne: integer("domaine_campagne"),
    sdcCode: text("sdc_code"),
    sdcId: text("sdc_id"),
    sdcNom: text("sdc_nom"),
    systemeSynthetiseId: text("systeme_synthetise_id"),
    systemeSynthetiseNom: text("systeme_synthetise_nom"),
    systemeSynthetiseCampagnes: text("systeme_synthetise_campagnes"),
    cultureRotationId: text("culture_rotation_id"),
    cultureRang: integer("culture_rang"),
    cultureIndicateurBranche: text("culture_indicateur_branche"),
    cultureCode: text("culture_code"),
    cultureNom: text("culture_nom"),
    finRotation: boolean("fin_rotation"),
    memeCampagneCulturePrecedente: boolean("meme_campagne_culture_precedente"),
    cultureAbsente: boolean("culture_absente"),
    cultureEspecesEdi: text("culture_especes_edi"),
    ciCode: text("ci_code"),
    ciNom: text("ci_nom"),
    precedentRotationId: text("precedent_rotation_id"),
    precedentRang: integer("precedent_rang"),
    precedentIndicateurBranche: text("precedent_indicateur_branche"),
    precedentCode: text("precedent_code"),
    precedentNom: text("precedent_nom"),
    precedentEspecesEdi: text("precedent_especes_edi"),
    frequenceConnexion: integer("frequence_connexion"),
    systemeSynthetiseValidation: boolean("systeme_synthetise_validation"),
  }
);

export type SuccessionAssoleeSynthetiseMagasinCan =
  typeof successionAssoleeSynthetiseMagasinCan.$inferSelect;
export type NewSuccessionAssoleeSynthetiseMagasinCan =
  typeof successionAssoleeSynthetiseMagasinCan.$inferInsert;
