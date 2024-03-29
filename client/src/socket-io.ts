import { AppActions, AppState } from './state';
import { Socket, io } from 'socket.io-client';
import { socketEvents as v } from "shared";
// const socketIoUrl = `http://${import.meta.env.VITE_API_HOSt}:${import.meta.env.VITE_API_PORT
//     }/${import.meta.env.VITE_POLLS_NAMESPACE}`;



export const socketIoUrl = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT
    }/${import.meta.env.VITE_POLLS_NAMESPACE}`;

type CreateSocketOptions = {
    socketIoUrl: string;
    actions: AppActions;
    state: AppState;
};
const createSocketWithHandlers = ({
    actions,
    socketIoUrl,
    state,
}: CreateSocketOptions): Socket => {
    console.log(`creating socket with accessToken ${state.accessToken}`);
    const socket = io(socketIoUrl, {
        auth: {
            token: state.accessToken,
        },
        transports: ['websocket', 'polling'],
    });
    // listening to Connections
    socket.on('connect', () => {
        console.log(
            `Connected With socketID ${socket.id} ,userID :${state.me?.id} , joined roomID : ${state.poll?.id} `
        );
        actions.stopLoading()
    });


    socket.on('connect_error', () => {
        console.log(`Failed to connect socket`);
        actions.addWsError({
            message: "Failed to Connect to Socket "
            , type: "connection Error !"
        })

        actions.stopLoading();
    })

    socket.on('exception', (exception) => {
        console.log(`Ws Exception `, exception);
        actions.addWsError(exception)
    })
    // Listing to server Events 
    socket.on(v.pollUpdated, (poll) => {
        console.log('event: "poll_updated" received', poll);
        actions.updatePoll(poll);
    })
    return socket
};
export { createSocketWithHandlers };
