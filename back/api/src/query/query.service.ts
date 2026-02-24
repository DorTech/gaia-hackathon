import { Injectable, BadRequestException } from "@nestjs/common";
import { getTableEntry, listTables } from "./table-registry";
import {
  QueryDto,
  MedianDto,
  FrequencyDto,
  NewFilterDto,
  NewFilterDB,
} from "./dto/query.dto";
import { QueryRepository } from "./query.repository";
import {
  ITableInfo,
  IQueryResponse,
  IMedianResponse,
  IFrequencyResponse,
  INewFrequencyResponse,
} from "@gaia/shared-type";

const CULTURE_ALIASES: Record<string, string[]> = {
  Ail: ["Ail"],
  Artichaut: ["Artichaut", "artichaut", "Artichaut gros capitule"],
  Asperges: ["ASPERGES"],
  Aubergine: ["aubergine", "AUBERGINE", "Aubergine"],
  Avoine: ["Avoine", "Avoine de printemps"],
  Betterave: ["betterave", "BETTERAVE", "Betterave", "Betterave sucrière"],
  Blette: ["Blette"],
  Blé: ["BLE", "Blé", "blé"],
  "Blé dur": ["BLE DUR", "blé dur", "Blé dur", "Blé Dur"],
  "Blé dur d'hiver": ["BLE DUR D'HIVER", "Blé dur d'hiver", "Blé dur hiver"],
  "Blé tendre": [
    "BLE TENDRE",
    "ble tendre",
    "blé tendre",
    "Blé Tendre",
    "Blé tendre",
  ],
  "Blé tendre d'hiver": [
    "Ble tendre d'hiver",
    "BLE TENDRE D'HIVER",
    "Ble tendre hiver",
    "BLE TENDRE HIVER",
    "Blé Tendre d'Hiver",
    "blé tendre d'hiver",
    "Blé tendre d'Hiver",
    "Blé tendre d'hiver",
    "Blé tendre hiver",
    "Blé Tendre Hiver",
    "blé tendre hiver",
    "Blé tendre Hiver",
  ],
  "Blé d'hiver": ["blé d'hiver", "Blé d'hiver"],
  Carotte: ["CAROTTE", "Carotte", "carotte", "Carottes"],
  Chanvre: ["Chanvre"],
  "Chou-fleur": [
    "Chou",
    "Chou fleur",
    "chou fleur",
    "chou fleur et romanesco",
    "CHOU POMME",
    "CHOU-FLEUR",
    "chou-fleur conventionnel",
    "choux",
    "Choux",
  ],
  Chrysanthème: [
    "Chrysanthemum",
    "Chrysanthème",
    "Chrysanthèmes",
    "chrysanthèmes",
  ],
  Colza: ["Colza", "colza", "COLZA", "Colza associé"],
  "Colza d'hiver": [
    "COLZA D'HIVER",
    "colza d'hiver",
    "Colza d'hiver",
    "colza hiver",
    "Colza hiver",
  ],
  Concombre: ["CONCOMBRE", "concombre", "Concombre"],
  Courge: ["Courge", "courge", "Courges"],
  Courgette: ["Courgette", "courgette", "COURGETTE"],
  Céleri: ["Céleri", "Céleri branche"],
  Épautre: ["Epeautre"],
  Épinard: ["epinard", "EPINARD", "Epinard", "Epinards", "épinard"],
  Fenouil: ["Fenouil", "fenouil"],
  Fèverole: ["feverole", "FEVEROLE", "Féverole", "féverole"],
  "Féverole d'hiver": ["FEVEROLE D'HIVER"],
  "Féverole de printemps": ["FEVEROLE DE PRINTEMPS"],
  Fraise: ["Fraise", "FRAISES"],
  Framboisier: ["FRAMBOISIER"],
  Fève: ["Fève"],
  Haricot: [
    "HARICOT",
    "haricot",
    "Haricot",
    "Haricot vert",
    "haricot vert",
    "Haricots-verts",
  ],
  Laitue: ["LAITUE", "laitue", "LAITUE D'AUTOMNE"],
  lentille: ["lentille", "LENTILLE", "Lentille", "Lentilles", "lentilles"],
  Lin: ["Lin", "LIN TEXTILE"],
  Luzerne: ["luzerne", "LUZERNE", "Luzerne", "luzerne deshydratéé"],
  Maïs: ["MAIS", "Mais", "mais", "MAÎS", "Maïs", "maïs", "MAÏS"],
  "Maïs ensilage": [
    "Mais ensilage",
    "MAIS ENSILAGE",
    "MAÎS ENSILAGE",
    "Maïs ensilage",
    "maïs ensilage",
  ],
  "Maïs fourrage": ["maïs fourrage", "Maïs fourrage"],
  "Maïs grain": [
    "Mais grain",
    "MAIS GRAIN",
    "mais grain",
    "MAÏS GRAIN",
    "Maïs Grain",
    "maïs grain",
    "Maïs grain",
  ],
  "Maïs semence": [
    "MAIS SEMENCE",
    "Maïs semence",
    "maïs semence",
    "Maïs semence",
    "maïs semence",
  ],
  Melon: ["MELON", "melon", "Melon"],
  Millet: ["Millet"],
  Moutarde: ["Moutarde"],
  Mâche: ["Mâche", "mâche", "MACHE", "mache"],
  "Mélange céréalier": [
    "Mélange céréalier",
    "mélange céréalier",
    "mélanges céréaliers",
  ],
  Méteil: [
    "méteil",
    "Méteil",
    "Méteil ensilage",
    "Méteil fourrage",
    "Méteil grain",
    "méteil grain",
  ],
  Navet: ["navet", "Navet", "NAVET"],
  Oignon: [
    "Oignon",
    "oignon",
    "OIGNON",
    "Oignons",
    "Oignons saison/conservation",
  ],
  Orge: ["Orge", "orge", "ORGE"],
  "Orge d'hiver": [
    "ORGE D'HIVER",
    "Orge d'hiver",
    "Orge d'Hiver",
    "orge d'hiver",
    "Orge d'hivers",
    "Orge Hiver",
    "orge hiver",
    "Orge hiver",
    "ORGE HIVER",
  ],
  "Orge de printemps": [
    "ORGE DE PRINTEMPS",
    "orge de printemps",
    "Orge de printemps",
    "Orge Printemps",
    "Orge printemps",
    "orge printemps",
    "ORGE PRINTEMPS",
  ],
  "Patate douce": ["patate douce", "Patate douce"],
  Poireau: ["Poireau", "poireau", "POIREAU", "Poireaux"],
  Pois: ["Pois", "pois"],
  "Pois chiche": ["pois chiche", "Pois chiche"],
  Poivron: ["Poivron", "poivron", "POIVRON"],
  "Pomme de terre": [
    "PDT",
    "pomme de terre",
    "POMME DE TERRE",
    "Pomme de terre",
    "POMME DE TERRE ",
    "pomme de terre primeur",
    "POMME DE TERRE PRIMEUR",
    "Pomme de terre primeur",
    "Pommes de terre",
  ],
  Radis: ["radis", "Radis", "RADIS", "Radis noir"],
  Salade: [
    "Salade",
    "SALADE",
    "salade",
    "salade automne",
    "salade d'automne",
    "salade de printemps",
    "salade printemps",
    "Salade type laitue, automne",
    "Salades",
  ],
  Sarrasin: ["sarrasin", "Sarrasin", "SARRASIN"],
  Seigle: ["seigle", "Seigle"],
  Soja: ["Soja", "SOJA", "soja"],
  Sorgho: ["SORGHO", "Sorgho", "sorgho", "Sorgho fourrager"],
  Tomate: ["tomate", "Tomate", "TOMATE", "Tomates"],
  Tournesol: [
    "tournesol",
    "Tournesol",
    "TOURNESOL",
    "tournesol semence",
    "TOURNESOL SEMENCE",
  ],
  Triticale: ["Triticale", "Triticale", "triticale", "Triticale d'hiver"],
};

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
        `Unknown table "${query.table}". Available: ${listTables()
          .map((t) => t.name)
          .join(", ")}`,
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
    const where = this.queryRepository.buildWhere(
      query.filters ?? [],
      columns,
      query.table,
      query.joins,
    );

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
        `Unknown table "${dto.table}". Available: ${listTables()
          .map((t) => t.name)
          .join(", ")}`,
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

    const where = this.queryRepository.buildWhere(
      dto.filters ?? [],
      columns,
      dto.table,
      dto.joins,
    );
    const result = await this.queryRepository.median(table, col, where);

    return { table: dto.table, field: dto.field, ...result };
  }

  async getFrequency(dto: FrequencyDto): Promise<IFrequencyResponse> {
    const entry = getTableEntry(dto.table);
    if (!entry) {
      throw new BadRequestException(
        `Unknown table "${dto.table}". Available: ${listTables()
          .map((t) => t.name)
          .join(", ")}`,
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

    const where = this.queryRepository.buildWhere(
      dto.filters ?? [],
      columns,
      dto.table,
      dto.joins,
    );
    const rows = await this.queryRepository.frequency(
      table,
      col,
      where,
      dto.asBoolean,
    );

    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const data = rows.map((r) => ({
      ...r,
      percentage: total > 0 ? Math.round((r.count / total) * 10000) / 100 : 0,
    }));

    return { table: dto.table, field: dto.field, total, data };
  }

  async getMedianVar(dto: NewFilterDto): Promise<{ median: number | null }> {
    const dbFilters: NewFilterDB = this.buildDbFilters(dto);
    if (dto.field === "nbRotation") {
      const nbRotation = await this.queryRepository.medianNbRotation(dbFilters);
      return { median: nbRotation.median };
    }
    if (dto.field === "nbWeedingPasses") {
      const nbWeedingPasses =
        await this.queryRepository.medianNbWeedingPasses(dbFilters);
      return { median: nbWeedingPasses.median };
    }
    if (dto.field === "fertilisation") {
      const fertilisation =
        await this.queryRepository.medianFertilisationNTot(dbFilters);
      return { median: fertilisation.median };
    }

    return { median: null };
  }

  async getFrequencyVar(dto: NewFilterDto): Promise<INewFrequencyResponse> {
    let rows: { value: string | boolean | null; count: number }[] = [];

    if (dto.field === "sequenceCultures") {
      rows = await this.queryRepository.frequencySequenceCultures(dto);
    } else if (dto.field === "macroorganismes") {
      rows = await this.queryRepository.frequencyMacroorganismes(dto);
    } else if (dto.field === "soilWork") {
      rows = await this.queryRepository.frequencySoilWork(dto);
    } else if (dto.field === "agricultureType") {
      rows = await this.queryRepository.frequencyAgricultureType(dto);
    }

    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const data = rows.map((r) => ({
      ...r,
      percentage: total > 0 ? Math.round((r.count / total) * 10000) / 100 : 0,
    }));

    return { total, data };
  }

  async getMedianIft(
    dto: NewFilterDto,
  ): Promise<{ median: number | null; count: number }> {
    // TODO add median for IFT
    // COUNT IS NB OF FARM IN THE MEDIAN
    return { median: null, count: 0 };
  }

  // Provides a mapping of culture names to their known aliases in the dataset, to help standardize user input and improve matching with database entries - hackathon workaround
  getCultureName(): Record<string, string[]> {
    return CULTURE_ALIASES;
  }

  getCultureAliases(canonicalName: string): string[] {
    const aliases = CULTURE_ALIASES[canonicalName];
    if (!aliases || aliases.length === 0) {
      return [];
    }
    return aliases;
  }

  buildDbFilters(dto: NewFilterDto): NewFilterDB {
    return {
      field: dto.field,
      culture: this.getCultureAliases(dto.culture),
      department: dto.department,
      agricultureType: dto.agricultureType,
    };
  }
}
