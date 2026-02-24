import { Injectable } from "@nestjs/common";
import {
  sql,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  like,
  inArray,
  isNull,
  isNotNull,
  and,
  SQL,
} from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { DephyService } from "../dephy/dephy.service";
import {
  JoinFilterDto,
  FilterDto,
  NewFilterDB,
  NewFilterDto,
} from "./dto/query.dto";
import { getTableEntry } from "./table-registry";

@Injectable()
export class QueryRepository {
  constructor(private readonly dephyService: DephyService) {}

  async findRows(
    table: PgTable,
    selectColumns: Record<string, any>,
    where: SQL | undefined,
    limit: number | undefined,
    offset: number,
  ) {
    const qb = this.dephyService.db
      .select(selectColumns)
      .from(table)
      .where(where)
      .offset(offset);

    return limit ? qb.limit(limit) : qb;
  }

  async count(table: PgTable, where: SQL | undefined): Promise<number> {
    const result = await this.dephyService.db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(where);

    return Number(result[0].count);
  }

  async median(
    table: PgTable,
    column: any,
    where: SQL | undefined,
  ): Promise<{ median: number | null; count: number }> {
    const result = await this.dephyService.db
      .select({
        median: sql<
          number | null
        >`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${column})`,
        count: sql<number>`count(${column})`,
      })
      .from(table)
      .where(where);

    const row = result[0];
    return {
      median: row.median !== null ? Number(row.median) : null,
      count: Number(row.count),
    };
  }

  async medianNbRotation(
    query: NewFilterDB,
  ): Promise<{ median: number | null }> {
    const result = await this.dephyService.db.execute(`
WITH rotation_cte AS (
    SELECT
        sdc.id,
        COUNT(DISTINCT sac.culture_nom) AS nb_cultures_rotation,
        STRING_AGG(DISTINCT sac.culture_nom, ' > ') AS sequence_cultures
    FROM sdc
    JOIN succession_assolee_synthetise_magasin_can sac
        ON sdc.id = sac.sdc_id
    GROUP BY sdc.id
)
SELECT
    PERCENTILE_CONT(0.5) 
        WITHIN GROUP (ORDER BY r.nb_cultures_rotation) AS median_nb_rotation
FROM rotation_cte r
JOIN synthetise_perf_magasin_can spmc
    ON r.id = spmc.sdc_id
JOIN sdc
    ON sdc.id = r.id
JOIN dispositif
    ON dispositif.id = sdc.dispositif_id
JOIN domain
    ON domain.id = dispositif.domaine_id
JOIN succession_assolee_synthetise_magasin_can sac
    ON sac.sdc_id = sdc.id
WHERE sac.culture_nom IN (${query.culture.map((c) => `'${c}'`).join(", ")})
  AND domain.departement LIKE '${query.department}'
  AND sdc.type_agriculture LIKE '${query.agricultureType}';
 `);

    if (result.rows.length === 0) {
      console.warn(
        `No data found for culture="${query.culture}", department="${query.department}", agricultureType="${query.agricultureType}"`,
      );
      return { median: null };
    }

    const row = result.rows[0];
    if (!row || row?.median_nb_rotation === null) {
      console.warn(
        `Median number of rotations is null for culture="${query.culture}", department="${query.department}", agricultureType="${query.agricultureType}"`,
      );
      return { median: null };
    }
    return {
      median: Number(row.median_nb_rotation),
    };
  }

  async medianNbWeedingPasses(
    query: NewFilterDB,
  ): Promise<{ median: number | null }> {
    const result = await this.dephyService.db.execute(`
WITH rotation_cte AS (
    SELECT
        sdc.id,
        COUNT(DISTINCT sac.culture_nom) AS nb_cultures_rotation,
        STRING_AGG(DISTINCT sac.culture_nom, ' > ') AS sequence_cultures
    FROM sdc
    JOIN succession_assolee_synthetise_magasin_can sac
        ON sdc.id = sac.sdc_id
    GROUP BY sdc.id
)
SELECT
    PERCENTILE_CONT(0.5) 
        WITHIN GROUP (ORDER BY spmc.nbre_de_passages_desherbage_meca) AS median_nb_weeding
FROM rotation_cte r
JOIN synthetise_perf_magasin_can spmc
    ON r.id = spmc.sdc_id
JOIN sdc
    ON sdc.id = r.id
JOIN dispositif
    ON dispositif.id = sdc.dispositif_id
JOIN domain
    ON domain.id = dispositif.domaine_id
JOIN succession_assolee_synthetise_magasin_can sac
    ON sac.sdc_id = sdc.id
WHERE sac.culture_nom IN (${query.culture.map((c) => `'${c}'`).join(", ")})
  AND domain.departement LIKE '${query.department}'
  AND sdc.type_agriculture LIKE '${query.agricultureType}';
 `);

    if (result.rows.length === 0) {
      console.warn(
        `No data found for culture="${query.culture}", department="${query.department}", agricultureType="${query.agricultureType}"`,
      );
      return { median: null };
    }

    const row = result.rows[0];
    if (!row || row?.median_nb_weeding === null) {
      console.warn(
        `Median number of weeding passes is null for culture="${query.culture}", department="${query.department}", agricultureType="${query.agricultureType}"`,
      );
      return { median: null };
    }
    return {
      median: Number(row.median_nb_weeding),
    };
  }

