import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GenerateRotationDto {
  @ApiProperty({
    example:
      "Une rotation de 5 ans en Bretagne commençant par du blé, avec des couverts et des légumineuses",
  })
  @IsString()
  @IsNotEmpty()
  prompt!: string;
}
