import { Injectable, BadRequestException } from "@nestjs/common";
import { getTableEntry, listTables } from "./table-registry";
import { QueryDto, MedianDto } from "./dto/query.dto";
import { QueryRepository } from "./query.repository";

@Injectable()
export class QueryService {
  constructor(private readonly queryRepository: QueryRepository) {}

  getTables() {
    return listTables();
  }

  async executeQuery(query: QueryDto) {
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

  async getMedian(dto: MedianDto) {
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
}
