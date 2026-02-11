import { pgTable, text, integer, doublePrecision } from "drizzle-orm/pg-core";

export const zone = pgTable("zone", {
	id: text("id").primaryKey(),
	code: text("code").notNull(),
	campagne: integer("campagne").notNull(),
	surface: doublePrecision("surface").notNull(),
	parcelleId: text("parcelle_id").notNull(),
	type: text("type").notNull(),
});

export type Zone = typeof zone.$inferSelect;
export type NewZone = typeof zone.$inferInsert;
