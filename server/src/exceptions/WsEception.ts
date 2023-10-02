import { WsException } from "@nestjs/websockets";

type WsExceptionType = "BadRequest" | "InternalServerError" | "Unauthorized" | "Unknown";

export class WsTypeException extends WsException {
    readonly type: WsExceptionType

    constructor(type: WsExceptionType, message: string | unknown) {
        super({ type, message })
        this.type = type

    }
}

export class WsBadRequestException extends WsTypeException {
    constructor(message: string | unknown) {
        super('BadRequest', message);
    }
}

export class WsUnauthorizedException extends WsTypeException {
    constructor(message: string | unknown) {
        super('Unauthorized', message);
    }
}

export class WsUnknownException extends WsTypeException {
    constructor(message: string | unknown) {
        super('Unknown', message);
    }
}
export class wsInternalServerError extends WsTypeException {
    constructor(message: string | unknown) {
        super("InternalServerError", message)
    }
}