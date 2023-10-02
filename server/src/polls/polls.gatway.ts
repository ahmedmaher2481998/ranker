import { ForbiddenException, Logger } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, WsException } from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Namespace, Socket } from "socket.io";

@WebSocketGateway({
    namespace: 'polls',

})
export class PollsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger('PollsGateway')

    constructor(private readonly pollsService: PollsService) { }
    @WebSocketServer()
    io: Namespace;

    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized   ...')
    }

    handleConnection(client: Socket, ...args: any[]) {
        const sockets = this.io.sockets;

        this.logger.log(`WS Client with id: ${client.id} connected!`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        // this.io.emit('hello', `from ${client.id}`);

    }


    handleDisconnect(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`Disconnected socket id: ${client.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        // TODO - remove client from poll and send `participants_updated` event to remaining clients
    }


    @SubscribeMessage('test')
    sendError(@MessageBody() body: any) {
        console.log(body)
        throw new WsException(body)

    }

}
