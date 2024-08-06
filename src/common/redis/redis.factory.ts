import { FactoryProvider, Logger } from "@nestjs/common";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "../contants/constants";
import { ConfigService } from "@nestjs/config";

export const RedisFactory: FactoryProvider<Redis> = {

    provide: REDIS_CLIENT,
    useFactory: async (configService: ConfigService) => {

        const logger = new Logger('RedisFactory');

        const redisInstance = new Redis({
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
            // maxRetriesPerRequest: null,
            // retryStrategy(times) {
            //     const delay = Math.min(times * 50, 2000);
            //     return delay;
            // },
        });

        // Handle Redis error events
        redisInstance.on('error', e => {
            logger.error(`Redis connection failed: ${e.message}`);
        });

        // Handle Redis connection events
        redisInstance.on('connect', () => {
            logger.log('Redis connecting...');
        });

        // Handle Redis ready events
        redisInstance.on('ready', () => {
            logger.log('Redis connected and ready!');
        });

        // Handle Redis reconnection events
        redisInstance.on('close', () => {
            logger.warn('Redis disconnected!');
        });

        // Handle Redis connection end events
        redisInstance.on('reconnecting', () => {
            logger.log('Redis reconnecting...');
        });

        // On redis connection ended
        redisInstance.on('end', () => {
            logger.warn('Redis connection ended!');
        });

        return redisInstance;
    },
    inject: [ConfigService]
}   