  async medianFertilisationNTot(
    query: NewFilterDB,
  ): Promise<{ median: number | null }> {
    const result = await this.dephyService.db.execute(`
SELECT
    PERCENTILE_CONT(0.5) 
        WITHIN GROUP (ORDER BY spmc.ferti_n_tot) AS median_fertilisation_n_tot
FROM synthetise_perf_magasin_can spmc
JOIN sdc
    ON sdc.id = spmc.sdc_id
JOIN dispositif
    ON dispositif.id = sdc.dispositif_id
JOIN domain
    ON domain.id = dispositif.domaine_id
JOIN succession_assolee_synthetise_magasin_can sac
    ON sac.sdc_id = sdc.id
WHERE sac.culture_nom IN (${query.culture.map((c) => `'${c}'`).join(", ")})
  AND domain.departement LIKE '${query.department}'
  AND sdc.type_agriculture LIKE '${query.agricultureType}';
 `);
    console.log("Median fertilisation query result:", result);
    if (result.rows.length === 0) {
      console.warn(
        `No data found for culture="${query.culture}", department="${query.department}", agricultureType="${query.agricultureType}"`,
      );
      return { median: null };
    }

    const row = result.rows[0];
    if (!row || row?.median_fertilisation_n_tot === null) {
      console.warn(
        `Median number of fertilisation N tot is null for culture="${query.culture}", department="${query.department}", agricultureType="${query.agricultureType}"`,
      );
      return { median: null };
    }

    return {
      median: Number(row.median_fertilisation_n_tot),
    };
  }

  async frequency(
    table: PgTable,
    column: any,
    where: SQL | undefined,
    asBoolean?: boolean,
  ): Promise<{ value: string | boolean | null; count: number }[]> {
    if (asBoolean) {
      const boolExpr = sql<boolean>`CASE WHEN ${column} > 0 THEN true ELSE false END`;
      const rows = await this.dephyService.db
        .select({
          value: boolExpr,
          count: sql<number>`count(*)`,
        })
        .from(table)
        .where(where)
        .groupBy(boolExpr)
        .orderBy(sql`count(*) desc`);

      return rows.map((r: any) => ({
        value: r.value ?? null,
        count: Number(r.count),
      }));
    }

    const rows = await this.dephyService.db
      .select({
        value: column,
        count: sql<number>`count(*)`,
      })
      .from(table)
      .where(where)
      .groupBy(column)
      .orderBy(sql`count(*) desc`);

    return rows.map((r: any) => ({
      value: r.value ?? null,
      count: Number(r.count),
    }));
  }

  async frequencySequenceCultures(
    query: NewFilterDto,
  ): Promise<{ value: string | boolean | null; count: number }[]> {
    const result = await this.dephyService.db.execute(sql`
WITH filtered_sdc AS (
    SELECT DISTINCT sdc.id
    FROM sdc
    JOIN dispositif ON dispositif.id = sdc.dispositif_id
    JOIN domain ON domain.id = dispositif.domaine_id
    JOIN succession_assolee_synthetise_magasin_can sac ON sac.sdc_id = sdc.id
    WHERE sac.culture_nom ILIKE '%' || ${query.culture} || '%'
      AND domain.departement LIKE ${query.department}
      AND sdc.type_agriculture LIKE ${query.agricultureType}
),
sequence_cte AS (
    SELECT
        sac.sdc_id,
        STRING_AGG(DISTINCT sac.culture_nom, ' > ') AS sequence_cultures
    FROM succession_assolee_synthetise_magasin_can sac
    WHERE sac.sdc_id IN (SELECT id FROM filtered_sdc)
    GROUP BY sac.sdc_id
)
SELECT
    sequence_cultures AS value,
    COUNT(*)::int AS count
FROM sequence_cte
GROUP BY sequence_cultures
ORDER BY count DESC;
    `);
    return result.rows.map((r: any) => ({
      value: r.value ?? null,
      count: Number(r.count),
    }));
  }

  async frequencyMacroorganismes(
    query: NewFilterDto,
  ): Promise<{ value: string | boolean | null; count: number }[]> {
    const result = await this.dephyService.db.execute(sql`
SELECT
    CASE WHEN spmc.recours_macroorganismes > 0 THEN true ELSE false END AS value,
    COUNT(*)::int AS count
FROM synthetise_perf_magasin_can spmc
JOIN sdc ON sdc.id = spmc.sdc_id
JOIN dispositif ON dispositif.id = sdc.dispositif_id
JOIN domain ON domain.id = dispositif.domaine_id
JOIN succession_assolee_synthetise_magasin_can sac ON sac.sdc_id = sdc.id
WHERE sac.culture_nom ILIKE '%' || ${query.culture} || '%'
  AND domain.departement LIKE ${query.department}
  AND sdc.type_agriculture LIKE ${query.agricultureType}
GROUP BY (CASE WHEN spmc.recours_macroorganismes > 0 THEN true ELSE false END)
ORDER BY count DESC;
    `);
    return result.rows.map((r: any) => ({
      value: r.value ?? null,
      count: Number(r.count),
    }));
  }

