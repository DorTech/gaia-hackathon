import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { parcelleType } from "./parcelle_type";
import { sdc } from "./sdc";

export const synthetise = pgTable("synthetise", {
	id: text("id").primaryKey(),
	campagnes: text("campagnes").notNull(),
	source: text("source"),
	valide: boolean("valide"),
	commentaire: text("commentaire"),
	parcelleTypeId: text("parcelle_type_id").references(() => parcelleType.id),
	sdcId: text("sdc_id").references(() => sdc.id),
});

export type Synthetise = typeof synthetise.$inferSelect;
export type NewSynthetise = typeof synthetise.$inferInsert;
