import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@bloomeo/dephy-dataset";

export type DephyDb = NodePgDatabase<typeof schema>;

@Injectable()
export class DephyService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: DephyDb;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>("DEPHY_DB_HOST", "localhost"),
      port: this.configService.get<number>("DEPHY_DB_PORT", 5433),
      user: this.configService.get<string>("DEPHY_DB_USER", "postgres"),
      password: this.configService.get<string>("DEPHY_DB_PASSWORD", "postgres"),
      database: this.configService.get<string>("DEPHY_DB_NAME", "dephy"),
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    const client = await this.pool.connect();
    client.release();
    console.log("Connected to Dephy database");
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
