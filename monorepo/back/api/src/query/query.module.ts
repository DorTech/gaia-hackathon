import { Module } from "@nestjs/common";
import { QueryController } from "./query.controller";
import { QueryService } from "./query.service";
import { QueryRepository } from "./query.repository";

@Module({
  controllers: [QueryController],
  providers: [QueryService, QueryRepository],
})
export class QueryModule {}
