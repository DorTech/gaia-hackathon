import { pgTable, text, doublePrecision } from "drizzle-orm/pg-core";
import { domaine } from "./domaine";

export const domaineSol = pgTable("domaine_sol", {
	id: text("id").primaryKey(),
	nomLocal: text("nom_local").notNull(),
	domaineId: text("domaine_id")
		.notNull()
		.references(() => domaine.id),
	commentaire: text("commentaire"),
	sauConcerneePct: doublePrecision("sau_concernee_pct"),
	solArvalisId: text("sol_arvalis_id"),
});

export type DomaineSol = typeof domaineSol.$inferSelect;
export type NewDomaineSol = typeof domaineSol.$inferInsert;
