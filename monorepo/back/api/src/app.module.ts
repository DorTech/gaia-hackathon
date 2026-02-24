import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DephyModule } from "./dephy/dephy.module";
import { QueryModule } from "./query/query.module";
import { RotationModule } from "./rotation/rotation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "env/.env",
    }),
    DephyModule,
    QueryModule,
    RotationModule,
  ],
})
export class AppModule {}
