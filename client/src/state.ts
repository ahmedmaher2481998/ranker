import { Poll } from 'shared/poll-types';
import { proxy, ref } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { Socket } from 'socket.io-client';
import { createSocketWithHandlers, socketIoUrl } from './socket-io';
import { getTokenPayload } from './util';
import { nanoid } from 'nanoid';
enum AppPage {
    join = 'join',
    create = 'create',
    welcome = 'welcome',
    waitingRoom = 'waitingRoom',
    startOver = 'startOver',
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
};

const state: AppState = proxy({
    currentPage: AppPage.welcome,
    loading: false,
    wsError: [],
});

const actions = {
    setPage: (page: AppPage) => {
        state.currentPage = page;
    },
    startOver: () => {
        actions.setPage(AppPage.startOver);
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
        } else {
            state.socket.connect();
        }
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
};

const computedWithState = derive(
    {
        me: (get) => {
            const accessToken = get(state).accessToken;
            if (!accessToken) return null;

            const { sub: id, name } = getTokenPayload(accessToken);

            return {
                name,
                id,
            };
        },
        isAdmin: (get) => {
            const me = get(state)?.me;
            const adminId = get(state).poll?.adminId;
            if (!me) return false;
            else {
                return me.id === adminId;
            }
        },
    },
    { proxy: state }
);
subscribeKey(state, 'accessToken', () => {
    if (state.accessToken) {
        localStorage.setItem('accessToken', state.accessToken);
    }
});

type AppActions = typeof actions;
export {
    computedWithState as state,
    actions,
    type AppActions,
    type AppState,
    AppPage,
};
