import { createStore } from 'vuex'

import newsModule from './news/index'
import blackboardModule from './blackboard/index'
import wikiModule from './wiki/index'
import authModule from './auth/index'

const store = createStore({
    modules: {
        news: newsModule,
        blackboard: blackboardModule,
        wiki: wikiModule,
        auth: authModule
    },
    state() {}
})

export default store