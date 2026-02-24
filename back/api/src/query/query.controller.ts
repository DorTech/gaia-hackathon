import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { QueryService } from "./query.service";
import {
  QueryDto,
  MedianDto,
  FrequencyDto,
  NewFilterDto,
} from "./dto/query.dto";
import {
  ITableInfo,
  IQueryResponse,
  IMedianResponse,
  IFrequencyResponse,
} from "@gaia/shared-type";

@ApiTags("query")
@Controller("query")
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get("tables")
  @ApiOperation({ summary: "List available tables and their columns" })
  getTables(): ITableInfo[] {
    return this.queryService.getTables();
  }

  @Post("data")
  @ApiOperation({
    summary:
      "Query any Dephy table with filters, pagination, and field selection",
  })
  async getData(@Body() body: QueryDto): Promise<IQueryResponse> {
    return this.queryService.executeQuery(body);
  }

  @Post("median")
  @ApiOperation({
    summary: "Compute the median of a numeric column with optional filters",
  })
  async getMedian(@Body() body: MedianDto): Promise<IMedianResponse> {
    return this.queryService.getMedian(body);
  }

  @Post("frequency")
  @ApiOperation({
    summary: "Get value frequency distribution for a qualitative column",
  })
  async getFrequency(@Body() body: FrequencyDto): Promise<IFrequencyResponse> {
    return this.queryService.getFrequency(body);
  }

  @Post("median_nb_rotation")
  @ApiOperation({
    summary:
      "Get the median number of rotations for a culture, department and type of agriculture",
  })
  async getNbRotation(
    @Body() body: NewFilterDto,
  ): Promise<{ medianNbRotation: number | null }> {
    return this.queryService.getMedianNbRotation(body);
  }

  @Post("median_nb_weeding_passes")
  @ApiOperation({
    summary:
      "Get the median number of mechanical weeding passes for a culture, department and type of agriculture",
  })
  async getNbWeedingPasses(
    @Body() body: NewFilterDto,
  ): Promise<{ medianNbWeedingPasses: number | null }> {
    return this.queryService.getMedianNbWeedingPasses(body);
  }
}
