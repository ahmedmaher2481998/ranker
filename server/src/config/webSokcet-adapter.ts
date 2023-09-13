import { INestApplication, Logger, RequestTimeoutException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

export class SocketIOAdapter extends IoAdapter {

    constructor(
        private app: INestApplication,
        private configService: ConfigService
    ) {
        super(app)
    }
    private logger = new Logger('SocketIOAdapter')
    createIOServer(port: number, options?: ServerOptions) {
        const clientPort = parseInt(this.configService.get<string>('PORT_CLIENT'));

        const cors = {
            origin: [
                `http://localhost:${clientPort}`,
                /^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/,
            ]
        }

        const OptionsWithCors = {
            cors,
            ...options
        }
        this.logger.log(`setting up cors with socketIO on ${clientPort}`)
        return super.createIOServer(port, OptionsWithCors);


    }

}