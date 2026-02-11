import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";

@ApiTags("items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: "Get all items" })
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an item by id" })
  findOne(@Param("id") id: string) {
    return this.itemsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new item" })
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an item" })
  update(@Param("id") id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an item" })
  remove(@Param("id") id: string) {
    return this.itemsService.remove(id);
  }
}
