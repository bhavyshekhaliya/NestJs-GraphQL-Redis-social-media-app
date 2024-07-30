import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { RedisFactory } from "./redis.factory";

@Module({
    imports: [
        ConfigModule
    ],
    providers: [
        RedisService,
        RedisFactory
    ],
    exports: [
        RedisService
    ],
})
export class RedisModule {
    private readonly logger = new Logger(RedisModule.name);
} 