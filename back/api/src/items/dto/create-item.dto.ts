import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateItemDto {
  @ApiProperty({ example: "Tomato plant" })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
