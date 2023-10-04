import { SocketWithAuth } from "src/polls/types/types"


export const getJwtFromSocket = (socket: SocketWithAuth): string => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token']
    return token
}