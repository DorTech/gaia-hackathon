import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, QueryResult, QueryResultRow } from "pg";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      connectionString:
        this.configService.get<string>("DATABASE_URL") ||
        "postgresql://postgres:postgres@localhost:5432/gaia"
    });
  }

  async onModuleInit() {
    const client = await this.pool.connect();
    client.release();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  /** Run a parameterized SQL query */
  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }
}
