import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  Min,
  ValidateNested,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  FilterOperator,
  IFilter,
  IJoinFilter,
  IQueryRequest,
  IMedianRequest,
  IFrequencyRequest,
} from "@gaia/shared-type";

const FILTER_OPERATORS: FilterOperator[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "like",
  "in",
  "isNull",
  "isNotNull",
];

export class FilterDto implements IFilter {
  @ApiProperty({ example: "departement" })
  @IsString()
  field: string;

  @ApiProperty({ enum: FILTER_OPERATORS, example: "eq" })
  @IsIn(FILTER_OPERATORS)
  operator: FilterOperator;

  @ApiPropertyOptional({ example: "75" })
  @IsOptional()
  value?: string | number | boolean | (string | number)[];
}

export class JoinFilterDto implements IJoinFilter {
  @ApiProperty({
    example: "domaine",
    description: "Source table to filter from",
  })
  @IsString()
  table: string;

  @ApiProperty({
    example: "id",
    description: "Column to select from source table",
  })
  @IsString()
  field: string;

  @ApiProperty({
    example: "domaineId",
    description: "Column on the target table to match against",
  })
  @IsString()
  targetField: string;

  @ApiProperty({
    type: [FilterDto],
    description: "Filters applied to the source table",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters: FilterDto[];
}

export class MedianDto implements IMedianRequest {
  @ApiProperty({ example: "sdc_realise_perf" })
  @IsString()
  table: string;

  @ApiProperty({ example: "iftHistoChimiqueTot" })
  @IsString()
  field: string;

  @ApiPropertyOptional({ type: [FilterDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiPropertyOptional({
    type: [JoinFilterDto],
    description: "Cross-table subquery filters",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinFilterDto)
  joins?: JoinFilterDto[];
}

export class NewFilterDto {
  @ApiProperty({ example: "blé", description: "Crop type" })
  @IsString()
  culture: string;

  @ApiProperty({ example: "75", description: "Department number" })
  @IsString()
  department: string;

  @ApiProperty({
    example: "conventionnelle",
    description: "Type of agriculture",
  })
  @IsString()
  agricultureType: string;
}

export class FrequencyDto implements IFrequencyRequest {
  @ApiProperty({ example: "domaine" })
  @IsString()
  table: string;

  @ApiProperty({ example: "typeFerme" })
  @IsString()
  field: string;

  @ApiPropertyOptional({ type: [FilterDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiPropertyOptional({
    type: [JoinFilterDto],
    description: "Cross-table subquery filters",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinFilterDto)
  joins?: JoinFilterDto[];

  @ApiPropertyOptional({
    example: false,
    description: "Treat numeric field as boolean (0 = false, > 0 = true)",
  })
  @IsOptional()
  @IsBoolean()
  asBoolean?: boolean;
}

export class QueryDto implements IQueryRequest {
  @ApiProperty({ example: "domaine" })
  @IsString()
  table: string;

  @ApiPropertyOptional({
    type: [String],
    example: ["id", "code", "departement"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  select?: string[];

  @ApiPropertyOptional({ type: [FilterDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiPropertyOptional({
    example: 20,
    description: "Omit or set to 0 to fetch all rows",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    type: [JoinFilterDto],
    description: "Cross-table subquery filters",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinFilterDto)
  joins?: JoinFilterDto[];
}
