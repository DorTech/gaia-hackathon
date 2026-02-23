import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { DephyService } from "./dephy.service";
import { domaine } from "@bloomeo/dephy-dataset";
import { sql } from "drizzle-orm";

@ApiTags("dephy")
@Controller("dephy")
export class DephyController {
  constructor(private readonly dephyService: DephyService) {}

  @Get("domaines")
  @ApiOperation({ summary: "List domaines (farms)" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "offset", required: false, type: Number })
  async getDomaines(
    @Query("limit") limit = 20,
    @Query("offset") offset = 0,
  ) {
    const db = this.dephyService.db;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: domaine.id,
          code: domaine.code,
          campagne: domaine.campagne,
          typeFerme: domaine.typeFerme,
          departement: domaine.departement,
          commune: domaine.commune,
          sauTotale: domaine.sauTotale,
        })
        .from(domaine)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(domaine),
    ]);

    return {
      data: rows,
      total: Number(countResult[0].count),
      limit,
      offset,
    };
  }
}
