import { Poll } from 'shared/poll-types';
import { proxy, ref } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import { Socket } from 'socket.io-client';
import { createSocketWithHandlers, socketIoUrl } from './socket-io';
import { getTokenPayload } from './util';
import { nanoid } from 'nanoid';
import { socketEvents as v } from 'shared';
enum AppPage {
    join = 'join',
    create = 'create',
    welcome = 'welcome',
    waitingRoom = 'waitingRoom',
}
type WsError = {
    type: string;
    message: string;
};
type WsErrorUnique = WsError & {
    id: string;
};
type Me = {
    id: string;
    name: string;
};
type AppState = {
    currentPage: AppPage;
    loading: boolean;
    poll?: Poll;
    accessToken?: string;
    me?: Me;
    socket?: Socket;
    wsError: WsErrorUnique[];
    isAdmin: boolean;
    nominationCount: number;
    participantCount: number;
    canStartVote: boolean;
};

const state = proxy<AppState>({
    currentPage: AppPage.welcome,
    loading: false,
    wsError: [],
    get canStartVote() {
        const votesPerParticipant = this.poll?.votesPerVoter ?? 100;
        console.log('can Start Vote ?', this.nominationCount >= votesPerParticipant);
        return this.nominationCount >= votesPerParticipant;
    },
    get nominationCount() {
        return Object.keys(this.poll?.nominations || {}).length;
    },
    get participantCount() {
        return Object.keys(this.poll?.participants || {}).length;
    },
    get isAdmin() {
        const me = this?.me;
        const adminId = this.poll?.adminId;
        if (!me) return false;
        else {
            return me.id === adminId;
        }
    },
    get me() {
        const accessToken = this.accessToken;
        if (!accessToken) return;

        const { sub: id, name } = getTokenPayload(accessToken);

        return {
            name,
            id,
        };
    },
});

const actions = {
    setPage: (page: AppPage) => {
        state.currentPage = page;
    },
    startOver: () => {
        localStorage.removeItem('accessToken');
        actions.reset();
        actions.setPage(AppPage.welcome);
    },
    startLoading: () => {
        state.loading = true;
    },
    stopLoading: () => {
        state.loading = false;
    },
    initializePoll: (poll?: Poll): void => {
        state.poll = poll;
    },
    setPollAccessToken: (token?: string): void => {
        state.accessToken = token;
    },
    initializeSocket: (): void => {
        if (!state.socket) {
            state.socket = ref(
                createSocketWithHandlers({
                    socketIoUrl,
                    state,
                    actions,
                })
            );
            return;
        } else if (!state.socket.connected) {
            state.socket.connect();
            return;
        }
        actions.stopLoading();
    },
    // we Exceptions Actions
    addWsError: (err: WsError) => {
        state.wsError = [
            ...state.wsError,
            {
                id: nanoid(6),
                ...err,
            },
        ];
    },
    removeWsError: (id: string) => {
        state.wsError = state.wsError.filter((err) => err.id !== id);
    },

    updatePoll: (poll: Poll) => {
        state.poll = poll;
    },
    nominate: (text: string) => {
        state.socket?.emit(v.addNomination, { text });
    },
    reset: () => {
        state.socket?.disconnect();
        state.poll = undefined;
        state.accessToken = undefined;
        state.loading = false;
        state.socket = undefined;
        state.wsError = [];
    },
    removeNomination: (id: string) => {
        state.socket?.emit(v.removeNomination, { id });
    },
    removeParticipant: (id: string) => {
        state.socket?.emit(v.removeParticipant, { id });
    },
    startVote: () => {
        state.socket?.emit(v.startPoll);
    },
};
// There were some errors with Derive Function from valtio
// const computedWithState = derive(
//     {
//         me: (get) => {
//             const accessToken = get(state).accessToken;
//             if (!accessToken) return null;

//             const { sub: id, name } = getTokenPayload(accessToken);

//             return {
//                 name,
//                 id,
//             };
//         },
//         isAdmin: (get) => {
//             const me = get(state)?.me;
//             const adminId = get(state).poll?.adminId;
//             if (!me) return false;
//             else {
//                 return me.id === adminId;
//             }
//         },
//     },
//     { proxy: state }
// );
// listener for access Token changes
subscribeKey(state, 'accessToken', () => {
    if (state.accessToken) {
        localStorage.setItem('accessToken', state.accessToken);
    }
});

type AppActions = typeof actions;
export { state, actions, type AppActions, type AppState, AppPage };
