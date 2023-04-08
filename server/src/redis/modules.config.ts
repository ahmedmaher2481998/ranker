import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis.module';
export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('redis');
    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
      onClientReady(redis) {
        logger.log('Redis start...');
        redis.on('error', (err) => {
          logger.error('Redis client Error:', err);
        });
        redis.on('connect', () => {
          logger.log(
            `Connected to redis on ${redis.options.host}:${redis.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});
