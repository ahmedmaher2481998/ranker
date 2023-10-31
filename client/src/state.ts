import { Poll } from 'shared/poll-types';
import { proxy } from 'valtio';

export enum AppPage {
    join = 'join',
    create = 'create',
    welcome = 'welcome',
    startOver = 'startOver',
}
export type AppState = {
    currentPage: AppPage;
    loading: boolean;
    poll?: Poll;
    accessToken?: string;
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

export { state, actions };
