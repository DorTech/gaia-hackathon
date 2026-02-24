import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RotationService } from "./rotation.service";
import { GenerateRotationDto } from "./dto/generate-rotation.dto";

@ApiTags("rotation")
@Controller("rotation")
export class RotationController {
  constructor(private readonly rotationService: RotationService) {}

  @Post("generate")
  @ApiOperation({ summary: "Generate a crop rotation plan using AI" })
  generate(@Body() dto: GenerateRotationDto) {
    return this.rotationService.generate(dto);
  }
}
