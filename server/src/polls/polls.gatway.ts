import { BadRequestException, Logger, UseFilters, UseGuards } from "@nestjs/common";
import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    WsException,
    ConnectedSocket,
} from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Namespace } from "socket.io";
import { WsCatchAllFilter } from "src/exceptions/WsCatchAllExceptions";
import { SocketWithAuth } from "./types";
import { events as v } from "../polls/types";
import { GatewayAdminGuard } from "./admin-gateway.guard";
@WebSocketGateway({
    namespace: "polls",
})
@UseFilters(new WsCatchAllFilter())
export class PollsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger("PollsGateway");

    constructor(private readonly pollsService: PollsService) { }
    @WebSocketServer()
    io: Namespace;

    afterInit(server) {
        this.logger.log("WebSocket Gateway initialized   ...");
    }

    async handleConnection(client: SocketWithAuth, ...args: any[]) {
        const sockets = this.io.sockets;

        const { userID, pollID, name } = client;
        await client.join(pollID);
        const roomSize = this.io.adapter.rooms?.get(pollID)?.size ?? 0;

        this.logger.log(`WS Client with id: ${client.id} connected!`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
        this.logger.debug(
            `Number of connected sockets to after adding to room  ${pollID}: ${roomSize}`
        );

        const updatedPoll = await this.pollsService.addParticipantToPoll({
            pollID,
            name,
            userID,
        });
        this.io.to(pollID).emit(v.pollUpdated, updatedPoll);
    }

    async handleDisconnect(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        const { userID, pollID } = client;
        // TODO - remove client from poll and send `participants_updated` event to remaining clients
        const updatedPoll = await this.pollsService.removeParticipantFromPoll({
            pollID,
            userID,
        });
        const roomSize = this.io.adapter.rooms?.get(pollID)?.size ?? 0;
        if (updatedPoll) {
            await this.io.to(pollID).emit(v.pollUpdated, updatedPoll);
        }
        this.logger.log(`Disconnected socket id: ${client.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
        this.logger.debug(
            `Number of connected sockets ad removing ${userID}: ${roomSize}`
        );
    }

    @SubscribeMessage(v.removeParticipant)
    @UseGuards(GatewayAdminGuard)
    async removeParticipant(@MessageBody('id') id: string, @ConnectedSocket() client: SocketWithAuth) {
        const { pollID, userID, name } = client
        this.logger.log(`${name} is trying to remove ${id} from poll ${pollID}`)
        const updatedPoll = await this.pollsService.removeParticipantFromPoll({
            pollID, userID: id
        })
        if (updatedPoll) {
            await this.io.to(pollID).emit(v.pollUpdated, updatedPoll)
        }

    }
}
