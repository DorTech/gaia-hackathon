import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const FILTER_OPERATORS = [
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
] as const;

export type FilterOperator = (typeof FILTER_OPERATORS)[number];

export class FilterDto {
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

export class JoinFilterDto {
  @ApiProperty({ example: "domaine", description: "Source table to filter from" })
  @IsString()
  table: string;

  @ApiProperty({ example: "id", description: "Column to select from source table" })
  @IsString()
  field: string;

  @ApiProperty({ example: "domaineId", description: "Column on the target table to match against" })
  @IsString()
  targetField: string;

  @ApiProperty({ type: [FilterDto], description: "Filters applied to the source table" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters: FilterDto[];
}

export class MedianDto {
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

  @ApiPropertyOptional({ type: [JoinFilterDto], description: "Cross-table subquery filters" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinFilterDto)
  joins?: JoinFilterDto[];
}

export class QueryDto {
  @ApiProperty({ example: "domaine" })
  @IsString()
  table: string;

  @ApiPropertyOptional({ type: [String], example: ["id", "code", "departement"] })
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

  @ApiPropertyOptional({ example: 20, description: "Omit or set to 0 to fetch all rows" })
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ type: [JoinFilterDto], description: "Cross-table subquery filters" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinFilterDto)
  joins?: JoinFilterDto[];
}
