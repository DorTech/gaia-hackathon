import { Injectable, BadRequestException } from "@nestjs/common";
import { getTableEntry, listTables } from "./table-registry";
import { QueryDto, MedianDto, FrequencyDto } from "./dto/query.dto";
import { QueryRepository } from "./query.repository";
import {
  ITableInfo,
  IQueryResponse,
  IMedianResponse,
  IFrequencyResponse,
} from "@gaia/shared-type";

@Injectable()
export class QueryService {
  constructor(private readonly queryRepository: QueryRepository) {}

  getTables(): ITableInfo[] {
    return listTables();
  }

  async executeQuery(query: QueryDto): Promise<IQueryResponse> {
    const entry = getTableEntry(query.table);
    if (!entry) {
      throw new BadRequestException(
        `Unknown table "${query.table}". Available: ${listTables().map((t) => t.name).join(", ")}`,
      );
    }

    const { table, columns } = entry;

    // Build select columns
    let selectColumns: Record<string, any>;
    if (query.select && query.select.length > 0) {
      selectColumns = {};
      for (const field of query.select) {
        if (!(field in columns)) {
          throw new BadRequestException(
            `Unknown column "${field}" in table "${query.table}". Available: ${Object.keys(columns).join(", ")}`,
          );
        }
        selectColumns[field] = columns[field];
      }
    } else {
      selectColumns = columns;
    }

    const limit = query.limit || undefined;
    const offset = query.offset ?? 0;
    const where = this.queryRepository.buildWhere(query.filters ?? [], columns, query.table, query.joins);

    const [data, total] = await Promise.all([
      this.queryRepository.findRows(table, selectColumns, where, limit, offset),
      this.queryRepository.count(table, where),
    ]);

    return { data, total, limit, offset };
  }

  async getMedian(dto: MedianDto): Promise<IMedianResponse> {
    const entry = getTableEntry(dto.table);
    if (!entry) {
      throw new BadRequestException(
        `Unknown table "${dto.table}". Available: ${listTables().map((t) => t.name).join(", ")}`,
      );
    }

    const { table, columns } = entry;
    const col = columns[dto.field];
    if (!col) {
      throw new BadRequestException(
        `Unknown column "${dto.field}" in table "${dto.table}". Available: ${Object.keys(columns).join(", ")}`,
      );
    }

    if (col.dataType !== "number") {
      throw new BadRequestException(
        `Column "${dto.field}" is not numeric (type: ${col.dataType}). Median can only be computed on numeric columns.`,
      );
    }

    const where = this.queryRepository.buildWhere(dto.filters ?? [], columns, dto.table, dto.joins);
    const result = await this.queryRepository.median(table, col, where);

    return { table: dto.table, field: dto.field, ...result };
  }

  async getFrequency(dto: FrequencyDto): Promise<IFrequencyResponse> {
    const entry = getTableEntry(dto.table);
    if (!entry) {
      throw new BadRequestException(
        `Unknown table "${dto.table}". Available: ${listTables().map((t) => t.name).join(", ")}`,
      );
    }

    const { table, columns } = entry;
    const col = columns[dto.field];
    if (!col) {
      throw new BadRequestException(
        `Unknown column "${dto.field}" in table "${dto.table}". Available: ${Object.keys(columns).join(", ")}`,
      );
    }

    if (dto.asBoolean && col.dataType !== "number") {
      throw new BadRequestException(
        `asBoolean can only be used on numeric columns. "${dto.field}" is of type ${col.dataType}.`,
      );
    }

    const where = this.queryRepository.buildWhere(dto.filters ?? [], columns, dto.table, dto.joins);
    const rows = await this.queryRepository.frequency(table, col, where, dto.asBoolean);

    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const data = rows.map((r) => ({
      ...r,
      percentage: total > 0 ? Math.round((r.count / total) * 10000) / 100 : 0,
    }));

    return { table: dto.table, field: dto.field, total, data };
  }
}
