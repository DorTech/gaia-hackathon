import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";

export const successionAssoleeRealiseMagasinCan = pgTable(
  "succession_assolee_realise_magasin_can",
  {
    id: serial("id").primaryKey(),
    domaineCode: text("domaine_code"),
    domaineId: text("domaine_id"),
    domaineNom: text("domaine_nom"),
    domaineCampagne: integer("domaine_campagne"),
    sdcCode: text("sdc_code"),
    sdcId: text("sdc_id"),
    sdcNom: text("sdc_nom"),
    parcelleId: text("parcelle_id"),
    parcelleNom: text("parcelle_nom"),
    zoneId: text("zone_id"),
    zoneNom: text("zone_nom"),
    cultureRang: integer("culture_rang"),
    cultureId: text("culture_id"),
    cultureNom: text("culture_nom"),
    cultureEspecesEdi: text("culture_especes_edi"),
    ciId: text("ci_id"),
    ciNom: text("ci_nom"),
    precedentId: text("precedent_id"),
    precedentNom: text("precedent_nom"),
    precedentEspecesEdi: text("precedent_especes_edi"),
  }
);

export type SuccessionAssoleeRealiseMagasinCan =
  typeof successionAssoleeRealiseMagasinCan.$inferSelect;
export type NewSuccessionAssoleeRealiseMagasinCan =
  typeof successionAssoleeRealiseMagasinCan.$inferInsert;
