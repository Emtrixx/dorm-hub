export default {
    getHub(state) {
        return state.hub;
    },
    getPosts(_,getters) {
        console.log(getters.getHub.posts)
        return getters.getHub.posts
    }
}