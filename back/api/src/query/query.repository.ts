import { Injectable } from "@nestjs/common";
import { sql, eq, ne, gt, gte, lt, lte, like, inArray, isNull, isNotNull, and, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { DephyService } from "../dephy/dephy.service";
import { FilterDto } from "./dto/query.dto";

@Injectable()
export class QueryRepository {
  constructor(private readonly dephyService: DephyService) {}

  async findRows(
    table: PgTable,
    selectColumns: Record<string, any>,
    where: SQL | undefined,
    limit: number,
    offset: number,
  ) {
    return this.dephyService.db
      .select(selectColumns)
      .from(table)
      .where(where)
      .limit(limit)
      .offset(offset);
  }

  async count(table: PgTable, where: SQL | undefined): Promise<number> {
    const result = await this.dephyService.db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(where);

    return Number(result[0].count);
  }

  buildWhere(filters: FilterDto[], columns: Record<string, any>, tableName: string): SQL | undefined {
    if (filters.length === 0) return undefined;

    const conditions = filters.map((f) => this.buildCondition(f, columns, tableName));
    return and(...conditions);
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
