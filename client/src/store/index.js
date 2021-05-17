import { createStore } from 'vuex'

import newsModule from './news/index'
import blackboardModule from './blackboard/index'
import wikiModule from './wiki/index'

const store = createStore({
    modules: {
        news: newsModule,
        blackboard: blackboardModule,
        wiki: wikiModule
    },
    state() {}
})

export default store