  async frequencySoilWork(
    query: NewFilterDto,
  ): Promise<{ value: string | boolean | null; count: number }[]> {
    const result = await this.dephyService.db.execute(sql`
SELECT
    spmc.type_de_travail_du_sol AS value,
    COUNT(*)::int AS count
FROM synthetise_perf_magasin_can spmc
JOIN sdc ON sdc.id = spmc.sdc_id
JOIN dispositif ON dispositif.id = sdc.dispositif_id
JOIN domain ON domain.id = dispositif.domaine_id
JOIN succession_assolee_synthetise_magasin_can sac ON sac.sdc_id = sdc.id
WHERE sac.culture_nom ILIKE '%' || ${query.culture} || '%'
  AND domain.departement LIKE ${query.department}
  AND sdc.type_agriculture LIKE ${query.agricultureType}
GROUP BY spmc.type_de_travail_du_sol
ORDER BY count DESC;
    `);
    return result.rows.map((r: any) => ({
      value: r.value ?? null,
      count: Number(r.count),
    }));
  }

  async frequencyAgricultureType(
    query: NewFilterDto,
  ): Promise<{ value: string | boolean | null; count: number }[]> {
    const result = await this.dephyService.db.execute(sql`
SELECT
    sdc.type_agriculture AS value,
    COUNT(*)::int AS count
FROM sdc
JOIN dispositif ON dispositif.id = sdc.dispositif_id
JOIN domain ON domain.id = dispositif.domaine_id
JOIN succession_assolee_synthetise_magasin_can sac ON sac.sdc_id = sdc.id
WHERE sac.culture_nom ILIKE '%' || ${query.culture} || '%'
  AND domain.departement LIKE ${query.department}
  AND sdc.type_agriculture LIKE ${query.agricultureType}
GROUP BY sdc.type_agriculture
ORDER BY count DESC;
    `);
    return result.rows.map((r: any) => ({
      value: r.value ?? null,
      count: Number(r.count),
    }));
  }

  buildWhere(
    filters: FilterDto[],
    columns: Record<string, any>,
    tableName: string,
    joins?: JoinFilterDto[],
  ): SQL | undefined {
    const conditions: SQL[] = [];

    for (const f of filters) {
      conditions.push(this.buildCondition(f, columns, tableName));
    }

    for (const join of joins ?? []) {
      conditions.push(this.buildJoinSubquery(join, columns, tableName));
    }

    if (conditions.length === 0) return undefined;
    return and(...conditions);
  }

  private buildJoinSubquery(
    join: JoinFilterDto,
    targetColumns: Record<string, any>,
    targetTableName: string,
  ): SQL {
    const sourceEntry = getTableEntry(join.table);
    if (!sourceEntry) {
      throw new Error(`Unknown join table "${join.table}"`);
    }

    const sourceCol = sourceEntry.columns[join.field];
    if (!sourceCol) {
      throw new Error(
        `Unknown column "${join.field}" in join table "${join.table}". Available: ${Object.keys(sourceEntry.columns).join(", ")}`,
      );
    }

    const targetCol = targetColumns[join.targetField];
    if (!targetCol) {
      throw new Error(
        `Unknown column "${join.targetField}" in table "${targetTableName}". Available: ${Object.keys(targetColumns).join(", ")}`,
      );
    }

    const sourceWhere =
      join.filters.length > 0
        ? and(
            ...join.filters.map((f) =>
              this.buildCondition(f, sourceEntry.columns, join.table),
            ),
          )
        : undefined;

    const subquery = this.dephyService.db
      .select({ val: sourceCol })
      .from(sourceEntry.table)
      .where(sourceWhere);

    return inArray(targetCol, subquery);
  }

  private buildCondition(
    filter: FilterDto,
    columns: Record<string, any>,
    tableName: string,
  ) {
    const col = columns[filter.field];
    if (!col) {
      throw new Error(
        `Unknown column "${filter.field}" in table "${tableName}". Available: ${Object.keys(columns).join(", ")}`,
      );
    }

    switch (filter.operator) {
      case "eq":
        return eq(col, filter.value as any);
      case "neq":
        return ne(col, filter.value as any);
      case "gt":
        return gt(col, filter.value as any);
      case "gte":
        return gte(col, filter.value as any);
      case "lt":
        return lt(col, filter.value as any);
      case "lte":
        return lte(col, filter.value as any);
      case "like":
        return like(col, filter.value as string);
      case "in":
        if (!Array.isArray(filter.value)) {
          throw new Error(`"in" operator requires an array value`);
        }
        return inArray(col, filter.value);
      case "isNull":
        return isNull(col);
      case "isNotNull":
        return isNotNull(col);
      default:
        throw new Error(`Unknown operator "${filter.operator}"`);
    }
  }
}
