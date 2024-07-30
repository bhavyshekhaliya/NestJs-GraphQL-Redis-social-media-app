import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT } from '../contants/constants';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);

    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) { }

    onModuleDestroy() {
        this.logger.log('Disconnecting Redis client...');

        this.redis.disconnect();
        
        this.logger.log('Redis client disconnected.');
    }

    async get(prefix: string, key: string): Promise<string | null> {
        try {
            return this.redis.get(`${prefix}:${key}`);
        } catch (error) {
            this.logger.error(`Error getting key ${prefix}:${key}: ${error.message}`);
            throw error;
        }
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        try {
            await this.redis.set(`${prefix}:${key}`, value);
        } catch (error) {
            this.logger.error(`Error setting key ${prefix}:${key}: ${error.message}`);
            throw error;
        }
    }

    async delete(prefix: string, key: string): Promise<void> {
        try {
            await this.redis.del(`${prefix}:${key}`);
        } catch (error) {
            this.logger.error(`Error deleting key ${prefix}:${key}: ${error.message}`);
            throw error;
        }
    }

    async setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void> {
        try {
            await this.redis.set(`${prefix}:${key}`, value, 'EX', expiry);
        } catch (error) {
            this.logger.error(`Error setting key ${prefix}:${key} with expiry: ${error.message}`);
            throw error;
        }
    }
}
