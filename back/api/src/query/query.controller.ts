import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { QueryService } from "./query.service";
import { QueryDto, MedianDto, FrequencyDto } from "./dto/query.dto";

@ApiTags("query")
@Controller("query")
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get("tables")
  @ApiOperation({ summary: "List available tables and their columns" })
  getTables() {
    return this.queryService.getTables();
  }

  @Post("data")
  @ApiOperation({ summary: "Query any Dephy table with filters, pagination, and field selection" })
  async getData(@Body() body: QueryDto) {
    return this.queryService.executeQuery(body);
  }

  @Post("median")
  @ApiOperation({ summary: "Compute the median of a numeric column with optional filters" })
  async getMedian(@Body() body: MedianDto) {
    return this.queryService.getMedian(body);
  }

  @Post("frequency")
  @ApiOperation({ summary: "Get value frequency distribution for a qualitative column" })
  async getFrequency(@Body() body: FrequencyDto) {
    return this.queryService.getFrequency(body);
  }
}
