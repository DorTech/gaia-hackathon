import { PgTable } from "drizzle-orm/pg-core";
import { getTableColumns } from "drizzle-orm";
import * as schema from "@bloomeo/dephy-dataset";

type TableEntry = {
  table: PgTable;
  columns: Record<string, any>;
};

const registry: Record<string, TableEntry> = {
  domaine: { table: schema.domaine, columns: getTableColumns(schema.domaine) },
  dispositif: { table: schema.dispositif, columns: getTableColumns(schema.dispositif) },
  sdc: { table: schema.sdc, columns: getTableColumns(schema.sdc) },
  parcelle: { table: schema.parcelle, columns: getTableColumns(schema.parcelle) },
  parcelle_type: { table: schema.parcelleType, columns: getTableColumns(schema.parcelleType) },
  zone: { table: schema.zone, columns: getTableColumns(schema.zone) },
  domaine_sol: { table: schema.domaineSol, columns: getTableColumns(schema.domaineSol) },
  synthetise: { table: schema.synthetise, columns: getTableColumns(schema.synthetise) },
  sdc_realise_perf_magasin_can: {
    table: schema.sdcRealisePerfMagasinCan,
    columns: getTableColumns(schema.sdcRealisePerfMagasinCan),
  },
  synthetise_perf_magasin_can: {
    table: schema.synthetisePerfMagasinCan,
    columns: getTableColumns(schema.synthetisePerfMagasinCan),
  },
};

export function getTableEntry(name: string): TableEntry | undefined {
  return registry[name];
}

export function listTables(): { name: string; columns: string[] }[] {
  return Object.entries(registry).map(([name, entry]) => ({
    name,
    columns: Object.keys(entry.columns),
  }));
}
