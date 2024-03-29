import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SocketIOAdapter } from "./config/webSokcet-adapter";

async function bootstrap() {
  const logger = new Logger("Main");

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const configService = app.get(ConfigService);

  const clientPort = parseInt(configService.get("PORT_CLIENT"));

  const port = parseInt(configService.get("PORT"));

  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      /^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/,
    ]
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService))
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
