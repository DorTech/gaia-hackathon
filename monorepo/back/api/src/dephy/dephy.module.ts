import { Global, Module } from "@nestjs/common";
import { DephyService } from "./dephy.service";

@Global()
@Module({
  providers: [DephyService],
  exports: [DephyService],
})
export class DephyModule {}
