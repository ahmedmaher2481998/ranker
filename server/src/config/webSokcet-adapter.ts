import { ForbiddenException, INestApplication, Logger, RequestTimeoutException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { SocketWithAuth } from "src/polls/types/types";
import { getJwtFromSocket } from "./utils";

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
        const ioServer: Server = super.createIOServer(port, OptionsWithCors);
        const jwtService = this.app.get(JwtService);
        ioServer.of('polls').use(createTokenMiddleWare(jwtService, this.logger))
        return ioServer;
    }

}

const createTokenMiddleWare = (jwt: JwtService, logger: Logger) => async (socket: SocketWithAuth, next) => {

    const token = getJwtFromSocket(socket)
    logger.debug(`verifying  token ${token}`)

    try {
        const authPayload = await jwt.verify(token)
        socket.userID = authPayload.sub
        socket.pollID = authPayload.pollID
        socket.name = authPayload.name
        logger.debug(`verified name: ${authPayload.name} pollID: ${authPayload.pollID} userID: ${authPayload.sub}`)

        return next()
    } catch (error) {
        return next(new ForbiddenException("Invalid access token "))
    }

}
