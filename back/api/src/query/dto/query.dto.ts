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
}
