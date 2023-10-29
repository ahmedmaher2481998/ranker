import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "./redis.module";
import { JwtModule } from "@nestjs/jwt";

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get<string>("JWT_SECRET"),
      signOptions: {
        expiresIn: parseInt(configService.get<string>("POLL_DURATION")),
      },
    };
  },
  inject: [ConfigService],
});
export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger("redis");
    return {
      connectionOptions: {
        host: configService.get("REDIS_HOST_PROD"),
        password: configService.get("REDIS_PASS_PROD"),
        port: configService.get("REDIS_PORT_PROD"),
        // host: configService.get('REDIS_HOST'),
        // port: configService.get('REDIS_PORT'),
      },
      onClientReady(redis) {
        logger.log("Redis is ready...");
        redis.on("error", (err) => {
          logger.error("Redis client Error:", err);
        });
        redis.on("connect", () => {
          logger.log(
            `Connected to redis on ${redis.options.host}:${redis.options.port}`
          );
        });
      },
    };
  },
});
