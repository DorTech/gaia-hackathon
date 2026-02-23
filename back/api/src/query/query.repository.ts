import { Injectable } from "@nestjs/common";
import { sql, eq, ne, gt, gte, lt, lte, like, inArray, isNull, isNotNull, and, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { DephyService } from "../dephy/dephy.service";
import { FilterDto, JoinFilterDto } from "./dto/query.dto";
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
        median: sql<number | null>`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${column})`,
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

    const sourceWhere = join.filters.length > 0
      ? and(...join.filters.map((f) => this.buildCondition(f, sourceEntry.columns, join.table)))
      : undefined;

    const subquery = this.dephyService.db
      .select({ val: sourceCol })
      .from(sourceEntry.table)
      .where(sourceWhere);

    return inArray(targetCol, subquery);
  }

  private buildCondition(filter: FilterDto, columns: Record<string, any>, tableName: string) {
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
