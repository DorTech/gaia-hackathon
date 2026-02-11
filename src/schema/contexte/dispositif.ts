import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { domaine } from "./domaine";

export const dispositif = pgTable("dispositif", {
	id: text("id").primaryKey(),
	code: text("code").notNull(),
	type: text("type").notNull(),
	campagne: integer("campagne").notNull(),
	domaineId: text("domaine_id")
		.notNull()
		.references(() => domaine.id),
});

export type Dispositif = typeof dispositif.$inferSelect;
export type NewDispositif = typeof dispositif.$inferInsert;
