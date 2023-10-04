
import { Injectable, Logger, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ControllerAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }
    logger = new Logger('controller-auth-guard')
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        try {
            const { accessToken } = request.body
            const data = await this.jwtService.verify(accessToken)
            const { sub, pollID, name } = data
            request.userId = sub;
            request.pollID = pollID;
            request.name = name;
            this.logger.log(`Verifying Jwt success for user ${name} with id ${sub}`)
            return true

        } catch (error) {
            throw new ForbiddenException('Invalid access Token .')

        }
    }
}
