import { Logger } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit } from "@nestjs/websockets";
import { PollsService } from "./polls.service";

@WebSocketGateway({
    namespace: 'polls',

})
export class PollsGateway implements OnGatewayInit {
    private readonly logger = new Logger('PollsGateway')
    constructor(private readonly pollsService: PollsService) { }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized   ...')

    }

}
