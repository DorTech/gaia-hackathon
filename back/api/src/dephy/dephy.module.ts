import { Global, Module } from "@nestjs/common";
import { DephyController } from "./dephy.controller";
import { DephyService } from "./dephy.service";

@Global()
@Module({
  controllers: [DephyController],
  providers: [DephyService],
  exports: [DephyService],
})
export class DephyModule {}
