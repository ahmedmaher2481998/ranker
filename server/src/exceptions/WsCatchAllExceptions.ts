import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from "@nestjs/common";
import { SocketWithAuth } from "src/polls/types";
import {
    WsBadRequestException,
    WsTypeException,
    WsUnauthorizedException,
    WsUnknownException,
} from "./WsEception";
import { events as v } from "../polls/types";
@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost): void {
        // throw new Error("Method not implemented.");
        const socket: SocketWithAuth = host.switchToWs().getClient();
        // convert http exceptions to ws exceptions 
        if (exception instanceof BadRequestException) {
            const exceptionData = exception.getResponse();
            const exceptionMessage =
                exceptionData["message"] ?? exceptionData ?? exception.name;
            const wsException = new WsBadRequestException(exceptionMessage);

            socket.emit(v.exception, wsException.getError());
            return;
        } else if (exception instanceof WsUnauthorizedException) {
            socket.emit(v.exception, exception.getError());
        } else if (exception instanceof WsTypeException) {
            socket.emit(v.exception, exception.getError());
        } else {
            const wsException = new WsUnknownException(exception.name);
            socket.emit(v.exception, wsException.getError());
        }
    }
}
