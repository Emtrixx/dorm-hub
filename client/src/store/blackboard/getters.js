export default {
    getHub(state) {
        return state.hub;
    },
    getPosts(state) {
        return state.hub.posts;
    },
    getPost(state) {
        return state.post;
    }
}