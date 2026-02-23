import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DephyModule } from "./dephy/dephy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "env/.env",
    }),
    DephyModule,
  ],
})
export class AppModule {}
