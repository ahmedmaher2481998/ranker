import { Poll } from 'shared/poll-types';
import { proxy, ref } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { Socket } from 'socket.io-client'
export enum AppPage {
    join = 'join',
    create = 'create',
    welcome = 'welcome',
    waitingRoom = 'waitingRoom',
    startOver = 'startOver',
}
type Me = {
    id: string,
    name: string
}
export type AppState = {
    currentPage: AppPage;
    loading: boolean;
    poll?: Poll;
    accessToken?: string;
    me?: Me,
    socket?: Socket;
};

const state: AppState = proxy({
    currentPage: AppPage.welcome,
    loading: false,
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
};
const computedWithState = derive(
    {
        me: (get) => {
            const accessToken = get(state).accessToken;
            if (!accessToken) return null;

            const { sub: id, name } = JSON.parse(
                window.atob(accessToken.split('.')[1])
            );

            return {
                name,
                id,
            };
        }, isAdmin: (get) => {
            const me = get(state)?.me
            const adminId = get(state)
                .poll?.adminId
            if (!me) return false
            else {
                return me.id === adminId
            }
        }
    },
    { proxy: state }
);
subscribeKey(state, "accessToken", () => {
    if (state.accessToken && state.poll) {
        localStorage.setItem('accessToken', state.accessToken)
    } else {
        localStorage.removeItem('accessToken')
    }
})
export { computedWithState as state, actions };
