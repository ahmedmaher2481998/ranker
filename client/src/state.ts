import { proxy } from 'valtio'



export enum AppPage {
    join = 'join',
    create = "create",
    welcome = 'welcome'
}
export type AppState = {
    currentPage: AppPage
}
const state: AppState = proxy({
    currentPage: AppPage.welcome
})


const actions = {
    setPage: (page: AppPage) => {
        state.currentPage = page
    }
}


export { state, actions }