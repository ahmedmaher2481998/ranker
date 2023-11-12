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

    const connectionOptions: {
      host: string;
      password?: string;
      port: number;
    } = { host: null, port: null };

    if (Boolean(process.env.prod)) {
      connectionOptions.host = configService.get("REDIS_HOST_PROD");
      connectionOptions.password = configService.get("REDIS_PASS_PROD");
      connectionOptions.port = +configService.get("REDIS_PORT_PROD");
    } else {
      connectionOptions.host = configService.get("REDIS_HOST");
      connectionOptions.port = +configService.get("REDIS_PORT");
    }

    logger.verbose(`prod ENV-Var  Set to: ${Boolean(process.env.prod)} ${Boolean(process.env.prod) ? "Will use Remote DB" : "will use localhost"}`);
    return {
      connectionOptions,
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
