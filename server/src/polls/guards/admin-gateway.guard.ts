import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from "@nestjs/common";
import { AuthPayload, SocketWithAuth } from "../types/types";
import { PollsService } from "../polls.service";
import { JwtService } from "@nestjs/jwt";
import { getJwtFromSocket } from "src/config/utils";
import { WsUnauthorizedException } from "src/exceptions/WsEception";
@Injectable()
export class GatewayAdminGuard implements CanActivate {
    private readonly logger = new Logger(GatewayAdminGuard.name);

    constructor(
        private readonly poolService: PollsService,
        private readonly jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: SocketWithAuth = context.switchToWs().getClient();
        const token = getJwtFromSocket(client);

        if (!token) {
            this.logger.error('No authorization token provided');

            throw new WsUnauthorizedException('No token provided');
        }


        try {
            const data = await this.jwtService.verify<AuthPayload & { sub: string }>(
                token
            );
            const { pollID, sub } = data
            this.logger.debug(`Validating admin using token payload`, data);
            const poll = await this.poolService.getPollById(pollID);

            if (sub === poll.adminId) {
                return true;
            } else throw new WsUnauthorizedException("Admin privilege is required !");
        } catch (e) {
            if (e instanceof WsUnauthorizedException) {
                throw new WsUnauthorizedException("Admin privilege is required !");
            } else {
                throw new WsUnauthorizedException("Unauthorized !");
            }
        }

        return true;
    }
}
